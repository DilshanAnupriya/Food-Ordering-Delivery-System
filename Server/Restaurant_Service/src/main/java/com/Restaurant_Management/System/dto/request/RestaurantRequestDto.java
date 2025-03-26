package com.Restaurant_Management.System.dto.request;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RestaurantRequestDto {

    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String restaurantEmail;
    private boolean availability;
    private boolean orderAvailability;
    private double rating;

}
