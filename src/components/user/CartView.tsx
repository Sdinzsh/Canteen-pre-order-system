import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, Plus, Minus, CreditCard, Wallet, ShoppingBag, AlertCircle } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';
import { Order } from '../../types';

export const CartView: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, createOrder, selectedCanteenId } = useApp();
  const [paymentType, setPaymentType] = useState<'advance' | 'full'>('full');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const advanceAmount = Math.ceil(subtotal * 0.2);
  const payableAmount = paymentType === 'full' ? subtotal : advanceAmount;
  const remainingAmount = paymentType === 'advance' ? subtotal - advanceAmount : 0;

  const handleCheckout = async () => {
    if (cart.length === 0 || !selectedCanteenId) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const order = createOrder(paymentType);
    if (order) {
      setConfirmedOrder(order);
    }
    
    setIsProcessing(false);
  };

  if (confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <ShoppingBag size={64} className="mb-4 opacity-30" />
        <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
        <p className="text-sm mt-1">Add items from the menu to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
        <button
          onClick={clearCart}
          className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.availableQuantity}
                className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white hover:bg-orange-600 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">Payment Option</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentType('full')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentType === 'full'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className={`mx-auto mb-2 ${paymentType === 'full' ? 'text-orange-500' : 'text-gray-400'}`} size={24} />
            <p className="font-medium text-gray-900">Full Payment</p>
            <p className="text-sm text-gray-500">Pay ₹{subtotal} now</p>
          </button>
          
          <button
            onClick={() => setPaymentType('advance')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentType === 'advance'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Wallet className={`mx-auto mb-2 ${paymentType === 'advance' ? 'text-orange-500' : 'text-gray-400'}`} size={24} />
            <p className="font-medium text-gray-900">Advance (20%)</p>
            <p className="text-sm text-gray-500">Pay ₹{advanceAmount} now</p>
          </button>
        </div>

        {paymentType === 'advance' && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p>
              Pay remaining ₹{remainingAmount} at the counter when collecting your order.
            </p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-900">Order Summary</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">₹{subtotal}</span>
          </div>
          {paymentType === 'advance' && (
            <>
              <div className="flex justify-between text-green-600">
                <span>Advance Payment (20%)</span>
                <span className="font-medium">₹{advanceAmount}</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>Pay at Counter</span>
                <span className="font-medium">₹{remainingAmount}</span>
              </div>
            </>
          )}
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Pay Now</span>
            <span className="text-orange-500">₹{payableAmount}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Pay ₹{payableAmount}
          </>
        )}
      </button>
    </div>
  );
};
