import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserLogin } from './UserLogin';
import { CanteenList } from './CanteenList';
import { MenuView } from './MenuView';
import { CartView } from './CartView';
import { OrdersView } from './OrdersView';
import { Home, ShoppingCart, ClipboardList, User, LogOut, Settings } from 'lucide-react';

type Tab = 'home' | 'cart' | 'orders' | 'profile';

export const UserDashboard: React.FC = () => {
  const { user, setUser, selectedCanteenId, cart, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  if (!user) {
    return <UserLogin />;
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return selectedCanteenId ? <MenuView /> : <CanteenList />;
      case 'cart':
        return <CartView />;
      case 'orders':
        return <OrdersView />;
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize">{user.type}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">ID</span>
                  <span className="font-medium">{user.collegeId || user.employeeId}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('admin')}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
            >
              <Settings size={18} />
              Switch to Admin View
            </button>

            <button
              onClick={() => setUser(null)}
              className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-gray-900">Campus Canteen</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-lg mx-auto flex">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
            { id: 'orders', icon: ClipboardList, label: 'Orders' },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 relative transition-all ${
                activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <tab.icon size={22} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
