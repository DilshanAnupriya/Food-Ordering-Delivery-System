package com.DeliveryOrder.DeliveryOrder.service;



import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import com.DeliveryOrder.DeliveryOrder.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    // Assign a driver and create a delivery entry
    public Delivery createDelivery(Delivery delivery) {
        delivery.setStatus("Assigned");
        return deliveryRepository.save(delivery);
    }

    // Get all deliveries
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    // Get delivery by Order ID
    public Optional<Delivery> getDeliveryByOrderId(String orderId) {
        return deliveryRepository.findByOrderId(orderId);
    }

    // Update Delivery Status
    public Delivery updateDeliveryStatus(String orderId, String status) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found!"));
        delivery.setStatus(status);
        return deliveryRepository.save(delivery);
    }

    // Delete Delivery
    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }
}
