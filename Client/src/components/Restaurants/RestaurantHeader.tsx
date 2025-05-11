import React from 'react';
import { motion } from 'framer-motion';
import {SectionWrapper} from "../../hoc";

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
    updatedAt: string;
    createdAt: string;
    categories?: string[];
}

interface Props {
    restaurant: Restaurant;
}

const WrapperRestaurantHeader: React.FC<Props> = ({ restaurant }) => {
    const isOpen = () => {
        // Simple mock function to check if restaurant is open
        // In a real app, you would compare current time with opening/closing times
        return restaurant.availability && restaurant.orderAvailability;
    };

    return (
        <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="relative h-96">
                <motion.img
                    src={restaurant.coverImageUrl || "/api/placeholder/1200/400"}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <motion.div
                        className="p-8 text-white w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">{restaurant.restaurantName}</h1>
                                <div className="flex flex-wrap items-center mt-3 gap-4">
                                    <motion.span
                                        className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <span className="mr-1">★</span> {restaurant.rating.toFixed(1)}
                                    </motion.span>
                                    <span className="text-sm md:text-base flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                                        {restaurant.restaurantAddress}
                  </span>
                                </div>
                                <div className="mt-3 text-sm md:text-base flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                                    <motion.span
                                        className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${
                                            isOpen() ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                        }`}
                                        animate={{
                                            scale: isOpen() ? [1, 1.1, 1] : 1
                                        }}
                                        transition={{
                                            repeat: isOpen() ? Infinity : 0,
                                            repeatType: "reverse",
                                            duration: 2
                                        }}
                                    >
                                        {isOpen() ? 'OPEN NOW' : 'CLOSED'}
                                    </motion.span>
                                </div>
                                {restaurant.description && (
                                    <motion.p
                                        className="mt-4 text-gray-200 max-w-2xl text-sm md:text-base line-clamp-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                    >
                                        {restaurant.description}
                                    </motion.p>
                                )}
                            </div>

                            <motion.div
                                className="hidden md:block"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                            >
                                {restaurant.restaurantType && (
                                    <span className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium">
                    {restaurant.restaurantType}
                  </span>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const RestaurantHeader = SectionWrapper(WrapperRestaurantHeader)
export default RestaurantHeader;