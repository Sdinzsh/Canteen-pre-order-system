import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Order } from '../../types';
import { CheckCircle, Clock, Calendar, Download, Share2 } from 'lucide-react';

interface OrderConfirmationProps {
  order: Order;
  onClose: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onClose }) => {
  const qrData = JSON.stringify({
    orderId: order.id,
    code: order.uniqueCode,
    userId: order.userId,
    amount: order.totalAmount,
    paid: order.advanceAmount,
    validUntil: order.validUntil.toISOString(),
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-6 text-center text-white rounded-t-2xl">
          <CheckCircle size={48} className="mx-auto mb-3" />
          <h2 className="text-xl font-bold">Order Placed Successfully!</h2>
          <p className="text-sm opacity-90 mt-1">Your pre-order has been confirmed</p>
        </div>

        <div className="p-6 space-y-6">
          {/* QR Code */}
          <div className="text-center">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border">
              <QRCodeSVG
                value={qrData}
                size={180}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#1f2937"
              />
            </div>
            <p className="text-sm text-gray-500 mt-3">Show this QR code at the counter</p>
          </div>

          {/* Order Code */}
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Order Code</p>
            <p className="text-2xl font-bold text-gray-900 tracking-wider">{order.uniqueCode}</p>
          </div>

          {/* Order Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Order Details</h3>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Canteen</span>
                <span className="font-medium">{order.canteenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Items</span>
                <span className="font-medium">{order.items.length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-medium">₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paid</span>
                <span className="font-medium text-green-600">₹{order.advanceAmount}</span>
              </div>
              {order.paymentStatus === 'advance' && (
                <div className="flex justify-between text-amber-600">
                  <span>Pay at Counter</span>
                  <span className="font-medium">₹{order.totalAmount - order.advanceAmount}</span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="border rounded-xl divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Validity */}
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl text-sm">
            <div className="flex items-center gap-2 text-amber-700">
              <Calendar size={18} />
              <span>Created: {formatDate(order.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-sm text-red-700">
            <Clock size={18} />
            <span>Valid until: {formatDate(order.validUntil)} (One-time use)</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all">
              <Download size={18} />
              Save QR
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all">
              <Share2 size={18} />
              Share
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
