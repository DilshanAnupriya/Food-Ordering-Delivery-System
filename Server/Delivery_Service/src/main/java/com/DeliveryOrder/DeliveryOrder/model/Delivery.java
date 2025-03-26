package com.DeliveryOrder.DeliveryOrder.model;

import jakarta.persistence.*;
import lombok.*;

@Entity

public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderId;
    private String customerName;
    private String customerAddress;
    private String assignedDriver;
    private String status;

    public  Delivery(){

    }

    public Delivery(Long id, String orderId, String customerName, String customerAddress, String assignedDriver, String status) {
        this.id = id;
        this.orderId = orderId;
        this.customerName = customerName;
        this.customerAddress = customerAddress;
        this.assignedDriver = assignedDriver;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getAssignedDriver() {
        return assignedDriver;
    }

    public void setAssignedDriver(String assignedDriver) {
        this.assignedDriver = assignedDriver;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
