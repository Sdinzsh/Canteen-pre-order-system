import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { canteens } from '../../data/mockData';
import { ChefHat, LogIn } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { setAdminUser } = useApp();
  const [name, setName] = useState('');
  const [selectedCanteen, setSelectedCanteen] = useState(canteens[0].id);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setAdminUser({
      id: `admin-${Date.now()}`,
      name,
      canteenId: selectedCanteen,
    });
  };

  const handleDemoLogin = () => {
    setAdminUser({
      id: 'admin-demo',
      name: 'Demo Admin',
      canteenId: canteens[0].id,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg mb-4">
            <ChefHat size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Canteen Admin</h1>
          <p className="text-gray-400 mt-1">Manage orders and menu items</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Canteen</label>
              <select
                value={selectedCanteen}
                onChange={(e) => setSelectedCanteen(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              >
                {canteens.map((canteen) => (
                  <option key={canteen.id} value={canteen.id}>
                    {canteen.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <LogIn size={20} />
              Login as Admin
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Try Demo Admin Account
          </button>
        </div>
      </div>
    </div>
  );
};
