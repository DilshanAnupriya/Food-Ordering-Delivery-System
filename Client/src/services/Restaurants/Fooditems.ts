import { API_BASE_URL, StandardResponse } from '../Common/Common';

export interface FoodItem {
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

export interface FoodItemsResponse {
    dataCount: number;
    dataList: FoodItem[];
}

export const fetchFoodItemsByCategory = async (
    restaurantId: string,
    category: string,
    searchText: string = '',
    page: number = 0,
    size: number = 10
): Promise<StandardResponse<FoodItemsResponse>> => {
    try {
        const url = new URL(`${API_BASE_URL}/foods/${restaurantId}/${category}`);

        // Add query parameters
        url.searchParams.append('searchText', searchText);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('size', size.toString());

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching food items:', error);
        throw error;
    }
};
export const fetchFoodCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/foods/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result.data; // assuming the response has a "data" array
    } catch (error) {
        console.error('Error fetching food categories:', error);
        throw error;
    }
};
