//package com.apigateway.config;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cloud.gateway.route.RouteLocator;
//import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class ApiGatewayConfig {
//
//    @Autowired
//    private JwtAuthorizationFilter authFilter;
//
//    @Bean
//    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
//        return builder.routes()
//                // Auth Service - Public endpoints
//                .route("authService", r -> r
//                        .path("/api/v1/auth/**")
//                        .uri("lb://authService"))
//
//                // Order Service - Protected endpoints
//                .route("order-service", r -> r
//                        .path("/api/orders/**")
//                        .filters(f -> f.filter(authFilter.apply(new JwtAuthorizationFilter.Config())))
//                        .uri("lb://order-service"))
//
//                // Review Service - Protected endpoints
//                .route("review-service", r -> r
//                        .path("/api/reviews/**")
//                        .filters(f -> f.filter(authFilter.apply(new JwtAuthorizationFilter.Config())))
//                        .uri("lb://review-service"))
//
//                // Add more routes for other microservices
//
//                .build();
//    }
//}