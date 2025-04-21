package com.DeliveryOrder.DeliveryOrder.repository;



import com.DeliveryOrder.DeliveryOrder.model.CompletedDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompletedDeliveryRepository extends JpaRepository<CompletedDelivery, Long> {
    List<CompletedDelivery> findByDriverId(String driverId);
}
