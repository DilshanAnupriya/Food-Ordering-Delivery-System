package com.Restaurant_Management.System.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FoodCartItemRequestDto {
    private String foodItemId;
    private String foodName;
    private double price;
    private int quantity;
}
