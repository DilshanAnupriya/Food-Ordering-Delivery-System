package com.Restaurant_Management.System.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
public class RestaurantResponseDto {

    private String restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String restaurantEmail;
    private boolean availability;
    private double rating;
}
