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
    if (loading) return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    if (searchError) {
      return (
          <div className="text-center mt-10 p-6 bg-white rounded-lg shadow-md">
            <p className="text-red-500 font-medium">{searchError}</p>
            <button
                onClick={clearSearch}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              Clear Search
            </button>
          </div>
      );
    }

    if (!orderData || orderData.orders.length === 0) {
      return (
          <div className="text-center mt-10 p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 font-medium">No orders found.</p>
          </div>
      );
    }

    return (
        <>
          {/* Search indicator */}
          {isSearching && (
              <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md shadow-sm border border-blue-100">
              <span className="text-blue-800 font-medium">
                Showing results for: <strong className="font-semibold">"{searchTerm}"</strong>
              </span>
                  <button
                      onClick={clearSearch}
                      className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto max-w-7xl mx-auto w-full px-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                  <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSort('orderId')}
                  >
                    <div className="flex items-center">
                      Order ID
                      {sortBy === 'orderId' && (
                          <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSort('orderDate')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'orderDate' && (
                          <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                          <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center">
                      Total
                      {sortBy === 'totalAmount' && (
                          <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {orderData.orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.orderDate!).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">User #{order.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                              to={`/orders/${order.orderId}`}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            View
                          </Link>
                          <Link
                              to={`/orders/${order.orderId}/edit`}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200"
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
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 mb-8 max-w-7xl mx-auto px-4">
            <div className="text-gray-200 font-medium">
              Showing page {orderData.currentPage + 1} of {orderData.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors duration-200 ${
                      page === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>
              <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= orderData.totalPages - 1}
                  className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors duration-200 ${
                      page >= orderData.totalPages - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
    );
  };

  return (
      <div className="bg-gray-50 min-h-screen">
        <div className="w-full">
          <SubNav/>
        </div>
        <div className="w-full shadow-md">
          <NavigationBar/>
        </div>

        <div className="container mx-auto py-8 bg-gray-700">
          <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-white">
              <span className="border-b-4 border-orange-500 pb-1">Order Management</span>
            </h1>
            <div className="flex">
              <form onSubmit={handleSearch} className="flex">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Search orders..."
                    className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-64 shadow-sm text-white"
                />
                <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded-r-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors duration-300 font-medium shadow-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {renderContent()}
        </div>

        <Footer />
      </div>
  );
};

export default OrderList;