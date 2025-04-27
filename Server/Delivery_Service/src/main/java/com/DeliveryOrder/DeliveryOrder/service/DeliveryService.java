package com.DeliveryOrder.DeliveryOrder.service;

import com.DeliveryOrder.DeliveryOrder.model.*;
import com.DeliveryOrder.DeliveryOrder.repository.CompletedDeliveryRepository;
import com.DeliveryOrder.DeliveryOrder.repository.DeliveryRepository;
import com.DeliveryOrder.DeliveryOrder.repository.DriverLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepo;
    private final DriverLocationRepository driverLocationRepo;
    private final CompletedDeliveryRepository completedDeliveryRepo;

    @Transactional
    public void updateLocation(LocationDTO location) {
        DriverLocation driverLoc = driverLocationRepo.findById(location.getDriverId())
                .orElse(new DriverLocation(location.getDriverId(), location.getLatitude(), location.getLongitude(), true));
        driverLoc.setLatitude(location.getLatitude());
        driverLoc.setLongitude(location.getLongitude());
        driverLocationRepo.save(driverLoc);

        deliveryRepo.findByDriverId(location.getDriverId()).ifPresent(delivery -> {
            delivery.setDriverLatitude(location.getLatitude());
            delivery.setDriverLongitude(location.getLongitude());
            deliveryRepo.save(delivery);
        });
    }

    @Transactional
    public void createDelivery(String orderId, double shopLat, double shopLon, double customerLat, double customerLon) {
        List<DriverLocation> availableDrivers = driverLocationRepo.findByIsAvailableTrue();

        if (availableDrivers.isEmpty()) {
            throw new RuntimeException("No available drivers!");
        }

        DriverLocation nearest = null;
        double minDist = Double.MAX_VALUE;

        for (DriverLocation d : availableDrivers) {
            double dist = calculateDistance(shopLat, shopLon, d.getLatitude(), d.getLongitude());
            if (dist < minDist) {
                minDist = dist;
                nearest = d;
            }
        }

        if (nearest != null) {
            Delivery delivery = new Delivery(null, orderId, nearest.getDriverId(),
                    customerLat, customerLon, // destination
                    nearest.getLatitude(), nearest.getLongitude(), // initial driver location
                    shopLat, shopLon, // shop location
                    false);
            deliveryRepo.save(delivery);

            nearest.setAvailable(false);
            driverLocationRepo.save(nearest);
        }
    }

    @Transactional
    public void markAsDelivered(String driverId) {
        Delivery delivery = deliveryRepo.findByDriverId(driverId)
                .orElseThrow(() -> new RuntimeException("No delivery assigned to this driver"));

        CompletedDelivery completed = new CompletedDelivery(
                null,
                delivery.getOrderId(),
                delivery.getDriverId(),
                delivery.getDestinationLatitude(),
                delivery.getDestinationLongitude(),
                true,
                LocalDateTime.now()
        );
        completedDeliveryRepo.save(completed);

        deliveryRepo.delete(delivery);

        driverLocationRepo.findById(driverId).ifPresent(driver -> {
            driver.setAvailable(true);
            driverLocationRepo.save(driver);
        });
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    public Delivery getDeliveryByDriver(String driverId) {
        return deliveryRepo.findByDriverId(driverId)
                .orElseThrow(() -> new RuntimeException("No active delivery assigned to this driver"));
    }

    public List<CompletedDelivery> getCompletedDeliveriesByDriver(String driverId) {
        return completedDeliveryRepo.findByDriverId(driverId);
    }

    public DeliveryTrackingDTO getDeliveryByOrderId(String orderId) {
        Delivery delivery = deliveryRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No active delivery found for this order ID"));

        // Map your Delivery entity to a DeliveryTracking DTO that matches the frontend needs
        return mapToDeliveryTracking(delivery);
    }

    // Helper method to map the entity to the frontend DTO
    private DeliveryTrackingDTO mapToDeliveryTracking(Delivery delivery) {
        // You might also need to fetch driver name from a user service if available
        String driverName = "Driver " + delivery.getDriverId().substring(0, 4); // Placeholder

        // Calculate estimated arrival time (you could add logic for this)
        LocalDateTime estimatedArrival = LocalDateTime.now().plusMinutes(15); // Placeholder

        return new DeliveryTrackingDTO(
                delivery.getOrderId(),
                false, // isDelivered
                estimatedArrival.toString(),
                driverName,
                delivery.getDriverLatitude(),
                delivery.getDriverLongitude(),
                delivery.getDestinationLatitude(),
                delivery.getDestinationLongitude()
        );
    }
    @Transactional
    public void deleteCompletedDeliveryByOrderId(String orderId) {
        if (!completedDeliveryRepo.existsByOrderId(orderId)) {
            throw new RuntimeException("Completed delivery with order ID " + orderId + " not found");
        }
        completedDeliveryRepo.deleteByOrderId(orderId);
    }
}