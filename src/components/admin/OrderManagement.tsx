import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { Clock, CheckCircle, XCircle, ChefHat, Package, Eye, X } from 'lucide-react';

const statusFlow = ['pending', 'accepted', 'preparing', 'ready', 'completed'] as const;

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Pending' },
  accepted: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Accepted' },
  preparing: { icon: ChefHat, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Preparing' },
  ready: { icon: Package, color: 'text-green-500', bg: 'bg-green-100', label: 'Ready' },
  completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Completed' },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Rejected' },
};

export const OrderManagement: React.FC = () => {
  const { adminUser, orders, updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const canteenOrders = orders.filter(o => o.canteenId === adminUser?.canteenId);
  
  const filteredOrders = filter === 'all' 
    ? canteenOrders 
    : canteenOrders.filter(o => o.orderStatus === filter);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['orderStatus']) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  const getNextStatus = (currentStatus: Order['orderStatus']) => {
    const currentIndex = statusFlow.indexOf(currentStatus as typeof statusFlow[number]);
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'accepted', 'preparing', 'ready', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Items</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.orderStatus];
                const StatusIcon = status.icon;
                const nextStatus = getNextStatus(order.orderStatus);

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{order.uniqueCode}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-900">{order.userName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-600">{order.items.length} items</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                      {order.paymentStatus === 'advance' && (
                        <p className="text-xs text-amber-600">₹{order.totalAmount - order.advanceAmount} due</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye size={18} />
                        </button>
                        {order.orderStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'accepted')}
                              className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'rejected')}
                              className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {nextStatus && order.orderStatus !== 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, nextStatus)}
                            className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
                          >
                            Mark {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No orders found
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{selectedOrder.uniqueCode}</p>
                  <p className="text-gray-500">{selectedOrder.userName}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${statusConfig[selectedOrder.orderStatus].bg} ${statusConfig[selectedOrder.orderStatus].color}`}>
                  {React.createElement(statusConfig[selectedOrder.orderStatus].icon, { size: 16 })}
                  {statusConfig[selectedOrder.orderStatus].label}
                </span>
              </div>

              <div className="border rounded-xl divide-y">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-bold">₹{selectedOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Paid</span>
                  <span className="font-medium">₹{selectedOrder.advanceAmount}</span>
                </div>
                {selectedOrder.paymentStatus === 'advance' && (
                  <div className="flex justify-between text-amber-600">
                    <span>Due at Counter</span>
                    <span className="font-medium">₹{selectedOrder.totalAmount - selectedOrder.advanceAmount}</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                <p>Order placed: {formatDate(selectedOrder.createdAt)}</p>
                <p>Valid until: {formatDate(selectedOrder.validUntil)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
