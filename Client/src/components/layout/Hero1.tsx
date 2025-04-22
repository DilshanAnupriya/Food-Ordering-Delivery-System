import { useEffect, useState } from 'react';
import { textVariant } from "../../util/motion.ts";
import { motion } from 'framer-motion';
import axios from 'axios';

interface TrendingRestaurant {
    restaurantName: string;
    search_id: string;
    searchCount: number;
    url: string | null;
}

interface ApiResponse {
    code: number;
    message: string;
    data: {
        trendingRestaurants: TrendingRestaurant[];
    };
}

const RestaurantCard: React.FC<{ restaurant: TrendingRestaurant }> = ({ restaurant }) => {
    // Default image to use when url is null
    const defaultImage = "src/assets/default-restaurant.png";

    return (
        <div className="flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 flex items-center justify-center">
                <img
                    src={restaurant.url || defaultImage}
                    alt={restaurant.restaurantName}
                    className="max-h-full max-w-full object-contain"
                />
            </div>
            <div className="p-3 mt-[-20px] text-center bg-amber-500 text-white font-medium">
                <h2>{restaurant.restaurantName}</h2>
            </div>
        </div>
    );
};

const TrendingRestaurants = () => {
    const [trendingRestaurants, setTrendingRestaurants] = useState<TrendingRestaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrendingRestaurants = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>('http://localhost:8082/api/v1/restaurants/trending-list');
                console.log(response.data.data.trendingRestaurants)
                setTrendingRestaurants(response.data.data.trendingRestaurants);
                setError(null);
            } catch (err) {
                console.error('Error fetching trending restaurants:', err);
                setError('Failed to load trending restaurants');
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingRestaurants();
    }, []);

    return (
        <>
            <motion.div variants={textVariant(0.3)}>
                <h2 className="text-black font-black md:text-[30px] sm:text-[50px] xs:text-[40px] text-[18px] pt-10 pl-2">
                    Popular Restaurants
                </h2>
            </motion.div>

            <div className="pt-8 max-w-6xl mx-auto">
                {loading ? (
                    <div className="text-center py-10">Loading trending restaurants...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {trendingRestaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.search_id} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default TrendingRestaurants;