import React, { useState } from 'react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Briefcase, LogIn } from 'lucide-react';

export const UserLogin: React.FC = () => {
  const { setUser } = useApp();
  const [userType, setUserType] = useState<'student' | 'employee'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !idNumber) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      type: userType,
      ...(userType === 'student' ? { collegeId: idNumber } : { employeeId: idNumber }),
    };

    setUser(newUser);
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'user-demo',
      name: 'Demo User',
      email: 'demo@campus.edu',
      type: 'student',
      collegeId: 'STU2024001',
    };
    setUser(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Canteen</h1>
          <p className="text-gray-500 mt-1">Pre-order your meals, skip the queue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                userType === 'student'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GraduationCap size={20} />
              Student
            </button>
            <button
              onClick={() => setUserType('employee')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                userType === 'employee'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Briefcase size={20} />
              Employee
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {userType === 'student' ? 'College ID' : 'Employee ID'}
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder={userType === 'student' ? 'STU2024001' : 'EMP2024001'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <LogIn size={20} />
              Login
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
            Try Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};
