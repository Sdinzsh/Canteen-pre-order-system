import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, CheckCircle, XCircle, Package, ChefHat, AlertCircle, QrCode, X } from 'lucide-react';
import { Order } from '../../types';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Pending' },
  accepted: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Accepted' },
  preparing: { icon: ChefHat, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Preparing' },
  ready: { icon: Package, color: 'text-green-500', bg: 'bg-green-100', label: 'Ready to Collect' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Rejected' },
};

export const OrdersView: React.FC = () => {
  const { orders, user } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const userOrders = orders.filter(o => o.userId === user?.id);
  const activeOrders = userOrders.filter(o => !['completed', 'rejected'].includes(o.orderStatus));
  const pastOrders = userOrders.filter(o => ['completed', 'rejected'].includes(o.orderStatus));

  const isOrderValid = (order: Order) => {
    return new Date(order.validUntil) > new Date() && !order.isUsed;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const status = statusConfig[order.orderStatus];
    const StatusIcon = status.icon;
    const valid = isOrderValid(order);

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-gray-900">{order.uniqueCode}</p>
              <p className="text-sm text-gray-500">{order.canteenName}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
              <StatusIcon size={14} />
              <span className="text-xs font-medium">{status.label}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{order.items.length} items • ₹{order.totalAmount}</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>

          {order.paymentStatus === 'advance' && order.orderStatus !== 'completed' && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-sm text-amber-700 mb-3">
              <AlertCircle size={14} />
              <span>Pay ₹{order.totalAmount - order.advanceAmount} at counter</span>
            </div>
          )}

          {order.orderStatus !== 'completed' && order.orderStatus !== 'rejected' && (
            <button
              onClick={() => setSelectedOrder(order)}
              disabled={!valid}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                valid
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <QrCode size={18} />
              {valid ? 'Show QR Code' : 'Order Expired'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-6">
      <h2 className="text-xl font-bold text-gray-900">My Orders</h2>

      {userOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <h3 className="font-medium text-gray-900">No orders yet</h3>
          <p className="text-sm mt-1">Your pre-orders will appear here</p>
        </div>
      ) : (
        <>
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Active Orders</h3>
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {pastOrders.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Past Orders</h3>
              {pastOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}

      {/* QR Code Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Order QR Code</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border mb-4">
                <QRCodeSVG
                  value={JSON.stringify({
                    orderId: selectedOrder.id,
                    code: selectedOrder.uniqueCode,
                    userId: selectedOrder.userId,
                    amount: selectedOrder.totalAmount,
                    paid: selectedOrder.advanceAmount,
                    validUntil: selectedOrder.validUntil,
                  })}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="text-2xl font-bold text-gray-900 mb-2">{selectedOrder.uniqueCode}</p>
              <p className="text-sm text-gray-500 mb-4">Show this at the counter</p>

              <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${statusConfig[selectedOrder.orderStatus].bg} ${statusConfig[selectedOrder.orderStatus].color}`}>
                {React.createElement(statusConfig[selectedOrder.orderStatus].icon, { size: 16 })}
                <span className="font-medium">{statusConfig[selectedOrder.orderStatus].label}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
