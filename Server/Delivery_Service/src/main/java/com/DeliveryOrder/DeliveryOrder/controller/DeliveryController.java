package com.DeliveryOrder.DeliveryOrder.controller;

import com.DeliveryOrder.DeliveryOrder.model.CompletedDelivery;
import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import com.DeliveryOrder.DeliveryOrder.model.DeliveryTrackingDTO;
import com.DeliveryOrder.DeliveryOrder.model.LocationDTO;
import com.DeliveryOrder.DeliveryOrder.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/delivery")

@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/update-location")
    public ResponseEntity<String> updateDriverLocation(@RequestBody LocationDTO dto) {
        deliveryService.updateLocation(dto);
        return ResponseEntity.ok("Location updated successfully");
    }


    @PostMapping("/create")
    public ResponseEntity<String> createDelivery(@RequestParam String orderId,
                                                 @RequestParam double shopLatitude,
                                                 @RequestParam double shopLongitude,
                                                 @RequestParam double destinationLatitude,
                                                 @RequestParam double destinationLongitude) {
        deliveryService.createDelivery(orderId, shopLatitude, shopLongitude, destinationLatitude, destinationLongitude);
        return ResponseEntity.ok("Delivery created!");
    }

    @PostMapping("/mark-delivered/{driverId}")
    public ResponseEntity<String> markAsDelivered(@PathVariable String driverId) {
        deliveryService.markAsDelivered(driverId);
        return ResponseEntity.ok("Delivery marked as delivered and driver is now available");
    }

    @GetMapping("/by-driver/{driverId}")
    public ResponseEntity<Delivery> getDeliveryByDriver(@PathVariable String driverId) {
        Delivery delivery = deliveryService.getDeliveryByDriver(driverId);
        return ResponseEntity.ok(delivery);
    }

    @GetMapping("/completed-deliveries/{driverId}")  // Note: Typo in "deliveries" (correct it)
    public ResponseEntity<List<CompletedDelivery>> getCompletedDeliveries(@PathVariable String driverId) {
        List<CompletedDelivery> deliveries = deliveryService.getCompletedDeliveriesByDriver(driverId);
        return ResponseEntity.ok(deliveries);
    }
    @GetMapping("/{orderId}")
    public ResponseEntity<DeliveryTrackingDTO> getDeliveryByOrderId(@PathVariable String orderId) {
        // You need to implement this method in your service
        DeliveryTrackingDTO delivery = deliveryService.getDeliveryByOrderId(orderId);
        return ResponseEntity.ok(delivery);
    }
    @DeleteMapping("/completed-deliveries/order/{orderId}")
    public ResponseEntity<String> deleteCompletedDeliveryByOrderId(@PathVariable String orderId) {
        deliveryService.deleteCompletedDeliveryByOrderId(orderId);
        return ResponseEntity.ok("Completed delivery for order " + orderId + " deleted successfully");
    }

}