package com.DeliveryOrder.DeliveryOrder.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deliveries")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String driverId;

    private double latitude;
    //for map

    private double longitude;

    private boolean isDelivered;
}
