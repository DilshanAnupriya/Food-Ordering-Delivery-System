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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

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
      
      // Check if no results found
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
    setPage(0); // Reset to first page when searching
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
    if (loading) return <div className="text-center mt-10">Loading orders...</div>;
    
    if (searchError) {
      return (
        <div className="text-center mt-10">
          <p className="text-red-500">{searchError}</p>
          <button 
            onClick={clearSearch}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Clear Search
          </button>
        </div>
      );
    }
    
    if (!orderData || orderData.orders.length === 0) {
      return <div className="text-center mt-10">No orders found.</div>;
    }

    return (
      <>
        {/* Search indicator */}
        {isSearching && (
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
              <span className="text-blue-700">
                Showing results for: <strong>"{searchTerm}"</strong>
              </span>
              <button 
                onClick={clearSearch}
                className="text-blue-700 hover:underline"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 mb-8 max-w-7xl mx-auto px-4">
          <div className="text-gray-700">
            Showing page {orderData.currentPage + 1} of {orderData.totalPages}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handlePageChange(page - 1)} 
              disabled={page === 0}
              className={`px-3 py-1 border rounded ${page === 0 ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Previous
            </button>
            <button 
              onClick={() => handlePageChange(page + 1)} 
              disabled={page >= orderData.totalPages - 1}
              className={`px-3 py-1 border rounded ${page >= orderData.totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="bg-gradient-to-r white relative overflow-hidden min-h-screen">
      <div className="w-full">
        <SubNav/> 
      </div>
      <div className="w-full">
        <NavigationBar/>
      </div>
      {/* Gap above search bar */}
      <div className="mt-8" />
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-orange-500">Order List</h1>
        <div className="flex">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search by order ID, user ID, status..."
              className="border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button 
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-r hover:bg-orange-600"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {renderContent()}
      <Footer />
    </div>
  );
};

export default OrderList;