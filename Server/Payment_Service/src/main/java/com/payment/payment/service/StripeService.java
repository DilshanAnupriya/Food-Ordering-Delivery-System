package com.payment.payment.service;

import com.payment.payment.dto.ProductRequest; // Ensure the ProductRequest class exists under this package level
import com.payment.payment.dto.StripeResponse;
import com.payment.payment.entity.Payment;
import com.payment.payment.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class StripeService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${stripe.secretKey}")
    private String secretKey;

    public StripeResponse checkoutProducts(ProductRequest productRequest) {
        Stripe.apiKey = secretKey;

        try {
            // 1. Create product data
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(productRequest.getName())
                            .build();

            // 2. Create price data
            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency() : "USD")
                            .setUnitAmount(productRequest.getAmount()) // cents
                            .setProductData(productData)
                            .build();

            // 3. Create line item
            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(productRequest.getQuantity())
                            .setPriceData(priceData)
                            .build();

            // 4. Build checkout session params
            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl("http://localhost:8080/success")
                            .setCancelUrl("http://localhost:8080/cancel")
                            .addLineItem(lineItem)
                            .build();

            // 5. Create the Stripe session
            Session session = Session.create(params);

            // 6. Save payment record to database
            Payment payment = Payment.builder()
                    .user_id(productRequest.getUserId())
                    .order_id(productRequest.getOrderId())
                    .amount(productRequest.getAmount() / 100.0) // convert to dollars
                    .currency(productRequest.getCurrency())
                    .stripe_payment_id(session.getId())
                    .payment_status("PENDING")
                    .payment_method("Stripe")
                    .paid_at(null) // To be updated on success
                    .build();

            paymentRepository.save(payment);

            log.info("Stripe session created successfully. Session ID: {}", session.getId());

            return StripeResponse.builder()
                    .status("SUCCESS")
                    .message("Stripe session created")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();

        } catch (StripeException e) {
            log.error("Stripe session creation failed", e);

            return StripeResponse.builder()
                    .status("FAILED")
                    .message("Stripe session creation failed: " + e.getMessage())
                    .build();
        }
    }
}
