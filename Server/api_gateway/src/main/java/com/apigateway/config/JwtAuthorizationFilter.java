//package com.apigateway.config;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.cloud.gateway.filter.GatewayFilter;
//import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.http.server.reactive.ServerHttpResponse;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//
//@Component
//public class JwtAuthorizationFilter extends AbstractGatewayFilterFactory<JwtAuthorizationFilter.Config> {
//
//    @Value("${jwt.secret}")
//    private String jwtSecret;
//
//    public JwtAuthorizationFilter() {
//        super(Config.class);
//    }
//
//    @Override
//    public GatewayFilter apply(Config config) {
//        return (exchange, chain) -> {
//            ServerHttpRequest request = exchange.getRequest();
//
//            // Skip filter if path is public
//            if (isPublicPath(request.getPath().toString())) {
//                return chain.filter(exchange);
//            }
//
//            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
//                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
//            }
//
//            String authHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
//            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                return onError(exchange, "Invalid authorization header", HttpStatus.UNAUTHORIZED);
//            }
//
//            String token = authHeader.substring(7);
//            if (!isValidToken(token)) {
//                return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
//            }
//
//            // Add user info and roles to headers for downstream services
//            ServerHttpRequest modifiedRequest = addHeadersFromJwt(exchange, token);
//            return chain.filter(exchange.mutate().request(modifiedRequest).build());
//        };
//    }
//
//    private boolean isPublicPath(String path) {
//        return path.contains("api/v1/auth") ;
//    }
//
//    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
//        ServerHttpResponse response = exchange.getResponse();
//        response.setStatusCode(httpStatus);
//        return response.setComplete();
//    }
//
//    private boolean isValidToken(String token) {
//        try {
//            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
//            return true;
//        } catch (Exception e) {
//            return false;
//        }
//    }
//
//    private ServerHttpRequest addHeadersFromJwt(ServerWebExchange exchange, String token) {
//        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
//
//        String username = claims.getSubject();
//        String roles = (String) claims.get("roles");
//
//        // Add these as headers
//        return exchange.getRequest().mutate()
//                .header("X-Username", username)
//                .header("X-Roles", roles)
//                .build();
//    }
//
//    public static class Config {
//        // Add properties if needed
//    }
//}