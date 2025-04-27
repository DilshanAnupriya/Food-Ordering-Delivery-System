package com.example.pos1.pos1.jwt;

import com.example.pos1.pos1.dto.request.ApplicationUserLoginDto;
import com.example.pos1.pos1.repo.ApplicationUserRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;

public class JwtUsernameAndPasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final ApplicationUserRepo userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtConfig jwtConfig;
    private final SecretKey secretKey;

    public JwtUsernameAndPasswordAuthenticationFilter(
            AuthenticationManager authenticationManager,
            JwtConfig jwtConfig,
            SecretKey secretKey,
            ApplicationUserRepo userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtConfig = jwtConfig;
        this.secretKey = secretKey;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response)
            throws AuthenticationException {
        try {
            ApplicationUserLoginDto requestApplicationUserLoginDto =
                    new ObjectMapper().readValue(request.getInputStream(),
                            ApplicationUserLoginDto.class);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    requestApplicationUserLoginDto.getUsername(),
                    requestApplicationUserLoginDto.getPassword()
            );
            return authenticationManager.authenticate(authentication);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String extractUserIdFromPrincipal(Object principal) {
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            // Fetch user from repository and get ID
            return userRepository.findByUsername(username).get().getUserId();
        }
        return null;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        // Get user principal
        Object principal = authResult.getPrincipal();

        // Extract userId from principal
        String userId = null;
        if (principal instanceof UserDetails) {
            // If you're using a custom UserDetails implementation that contains userId
            // For example, if you have a CustomUserDetails class with getUserId method
            userId = extractUserIdFromPrincipal(principal);
        }

        String token = Jwts.builder()
                .setSubject(authResult.getName())
                .claim("authorities", authResult.getAuthorities())
                // Add userId as a claim
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(
                        java.sql.Date.valueOf(LocalDate.now()
                                .plusDays(jwtConfig.getTokenExpirationAfterDays()))
                )
                .signWith(secretKey)
                .compact();

        response.addHeader(HttpHeaders.AUTHORIZATION, jwtConfig.getTokenPrefix() + token);

        // Optionally, you can also add the userId to the response body
        response.setContentType("application/json");
        response.getWriter().write("{\"token\":\"" + token + "\", \"userId\":\"" + userId + "\"}");
    }





    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        super.unsuccessfulAuthentication(request, response, failed);
    }
}