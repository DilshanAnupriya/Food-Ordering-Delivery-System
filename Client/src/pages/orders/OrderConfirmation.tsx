import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/layout/Navbar';
import SubNav from '../../components/layout/SubNav';
import Footer from '../../components/layout/Footer';

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails') || '[]');
    const latestOrder = orderDetails[orderDetails.length - 1];

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
                    {latestOrder && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <h2 className="text-xl font-semibold mb-3">Order Details</h2>
                            <p className="text-gray-700">Order ID: #{latestOrder.orderId}</p>
                            <p className="text-gray-700">Total Amount: ${(latestOrder.totalAmount).toFixed(2)}</p>
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