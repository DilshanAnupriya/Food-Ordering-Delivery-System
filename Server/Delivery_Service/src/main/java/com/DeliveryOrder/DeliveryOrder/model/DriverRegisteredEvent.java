package com.DeliveryOrder.DeliveryOrder.model;

import lombok.Data;

@Data
public class DriverRegisteredEvent {
    private String driverId;
    private String name;
    private String email;
}