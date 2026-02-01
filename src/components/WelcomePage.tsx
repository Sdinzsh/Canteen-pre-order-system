import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ChefHat, ArrowRight, Smartphone, QrCode, Clock, CreditCard } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl shadow-xl mb-6">
              <span className="text-4xl">🍽️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Campus <span className="text-gradient">Canteen</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Pre-order your meals, skip the queue, and enjoy your food without the wait. 
              Perfect for colleges, companies, and institutions.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentView('user')}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <GraduationCap size={24} />
                I'm a Student / Employee
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => setCurrentView('admin')}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <ChefHat size={24} />
                I'm Canteen Staff
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Smartphone,
              title: 'Browse Menu',
              description: 'View real-time food availability, prices, and preparation time from any canteen',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: CreditCard,
              title: 'Pre-Order',
              description: 'Reserve your food with advance payment or pay in full to secure your meal',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: QrCode,
              title: 'Get QR Code',
              description: 'Receive a unique QR code valid for one day. Show it at the counter to collect',
              color: 'from-purple-500 to-violet-500',
            },
            {
              icon: Clock,
              title: 'Skip the Queue',
              description: 'Walk straight to the counter, show your QR, and get your food instantly',
              color: 'from-orange-500 to-amber-500',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Say Goodbye to Long Queues
              </h2>
              <div className="space-y-4">
                {[
                  '✅ Real-time food availability updates',
                  '✅ Pre-order during class or meetings',
                  '✅ Flexible payment options (advance or full)',
                  '✅ Unique QR code for secure collection',
                  '✅ Order history and tracking',
                  '✅ Works across multiple canteens',
                ].map((benefit, index) => (
                  <p key={index} className="text-gray-600 flex items-center gap-2">
                    {benefit}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Confirmed!</p>
                    <p className="text-sm text-gray-500">ORD-2024-XYZ123</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Your items:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Masala Dosa × 1</span>
                      <span className="font-medium">₹60</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Masala Chai × 2</span>
                      <span className="font-medium">₹40</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-green-700 font-medium">Ready to collect in 10 mins!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Perfect For
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our solution works for any organization with a canteen facility
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { emoji: '🎓', label: 'Colleges' },
            { emoji: '🏢', label: 'Corporate Offices' },
            { emoji: '🏭', label: 'Factories' },
            { emoji: '🏥', label: 'Hospitals' },
            { emoji: '🏫', label: 'Schools' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-lg transition-all"
            >
              <span className="text-4xl mb-3 block">{item.emoji}</span>
              <p className="font-medium text-gray-900">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-8">
            Choose your role and start using Campus Canteen today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentView('user')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all"
            >
              <GraduationCap size={20} />
              Student / Employee App
            </button>
            
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
            >
              <ChefHat size={20} />
              Canteen Admin Panel
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-lg">Campus Canteen</span>
          </div>
          <p className="text-gray-400 text-sm">
            Pre-Order & Availability Management System
          </p>
          <p className="text-gray-500 text-xs mt-4">
            Reducing queues, saving time, improving canteen efficiency
          </p>
        </div>
      </footer>
    </div>
  );
};
