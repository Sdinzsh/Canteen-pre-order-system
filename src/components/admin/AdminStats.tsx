import React from 'react';
import { useApp } from '../../context/AppContext';
import { canteens } from '../../data/mockData';
import { DollarSign, ShoppingBag, Clock, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export const AdminStats: React.FC = () => {
  const { adminUser, orders, foodItems } = useApp();

  const _canteen = canteens.find(c => c.id === adminUser?.canteenId);
  void _canteen; // Available for future use
  const canteenOrders = orders.filter(o => o.canteenId === adminUser?.canteenId);
  const canteenItems = foodItems.filter(f => f.canteenId === adminUser?.canteenId);

  const todayOrders = canteenOrders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const pendingOrders = canteenOrders.filter(o => o.orderStatus === 'pending').length;
  const preparingOrders = canteenOrders.filter(o => ['accepted', 'preparing'].includes(o.orderStatus)).length;
  const completedOrders = todayOrders.filter(o => o.orderStatus === 'completed').length;
  const todayRevenue = todayOrders.filter(o => o.orderStatus === 'completed').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRevenue = canteenOrders.filter(o => o.orderStatus === 'completed').reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockItems = canteenItems.filter(f => f.availableQuantity <= 5 && f.availableQuantity > 0);
  const outOfStockItems = canteenItems.filter(f => f.availableQuantity === 0);

  const stats = [
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12%',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'In Preparation',
      value: preparingOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      label: 'Completed Today',
      value: completedOrders,
      icon: CheckCircle,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {adminUser?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                <stat.icon size={20} />
              </div>
              {stat.change && (
                <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-700 mb-3">
            <AlertTriangle size={20} />
            <h3 className="font-semibold">Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            {outOfStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-red-100 rounded-lg p-3 text-sm">
                <span className="font-medium text-red-700">{item.name}</span>
                <span className="text-red-600 font-bold">Out of Stock</span>
              </div>
            ))}
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-amber-100 rounded-lg p-3 text-sm">
                <span className="font-medium text-amber-700">{item.name}</span>
                <span className="text-amber-600">Only {item.availableQuantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="divide-y">
          {canteenOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{order.uniqueCode}</p>
                <p className="text-sm text-gray-500">{order.userName} • {order.items.length} items</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  order.orderStatus === 'completed' ? 'bg-green-100 text-green-700' :
                  order.orderStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>
          ))}
          {canteenOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Total Stats */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">₹{totalRevenue}</p>
            <p className="text-sm text-gray-400">Total Revenue</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{canteenOrders.filter(o => o.orderStatus === 'completed').length}</p>
            <p className="text-sm text-gray-400">Orders Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{canteenItems.length}</p>
            <p className="text-sm text-gray-400">Menu Items</p>
          </div>
        </div>
      </div>
    </div>
  );
};
