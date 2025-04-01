package com.DeliveryOrder.DeliveryOrder.controller;

import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import com.DeliveryOrder.DeliveryOrder.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDelivery(@PathVariable Long id) {
        boolean isDeleted = deliveryService.deleteDelivery(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.OK).body("Delivery deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery not found");
        }
    }

    @GetMapping("/track/{orderId}")
    public ResponseEntity<Delivery> trackDelivery(@PathVariable String orderId) {
        // Find delivery by orderId
        Optional<Delivery> delivery = deliveryService.getDeliveryByOrderId(orderId);

        if (delivery.isPresent()) {
            // Return the delivery details if found
            return ResponseEntity.ok(delivery.get());
        } else {
            // Return a NOT_FOUND status if the delivery does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null); // or use an appropriate error message in the response body
        }
    }
}
