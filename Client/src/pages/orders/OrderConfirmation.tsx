import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../../components/layout/Navbar';
import SubNav from '../../components/layout/SubNav';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../services/auth/authContext';

interface OrderDetails {
    orderId: string;
    totalAmount: number;
}

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    
    const getOrderDetails = (): OrderDetails | null => {
        try {
            const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails') || '[]');
            return orderDetails[orderDetails.length - 1] || null;
        } catch (err) {
            console.error('Error parsing order details:', err);
            return null;
        }
    };

    const latestOrder = getOrderDetails();

    const sendConfirmationEmail = async () => {
        if (!latestOrder) {
            setError('No order details available');
            return;
        }

        if (!user?.sub) {
            setError('No email address available');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/orders/confirm?email=${encodeURIComponent(user.sub)}&orderId=${encodeURIComponent(latestOrder.orderId)}&totalAmount=${encodeURIComponent(latestOrder.totalAmount.toFixed(2))}`,
                null,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setIsEmailSent(true);
                setError(null);
                console.log('Confirmation email sent successfully');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                setError(`Failed to send confirmation email: ${errorMessage}`);
                console.error('Error details:', {
                    status: error.response?.status,
                    message: errorMessage,
                    data: error.response?.data
                });
            } else {
                setError('An unexpected error occurred');
                console.error('Unexpected error:', error);
            }
        }
    };

    useEffect(() => {
        if (latestOrder && !isEmailSent && user?.sub) {
            sendConfirmationEmail();
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
                        Thank you for your order. Your order has been successfully placed and is being processed.
                        {isEmailSent && ' A confirmation email has been sent to your email address.'}
                    </p>
                    {error && (
                        <p className="text-red-500 mb-6">{error}</p>
                    )}
                    {latestOrder && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <h2 className="text-xl font-semibold mb-3">Order Details</h2>
                            <p className="text-gray-700">Order ID: #{latestOrder.orderId}</p>
                            <p className="text-gray-700">Total Amount: ${(latestOrder.totalAmount).toFixed(2)}</p>
                            <p className="text-gray-700">Email: {user?.sub}</p>
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