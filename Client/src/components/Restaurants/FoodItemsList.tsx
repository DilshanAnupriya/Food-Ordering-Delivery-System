import React from 'react';
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
            {loadingFoodItems && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* No items found */}
            {!loadingFoodItems &&
                foodItemsByCategory[selectedCategory] &&
                foodItemsByCategory[selectedCategory].length === 0 && (
                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                        <p className="text-gray-500">No food items found in this category</p>
                    </div>
                )}

            {/* Food items grid */}
            {!loadingFoodItems && foodItemsByCategory[selectedCategory] && foodItemsByCategory[selectedCategory].length > 0 && (
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
                                    <button
                                        className={`px-4 py-2 rounded-full text-sm ${
                                            item.available
                                                ? 'bg-orange-400 text-white hover:bg-orange-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={!item.available}
                                    >
                                        {item.available ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
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

