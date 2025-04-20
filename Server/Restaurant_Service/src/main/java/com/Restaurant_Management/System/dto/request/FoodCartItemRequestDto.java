package com.Restaurant_Management.System.dto.request;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class FoodCartItemRequestDto {
    private String foodItemId;
    private String foodName;
    private double price;
    private int quantity;
}
