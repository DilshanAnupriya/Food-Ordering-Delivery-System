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
    <div>
      <h1>Checkout</h1>
      <button onClick={handleCheckout} disabled={isLoading}>
        {isLoading ? "Processing..." : "Checkout with Stripe"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Checkout;
