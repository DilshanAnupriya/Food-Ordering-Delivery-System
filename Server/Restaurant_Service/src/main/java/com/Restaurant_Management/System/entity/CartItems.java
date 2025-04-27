package com.Restaurant_Management.System.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity(name = "cartItems")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CartItems {

    @Id
    private String id;

    private String foodName;

    private String foodImage;

    private String restaurantId;
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart foodCart;

    @ManyToOne
    @JoinColumn(name = "food_item_id")
    private FoodItem foodItem;

    private int quantity;
}
