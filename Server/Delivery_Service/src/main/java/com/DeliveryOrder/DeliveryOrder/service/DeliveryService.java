package com.DeliveryOrder.DeliveryOrder.service;

import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import com.DeliveryOrder.DeliveryOrder.model.Driver;
import com.DeliveryOrder.DeliveryOrder.model.DeliveryDriver;
import com.DeliveryOrder.DeliveryOrder.repository.DeliveryRepository;
import com.DeliveryOrder.DeliveryOrder.repository.DriverRepository;
import com.DeliveryOrder.DeliveryOrder.repository.DeliveryDriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DeliveryDriverRepository deliveryDriverRepository;

    // Create a new delivery and auto-assign the nearest available driver
    public Delivery createDelivery(Delivery delivery) {
        Optional<Driver> assignedDriver = findNearestAvailableDriver(delivery.getOrderLocation());

        if (assignedDriver.isPresent()) {
            Driver driver = assignedDriver.get();
            delivery.setAssignedDriver(driver);
            delivery.setStatus("Assigned");
            delivery.setTrackingLink(generateTrackingLink(delivery.getOrderId()));

            // Mark driver as unavailable
            driver.setAvailability(false);
            driverRepository.save(driver);
        } else {
            delivery.setStatus("Pending - No Driver Available");
        }

        return deliveryRepository.save(delivery);
    }

    // Find the nearest available driver based on location
    private Optional<Driver> findNearestAvailableDriver(String orderLocation) {
        return driverRepository.findAll().stream()
                .filter(Driver::isAvailability) // Only available drivers
                .min((d1, d2) -> compareDistances(orderLocation, d1.getLocationPoint(), d2.getLocationPoint()));
    }

    // Mock distance comparison (Replace with actual geo-distance logic)
    private int compareDistances(String orderLocation, String loc1, String loc2) {
        return loc1.compareTo(loc2); // Dummy comparison (Implement real distance calculation)
    }

    // Generate a mock tracking link
    private String generateTrackingLink(String orderId) {
        return "https://tracking.example.com/" + orderId;
    }


    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Optional<Delivery> getDeliveryByOrderId(String orderId) {
        return deliveryRepository.findByOrderId(orderId);
    }

    public Delivery updateDeliveryStatus(Long deliveryId, String status) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findById(deliveryId);
        if (optionalDelivery.isPresent()) {
            Delivery delivery = optionalDelivery.get();
            delivery.setStatus(status);
            return deliveryRepository.save(delivery);
        }
        return null;
    }

    public boolean deleteDelivery(Long id) {
        Optional<Delivery> delivery = deliveryRepository.findById(id);
        if (delivery.isPresent()) {
            deliveryRepository.deleteById(id); // Delete the delivery if found
            return true; // Return true if the deletion was successful
        }
        return false; // Return false if the delivery was not found
    }


}
