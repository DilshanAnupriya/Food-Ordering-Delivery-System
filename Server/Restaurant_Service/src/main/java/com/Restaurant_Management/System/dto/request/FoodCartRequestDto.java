package com.Restaurant_Management.System.dto.request;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FoodCartRequestDto {
    private String userId;
    private List<FoodCartItemRequestDto> cartItems;
    private double totalPrice;
}
