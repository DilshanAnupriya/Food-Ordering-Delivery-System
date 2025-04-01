package com.DeliveryOrder.DeliveryOrder.repository;

import com.DeliveryOrder.DeliveryOrder.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByAvailabilityTrue();
}