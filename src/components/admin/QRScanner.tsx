import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, CheckCircle, XCircle, AlertTriangle, Search, Clock } from 'lucide-react';
import { Order } from '../../types';

export const QRScanner: React.FC = () => {
  const { adminUser, orders, markOrderAsUsed, updateOrderStatus } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [scanResult, setScanResult] = useState<'valid' | 'invalid' | 'expired' | 'used' | null>(null);

  const handleSearch = () => {
    if (!searchCode.trim()) return;

    const order = orders.find(
      o => o.uniqueCode.toLowerCase() === searchCode.trim().toLowerCase() && 
           o.canteenId === adminUser?.canteenId
    );

    if (!order) {
      setScanResult('invalid');
      setScannedOrder(null);
      return;
    }

    if (order.isUsed) {
      setScanResult('used');
      setScannedOrder(order);
      return;
    }

    const now = new Date();
    const validUntil = new Date(order.validUntil);

    if (now > validUntil) {
      setScanResult('expired');
      setScannedOrder(order);
      return;
    }

    setScanResult('valid');
    setScannedOrder(order);
  };

  const handleComplete = () => {
    if (scannedOrder && scanResult === 'valid') {
      markOrderAsUsed(scannedOrder.id);
      setScannedOrder({ ...scannedOrder, isUsed: true, orderStatus: 'completed' });
      setScanResult('used');
    }
  };

  const handleMarkReady = () => {
    if (scannedOrder) {
      updateOrderStatus(scannedOrder.id, 'ready');
      setScannedOrder({ ...scannedOrder, orderStatus: 'ready' });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const resetScan = () => {
    setSearchCode('');
    setScannedOrder(null);
    setScanResult(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">QR Code Verification</h1>

      {/* Search Box */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <QrCode size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Enter Order Code</h2>
          <p className="text-gray-500 text-sm">Type the order code shown by customer</p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ORD-2024-XXXXXX"
            className="flex-1 px-4 py-3 border rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-center text-lg font-mono tracking-wider"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <Search size={20} />
            Verify
          </button>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className={`rounded-xl p-6 ${
          scanResult === 'valid' ? 'bg-green-50 border border-green-200' :
          scanResult === 'used' ? 'bg-blue-50 border border-blue-200' :
          scanResult === 'expired' ? 'bg-amber-50 border border-amber-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            {scanResult === 'valid' && (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-green-800">Valid Order</h3>
                  <p className="text-green-600 text-sm">Ready to collect</p>
                </div>
              </>
            )}
            {scanResult === 'used' && (
              <>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-800">Already Completed</h3>
                  <p className="text-blue-600 text-sm">This order has been collected</p>
                </div>
              </>
            )}
            {scanResult === 'expired' && (
              <>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800">Order Expired</h3>
                  <p className="text-amber-600 text-sm">This order is no longer valid</p>
                </div>
              </>
            )}
            {scanResult === 'invalid' && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800">Invalid Code</h3>
                  <p className="text-red-600 text-sm">Order not found for this canteen</p>
                </div>
              </>
            )}
          </div>

          {scannedOrder && (
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{scannedOrder.uniqueCode}</p>
                  <p className="text-gray-500">{scannedOrder.userName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scannedOrder.orderStatus === 'completed' ? 'bg-green-100 text-green-700' :
                  scannedOrder.orderStatus === 'ready' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {scannedOrder.orderStatus}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {scannedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-bold text-lg">₹{scannedOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Already Paid</span>
                  <span className="font-medium">₹{scannedOrder.advanceAmount}</span>
                </div>
                {scannedOrder.paymentStatus === 'advance' && (
                  <div className="flex justify-between text-amber-600 text-lg">
                    <span className="font-medium">Collect Now</span>
                    <span className="font-bold">₹{scannedOrder.totalAmount - scannedOrder.advanceAmount}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                <p>Created: {formatDate(scannedOrder.createdAt)}</p>
                <p>Valid Until: {formatDate(scannedOrder.validUntil)}</p>
              </div>

              {scanResult === 'valid' && (
                <div className="flex gap-3 pt-4">
                  {scannedOrder.orderStatus !== 'ready' && (
                    <button
                      onClick={handleMarkReady}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
                    >
                      Mark as Ready
                    </button>
                  )}
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Complete Order
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={resetScan}
            className="w-full mt-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-white transition-all"
          >
            Scan Another Order
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">How to Use</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 text-sm font-bold">1</span>
            </div>
            <p className="text-gray-600 text-sm">Ask customer to show their order QR code or order ID</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 text-sm font-bold">2</span>
            </div>
            <p className="text-gray-600 text-sm">Enter the order code in the search box above</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 text-sm font-bold">3</span>
            </div>
            <p className="text-gray-600 text-sm">Verify order details and collect remaining payment if any</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 text-sm font-bold">4</span>
            </div>
            <p className="text-gray-600 text-sm">Mark order as complete to prevent reuse</p>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
        <div className="text-sm">
          <p className="font-medium text-amber-800">Important Security Note</p>
          <p className="text-amber-700 mt-1">
            Each QR code can only be used once. Once marked as complete, the order cannot be used again. 
            Always verify the customer's identity before completing the order.
          </p>
        </div>
      </div>
    </div>
  );
};
