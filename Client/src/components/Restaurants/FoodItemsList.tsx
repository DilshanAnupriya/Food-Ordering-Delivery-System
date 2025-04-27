import React, { useState, useEffect } from 'react';
import SectionWrapper from "../../hoc/SectionWrapper.tsx";
import { motion } from 'framer-motion'; // For animations
import axios from 'axios';

// Define FoodItem interface
interface FoodItem {
    foodItemId: string;
    name: string;
    type: string;
    category: string;
    price: number;
    discount: number;
    imageUrl: string;
    description: string;
    available: boolean;
    restaurantId: string;
    restaurantName: string;
    createdAt: string;
}

// Cart item interface for sending to API
interface CartItem {
    foodItemId: string;
    foodName: string;
    foodImage?: string;
    price: number;
    quantity: number;
}

interface FoodItemsListProps {
    selectedCategory: string | null;
    foodItemsByCategory: Record<string, FoodItem[]>;
    foodItemsTotalCount: Record<string, number>;
    loadingFoodItems: boolean;
    calculateFinalPrice: (price: number, discount: number) => string;
    searchText: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FoodItemsList: React.FC<FoodItemsListProps> = ({
                                                         selectedCategory,
                                                         foodItemsByCategory,
                                                         foodItemsTotalCount,
                                                         loadingFoodItems,
                                                         calculateFinalPrice,
                                                         searchText,
                                                         onSearchChange,
                                                     }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [addedItemId, setAddedItemId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Get user ID from local storage or other auth source
        const storedUserId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (storedUserId && token) {
            setUserId(storedUserId);
            // Fetch existing cart on component mount
            fetchUserCart(storedUserId);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUserCart = async (uid: string) => {
        setIsLoading(true);
        try {
            const response = await getCartByUserId(uid);
            if (response.data && response.data.cartItems) {
                setCartItems(response.data.cartItems);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            // If 404 or cart not found, that's ok - we'll create one when adding items
        } finally {
            setIsLoading(false);
        }
    };

    // Create axios instance with auth headers
    const getCartAxios = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Authentication token not found");
        }
        return axios.create({
            baseURL: 'http://localhost:8082',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    };

    const getCartByUserId = async (userId: string) => {
        try {
            const axiosInstance = getCartAxios();
            const response = await axiosInstance.get(`/api/v1/cart/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    };

    const addToCart = async (item: FoodItem) => {
        const currentUserId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!currentUserId || !token) {
            alert("Please log in to add items to cart");
            return;
        }

        try {
            const axiosInstance = getCartAxios();
            const cartItem: CartItem = {
                foodItemId: item.foodItemId,
                foodName: item.name,
                foodImage: item.imageUrl,
                price: item.discount > 0
                    ? parseFloat(calculateFinalPrice(item.price, item.discount))
                    : item.price,
                quantity: 1
            };

            // Show button animation
            setAddedItemId(item.foodItemId);
            setTimeout(() => {
                setAddedItemId(null);
            }, 1500);

            // Check if cart exists
            let hasExistingCart = false;
            try {
                const cartResponse = await axiosInstance.get(`/api/v1/cart/${currentUserId}`);
                hasExistingCart = !!(cartResponse.data && cartResponse.data.cartItems);
            } catch (err) {
                hasExistingCart = false;
            }

            if (hasExistingCart) {
                await axiosInstance.post(
                    `/api/v1/cart/${currentUserId}/items`,
                    [cartItem]
                );
            } else {
                await axiosInstance.post(
                    '/api/v1/cart',
                    {
                        userId: currentUserId,
                        cartItems: [cartItem]
                    }
                );
            }

            setCartItems(prev => [...prev, cartItem]);
            setUserId(currentUserId);

        } catch (error) {
            console.error('Error adding item to cart:', error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert('Your session has expired. Please log in again.');
            } else {
                alert('Failed to add item to cart');
            }
        }
    };



    if (!selectedCategory) return null;

    return (
        <div className='mb-10'>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{selectedCategory}</h2>
                {foodItemsTotalCount[selectedCategory] !== undefined && (
                    <span className="text-gray-500">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search food items..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchText}
                                onChange={onSearchChange}
                            />
                            <svg
                                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </span>
                )}
            </div>

            {/* Loading state for food items */}
            {(loadingFoodItems || isLoading) && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* No items found */}
            {!loadingFoodItems && !isLoading &&
                foodItemsByCategory[selectedCategory] &&
                foodItemsByCategory[selectedCategory].length === 0 && (
                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                        <p className="text-gray-500">No food items found in this category</p>
                    </div>
                )}

            {/* Food items grid */}
            {!loadingFoodItems && !isLoading &&
                foodItemsByCategory[selectedCategory] &&
                foodItemsByCategory[selectedCategory].length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {foodItemsByCategory[selectedCategory].map((item) => (
                            <div key={item.foodItemId} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="relative h-38">
                                    <img
                                        src={item.imageUrl || "/api/placeholder/400/300"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {item.discount > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                                            {item.discount}% OFF
                                        </div>
                                    )}
                                    {item.type === 'Veg' ? (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                            VEG
                                        </div>
                                    ) : (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                                            NON-VEG
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {item.discount > 0 ? (
                                                <div className="flex items-center">
                                                    <span className="text-lg font-bold">Rs.{calculateFinalPrice(item.price, item.discount)}</span>
                                                    <span className="ml-2 text-sm text-gray-500 line-through">Rs.{item.price.toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-lg font-bold">Rs.{item.price.toFixed(2)}</span>
                                            )}
                                        </div>

                                        {/* Add to Cart button with animation */}
                                        <motion.button
                                            className={`px-4 py-2 rounded-full text-sm ${
                                                item.available
                                                    ? 'bg-orange-400 text-white hover:bg-orange-700'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                            disabled={!item.available || isLoading}
                                            onClick={() => item.available && addToCart(item)}
                                            whileTap={{ scale: 0.9 }}
                                            animate={{
                                                scale: addedItemId === item.foodItemId ? [1, 1.2, 1] : 1,
                                                backgroundColor: addedItemId === item.foodItemId
                                                    ? ['#fb923c', '#22c55e', '#fb923c']
                                                    : '#fb923c'
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {isLoading && item.foodItemId === addedItemId ? 'Adding...' :
                                                addedItemId === item.foodItemId ? 'Added!' :
                                                    item.available ? 'Add to Cart' : 'Out of Stock'}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
};

const FoodItemsListWrapper = SectionWrapper(FoodItemsList);

export default FoodItemsListWrapper;