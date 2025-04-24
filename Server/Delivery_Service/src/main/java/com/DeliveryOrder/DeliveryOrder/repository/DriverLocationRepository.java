package com.DeliveryOrder.DeliveryOrder.repository;

import com.DeliveryOrder.DeliveryOrder.model.DriverLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverLocationRepository extends JpaRepository<DriverLocation, String> {
    List<DriverLocation> findByIsAvailableTrue();
}