import axios from "axios";

// Define ProductRequest interface
interface ProductRequest {
  amount: number;
  quantity: number;
  name: string;
  currency: string;
  userId: number;
  orderId: number;
}

// Function to create a checkout session
export const createCheckoutSession = async (productRequest: ProductRequest) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/product/v1/checkout", // Your backend API endpoint
      productRequest
    );
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
