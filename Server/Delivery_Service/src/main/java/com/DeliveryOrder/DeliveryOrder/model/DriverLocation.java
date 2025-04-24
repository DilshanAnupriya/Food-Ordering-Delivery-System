package com.DeliveryOrder.DeliveryOrder.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "driver_locations")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverLocation {

    @Id
    @Column(name = "driver_id", nullable = false)
    private String driverId;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false)
    private boolean isAvailable;
}