// src/pages/CartPage.jsx
import { useState, useEffect } from 'react';
import { getCartByUserId, removeCartItem, updateCartItemQuantity, clearCart } from '../../services/Restaurants/Cart';
import { useAuth } from '../../services/auth/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubNav from "../../components/layout/SubNav.tsx";
import Navbar from "../../components/layout/Navbar.tsx";
import Footer from "../../components/layout/Footer.tsx";

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // Not using this anymore since we'll navigate to /cart directly

    const fetchCart = async () => {
        try {
            setLoading(true);
            // Get userId from the decoded JWT
            const userId = user?.userId;

            if (!userId) {
                console.error('User ID not found in token:', user);
                setError('User ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            const response = await getCartByUserId(userId);
            if (response.code === 200) {
                setCart(response.data);
            } else {
                setError('Failed to fetch cart');
            }
        } catch (err) {
            setError(`Error loading cart: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Store authentication status in sessionStorage to persist across reloads
        if (isAuthenticated && user) {
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('user', JSON.stringify(user));
            fetchCart();
        } else {
            // Check if we have stored authentication data
            const storedAuth = sessionStorage.getItem('isAuthenticated');
            const storedUser = sessionStorage.getItem('user');

            if (storedAuth === 'true' && storedUser) {
                // Use stored user data to fetch cart
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser?.userId) {
                    // Temporarily use stored user for this request
                    const tempUser = { ...user, userId: parsedUser.userId };
                    setLoading(true);
                    getCartByUserId(parsedUser.userId)
                        .then(response => {
                            if (response.code === 200) {
                                setCart(response.data);
                            } else {
                                setError('Failed to fetch cart');
                            }
                        })
                        .catch(err => {
                            setError(`Error loading cart: ${err.message || 'Unknown error'}`);
                            // If we get authentication errors, redirect to login
                            if (err.response?.status === 401) {
                                navigate('/login', { state: { from:`/cart/${user.id}` } });
                            }
                        })
                        .finally(() => setLoading(false));
                    return;
                }
            }

            // If we reach here, user is not authenticated and no valid stored data
            navigate('/login', { state: { from: `/cart/${user.id}` } });
        }
    }, [user, isAuthenticated, navigate]);

    const handleQuantityUpdate = async (foodId, currentQuantity, increase) => {
        const userId = user?.userId;
        if (!userId) return;

        try {
            // Optimistic UI update
            const newQuantity = increase ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);

            // Update local state first for responsive UI
            const updatedItems = cart.cartItems.map(item =>
                item.foodItemId === foodId ? {...item, quantity: newQuantity} : item
            );

            const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            setCart({
                ...cart,
                cartItems: updatedItems,
                totalPrice: newTotal
            });

            // Call API to update backend
            await updateCartItemQuantity(userId, foodId, 1, increase);
            toast.success(`Quantity ${increase ? 'increased' : 'decreased'}`);
        } catch (err) {
            setError(`Failed to update quantity: ${err.message || 'Unknown error'}`);
            toast.error("Failed to update quantity");
            // Revert optimistic update on failure
            fetchCart();
        }
    };

    const handleRemoveItem = async (foodId) => {
        const userId = user?.userId;
        if (!userId) return;

        try {
            // Optimistic UI update
            const removedItem = cart.cartItems.find(item => item.foodItemId === foodId);
            const updatedItems = cart.cartItems.filter(item => item.foodItemId !== foodId);
            const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            setCart({
                ...cart,
                cartItems: updatedItems,
                totalPrice: newTotal
            });

            // Call API to remove item
            await removeCartItem(userId, foodId);
            toast.success(`${removedItem?.foodName || 'Item'} removed from cart`);
        } catch (err) {
            setError(`Failed to remove item: ${err.message || 'Unknown error'}`);
            toast.error("Failed to remove item");
            // Refresh cart data on failure
            fetchCart();
        }
    };

    const handleClearCart = async () => {
        const userId = user?.userId;
        if (!userId) return;

        try {
            // No need for window.confirm, we'll use toast instead
            await clearCart(userId);
            setCart({
                ...cart,
                cartItems: [],
                totalPrice: 0
            });
            toast.success("Cart cleared successfully");
        } catch (err) {
            setError(`Failed to clear cart: ${err.message || 'Unknown error'}`);
            toast.error("Failed to clear cart");
            fetchCart();
        }
    };

    // Function to confirm clearing the cart with toast
    const confirmClearCart = () => {
        toast.info(
            <div>
                <p>Are you sure you want to clear your cart?</p>
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => handleClearCart()}
                        className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-300 px-3 py-1 rounded"
                    >
                        No
                    </button>
                </div>
            </div>,
            { autoClose: false, closeButton: false }
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    if (!cart || cart.cartItems?.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    // @ts-ignore
    return (
        <>
            <SubNav/>
            <Navbar/>
        <div className="container mx-auto p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Cart</h1>
                <button
                    onClick={confirmClearCart}
                    className="text-red-600 hover:text-red-800 font-medium"
                >
                    Clear Cart
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                        <div className="col-span-6">Item</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Subtotal</div>
                    </div>
                </div>

                {cart.cartItems.map((item) => (
                    <div key={item.foodItemId} className="p-6 border-b">
                        <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6 flex items-center">
                                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                                    {item.foodImage ? (
                                        <img
                                            src={item.foodImage}
                                            alt={item.foodName}
                                            className="h-full w-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{item.foodName}</h3>
                                    <button
                                        onClick={() => handleRemoveItem(item.foodItemId)}
                                        className="text-red-500 text-sm mt-1 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-2 text-center">${item.price.toFixed(2)}</div>

                            <div className="col-span-2">
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={() => handleQuantityUpdate(item.foodItemId, item.quantity, false)}
                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                        disabled={item.quantity <= 1}
                                    >
                                        <span className="text-gray-600">-</span>
                                    </button>
                                    <span className="mx-3">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityUpdate(item.foodItemId, item.quantity, true)}
                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                    >
                                        <span className="text-gray-600">+</span>
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-2 text-right font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="p-6">
                    <div className="flex justify-end">
                        <div className="w-64">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Subtotal</span>
                                <span>${cart.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Tax</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between py-2 mt-2">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-lg">${cart.totalPrice.toFixed(2)}</span>
                            </div>
                            <button
                                className="w-full mt-4 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-medium"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <Footer/>
        </>
    );
};

export default CartPage;