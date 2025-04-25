import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/Orders/orderService'; 
import { Order, OrderStatus } from '../../types/Order/order';
import Footer from '../../components/layout/Footer';
import SubNav from '../../components/layout/SubNav';
import NavigationBar from '../../components/layout/Navbar';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [statusInfo, setStatusInfo] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(parseInt(orderId!));
        setOrder(data);
        setStatus(data.status);

        // Get tracking info
        const trackInfo = await orderService.trackOrderStatus(parseInt(orderId!));
        setStatusInfo(trackInfo.statusInfo);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!status || !order) return;
    try {
      const updatedOrder = await orderService.updateOrderStatus(order.orderId!, status as OrderStatus);
      setOrder(updatedOrder);
      alert('Order status updated successfully');
      
      // Refresh tracking info
      const trackInfo = await orderService.trackOrderStatus(parseInt(orderId!));
      setStatusInfo(trackInfo.statusInfo);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(order.orderId!);
        alert('Order deleted successfully');
        navigate('/orders');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
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
      <div className="max-w- 7xl mx-auto px-30 py-8">
      <div className="flex justify-between items-center mb-6"> 
        <h1 className="text-2xl font-bold">Order {order.orderId}</h1>
        <div className="space-x-2">
          <Link to="/orders" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Orders
          </Link>
          <Link to={`/orders/${order.orderId}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Edit Order
          </Link>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete Order
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

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Update Status</label>
            <div className="flex items-center space-x-2">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Status</option>
                {Object.values(OrderStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button 
                onClick={handleStatusUpdate}
                disabled={!status || status === order.status}
                className={`px-4 py-2 rounded ${!status || status === order.status ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Update
              </button>
            </div>
          </div>

          <div>
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