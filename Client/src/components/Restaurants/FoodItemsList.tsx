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
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userId, setUserId] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @ts-ignore
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [addedItemId, setAddedItemId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

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

    // More dramatic entrance animation for food items
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 22,
                mass: 1.2
            }
        }
    };

    // Enhanced skeleton loading animation variants
    const skeletonVariants = {
        initial: {
            opacity: 0.6,
        },
        animate: {
            opacity: [0.6, 0.9, 0.6],
            scale: [0.98, 1, 0.98],
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="mb-20">
            <motion.div
                className="flex justify-between items-center mb-8 pt-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 relative">
                    {selectedCategory}
                    <motion.div
                        className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-orange-500 to-red-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    />
                </h2>
                {foodItemsTotalCount[selectedCategory] !== undefined && (
                    <div className="relative w-full md:w-64">
                        <motion.input
                            type="text"
                            placeholder="Search food items..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm bg-white"
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

            {/* Enhanced loading skeleton for food items */}
            {(loadingFoodItems || isLoading) && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <motion.div
                            key={`skeleton-${index}`}
                            className="bg-white rounded-2xl shadow-md overflow-hidden h-96"
                            variants={skeletonVariants}
                            initial="initial"
                            animate="animate"
                            custom={index}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Image skeleton with shimmer effect */}
                            <div className="relative h-56 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        ease: "linear",
                                        delay: index * 0.2
                                    }}
                                />
                            </div>

                            <div className="p-6">
                                {/* Title skeleton */}
                                <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-3/4 mb-4 overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            ease: "linear",
                                            delay: index * 0.2 + 0.1
                                        }}
                                    />
                                </div>

                                {/* Description lines */}
                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-full mb-2 overflow-hidden" />
                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-2/3 mb-6 overflow-hidden" />

                                {/* Price and button area */}
                                <div className="flex justify-between items-center">
                                    <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-20 overflow-hidden" />
                                    <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-10 overflow-hidden" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* No items found */}
            {!loadingFoodItems && !isLoading &&
                foodItemsByCategory[selectedCategory] &&
                foodItemsByCategory[selectedCategory].length === 0 && (
                    <motion.div
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl text-center shadow-sm border border-gray-100"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </motion.div>
                        <p className="text-gray-700 text-lg font-medium">No food items found in this category</p>
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
                                    className="bg-white rounded-2xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-xl"
                                    variants={itemVariants}
                                    layout
                                    onMouseEnter={() => setHoveredItemId(item.foodItemId)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                    whileHover={{
                                        y: -12,
                                        scale: 1.03,
                                        transition: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15
                                        }
                                    }}
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <motion.img
                                            src={item.imageUrl || "/api/placeholder/400/300"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            initial={{ scale: 1, filter: "brightness(1)" }}
                                            whileHover={{
                                                scale: 1.1,
                                                filter: "brightness(1.05) contrast(1.05)",
                                                transition: {
                                                    duration: 0.7,
                                                    ease: [0.19, 1, 0.22, 1] // Cubic bezier for smooth movement
                                                }
                                            }}
                                        />

                                        {/* Food type badge (Veg/Non-Veg) */}
                                        <motion.div
                                            className={`absolute top-4 left-4 ${
                                                item.type === 'Veg'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-600'
                                            } text-white px-3 py-1 rounded-full text-xs font-medium shadow-md z-10`}
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {item.type === 'Veg' ? 'VEG' : 'NON-VEG'}
                                        </motion.div>

                                        {/* Discount tag */}
                                        {item.discount > 0 && (
                                            <motion.div
                                                className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md z-10"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {item.discount}% OFF
                                            </motion.div>
                                        )}

                                        {/* Enhanced dark overlay with larger add to cart icon on hover */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent flex items-center justify-center cursor-pointer z-20"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: hoveredItemId === item.foodItemId ? 1 : 0
                                            }}
                                            transition={{ duration: 0.4 }}
                                            onClick={() => item.available && addToCart(item)}
                                        >
                                            {item.available ? (
                                                <motion.div
                                                    className="bg-white rounded-full p-4 shadow-xl flex items-center justify-center"
                                                    initial={{ scale: 0.4, opacity: 0, y: 10 }}
                                                    animate={{
                                                        scale: hoveredItemId === item.foodItemId ? 1 : 0.4,
                                                        opacity: hoveredItemId === item.foodItemId ? 1 : 0,
                                                        y: hoveredItemId === item.foodItemId ? 0 : 10,
                                                        rotate: addedItemId === item.foodItemId ? [0, 360] : 0
                                                    }}
                                                    whileHover={{
                                                        scale: 1.1,
                                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    transition={{
                                                        duration: 0.4,
                                                        type: "spring",
                                                        stiffness: 400
                                                    }}
                                                >
                                                    {addedItemId === item.foodItemId ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                        </svg>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    className="bg-white bg-opacity-80 rounded-full p-4 text-gray-500 flex items-center justify-center"
                                                    initial={{ scale: 0.4, opacity: 0, y: 10 }}
                                                    animate={{
                                                        scale: hoveredItemId === item.foodItemId ? 1 : 0.4,
                                                        opacity: hoveredItemId === item.foodItemId ? 1 : 0,
                                                        y: hoveredItemId === item.foodItemId ? 0 : 10
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        type: "spring",
                                                        stiffness: 400
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </div>

                                    <div className="p-6">
                                        <motion.h3
                                            className="text-xl font-bold mb-2 text-gray-800"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            whileHover={{
                                                color: "#f97316",
                                                x: 2,
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            {item.name}
                                        </motion.h3>

                                        <motion.p
                                            className="text-gray-600 text-sm mb-4 line-clamp-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {item.description}
                                        </motion.p>

                                        <motion.div
                                            className="flex justify-between items-center"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            whileHover={{
                                                scale: hoveredItemId === item.foodItemId ? 1.05 : 1,
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            <div>
                                                {item.discount > 0 ? (
                                                    <div className="flex items-center">
                                                        <span className="text-xl font-bold text-gray-900">${calculateFinalPrice(item.price, item.discount)}</span>
                                                        <span className="ml-2 text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                                                )}
                                            </div>

                                            {!item.available && (
                                                <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </motion.div>
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