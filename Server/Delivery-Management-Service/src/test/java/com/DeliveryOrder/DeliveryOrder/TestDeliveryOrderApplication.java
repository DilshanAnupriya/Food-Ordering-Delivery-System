package com.DeliveryOrder.DeliveryOrder;

import org.springframework.boot.SpringApplication;

public class TestDeliveryOrderApplication {

	public static void main(String[] args) {
		SpringApplication.from(DeliveryOrderApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
