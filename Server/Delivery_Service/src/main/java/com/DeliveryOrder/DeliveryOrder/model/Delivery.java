package com.DeliveryOrder.DeliveryOrder.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity

public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliveryId;
    private String orderId;
    private String status;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private String trackingLink;

    @ManyToOne
    @JoinColumn(name = "driver_id")

    private Driver assignedDriver;

    public  Delivery(){

    }

    public Delivery(Long deliveryId, String orderId, String status, String estimatedDeliveryTime, String actualDeliveryTime, String trackingLink,Driver assignedDriver) {
        this.deliveryId = deliveryId;
        this.orderId = orderId;
        this.status = status;
        this.estimatedDeliveryTime = LocalDateTime.parse(estimatedDeliveryTime);
        this.actualDeliveryTime = LocalDateTime.parse(actualDeliveryTime);
        this.trackingLink = trackingLink;
        this.assignedDriver = assignedDriver;

    }

    public Long getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(Long deliveryId) {
        this.deliveryId = deliveryId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getEstimatedDeliveryTime() {
        return estimatedDeliveryTime;
    }

    public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) {
        this.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    public LocalDateTime getActualDeliveryTime() {
        return actualDeliveryTime;
    }

    public void setActualDeliveryTime(LocalDateTime actualDeliveryTime) {
        this.actualDeliveryTime = actualDeliveryTime;
    }

    public String getTrackingLink() {
        return trackingLink;
    }

    public void setTrackingLink(String trackingLink) {
        this.trackingLink = trackingLink;
    }

    public Driver getAssignedDriver() {
        return assignedDriver;
    }

    public void setAssignedDriver(Driver assignedDriver) {
        this.assignedDriver = assignedDriver;
    }
}
