import React from 'react';
import SectionWrapper from "../../hoc/SectionWrapper.tsx";


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
    updatedAt: string;
    createdAt: string;
    // Using optional categories field
    categories?: string[];
}
interface Props {
    restaurant: Restaurant;
}
const RestaurantHeader: React.FC<Props> = ({ restaurant }) => {
    console.log(restaurant.imageUrl);
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="relative h-84">
                <img
                    src={restaurant.imageUrl}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover bg-cover"
                />
                <div className="absolute inset-0  bg-opacity-40 flex items-end">
                    <div className="p-6 text-white">
                        <h1 className="text-6xl font-bold">{restaurant.restaurantName}</h1>
                        <div className="flex items-center mt-2">
              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-semibold">
                ★ {restaurant.rating.toFixed(1)}
              </span>
                            <span className="ml-4 text-sm">{restaurant.restaurantAddress}</span>
                        </div>
                        <div className="mt-2 text-sm">
                            <span>Hours: {restaurant.openingTime} - {restaurant.closingTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const RestaurantHeaderWrapper = SectionWrapper(RestaurantHeader);

export default RestaurantHeaderWrapper;

