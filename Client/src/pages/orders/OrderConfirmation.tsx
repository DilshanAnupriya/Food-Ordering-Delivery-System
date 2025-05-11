import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../../components/layout/Navbar';
import SubNav from '../../components/layout/SubNav';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../services/auth/authContext';
import { fetchRestaurantData } from '../../services/Restaurants/LoadAllRestaurants';
import { orderService } from '../../services/Orders/orderService';

interface OrderDetails {
    orderId: string;
    totalAmount: number;
    restaurantId: string;
}

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingDelivery, setIsCreatingDelivery] = useState(false);
    const [deliveryStatuses, setDeliveryStatuses] = useState<any[]>([]);
    const { user } = useAuth();

    const getOrderDetails = (): OrderDetails[] => {
        try {
            return JSON.parse(sessionStorage.getItem('orderDetails') || '[]');
        } catch (err) {
            console.error('Error parsing order details:', err);
            return [];
        }
    };

    const orderDetails = getOrderDetails();
    const latestOrder = orderDetails[orderDetails.length - 1];

    const sendConfirmationEmail = async () => {
        if (!latestOrder || !user?.sub) {
            setError('Missing order or user information');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/orders/confirm?email=${encodeURIComponent(user.sub)}&orderId=${encodeURIComponent(latestOrder.orderId)}&totalAmount=${encodeURIComponent(latestOrder.totalAmount.toFixed(2))}`,
                null,
                { headers: { 'Accept': 'application/json' } }
            );

            if (response.status === 200) {
                setIsEmailSent(true);
                setError(null);
                console.log('Confirmation email sent');
            }
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Unexpected error occurred';
            setError(`Email error: ${message}`);
        }
    };

    const createDeliveryForOrder = async (order: OrderDetails) => {
        try {
            const restaurantInfo = await fetchRestaurantData(order.restaurantId);
            const userDestination = await orderService.getOrderById(order.orderId);

            if (restaurantInfo && userDestination) {
                const response = await axios.post('http://localhost:8082/api/v1/delivery/create', null, {
                    params: {
                        orderId: order.orderId,
                        shopLatitude: restaurantInfo.data.latitude,
                        shopLongitude: restaurantInfo.data.longitude,
                        destinationLatitude: userDestination.latitude,
                        destinationLongitude: userDestination.longitude
                    }
                });

                if (response.status === 200) {
                    setDeliveryStatuses(prev => [...prev, { orderId: order.orderId, success: true, message: 'Delivery created' }]);
                }
            }
        } catch (error) {
            console.error('Delivery error:', error);
            setDeliveryStatuses(prev => [...prev, { orderId: order.orderId, success: false, message: 'Delivery failed' }]);
        }
    };

    useEffect(() => {
        if (latestOrder && user?.sub && !isEmailSent) {
            sendConfirmationEmail();
        }

        if (orderDetails.length > 0 && deliveryStatuses.length === 0) {
            setIsCreatingDelivery(true);
            const processDeliveries = async () => {
                for (const order of orderDetails) {
                    await createDeliveryForOrder(order);
                }
                setIsCreatingDelivery(false);
            };
            processDeliveries();
        }
    }, [latestOrder, isEmailSent, user]);

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
                        Thank you for your order. It’s being processed.
                        {isEmailSent && ' A confirmation email has been sent.'}
                    </p>
                    {error && <p className="text-red-500 mb-6">{error}</p>}

                    {orderDetails.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <h2 className="text-xl font-semibold mb-3">Order Details</h2>
                            {orderDetails.map((order, index) => (
                                <div key={index} className={index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}>
                                    <p className="text-gray-700">Order ID: #{order.orderId}</p>
                                    <p className="text-gray-700">Restaurant ID: {order.restaurantId}</p>
                                    <p className="text-gray-700">Total: ${order.totalAmount.toFixed(2)}</p>
                                </div>
                            ))}
                            <div className="mt-6">
                                <h3 className="font-medium text-gray-700">Delivery Status:</h3>
                                {isCreatingDelivery ? (
                                    <p className="text-blue-500">Creating delivery requests...</p>
                                ) : (
                                    deliveryStatuses.map(status => (
                                        <div key={status.orderId} className="mt-2">
                                            <p className="text-sm font-medium">Order #{status.orderId}:</p>
                                            <p className={status.success ? "text-green-500" : "text-red-500"}>{status.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/track')} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                            Track Order
                        </button>
                        <button onClick={() => navigate('/')} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">
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
