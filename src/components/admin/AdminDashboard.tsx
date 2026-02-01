import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { canteens } from '../../data/mockData';
import { AdminLogin } from './AdminLogin';
import { OrderManagement } from './OrderManagement';
import { MenuManagement } from './MenuManagement';
import { QRScanner } from './QRScanner';
import { AdminStats } from './AdminStats';
import { LayoutDashboard, ClipboardList, UtensilsCrossed, QrCode, LogOut, User } from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'menu' | 'scanner';

export const AdminDashboard: React.FC = () => {
  const { adminUser, setAdminUser, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (!adminUser) {
    return <AdminLogin />;
  }

  const canteen = canteens.find(c => c.id === adminUser.canteenId);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminStats />;
      case 'orders':
        return <OrderManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'scanner':
        return <QRScanner />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-lg">🍽️</span>
            </div>
            <div>
              <h1 className="font-bold">Canteen Admin</h1>
              <p className="text-xs text-gray-400">{canteen?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'orders', icon: ClipboardList, label: 'Orders' },
            { id: 'menu', icon: UtensilsCrossed, label: 'Menu' },
            { id: 'scanner', icon: QrCode, label: 'QR Scanner' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={() => setCurrentView('user')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <User size={20} />
            <span>Switch to User</span>
          </button>
          <button
            onClick={() => setAdminUser(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span className="font-bold">Admin</span>
          </div>
          <span className="text-sm text-gray-400">{canteen?.name}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700">
        <div className="flex">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'orders', icon: ClipboardList, label: 'Orders' },
            { id: 'menu', icon: UtensilsCrossed, label: 'Menu' },
            { id: 'scanner', icon: QrCode, label: 'Scan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all ${
                activeTab === tab.id ? 'text-emerald-400' : 'text-gray-500'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
