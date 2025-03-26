package com.DeliveryOrder.DeliveryOrder.controller;

import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import com.DeliveryOrder.DeliveryOrder.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    // Create a Delivery
    @PostMapping
    public Delivery createDelivery(@RequestBody Delivery delivery) {
        return deliveryService.createDelivery(delivery);
    }

    // Get All Deliveries
    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    // Get Delivery by Order ID
    @GetMapping("/{orderId}")
    public Optional<Delivery> getDeliveryByOrderId(@PathVariable String orderId) {
        return deliveryService.getDeliveryByOrderId(orderId);
    }

    // Update Delivery Status
    @PutMapping("/{orderId}")
    public Delivery updateDeliveryStatus(@PathVariable String orderId, @RequestParam String status) {
        return deliveryService.updateDeliveryStatus(orderId, status);
    }

    // Delete Delivery
    @DeleteMapping("/{id}")
    public String deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return "Delivery removed!";
    }
}
