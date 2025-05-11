import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/Orders/orderService';
import NavigationBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SubNav from '../../components/layout/SubNav';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../services/auth/authContext';

interface OrderStatus {
  statusInfo: string;
  estimatedDelivery?: string;
  lastUpdated?: string;
  orderDetails?: {
    items: Array<{ name: string, quantity: number }>;
    total: number;
    restaurant: string;
  };
  deliveryAddress?: string;
  trackingHistory?: Array<{ status: string, timestamp: string }>;
  orderId?: string;
}

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState<string>('');
  const [trackingInfo, setTrackingInfo] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userOrders, setUserOrders] = useState<Array<{ orderId: string, date?: string, totalAmount?: number }>>([]);
  const [showDetailedView, setShowDetailedView] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch only the logged-in user's orders from sessionStorage
    const fetchUserOrders = () => {
      const orderDetails = sessionStorage.getItem('orderDetail');
      if (orderDetails && user?.userId) {
        try {
          const orders = JSON.parse(orderDetails);
          // Only show orders belonging to this user
          const filteredOrders = orders.filter((o: any) => o.userId === user.userId);
          setUserOrders(filteredOrders);
        } catch (e) {
          setUserOrders([]);
        }
      } else {
        setUserOrders([]);
      }
    };
    fetchUserOrders();
  }, [user]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      setLoading(true);
      setError('');
      const data = await orderService.trackOrderStatus(parseInt(orderId));
      const enhancedData: OrderStatus = {
        statusInfo: data.statusInfo,
        estimatedDelivery: data.statusInfo.includes('DELIVERED') ? 'Delivered' : 'Estimated in 25-35 minutes',
        lastUpdated: new Date().toLocaleTimeString(),
        orderDetails: {
          items: [
            { name: 'Margherita Pizza', quantity: 1 },
            { name: 'Caesar Salad', quantity: 1 },
            { name: 'Garlic Bread', quantity: 2 }
          ],
          total: 32.50,
          restaurant: 'Pizza Palace'
        },
        deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
        trackingHistory: [
          { status: 'Order Placed', timestamp: '12:30 PM' },
          { status: 'Confirmed by Restaurant', timestamp: '12:35 PM' },
          { status: 'Preparation Started', timestamp: '12:45 PM' },
          { status: data.statusInfo, timestamp: new Date().toLocaleTimeString() }
        ],
        orderId: orderId
      };
      setTrackingInfo(enhancedData);
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to retrieve tracking information. Please check the order ID and try again.');
      setTrackingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUserOrder = (id: string) => {
    setOrderId(id);
    const autoSubmitOrder = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await orderService.trackOrderStatus(parseInt(id));
        const enhancedData: OrderStatus = {
          statusInfo: data.statusInfo,
          estimatedDelivery: data.statusInfo.includes('DELIVERED') ? 'Delivered' : 'Estimated in 25-35 minutes',
          lastUpdated: new Date().toLocaleTimeString(),
          orderDetails: {
            items: [
              { name: 'Margherita Pizza', quantity: 1 },
              { name: 'Caesar Salad', quantity: 1 },
              { name: 'Garlic Bread', quantity: 2 }
            ],
            total: 32.50,
            restaurant: 'Pizza Palace'
          },
          deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
          trackingHistory: [
            { status: 'Order Placed', timestamp: '12:30 PM' },
            { status: 'Confirmed by Restaurant', timestamp: '12:35 PM' },
            { status: 'Preparation Started', timestamp: '12:45 PM' },
            { status: data.statusInfo, timestamp: new Date().toLocaleTimeString() }
          ],
          orderId: id
        };
        setTrackingInfo(enhancedData);
      } catch (error) {
        console.error('Error tracking order:', error);
        setError('Failed to retrieve tracking information. Please check the order ID and try again.');
        setTrackingInfo(null);
      } finally {
        setLoading(false);
      }
    };
    autoSubmitOrder();
  };

  const handleNavigateToTracking = () => {
    if (trackingInfo) {
      // Store the order details in session storage so CustomerTracking can access it
      const orderDetails = {
        orderId: trackingInfo.orderId
      };
      sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      navigate('/customer-tracking');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-white relative overflow-hidden">
      <div className="w-full">
        <SubNav />
      </div>
      <div className="w-full">
        <NavigationBar />
      </div>

      <div className="flex-grow container mx-auto px-4 sm:px-10 py-12 bg-gray-800">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100 mb-16">
          <div className="bg-gradient-to-r from-orange-500 to-orange-500 py-10 px-8">
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

            {/* User's Orders List */}
            {userOrders.length > 0 && !trackingInfo && (
              <div className="mb-8 bg-orange-50 rounded-xl p-4 border border-orange-100">
                <h3 className="text-md font-semibold text-orange-800 mb-2">Your Orders</h3>
                <div className="flex flex-wrap gap-2">
                  {userOrders.map((order) => (
                    <button
                      key={order.orderId}
                      onClick={() => handleSelectUserOrder(order.orderId)}
                      className="bg-white text-orange-600 px-3 py-2 rounded-lg border border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-colors text-sm font-medium flex items-center shadow-sm"
                    >
                      <svg className="h-4 w-4 mr-1 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Order #{order.orderId}
                      {order.totalAmount && <span className="ml-2 text-gray-500">(${order.totalAmount.toFixed(2)})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-orange-800 flex items-center">
                    <svg className="h-6 w-6 text-orange-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order {orderId} Status
                  </h2>
                  <button
                    onClick={() => setShowDetailedView(!showDetailedView)}
                    className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
                  >
                    {showDetailedView ? 'Show Less' : 'Show Details'}
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      {showDetailedView ?
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        :
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      }
                    </svg>
                  </button>
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 bg-orange-500 rounded-full p-2 text-white">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-orange-800 mb-2">Current Status</h3>
                      <p className="text-orange-700 font-medium text-lg bg-white bg-opacity-50 p-3 rounded-lg border border-orange-100 shadow-sm">{trackingInfo.statusInfo}</p>
                      <div className="mt-2 flex justify-between items-center text-sm">
                        <span className="text-orange-600">Last updated: {trackingInfo.lastUpdated}</span>
                        <span className="text-orange-600 font-medium">{trackingInfo.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {showDetailedView && (
                  <div className="mt-6 space-y-6 animate-fadeIn">
                    <div className="bg-white p-4 rounded-xl border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-4">Order Progress</h4>
                      <div className="space-y-4">
                        {trackingInfo.trackingHistory?.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`flex-shrink-0 h-6 w-6 rounded-full ${index === trackingInfo.trackingHistory!.length - 1 ? 'bg-orange-500' : 'bg-orange-300'} flex items-center justify-center text-white text-xs font-bold`}>
                              {index + 1}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-orange-800">{step.status}</p>
                              <p className="text-sm text-orange-600">{step.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {trackingInfo.orderDetails && (
                      <div className="bg-white p-4 rounded-xl border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">Order Details</h4>
                        <p className="text-orange-700 mb-3">From: {trackingInfo.orderDetails.restaurant}</p>
                        <div className="space-y-2">
                          {trackingInfo.orderDetails.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-orange-100 flex justify-between font-bold">
                            <span>Total</span>
                            <span>${trackingInfo.orderDetails.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {trackingInfo.deliveryAddress && (
                      <div className="bg-white p-4 rounded-xl border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">Delivery Address</h4>
                        <p className="text-gray-700">{trackingInfo.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    className="text-orange-600 hover:text-orange-800 font-medium flex items-center bg-orange-50 px-4 py-2 rounded-lg transition-colors hover:bg-orange-100 shadow-sm border border-orange-100"
                    onClick={() => navigate('/')}
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button
                    className="text-orange-600 hover:text-orange-800 font-medium flex items-center bg-orange-50 px-4 py-2 rounded-lg transition-colors hover:bg-orange-100 shadow-sm border border-orange-100"
                    onClick={handleNavigateToTracking}
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Track Your Order
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-orange-100 bg-gradient-to-b from-orange-50 to-white p-6">
            <div className="text-center">
              <p className="text-orange-700 mb-2 font-medium">Need help? Contact our customer support</p>
              <div className="flex justify-center gap-4">
                <a href="mailto:support@orderingsystem.com" className="font-semibold text-orange-600 hover:text-orange-800 transition-colors flex items-center">
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
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default OrderTracking;