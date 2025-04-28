// FoodItemsList.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SectionWrapper from "../../hoc/SectionWrapper.tsx";

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
    restaurantId: string;
    restaurantName: string;
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
        const restaurantId = item.restaurantId;
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
                restaurantId: restaurantId,
                restaurantName: item.restaurantName,
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="mb-12">
            <motion.div
                className="flex justify-between items-center mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 relative">
                    {selectedCategory}
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "50%" }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    />
                </h2>
                {foodItemsTotalCount[selectedCategory] !== undefined && (
                    <div className="relative w-full md:w-64">
                        <motion.input
                            type="text"
                            placeholder="Search food items..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                            value={searchText}
                            onChange={onSearchChange}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        />
                        <svg
                            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
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
                )}
            </motion.div>

            {/* Loading state for food items */}
            {(loadingFoodItems || isLoading) && (
                <motion.div
                    className="flex justify-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
                        <p className="mt-4 text-gray-500">Loading delicious options...</p>
                    </div>
                </motion.div>
            )}

            {/* No items found */}
            {!loadingFoodItems && !isLoading &&
                foodItemsByCategory[selectedCategory] &&
                foodItemsByCategory[selectedCategory].length === 0 && (
                    <motion.div
                        className="bg-gray-50 p-10 rounded-xl text-center shadow-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <p className="text-gray-600 text-lg">No food items found in this category</p>
                        <p className="text-gray-500 mt-2">Try selecting another category or adjusting your search</p>
                    </motion.div>
                )}

            {/* Food items grid */}
            {!loadingFoodItems && !isLoading &&
                foodItemsByCategory[selectedCategory] &&
                foodItemsByCategory[selectedCategory].length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {foodItemsByCategory[selectedCategory].map((item) => (
                                <motion.div
                                    key={item.foodItemId}
                                    className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={item.imageUrl || "/api/placeholder/400/300"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {item.discount > 0 && (
                                            <motion.div
                                                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {item.discount}% OFF
                                            </motion.div>
                                        )}
                                        <motion.div
                                            className={`absolute top-3 left-3 ${
                                                item.type === 'Veg'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-600'
                                            } text-white px-3 py-1 rounded-full text-xs font-medium shadow-md`}
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {item.type === 'Veg' ? 'VEG' : 'NON-VEG'}
                                        </motion.div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                {item.discount > 0 ? (
                                                    <div className="flex items-center">
                                                        <span className="text-xl font-bold text-gray-900">Rs.{calculateFinalPrice(item.price, item.discount)}</span>
                                                        <span className="ml-2 text-sm text-gray-500 line-through">Rs.{item.price.toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-900">Rs.{item.price.toFixed(2)}</span>
                                                )}
                                            </div>

                                            <motion.button
                                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                                                    item.available
                                                        ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                                disabled={!item.available || isLoading}
                                                onClick={() => item.available && addToCart(item)}
                                                whileTap={{ scale: 0.9 }}
                                                animate={{
                                                    scale: addedItemId === item.foodItemId ? [1, 1.2, 1] : 1,
                                                    backgroundColor: addedItemId === item.foodItemId
                                                        ? ['#f97316', '#16a34a', '#f97316']
                                                        : undefined
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {isLoading && item.foodItemId === addedItemId ? 'Adding...' :
                                                    addedItemId === item.foodItemId ? (
                                                            <span className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Added!
                                                        </span>
                                                        ) :
                                                        item.available ? 'Add to Cart' : 'Out of Stock'}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
        </div>
    );
};

const FoodItemsListWrapper = SectionWrapper(FoodItemsList);

export default FoodItemsListWrapper;