import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/Orders/orderService'; 
import { Order } from '../../types/Order/order';
import Footer from '../../components/layout/Footer';
import SubNav from '../../components/layout/SubNav';
import NavigationBar from '../../components/layout/Navbar';
import OrderStatusUpdate from '../../components/order/OrderStatusUpdate';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusInfo, setStatusInfo] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(parseInt(orderId!));
      setOrder(data);

      // Get tracking info
      const trackInfo = await orderService.trackOrderStatus(parseInt(orderId!));
      setStatusInfo(trackInfo.statusInfo);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  // This function will be passed to OrderStatusUpdate as a callback
  const handleStatusUpdateComplete = () => {
    fetchOrderData(); // Refresh the order data after status update
  };

  const handleDelete = async () => {
    if (!order || !orderId) return;
    
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        setDeleteLoading(true);
        await orderService.deleteOrder(parseInt(orderId));
        alert('Order deleted successfully');
        navigate('/orders');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-white text-xl font-medium flex items-center">
        <svg className="animate-spin h-8 w-8 mr-3 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading order details...
      </div>
    </div>
  );
  
  if (!order) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-white text-xl">Order not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="w-full shadow-md">
        <SubNav/> 
      </div>
      <div className="w-full shadow-lg">
        <NavigationBar/>
      </div>
      
      <div className="bg-gradient-to-b from-gray-600 to-gray-500 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <span className="bg-orange-500 text-white p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
              Order {order.orderId}
            </h1>
            <div className="flex gap-3">
              <Link to="/orders" className="bg-orange-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition duration-200 flex items-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Orders
              </Link>
              <button 
                onClick={handleDelete} 
                disabled={deleteLoading}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition duration-200 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {deleteLoading ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Order Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-500 text-sm">Order Date</p>
                  <p className="font-medium text-gray-800">{new Date(order.orderDate!).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-500 text-sm">Last Updated</p>
                  <p className="font-medium text-gray-800">{new Date(order.lastUpdated!).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-500 text-sm">Customer ID</p>
                  <p className="font-medium text-gray-800">{order.userId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-500 text-sm">Restaurant ID</p>
                  <p className="font-medium text-gray-800">{order.restaurantId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md col-span-2">
                  <p className="text-gray-500 text-sm">Delivery Address</p>
                  <p className="font-medium text-gray-800">{order.deliveryAddress}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md col-span-2">
                  <p className="text-gray-500 text-sm">Contact Phone</p>
                  <p className="font-medium text-gray-800">{order.contactPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Status
              </h2>
              <div className="mb-4">
                <p className="text-gray-500 text-sm mb-2">Current Status</p>
                <div className="flex items-center">
                  <span 
                    className={`px-4 py-2 rounded-full text-sm font-medium
                      ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
                      ${order.status === 'PLACED' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
                      ${order.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-800 border border-purple-200' : ''}
                      ${order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : ''}
                      ${order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-100 text-orange-800 border border-orange-200' : ''}
                    `}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <OrderStatusUpdate 
                orderId={order.orderId!} 
                currentStatus={order.status} 
                onStatusUpdate={handleStatusUpdateComplete} 
              />

              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-2">Tracking Information</p>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  {statusInfo}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transform transition duration-500 hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center border-b border-gray-200 pb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 bg-gray-100 text-left text-gray-600 uppercase text-sm font-semibold rounded-tl-lg">Item</th>
                    <th className="py-3 px-4 bg-gray-100 text-left text-gray-600 uppercase text-sm font-semibold">Menu ID</th>
                    <th className="py-3 px-4 bg-gray-100 text-right text-gray-600 uppercase text-sm font-semibold">Quantity</th>
                    <th className="py-3 px-4 bg-gray-100 text-right text-gray-600 uppercase text-sm font-semibold">Unit Price</th>
                    <th className="py-3 px-4 bg-gray-100 text-right text-gray-600 uppercase text-sm font-semibold rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-orange-50 transition duration-200`}>
                      <td className="py-3 px-4 border-b border-gray-100">{item.itemName}</td>
                      <td className="py-3 px-4 border-b border-gray-100">{item.menuItemId}</td>
                      <td className="py-3 px-4 border-b border-gray-100 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 border-b border-gray-100 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 border-b border-gray-100 text-right font-medium">${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right font-medium text-gray-600">Subtotal</td>
                    <td className="py-3 px-4 text-right font-medium">${order.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right font-medium text-gray-600">Delivery Fee</td>
                    <td className="py-3 px-4 text-right font-medium">${order.deliveryFee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right font-medium text-gray-600">Tax</td>
                    <td className="py-3 px-4 text-right font-medium">${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right font-semibold text-lg text-gray-800 border-t-2 border-gray-200">Total</td>
                    <td className="py-3 px-4 text-right font-semibold text-lg text-orange-500 border-t-2 border-gray-200">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default OrderDetail;