package com.DeliveryOrder.DeliveryOrder.controller;

import com.DeliveryOrder.DeliveryOrder.model.Driver;
import com.DeliveryOrder.DeliveryOrder.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {
        return driverService.createDriver(driver);
    }

    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    @GetMapping("/{driverId}")
    public Driver getDriverById(@PathVariable Long driverId) {
        return driverService.getDriverById(driverId);
    }

    @DeleteMapping("/{driverId}")
    public String deleteDriver(@PathVariable Long driverId) {
        driverService.deleteDriver(driverId);
        return "Driver deleted successfully!";
    }
}
