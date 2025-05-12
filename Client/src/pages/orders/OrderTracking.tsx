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
    const fetchUserOrders = () => {
      const orderDetails = sessionStorage.getItem('orderDetail');
      if (orderDetails && user?.userId) {
        try {
          const orders = JSON.parse(orderDetails);
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
      const orderDetails = {
        orderId: trackingInfo.orderId
      };
      sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      navigate('/customer-tracking');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black via-black/80 to-black/60">
      <div className="w-full">
        <SubNav />
      </div>
      <div className="w-full">
        <NavigationBar />
      </div>

      <div className="flex-grow container mx-auto px-4 sm:px-6 py-18">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-16">
          <div className="bg-gradient-to-r from-orange-400 to-orange-400 py-12 px-8 text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">Order Tracking</h1>
            <p className="text-white mt-3 text-lg">Check the status of your premium dining experience</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleTrack} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID"
                  className="flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition shadow-sm bg-white text-gray-800 placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center font-medium shadow-md"
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

            {userOrders.length > 0 && !trackingInfo && (
              <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Recent Orders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {userOrders.map((order) => (
                    <button
                      key={order.orderId}
                      onClick={() => handleSelectUserOrder(order.orderId)}
                      className="bg-white text-gray-800 px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium flex items-center shadow-sm"
                    >
                      <svg className="h-4 w-4 mr-2 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Order {order.orderId}
                      {order.totalAmount && <span className="ml-2 text-gray-500">(${order.totalAmount.toFixed(2)})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
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
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <svg className="h-6 w-6 text-gray-700 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order {orderId}
                  </h2>
                  {/* <button
                    onClick={() => setShowDetailedView(!showDetailedView)}
                    className="text-gray-700 hover:text-gray-900 font-medium flex items-center text-sm"
                  >
                    {showDetailedView ? 'Show Less' : 'Show Details'}
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      {showDetailedView ?
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        :
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      }
                    </svg>
                  </button> */}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-800 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 bg-gray-800 rounded-full p-2 text-white">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Status</h3>
                      <p className="text-gray-800 font-medium text-lg bg-white p-3 rounded-md border border-gray-200">{trackingInfo.statusInfo}</p>
                      <div className="mt-3 flex justify-between items-center text-sm">
                        <span className="text-gray-600">Last updated: {trackingInfo.lastUpdated}</span>
                        <span className="text-gray-800 font-medium">{trackingInfo.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {showDetailedView && (
                  <div className="mt-6 space-y-6 animate-fadeIn">
                    <div className="bg-white p-5 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-5 text-lg">Order Progress</h4>
                      <div className="space-y-4">
                        {trackingInfo.trackingHistory?.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`flex-shrink-0 h-6 w-6 rounded-full ${index === trackingInfo.trackingHistory!.length - 1 ? 'bg-gray-900' : 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold`}>
                              {index + 1}
                            </div>
                            <div className="ml-4">
                              <p className="font-medium text-gray-900">{step.status}</p>
                              <p className="text-sm text-gray-600 mt-1">{step.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {trackingInfo.orderDetails && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg">Order Details</h4>
                        <p className="text-gray-700 mb-4">From: <span className="font-medium">{trackingInfo.orderDetails.restaurant}</span></p>
                        <div className="space-y-3">
                          {trackingInfo.orderDetails.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-700">{item.quantity}x {item.name}</span>
                              <span className="text-gray-600">${(item.quantity * 10.83).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>${trackingInfo.orderDetails.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {trackingInfo.deliveryAddress && (
                      <div className="bg-white p-5 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-lg">Delivery Address</h4>
                        <p className="text-gray-700">{trackingInfo.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    className="text-orange-500 hover:text-gray-900 font-medium flex items-center bg-gray-50 px-5 py-2.5 rounded-md transition-colors hover:bg-gray-100 border border-gray-200"
                    onClick={() => navigate('/')}
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                  </button>
                  <button
                    className="text-white bg-orange-500 hover:bg-gray-700 font-medium flex items-center px-5 py-2.5 rounded-md transition-colors"
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

          <div className="border-t border-gray-200 bg-gray-50 p-8">
            <div className="text-center">
              <p className="text-gray-700 mb-3 font-medium">Need help with your order?</p>
              <div className="flex justify-center gap-4">
                <a href="mailto:support@premiumrestaurants.com" className="font-medium text-gray-800 hover:text-gray-900 transition-colors flex items-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@premiumrestaurants.com
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