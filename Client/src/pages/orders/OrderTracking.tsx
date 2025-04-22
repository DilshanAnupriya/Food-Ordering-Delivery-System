import React, { useState } from 'react';
import { orderService } from '../../services/Orders/orderService';

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState<string>('');
  const [trackingInfo, setTrackingInfo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await orderService.trackOrderStatus(parseInt(orderId));
      setTrackingInfo(data.statusInfo);
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to retrieve tracking information. Please check the order ID and try again.');
      setTrackingInfo('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-8">
            <h1 className="text-3xl font-extrabold text-white text-center tracking-tight">Track Your Order</h1>
            <p className="text-orange-50 text-center mt-2 opacity-90">Enter your order ID to check its current status</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleTrack} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID"
                  className="flex-grow p-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition shadow-sm bg-orange-50 bg-opacity-30 text-orange-900 placeholder-orange-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-4 rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center justify-center font-semibold transform hover:scale-105 shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Tracking...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Track Order
                    </span>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-6 shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {trackingInfo && (
              <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-lg transition-all duration-500 ease-in-out">
                <h2 className="text-xl font-bold mb-4 text-orange-800 flex items-center">
                  <svg className="h-6 w-6 text-orange-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order #{orderId} Status
                </h2>
                
                <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 bg-orange-500 rounded-full p-2 text-white">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-orange-800 mb-2">Current Status</h3>
                      <p className="text-orange-700 font-medium text-lg bg-white bg-opacity-50 p-3 rounded-lg border border-orange-100 shadow-sm">{trackingInfo}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    className="text-orange-600 hover:text-orange-800 font-medium flex items-center bg-orange-50 px-4 py-2 rounded-lg transition-colors hover:bg-orange-100 shadow-sm border border-orange-100"
                    onClick={() => window.print()}
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Details
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-orange-100 bg-gradient-to-b from-orange-50 to-white p-6">
            <div className="text-center">
              <p className="text-orange-700 mb-2 font-medium">Need help? Contact our customer support</p>
              <a href="mailto:support@orderingsystem.com" className="font-semibold text-orange-600 hover:text-orange-800 transition-colors flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@orderingsystem.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;