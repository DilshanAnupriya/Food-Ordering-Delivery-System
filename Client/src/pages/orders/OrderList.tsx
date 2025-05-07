import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/Orders/orderService'; 
import { PaginatedOrdersResponse } from '../../types/Order/order'; 
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/layout/AdminSideBar';
import { Package, Search, RefreshCcw, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<PaginatedOrdersResponse | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('orderDate');
  const [direction, setDirection] = useState<string>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setSearchError(null);
      const data = await orderService.getOrders(page, size, sortBy, direction);
      setOrderData(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSearchError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchOrders = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      fetchOrders();
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      setSearchError(null);
      const data = await orderService.searchOrders(searchTerm, page, size, sortBy, direction);
      setOrderData(data);
      
      if (data.orders.length === 0) {
        setSearchError(`No results found for "${searchTerm}"`);
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      setSearchError('Failed to search orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearching && searchTerm.trim()) {
      searchOrders();
    } else {
      fetchOrders();
    }
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    searchOrders();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setIsSearching(false);
      setSearchError(null);
      fetchOrders();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setSearchError(null);
    fetchOrders();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      );
    }
    
    if (searchError) {
      return (
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
          <span className="text-red-500">!</span>
          <div>
            <h3 className="font-medium text-red-800">{searchError}</h3>
            <button 
              onClick={clearSearch}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Clear Search
            </button>
          </div>
        </div>
      );
    }
    
    if (!orderData || orderData.orders.length === 0) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Orders</h3>
          <p className="mt-1 text-sm text-gray-500">No orders found in the system.</p>
        </div>
      );
    }

    return (
      <>
        {isSearching && (
          <div className="mb-4">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <span className="text-blue-700 flex items-center gap-2">
                <Search size={16} />
                Results for: <strong>"{searchTerm}"</strong>
              </span>
              <button 
                onClick={clearSearch}
                className="text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <RefreshCcw size={16} />
                Clear
              </button>
            </div>
          </div>
        )}
      
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
              <Link
                to="/orders/new"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Order
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {orderData.orders.map((order) => (
                  <motion.tr 
                    key={order.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg mt-4">
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing page <span className="font-medium">{orderData.currentPage + 1}</span> of{' '}
              <span className="font-medium">{orderData.totalPages}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 0}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
                  ${page === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page >= orderData.totalPages - 1}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
                  ${page >= orderData.totalPages - 1 
                    ? 'bg-gray-100 text-gray-400 cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-semibold text-gray-900">Order Management</h1>
                <form onSubmit={handleSearch} className="flex-1 sm:flex-initial">
                  <div className="flex max-w-md">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        placeholder="Search orders..."
                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm pl-4 pr-10 py-2"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderList;