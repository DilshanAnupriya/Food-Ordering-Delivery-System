import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../services/Payment/payment"; // Adjust the import path as necessary

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load your Stripe public key (Replace with your actual key)
  const stripePromise = loadStripe("pk_test_51RDK3f05Jvg5zM6NtWwccOGgYNKOZNvDn3KRtP7ESmO0nzE9xTZSegnjI7HdkT2D14qCKnfKf93MSrZu5mhc9RU000SRF52DTx");

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Example product request
    const productRequest = {
      amount: 5000, // amount in cents
      quantity: 2,
      name: "Sample Product",
      currency: "USD",
      userId: 1,
      orderId: 12345,
    };

    try {
      const sessionData = await createCheckoutSession(productRequest);
      const stripe = await stripePromise;
      if (stripe) {
        // Redirect to Stripe checkout page
        const { sessionUrl } = sessionData;
        window.location.href = sessionUrl; // Redirect to Stripe
      }
    } catch (error) {
      setErrorMessage("There was an error processing your payment.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Checkout</h1>
        <div className="mb-8 flex flex-col items-center">
          <img src="/assets/Full Shopping Basket.png" alt="Checkout" className="w-24 h-24 mb-4" />
          <p className="text-gray-700 text-lg font-medium">You're almost there! Complete your order below.</p>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Checkout with Stripe'
          )}
        </button>
        {errorMessage && (
          <p className="mt-6 text-center text-red-500 bg-red-100 rounded-lg py-2 px-4">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
