import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/Orders/orderService'; 
import { Order } from '../../types/Order/order';
import Footer from '../../components/layout/Footer';
import SubNav from '../../components/layout/SubNav';
import NavigationBar from '../../components/layout/Navbar';
import OrderStatusUpdate from '../../components/order/OrderStatusUpdate'; // Import the new component

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

  if (loading) return <div className="text-center mt-10">Loading order details...</div>;
  if (!order) return <div className="text-center mt-10">Order not found</div>;

  return (
    <div className="bg-gradient-to-r white relative overflow-hidden">
      <div className="w-full">
        <SubNav/> 
      </div>
      <div className="w-full">
        < NavigationBar/>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6"> 
        <h1 className="text-2xl font-bold">Order {order.orderId}</h1>
        <div className="space-x-2">
          <Link to="/orders" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Orders
          </Link>
          <button 
            onClick={handleDelete} 
            disabled={deleteLoading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {deleteLoading ? 'Deleting...' : 'Delete Order'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">Order Date</p>
              <p>{new Date(order.orderDate!).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-700">Last Updated</p>
              <p>{new Date(order.lastUpdated!).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-700">Customer ID</p>
              <p>{order.userId}</p>
            </div>
            <div>
              <p className="text-gray-700">Restaurant ID</p>
              <p>{order.restaurantId}</p>
            </div>
            <div>
              <p className="text-gray-700">Delivery Address</p>
              <p>{order.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-gray-700">Contact Phone</p>
              <p>{order.contactPhone}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <div className="mb-4">
            <p className="text-gray-700">Current Status</p>
            <div className="flex items-center mt-2">
              <span 
                className={`px-3 py-1 rounded text-sm font-medium
                  ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                  ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                  ${order.status === 'PLACED' ? 'bg-blue-100 text-blue-800' : ''}
                  ${order.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-800' : ''}
                  ${order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-100 text-orange-800' : ''}
                `}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Replace the old status update UI with the new component */}
          <OrderStatusUpdate 
            orderId={order.orderId!} 
            currentStatus={order.status} 
            onStatusUpdate={handleStatusUpdateComplete} 
          />

          <div className="mt-4">
            <p className="text-gray-700 mb-2">Tracking Information</p>
            <div className="bg-gray-50 p-3 rounded">
              {statusInfo}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-left">Menu ID</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2">{item.itemName}</td>
                <td className="py-2">{item.menuItemId}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="py-2 text-right">${item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td colSpan={4} className="py-2 text-right font-medium">Subtotal</td>
              <td className="py-2 text-right">${order.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="py-2 text-right font-medium">Delivery Fee</td>
              <td className="py-2 text-right">${order.deliveryFee.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="py-2 text-right font-medium">Tax</td>
              <td className="py-2 text-right">${order.tax.toFixed(2)}</td>
            </tr>
            <tr className="border-t">
              <td colSpan={4} className="py-2 text-right font-semibold">Total</td>
              <td className="py-2 text-right font-semibold">${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      </div>
      <Footer/>
    </div>
  );
};

export default OrderDetail;