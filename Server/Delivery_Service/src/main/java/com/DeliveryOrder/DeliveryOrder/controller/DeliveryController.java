package com.DeliveryOrder.DeliveryOrder.controller;

import com.DeliveryOrder.DeliveryOrder.model.LocationDTO;
import com.DeliveryOrder.DeliveryOrder.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//
@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/update-location")
    public ResponseEntity<String> updateDriverLocation(@RequestBody LocationDTO dto) {
        deliveryService.updateLocation(dto);
        return ResponseEntity.ok("Location updated!");
    }

    @PostMapping("/create")
    public ResponseEntity<String> createDelivery(@RequestParam String orderId,
                                                 @RequestParam double latitude,
                                                 @RequestParam double longitude) {
        deliveryService.createDelivery(orderId, latitude, longitude);
        return ResponseEntity.ok("Delivery created!");
    }

    @PostMapping("/mark-delivered/{driverId}")
    public ResponseEntity<String> markAsDelivered(@PathVariable String driverId) {
        deliveryService.markAsDelivered(driverId);
        return ResponseEntity.ok("Delivery marked as delivered");
    }
}
