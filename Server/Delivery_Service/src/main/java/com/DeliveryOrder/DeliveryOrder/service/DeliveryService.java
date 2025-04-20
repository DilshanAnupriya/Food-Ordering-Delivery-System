package com.DeliveryOrder.DeliveryOrder.service;

import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import com.DeliveryOrder.DeliveryOrder.model.DriverLocation;
import com.DeliveryOrder.DeliveryOrder.model.LocationDTO;
import com.DeliveryOrder.DeliveryOrder.repository.DeliveryRepository;
import com.DeliveryOrder.DeliveryOrder.repository.DriverLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepo;
    private final DriverLocationRepository driverLocationRepo;

    public void updateLocation(LocationDTO location) {
        DriverLocation driverLoc = driverLocationRepo.findById(location.getDriverId())
                .orElse(new DriverLocation(location.getDriverId(), location.getLatitude(), location.getLongitude(), true));
        driverLoc.setLatitude(location.getLatitude());
        driverLoc.setLongitude(location.getLongitude());
        driverLocationRepo.save(driverLoc);

        deliveryRepo.findByDriverId(location.getDriverId()).ifPresent(delivery -> {
            delivery.setLatitude(location.getLatitude());
            delivery.setLongitude(location.getLongitude());
            deliveryRepo.save(delivery);
        });
    }

    public void createDelivery(String orderId, double lat, double lon) {
        List<DriverLocation> availableDrivers = driverLocationRepo.findByIsAvailableTrue();

        if (availableDrivers.isEmpty()) throw new RuntimeException("No available drivers!");

        DriverLocation nearest = null;
        double minDist = Double.MAX_VALUE;

        for (DriverLocation d : availableDrivers) {
            double dist = calculateDistance(lat, lon, d.getLatitude(), d.getLongitude());
            if (dist < minDist) {
                minDist = dist;
                nearest = d;
            }
        }

        if (nearest != null) {
            Delivery delivery = new Delivery(null, orderId, nearest.getDriverId(), lat, lon, false);
            deliveryRepo.save(delivery);

            nearest.setAvailable(false);
            driverLocationRepo.save(nearest);
        }
    }

    public void markAsDelivered(String driverId) {
        Delivery delivery = deliveryRepo.findByDriverId(driverId)
                .orElseThrow(() -> new RuntimeException("No delivery assigned to this driver"));
        delivery.setDelivered(true);
        deliveryRepo.save(delivery);

        driverLocationRepo.findById(driverId).ifPresent(driver -> {
            driver.setAvailable(true);
            driverLocationRepo.save(driver);
        });
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
