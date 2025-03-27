package com.DeliveryOrder.DeliveryOrder.model;


import jakarta.persistence.*;
import lombok.*;

@Entity

public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    private String name;
    private String phone;
    private String vehicleType;
    private String vehicleNo;
    private String locationPoint;
    private boolean availability;

    public Driver(){

    }

    public Driver(String name, String phone, String vehicleType, String vehicleNo, String locationPoint, boolean availability) {
        this.name = name;
        this.phone = phone;
        this.vehicleType = vehicleType;
        this.vehicleNo = vehicleNo;
        this.locationPoint = locationPoint;
        this.availability = availability;

    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public String getLocationPoint() {
        return locationPoint;
    }

    public void setLocationPoint(String locationPoint) {
        this.locationPoint = locationPoint;
    }

    public boolean isAvailability() {
        return availability;
    }

    public void setAvailability(boolean availability) {
        this.availability = availability;
    }
}
