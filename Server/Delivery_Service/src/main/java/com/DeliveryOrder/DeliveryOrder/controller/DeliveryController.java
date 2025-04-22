package com.DeliveryOrder.DeliveryOrder.controller;

import com.DeliveryOrder.DeliveryOrder.model.CompletedDelivery;
import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import com.DeliveryOrder.DeliveryOrder.model.LocationDTO;
import com.DeliveryOrder.DeliveryOrder.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/delivery")
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true",
        maxAge = 3600)
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/update-location")
    public ResponseEntity<String> updateDriverLocation(@RequestBody LocationDTO dto) {
        deliveryService.updateLocation(dto);
        return ResponseEntity.ok("Location updated successfully");
    }

//    @PostMapping("/create")
//    public ResponseEntity<String> createDelivery(@RequestParam String orderId,
//                                                 @RequestParam double latitude,
//                                                 @RequestParam double longitude) {
//        deliveryService.createDelivery(orderId, latitude, longitude);
//        return ResponseEntity.ok("Delivery created and assigned to nearest available driver");
//    }

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
}