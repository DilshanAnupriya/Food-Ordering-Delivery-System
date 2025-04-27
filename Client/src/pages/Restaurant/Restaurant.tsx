import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRestaurantData } from '../../services/Restaurants/LoadAllRestaurants';
import { fetchFoodItemsByCategory } from '../../services/Restaurants/Fooditems';
import Navbar from "../../components/layout/Navbar.tsx";
import RestaurantHeaderWrapper from "../../components/Restaurants/RestaurantHeader.tsx";
import CategoriesSearch from "../../components/Restaurants/CategorySearch.tsx";
import FoodItemsListWrapper from "../../components/Restaurants/FoodItemsList.tsx";
import SubNav from "../../components/layout/SubNav.tsx";
import Footer from "../../components/layout/Footer.tsx";
import WrapperPagination from '../../components/Restaurants/Pagination.tsx';
import { fetchFoodCategories } from '../../services/Restaurants/Fooditems.ts';

// Define TypeScript interfaces for the data
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

// Updated Restaurant interface to match API response
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

const Restaurant = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [foodItemsByCategory, setFoodItemsByCategory] = useState<Record<string, FoodItem[]>>({});
    const [foodItemsTotalCount, setFoodItemsTotalCount] = useState<Record<string, number>>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingFoodItems, setLoadingFoodItems] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    // Default categories to use if none come from API
    const defaultCategories = ['Italian', 'fast food', 'Desserts', 'Vegan','Beverages'];

// Pagination state
    const [page, setPage] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [size, setSize] = useState<number>(6); // Number of items per page

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        const loadRestaurantData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await fetchRestaurantData(id);
                const restaurantData = response.data;

                // Fetch categories from backend
                let categories: string[] = [];
                try {
                    categories = await fetchFoodCategories();
                } catch (catErr) {
                    console.warn("Falling back to default categories due to fetch failure.");
                    categories = defaultCategories;
                }

                const restaurantWithCategories = {
                    ...restaurantData,
                    categories
                };

                setRestaurant(restaurantWithCategories);

                // Set default selected category
                if (categories.length > 0) {
                    setSelectedCategory(categories[0]);
                }
            } catch (err) {
                setError('Failed to load restaurant data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadRestaurantData();
    }, [id]);

    useEffect(() => {
        // Reset page when category or search changes
        setPage(0);
    }, [selectedCategory, searchText]);


    useEffect(() => {
        // Fetch food items when a category is selected
        const loadFoodItems = async () => {
            if (!id || !selectedCategory) return;

            try {
                setLoadingFoodItems(true);
                console.log(`Loading food items for ${selectedCategory}`);

                // Initialize the category with an empty array before fetching
                setFoodItemsByCategory(prev => ({
                    ...prev,
                    [selectedCategory]: []
                }));



                const response = await fetchFoodItemsByCategory(
                    id,
                    selectedCategory,
                    searchText,
                    page,
                    size
                );
                console.log('Food items API response:', response);

                // Correctly access the data within the StandardResponse
                if (response.data) {
                    console.log('Food items data:', response.data);

                    setFoodItemsByCategory(prev => ({
                        ...prev,
                        [selectedCategory]: response.data.dataList || []
                    }));

                    setFoodItemsTotalCount(prev => ({
                        ...prev,
                        [selectedCategory]: response.data.dataCount || 0
                    }));

                    console.log('Updated food items state:', response.data.dataList);
                }
            } catch (err) {
                console.error('Failed to load food items:', err);
                // Initialize with empty array on error
                setFoodItemsByCategory(prev => ({
                    ...prev,
                    [selectedCategory]: []
                }));
                setFoodItemsTotalCount(prev => ({
                    ...prev,
                    [selectedCategory]: 0
                }));
            } finally {
                setLoadingFoodItems(false);
            }
        };

        loadFoodItems();
    }, [id, selectedCategory, searchText, page, size]);

    const handleCategoryChange = (category: string) => {
        console.log('Changing category to:', category);
        setSelectedCategory(category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    // Calculate final price after discount
    const calculateFinalPrice = (price: number, discount: number) => {
        return (price - (price * discount / 100)).toFixed(2);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Restaurant not found'}
                </div>
            </div>
        );
    }

    return (
        <div>
            <SubNav/>
            <Navbar/>

                <RestaurantHeaderWrapper restaurant={restaurant} />

                {/* Using the new CategorySearch component */}
                <CategoriesSearch
                    categories={restaurant.categories || []}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    searchText={searchText}
                />



                {/* Using the new FoodItemsList component */}
                <FoodItemsListWrapper
                    selectedCategory={selectedCategory}
                    foodItemsByCategory={foodItemsByCategory}
                    foodItemsTotalCount={foodItemsTotalCount}
                    loadingFoodItems={loadingFoodItems}
                    calculateFinalPrice={calculateFinalPrice}
                    searchText={searchText}
                    onSearchChange={handleSearchChange}

                />

                    <WrapperPagination
                        page={page}
                        size={size}
                        totalItems={foodItemsTotalCount[selectedCategory]}
                        onPageChange={handlePageChange}
                    />
            <Footer/>
        </div>
    );
};

export default Restaurant;