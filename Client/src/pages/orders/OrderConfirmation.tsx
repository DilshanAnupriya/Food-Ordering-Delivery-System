import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/layout/Navbar';
import SubNav from '../../components/layout/SubNav';
import Footer from '../../components/layout/Footer';
import axios from 'axios';
import {fetchRestaurantData} from '../../services/Restaurants/LoadAllRestaurants'
import {orderService} from '../../services/Orders/orderService'

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const [isCreatingDelivery, setIsCreatingDelivery] = useState(false);
    const [deliveryStatuses, setDeliveryStatuses] = useState([]);

    // Get order details from session storage
    const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails') || '[]');

    useEffect(() => {
        // Only create deliveries if they haven't been created yet
        if (orderDetails.length > 0 && deliveryStatuses.length === 0) {
            setIsCreatingDelivery(true);

            // Process each order sequentially
            const processOrders = async () => {
                for (const order of orderDetails) {
                    await createDeliveryForOrder(order);
                }
                setIsCreatingDelivery(false);
            };

            processOrders();
        }
    }, [orderDetails]);

    const createDeliveryForOrder = async (order) => {
        try {
            // 1. Get restaurant location using restaurantId
            const restaurantInfo = await fetchRestaurantData(order.restaurantId);

            // 2. Get delivery destination based on the order
            const userDestination = await orderService.getOrderById(order.orderId);

            // 3. Create the delivery
            if (restaurantInfo && userDestination) {
                const deliveryResponse = await axios.post('http://localhost:8082/api/v1/delivery/create', null, {
                    params: {
                        orderId: order.orderId.toString(),
                        shopLatitude: restaurantInfo.data.latitude,
                        shopLongitude: restaurantInfo.data.longitude,
                        destinationLatitude: userDestination.latitude,
                        destinationLongitude: userDestination.longitude
                    }
                });

                if (deliveryResponse.status === 200) {
                    // Add this successful delivery status to our array of statuses
                    setDeliveryStatuses(prev => [...prev, {
                        orderId: order.orderId,
                        restaurantId: order.restaurantId,
                        success: true,
                        message: 'Delivery request created successfully'
                    }]);
                }
            }
        } catch (error) {
            console.error('Error creating delivery for order ID:', order.orderId, error);
            // Add this failed delivery status to our array of statuses
            setDeliveryStatuses(prev => [...prev, {
                orderId: order.orderId,
                restaurantId: order.restaurantId,
                success: false,
                message: 'Failed to create delivery request'
            }]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SubNav />
            <NavigationBar />
            <div className="max-w-2xl mx-auto mt-10 p-6">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for your order. Your order has been successfully placed and is being processed.
                    </p>
                    {orderDetails.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <h2 className="text-xl font-semibold mb-3">Order Details</h2>

                            {/* Display all orders */}
                            {orderDetails.map((order, index) => (
                                <div key={index} className={index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}>
                                    <p className="text-gray-700">Order ID: #{order.orderId}</p>
                                    <p className="text-gray-700">Restaurant ID: {order.restaurantId}</p>
                                    <p className="text-gray-700">Total Amount: ${(order.totalAmount).toFixed(2)}</p>
                                </div>
                            ))}

                            {/* Delivery Statuses Information */}
                            <div className="mt-6">
                                <h3 className="font-medium text-gray-700">Delivery Status:</h3>
                                {isCreatingDelivery ? (
                                    <p className="text-blue-500">Creating delivery requests...</p>
                                ) : deliveryStatuses.length > 0 ? (
                                    <div className="space-y-2 mt-2">
                                        {/* Ensure we only show one status per order */}
                                        {orderDetails.map((order) => {
                                            // Find the status for this order
                                            const status = deliveryStatuses.find(s => s.orderId === order.orderId);

                                            if (!status) return null;

                                            return (
                                                <div key={order.orderId} className="border-t pt-2 first:border-t-0 first:pt-0">
                                                    <p className="text-sm font-medium">Order #{status.orderId}:</p>
                                                    <p className={status.success ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                                                        {status.message}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Processing...</p>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/track')}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Track Order
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderConfirmation;