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

    public Delivery createDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
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

    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }

    // Assign Driver to a Delivery
    public String assignDriverToDelivery(Long deliveryId, Long driverId) {
        Optional<Delivery> deliveryOpt = deliveryRepository.findById(deliveryId);
        Optional<Driver> driverOpt = driverRepository.findById(driverId);

        if (deliveryOpt.isPresent() && driverOpt.isPresent()) {
            Delivery delivery = deliveryOpt.get();
            Driver driver = driverOpt.get();

            delivery.setAssignedDriver(driver);
            deliveryRepository.save(delivery);

            DeliveryDriver deliveryDriver = new DeliveryDriver(null, delivery, driver);
            deliveryDriverRepository.save(deliveryDriver);

            return "Driver assigned successfully!";
        }
        return "Delivery or Driver not found!";
    }
}
