import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../services/Payment/payment";

const Checkout = ({ userId, orderId }: { userId: number; orderId: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);

  // Load your Stripe public key with error handling
  const stripePromise = (() => {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!key) {
      console.error('Stripe public key is not configured');
      return null;
    }
    return loadStripe(key);
  })();

  // Fetch the amount dynamically (e.g., from an API or context)
  useEffect(() => {
    // Simulate fetching the amount from an API
    const fetchAmount = async () => {
      try {
        // Replace with your API call to fetch the amount
        const response = await fetch(`/api/v1/orders/${orderId}`);
        const data = await response.json();
        setAmount(data.totalAmount); // Assuming the API returns `totalAmount`
      } catch (error) {
        console.error("Error fetching amount:", error);
      }
    };

    fetchAmount();
  }, [orderId]);

  const handleCheckout = async () => {
    if (!stripePromise) {
      setErrorMessage("Payment system is not properly configured. Please contact support.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const productRequest = {
      amount: amount * 100, // Convert to cents
      quantity: 1,
      name: "Order Payment",
      currency: "USD",
      userId,
      orderId,
    };

    try {
      const sessionData = await createCheckoutSession(productRequest);
      const stripe = await stripePromise;
      if (stripe) {
        const { sessionUrl } = sessionData;
        if (!sessionUrl) {
          throw new Error("Invalid session URL received");
        }
        window.location.href = sessionUrl; // Redirect to Stripe
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage("There was an error processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Checkout</h1>
        <div className="mb-8 flex flex-col items-center">
          <p className="text-gray-700 text-lg font-medium">
            You're about to pay <span className="font-bold">${amount.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
            isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isLoading ? "Processing..." : "Checkout with Stripe"}
        </button>
        {errorMessage && (
          <p className="mt-6 text-center text-red-500 bg-red-100 rounded-lg py-2 px-4">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkout;