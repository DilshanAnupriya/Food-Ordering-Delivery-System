import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../services/Common/Common';
import {
    Clock,
    Star,
    Users,
    Package,
    TrendingUp,
    DollarSign,
    Settings,
    ExternalLink,
    PenTool,
    Calendar,
    AlertCircle,
    CheckCircle,
    Phone,
    Mail,
    MapPin,
    Tag,
    Coffee
} from 'lucide-react';

import Sidebar from "../../../components/Restaurants/Owner/Sidebar.tsx";

// Restaurant interface that matches backend response
interface Restaurant {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: string;
    restaurantPhone: string;
    restaurantEmail: string;
    restaurantType: string;
    city: string;
    availability: boolean;
    orderAvailability: boolean;
    rating: number;
    openingTime: string;
    closingTime: string;
    description: string;
    active: boolean;
    imageUrl: string;
    coverImageUrl: string;
    owner_username: string;
    updatedAt: string;
    createdAt: string;
}

// Mock order stats for the dashboard (in a real app, these would come from an API)
interface OrderStats {
    total: number;
    pending: number;
    completed: number;
    revenue: number;
    todayOrders: number;
    todayRevenue: number;
}

const RestaurantOwnerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
    const [orderStats, setOrderStats] = useState<OrderStats>({
        total: 0,
        pending: 0,
        completed: 0,
        revenue: 0,
        todayOrders: 0,
        todayRevenue: 0
    });

    // Handle window resize for responsive design
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Format time (e.g., "08:00:00" to "8:00 AM")
    const formatTime = (timeString: string) => {
        if (!timeString) return "";

        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;

        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // Get username from token (in a real app, you would use a proper auth library)
    // Get username from JWT token
    const getUsername = () => {
        try {
            // Get the token from local storage or wherever it's stored in your app
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No JWT token found');
                return null;
            }

            // Parse the JWT token
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                console.error('Invalid JWT token format');
                return null;
            }

            // Decode the payload (second part of the token)
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Decoded JWT:', payload);

            // Extract username from the 'sub' claim
            if (payload && payload.sub) {
                return payload.sub;
            } else {
                console.error('No username found in JWT token');
                return null;
            }
        } catch (error) {
            console.error('Error parsing JWT token:', error);
            return null;
        }
    };

    // Fetch restaurant data
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                const username = getUsername();

                // Make the API call to get restaurant by owner username
                const response = await axios.get(`${API_BASE_URL}/restaurants/by-owner/${username}`);

                if (response.data.code === 200) {
                    console.log(response.data.data);
                    setRestaurant(response.data.data);

                    // In a real app, you would fetch order stats here too
                    // For now, setting mock data
                    setOrderStats({
                        total: 125,
                        pending: 8,
                        completed: 117,
                        revenue: 3780,
                        todayOrders: 12,
                        todayRevenue: 345
                    });

                    setError(null);
                } else {
                    throw new Error('Failed to fetch restaurant data');
                }
            } catch (err) {
                console.error('Error fetching restaurant data:', err);
                setError('An error occurred while fetching your restaurant data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10
            }
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your restaurant dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="flex items-center justify-center mb-4">
                        <AlertCircle size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 text-center mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // If no restaurant is found
    if (!restaurant) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="flex items-center justify-center mb-4">
                        <Coffee size={40} className="text-orange-500" />
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2">No Restaurant Found</h2>
                    <p className="text-gray-600 text-center mb-6">You don't have any restaurants registered yet.</p>
                    <button
                        onClick={() => navigate('/restaurant/create')}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Register a Restaurant
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar isMobile={isMobile}  restaurant={restaurant} />

            {/* Main Content */}
            <div className={`flex-1 ${isMobile ? '' : 'ml-[72px]'} transition-all duration-300`}>
                {/* Main content container with padding for different screen sizes */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    {/* Hero section - moved below page title */}

                    {/* Hero section with restaurant cover */}
                    <div
                        className="relative h-64 rounded-xl overflow-hidden mb-6"
                        style={{
                            backgroundImage: `url(${restaurant.coverImageUrl || "/api/placeholder/1200/400"})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute bg-black "></div>
                        <div className="absolute inset-0 flex items-center px-8 mt-23">
                            <div className="flex items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-24 w-24 rounded-xl overflow-hidden border-4 border-white shadow-lg mr-6"
                                >
                                    <img
                                        src={restaurant.imageUrl || "/api/placeholder/200/200"}
                                        alt={restaurant.restaurantName}
                                        className="h-full w-full object-cover"
                                    />
                                </motion.div>
                                <div className="text-white ">
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl font-bold text-white"
                                    >
                                        {restaurant.restaurantName}
                                    </motion.h1>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center mt-2"
                                    >
                                        <Tag size={16} className="mr-2 text-yellow-300" />
                                        <span>{restaurant.restaurantType}</span>
                                        <div className="mx-3 h-1 w-1 rounded-full bg-yellow-300"></div>
                                        <MapPin size={16} className="mr-2 text-yellow-300" />
                                        <span>{restaurant.city}</span>
                                        <div className="mx-3 h-1 w-1 rounded-full bg-yellow-300"></div>
                                        <Star size={16} className="mr-2 text-yellow-300" />
                                        <span>{restaurant.rating.toFixed(1)}</span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Restaurant Information Card */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Restaurant Information</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
                                        onClick={() => navigate(`/update/${restaurant.restaurantId}`)}
                                    >
                                        <PenTool size={16} />
                                        <span>Edit Details</span>
                                    </motion.button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                                <p className="mt-1 text-gray-800">{restaurant.description}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Hours of Operation</h3>
                                                <div className="mt-1 flex items-center">
                                                    <Clock size={16} className="text-gray-500 mr-2" />
                                                    <span className="text-gray-800">
                                                      {formatTime(restaurant.openingTime)} - {formatTime(restaurant.closingTime)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                                <div className="mt-1 flex items-center gap-4">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                                                        restaurant.active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {restaurant.active ? <CheckCircle size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                                                        {restaurant.active ? 'Open' : 'Closed'}
                                                    </div>

                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                                                        restaurant.orderAvailability
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {restaurant.orderAvailability ? <CheckCircle size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                                                        {restaurant.orderAvailability ? 'Accepting Orders' : 'Not Accepting Orders'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                                                <div className="mt-1 space-y-2">
                                                    <div className="flex items-center">
                                                        <Phone size={16} className="text-gray-500 mr-2" />
                                                        <span className="text-gray-800">{restaurant.restaurantPhone}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Mail size={16} className="text-gray-500 mr-2" />
                                                        <span className="text-gray-800">{restaurant.restaurantEmail}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin size={16} className="text-gray-500 mr-2" />
                                                        <span className="text-gray-800">{restaurant.restaurantAddress}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Restaurant Added</h3>
                                                <div className="mt-1 flex items-center">
                                                    <Calendar size={16} className="text-gray-500 mr-2" />
                                                    <span className="text-gray-800">{formatDate(restaurant.createdAt)}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                                                <div className="mt-1 flex items-center">
                                                    <Calendar size={16} className="text-gray-500 mr-2" />
                                                    <span className="text-gray-800">{formatDate(restaurant.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>

                                <div className="space-y-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        onClick={() => navigate(`/${restaurant?.restaurantId}/fooditems`)}
                                    >
                                        <Package size={18} />
                                        <span>Manage Food Items</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        onClick={() => navigate('/')}
                                    >
                                        <Package size={18} />
                                        <span>View Orders</span>
                                    </motion.button>

                                    <div className="border-t border-gray-200 my-4"></div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        onClick={() => {
                                            // Toggle restaurant availability
                                            // In a real app, this would make an API call
                                            alert('This would toggle restaurant availability');
                                        }}
                                    >
                                        {restaurant.active ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                                        <span>{restaurant.active ? 'Mark as Closed' : 'Mark as Open'}</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        onClick={() => {
                                            // Toggle order availability
                                            // In a real app, this would make an API call
                                            alert('This would toggle order availability');
                                        }}
                                    >
                                        {restaurant.orderAvailability ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                                        <span>{restaurant.orderAvailability ? 'Stop Accepting Orders' : 'Start Accepting Orders'}</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        onClick={() => navigate('/settings')}
                                    >
                                        <Settings size={18} />
                                        <span>Restaurant Settings</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{orderStats.total}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <span className="text-green-500 font-medium">↑ 12%</span> from last month
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">${orderStats.revenue}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <span className="text-green-500 font-medium">↑ 8%</span> from last month
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{orderStats.todayOrders}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-orange-500" />
                                </div>
                            </div><div className="mt-4 text-sm text-gray-500">
                            <span className="text-green-500 font-medium">↑ 18%</span> from yesterday
                        </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">${orderStats.todayRevenue}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-purple-500" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <span className="text-green-500 font-medium">↑ 7%</span> from yesterday
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Order Status Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                    >
                        {/* Pending Orders */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Pending Orders</h2>
                                    <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium flex items-center">
                                        <AlertCircle size={12} className="mr-1" />
                                        {orderStats.pending} orders waiting
                                    </div>
                                </div>

                                {/* This would be a real list in a production app */}
                                <div className="space-y-4">
                                    {orderStats.pending > 0 ? (
                                        Array(Math.min(orderStats.pending, 3)).fill(0).map((_, index) => (
                                            <div key={index} className="border border-gray-100 rounded-lg p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">Order #{(Math.random() * 1000).toFixed(0)}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {index === 0 ? '5 minutes ago' : index === 1 ? '15 minutes ago' : '25 minutes ago'}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                                                >
                                                    View Details
                                                </motion.button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No pending orders at the moment
                                        </div>
                                    )}

                                    {orderStats.pending > 3 && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-2 text-orange-500 hover:text-orange-600 text-sm flex items-center justify-center gap-2"
                                            onClick={() => navigate('/orders?status=pending')}
                                        >
                                            <span>View all {orderStats.pending} pending orders</span>
                                            <ExternalLink size={14} />
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Reviews (This would be populated from an API in a real app) */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
                                    <div className="flex items-center">
                                        <Star size={16} className="text-yellow-400 mr-1" />
                                        <span className="text-gray-800 font-medium">{restaurant.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Sample reviews - in a real app, these would come from an API */}
                                    <div className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                    <Users size={16} className="text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">John D.</p>
                                                    <p className="text-sm text-gray-500">2 days ago</p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= 5 ? "text-yellow-400" : "text-gray-300"}
                                                        fill={star <= 5 ? "currentColor" : "none"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-gray-600 text-sm">
                                            Absolutely loved the food! Everything was fresh and delicious.
                                            The service was also excellent. Will definitely come back!
                                        </p>
                                    </div>

                                    <div className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                    <Users size={16} className="text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Sarah M.</p>
                                                    <p className="text-sm text-gray-500">1 week ago</p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= 4 ? "text-yellow-400" : "text-gray-300"}
                                                        fill={star <= 4 ? "currentColor" : "none"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-gray-600 text-sm">
                                            Great food and ambiance! The only thing I would improve is
                                            the waiting time. But overall a pleasant experience.
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-2 text-orange-500 hover:text-orange-600 text-sm flex items-center justify-center gap-2"
                                        onClick={() => navigate('/reviews')}
                                    >
                                        <span>View all reviews</span>
                                        <ExternalLink size={14} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Footer with helpful information or tips */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-6 mb-8"
                    >
                        <div className="flex items-start">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <Coffee size={24} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium text-blue-800 mb-1">Restaurant Owner Tips</h3>
                                <p className="text-blue-600 text-sm">
                                    Remember to regularly update your menu and respond promptly to customer reviews.
                                    Engaging with your customers builds loyalty and improves your restaurant's reputation.
                                </p>
                                <button
                                    className="mt-3 text-blue-700 hover:text-blue-800 text-sm flex items-center"
                                    onClick={() => navigate('/help/owner-tips')}
                                >
                                    <span>View more tips</span>
                                    <ExternalLink size={14} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantOwnerDashboard;