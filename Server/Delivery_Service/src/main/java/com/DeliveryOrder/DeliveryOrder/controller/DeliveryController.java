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

    @PostMapping
    public Delivery createDelivery(@RequestBody Delivery delivery) {
        return deliveryService.createDelivery(delivery);
    }

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/{orderId}")
    public Optional<Delivery> getDeliveryByOrderId(@PathVariable String orderId) {
        return deliveryService.getDeliveryByOrderId(orderId);
    }

    @PutMapping("/{deliveryId}/status")
    public Delivery updateDeliveryStatus(@PathVariable Long deliveryId, @RequestParam String status) {
        return deliveryService.updateDeliveryStatus(deliveryId, status);
    }


    @PostMapping("/{deliveryId}/assign/{driverId}")
    public String assignDriver(@PathVariable Long deliveryId, @PathVariable Long driverId) {
        return deliveryService.assignDriverToDelivery(deliveryId, driverId);
    }
}
