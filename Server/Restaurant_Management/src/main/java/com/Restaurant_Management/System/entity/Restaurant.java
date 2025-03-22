package com.Restaurant_Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "restaurant")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Restaurant {



    @Id
    private String restaurantId;

    @Column(name="restaurant_name", nullable = false,unique = true)
    private String restaurantName;

    @Column( nullable = false)
    private String restaurantAddress;

    @Column( nullable = false,length = 11)
    private String restaurantPhone;

    @Column( nullable = false,unique = true)
    private String restaurantEmail;

    @Column( nullable = false)
    private boolean availability;

    @Column( nullable = false)
    private double rating;

    @OneToMany(mappedBy = "restaurant",cascade = CascadeType.ALL, fetch = FetchType.LAZY,orphanRemoval = true)
    private Set<FoodItem> foodItems;


}
