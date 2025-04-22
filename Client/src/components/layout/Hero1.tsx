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
    const defaultImage = "src/assets/mac.png";

    return (
        <div className="flex flex-col w-[220px] ml-[-30px] mr-[40px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all ease-in-out transform hover:-translate-y-2 duration-300  bg-white ">

        <div className="h-48 flex items-center justify-center bg-gray-100">
                <img
                    src={restaurant.url || defaultImage}
                    alt={restaurant.restaurantName}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="p-4 text-center bg-amber-500 text-white font-semibold text-lg">
                {restaurant.restaurantName}
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
                <h2 className="text-black font-black md:text-[30px] sm:text-[50px] xs:text-[40px] text-[18px] pt-10 ">
                    Popular Restaurants
                </h2>
            </motion.div>

            <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 py-10 ">
                {loading ? (
                    <div className="text-center py-10">Loading trending restaurants...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-23 ">
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