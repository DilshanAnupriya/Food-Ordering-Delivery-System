import React from 'react';

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
        return restaurant.availability && restaurant.orderAvailability;
    };

    return (
        <div className="h-130 w-full overflow-hidden relative">
            {/* Full screen background image */}
            <div className="absolute inset-0">
                <img
                    src={restaurant.coverImageUrl}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/50"></div>
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end px-17">
                <div className="p-8 text-white w-full">
                    <div className="flex justify-between items-end">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">{restaurant.restaurantName}</h1>

                            <div className="flex flex-wrap items-center mt-3 gap-4">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <span className="mr-1">★</span> {restaurant.rating.toFixed(1)}
                </span>

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
                                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${
                                    isOpen() ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                  {isOpen() ? 'OPEN NOW' : 'CLOSED'}
                </span>
                            </div>

                            {restaurant.description && (
                                <p className="mt-4 text-gray-200 max-w-2xl text-sm md:text-base">
                                    {restaurant.description}
                                </p>
                            )}
                        </div>


                    </div>



                    {/* Contact info */}
                    <div className="mt-8 mb-6 flex gap-4">
                        <a href={`tel:${restaurant.restaurantPhone}`} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                        </a>
                        <a href={`mailto:${restaurant.restaurantEmail}`} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                        </a>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-6 py-2 rounded-lg flex items-center text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WrapperRestaurantHeader;