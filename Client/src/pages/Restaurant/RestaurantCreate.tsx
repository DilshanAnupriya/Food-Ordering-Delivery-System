import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Types
interface RestaurantRequestDto {
    restaurantName: string;
    restaurantAddress: string;
    restaurantPhone: string;
    restaurantEmail: string;
    restaurantType: string;
    city: string;
    latitude: number;
    longitude: number;
    availability: boolean;
    orderAvailability: boolean;
    rating: number;
    openingTime: string;
    closingTime: string;
    description: string;
    imageUrl: string;
    active: boolean;
}

interface StandardResponseDto {
    code: number;
    message: string;
    data: never;
}

const CreateRestaurantPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<RestaurantRequestDto>({
        restaurantName: '',
        restaurantAddress: '',
        restaurantPhone: '',
        restaurantEmail: '',
        restaurantType: '',
        city: '',
        latitude: 0,
        longitude: 0,
        availability: true,
        orderAvailability: true,
        rating: 0,
        openingTime: '',
        closingTime: '',
        description: '',
        imageUrl: '',
        active: true
    });

    const restaurantTypes = [
        'Italian',
        'Chinese',
        'Indian',
        'Mexican',
        'American',
        'Japanese',
        'French',
        'Mediterranean',
        'Thai',
        'Greek',
        'Spanish',
        'Korean',
        'Vietnamese',
        'Turkish',
        'Lebanese'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: parseFloat(value) });
    };

    const resetForm = () => {
        setFormData({
            restaurantName: '',
            restaurantAddress: '',
            restaurantPhone: '',
            restaurantEmail: '',
            restaurantType: '',
            city: '',
            latitude: 0,
            longitude: 0,
            availability: true,
            orderAvailability: true,
            rating: 0,
            openingTime: '',
            closingTime: '',
            description: '',
            imageUrl: '',
            active: true
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post<StandardResponseDto>(
                'http://localhost:8082/api/v1/restaurants',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                toast.success('Restaurant created successfully!');
                resetForm();
            }
        } catch (error) {
            console.error('Error creating restaurant:', error);
            toast.error('Failed to create restaurant. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">Create New Restaurant</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Fill in the details below to create a new restaurant in the system.
                        </p>
                    </div>

                    <div className="border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                {/* Restaurant Name */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                                        Restaurant Name<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="restaurantName"
                                            id="restaurantName"
                                            required
                                            value={formData.restaurantName}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Restaurant Type */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="restaurantType" className="block text-sm font-medium text-gray-700">
                                        Restaurant Type<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="restaurantType"
                                            name="restaurantType"
                                            value={formData.restaurantType}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            {restaurantTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Restaurant Address */}
                                <div className="sm:col-span-6">
                                    <label htmlFor="restaurantAddress" className="block text-sm font-medium text-gray-700">
                                        Address<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="restaurantAddress"
                                            id="restaurantAddress"
                                            required
                                            value={formData.restaurantAddress}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* City */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="restaurantPhone" className="block text-sm font-medium text-gray-700">
                                        Phone Number<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            name="restaurantPhone"
                                            id="restaurantPhone"
                                            required
                                            value={formData.restaurantPhone}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="restaurantEmail" className="block text-sm font-medium text-gray-700">
                                        Email<span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="restaurantEmail"
                                            id="restaurantEmail"
                                            required
                                            value={formData.restaurantEmail}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                        Rating (1-5)
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="rating"
                                            id="rating"
                                            min="1"
                                            max="5"
                                            step="0.1"
                                            value={formData.rating}
                                            onChange={handleNumberChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Opening Hours */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700">
                                        Opening Time
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="time"
                                            name="openingTime"
                                            id="openingTime"
                                            value={formData.openingTime}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Closing Hours */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700">
                                        Closing Time
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="time"
                                            name="closingTime"
                                            id="closingTime"
                                            value={formData.closingTime}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Latitude */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                                        Latitude
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="latitude"
                                            id="latitude"
                                            step="0.000001"
                                            value={formData.latitude}
                                            onChange={handleNumberChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Longitude */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                                        Longitude
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="longitude"
                                            id="longitude"
                                            step="0.000001"
                                            value={formData.longitude}
                                            onChange={handleNumberChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="sm:col-span-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <div className="mt-1">
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div className="sm:col-span-6">
                                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                        Image URL
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="url"
                                            name="imageUrl"
                                            id="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Checkboxes for availability */}
                                <div className="sm:col-span-3">
                                    <div className="flex items-center">
                                        <input
                                            id="availability"
                                            name="availability"
                                            type="checkbox"
                                            checked={formData.availability}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                                            Restaurant Available
                                        </label>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <div className="flex items-center">
                                        <input
                                            id="orderAvailability"
                                            name="orderAvailability"
                                            type="checkbox"
                                            checked={formData.orderAvailability}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="orderAvailability" className="ml-2 block text-sm text-gray-700">
                                            Order Available
                                        </label>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <div className="flex items-center">
                                        <input
                                            id="active"
                                            name="active"
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                            Active
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Image */}
                            {formData.imageUrl && (
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                                    <div className="h-48 w-full overflow-hidden rounded-md bg-gray-100">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Restaurant preview"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                                                (e.target as HTMLImageElement).alt = 'Failed to load image';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating...' : 'Create Restaurant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRestaurantPage;