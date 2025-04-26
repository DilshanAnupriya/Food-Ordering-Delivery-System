import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/Orders/orderService'; 
import { PaginatedOrdersResponse } from '../../types/Order/order'; 
import { Link } from 'react-router-dom';
import NavigationBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SubNav from '../../components/layout/SubNav';

const OrderList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<PaginatedOrdersResponse | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('orderDate');
  const [direction, setDirection] = useState<string>('desc');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(page, size, sortBy, direction);
      setOrderData(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, size, sortBy, direction]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;
  
  if (!orderData || orderData.orders.length === 0) {
    return <div className="text-center mt-10">No orders found.</div>;
  }

  return (
    <div className="bg-gradient-to-r white relative overflow-hidden min-h-screen">
      <div className="w-full">
        <SubNav/> 
      </div>
      <div className="w-full">
        < NavigationBar/>
      </div>
      {/* Gap above New Order button */}
      <div className="mt-8" />
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-orange-500" >Order List</h1>
        <Link to="/orders/new" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-500">
          New Order
        </Link>
      </div>

      {/* Centered Table */}
      <div className="overflow-x-auto max-w-7xl mx-auto w-full px-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th 
                className="py-2 px-4 border-b cursor-pointer" 
                onClick={() => handleSort('orderId')}
              >
                Order ID {sortBy === 'orderId' && (direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="py-2 px-4 border-b cursor-pointer" 
                onClick={() => handleSort('orderDate')}
              >
                Date {sortBy === 'orderDate' && (direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th 
                className="py-2 px-4 border-b cursor-pointer" 
                onClick={() => handleSort('status')}
              >
                Status {sortBy === 'status' && (direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="py-2 px-4 border-b cursor-pointer" 
                onClick={() => handleSort('totalAmount')}
              >
                Total {sortBy === 'totalAmount' && (direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderData.orders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{order.orderId}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(order.orderDate!).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">User #{order.userId}</td>
                <td className="py-2 px-4 border-b">
                  <span 
                    className={`px-2 py-1 rounded text-xs font-semibold
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
                </td>
                <td className="py-2 px-4 border-b">${order.totalAmount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">
                  <Link 
                    to={`/orders/${order.orderId}`} 
                    className="text-blue-500 hover:underline mr-2"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/orders/${order.orderId}/edit`} 
                    className="text-green-500 hover:underline mr-2"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this order?')) {
                        await orderService.deleteOrder(order.orderId!);
                        fetchOrders();
                      }
                    }} 
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gap below pagination */}
      <div className="flex justify-between items-center mt-4 text-white mb-8 max-w-7xl mx-auto px-4">
        <div>
          Showing page {orderData.currentPage + 1} of {orderData.totalPages}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 0}
            className={`px-3 py-1 border rounded ${page === 0 ? 'bg-orange-500 text-gray-700' : 'hover:bg-gray-100'}`}
          >
            Previous
          </button>
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page >= orderData.totalPages - 1}
            className={`px-3 py-1 border rounded ${page >= orderData.totalPages - 1 ? 'bg-orange-500 text-gray-700' : 'hover:bg-gray-100'}`}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default OrderList;