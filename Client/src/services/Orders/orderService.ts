import axios from 'axios';
import { Order, OrderStatus, PaginatedOrdersResponse } from '../../types/Order/order';


const API_BASE_URL = 'http://localhost:8082/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const orderService = {
  // Get paginated orders
  getOrders: async (page = 0, size = 10, sortBy = 'orderDate', direction = 'desc') => {
    try {
      const response = await api.get<PaginatedOrdersResponse>(
        '/orders', {
          params: {
            page,
            size,
            sortBy,
            direction
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get orders by user ID
  getOrdersByUserId: async (userId: number) => {
    try {
      const response = await api.get<Order[]>(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId: number) => {
    try {
      const response = await api.get<Order>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (order: Order) => {
    try {
      const response = await api.post<Order>('/orders', order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (orderId: number, order: Order) => {
    try {
      const response = await api.put<Order>(`/orders/${orderId}`, order);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: OrderStatus) => {
    try {
      const response = await api.patch<Order>(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      throw error;
    }
  },

  // Track order status
  trackOrderStatus: async (orderId: number) => {
    try {
      const response = await api.get<{ statusInfo: string }>(`/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      console.error(`Error tracking order ${orderId}:`, error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId: number) => {
    try {
      await api.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error(`Error deleting order ${orderId}:`, error);
      throw error;
    }
  },
};