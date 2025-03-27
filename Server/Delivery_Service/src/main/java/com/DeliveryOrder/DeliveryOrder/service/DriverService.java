package com.DeliveryOrder.DeliveryOrder.service;

import com.DeliveryOrder.DeliveryOrder.model.Driver;
import com.DeliveryOrder.DeliveryOrder.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long driverId) {
        return driverRepository.findById(driverId).orElse(null);
    }

    public void deleteDriver(Long driverId) {
        driverRepository.deleteById(driverId);
    }
}
