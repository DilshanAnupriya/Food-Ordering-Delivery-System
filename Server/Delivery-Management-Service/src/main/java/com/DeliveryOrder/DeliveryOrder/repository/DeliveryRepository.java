package com.DeliveryOrder.DeliveryOrder.repository;


import com.DeliveryOrder.DeliveryOrder.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(String orderId);
}
