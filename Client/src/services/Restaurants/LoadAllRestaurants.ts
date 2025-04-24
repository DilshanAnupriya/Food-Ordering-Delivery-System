// services/restaurantService.ts
import axios from 'axios';

// Types
export interface Restaurant {
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
}

export interface RestaurantResponseData {
    dataCount: number;
    dataList: Restaurant[];
}

export interface StandardResponseDto {
    code: number;
    message: string;
    data: RestaurantResponseData;
}

const API_BASE_URL = 'http://localhost:8082/api/v1';

export const fetchRestaurants = async (
    searchText: string,
    page: number,
    size: number = 10
): Promise<{ restaurants: Restaurant[]; totalItems: number }> => {
    try {
        const response = await axios.get<StandardResponseDto>(
            `${API_BASE_URL}/restaurants/list?searchText=${searchText}&page=${page}&size=${size}`
        );

        if (response.data.code === 200) {
            return {
                restaurants: response.data.data.dataList,
                totalItems: response.data.data.dataCount
            };
        } else {
            throw new Error('Failed to fetch restaurants');
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
    }
};