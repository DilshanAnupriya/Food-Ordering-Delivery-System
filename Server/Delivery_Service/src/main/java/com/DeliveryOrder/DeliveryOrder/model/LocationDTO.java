package com.DeliveryOrder.DeliveryOrder.model;


import lombok.Data;

@Data
public class LocationDTO {
    private String driverId;
    private double latitude;
    private double longitude;
}
