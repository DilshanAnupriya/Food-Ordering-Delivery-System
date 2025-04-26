import axios from 'axios';

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    password: string;
    fullName: string;
}

const API_URL = 'http://localhost:8082/api/v1';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authService = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await axios.post('http://localhost:8082/login', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Access-Control-Expose-Headers': 'Authorization'
                }
            });
            
            // Log full response for debugging
            console.log('Full response:', {
                status: response.status,
                headers: response.headers,
                data: response.data
            });

            // Try to get token from different possible locations
            let token = null;
            
            // 1. Check Authorization header
            const authHeader = response.headers['authorization'];
            if (authHeader) {
                token = authHeader.startsWith('Bearer ') ? 
                    authHeader.substring(7) : authHeader;
            }

            // 2. Check response body for token field
            if (!token && response.data) {
                if (typeof response.data === 'string' && response.data.length > 0) {
                    // Try parsing the response data if it's a string
                    try {
                        const parsedData = JSON.parse(response.data);
                        token = parsedData.token || parsedData.access_token || parsedData.jwt;
                    } catch (e) {
                        // If the string is the token itself
                        token = response.data;
                    }
                } else if (typeof response.data === 'object') {
                    // Check common token field names in response object
                    token = response.data.token || 
                           response.data.access_token || 
                           response.data.jwt;
                }
            }

            if (!token) {
                console.error('No token found in response:', response);
                throw new Error('Authentication failed: No token received from server');
            }

            localStorage.setItem('token', token);
            return response;
        } catch (error: any) {
            console.error('Login error:', error.response || error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'An error occurred during login'
            );
        }
    },

    async register(data: RegisterData) {
        const response = await axiosInstance.post(`${API_URL}/users/visitor/register`, data);
        return response.data;
    },

    async getUserProfile(token: string) {
        const response = await axiosInstance.get(`${API_URL}/users/load-user-data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
    }
};