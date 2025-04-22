package com.payment.payment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user_id;
    private Long order_id;

    private Double amount;
    private String currency;

    private String stripe_payment_id;
    private String payment_status;
    private String payment_method;

    private LocalDateTime paid_at;
}
