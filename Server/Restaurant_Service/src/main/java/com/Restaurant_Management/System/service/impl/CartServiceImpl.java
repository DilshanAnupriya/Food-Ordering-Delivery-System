package com.Restaurant_Management.System.service.impl;

import com.Restaurant_Management.System.dto.request.FoodCartItemRequestDto;
import com.Restaurant_Management.System.dto.request.FoodCartRequestDto;
import com.Restaurant_Management.System.dto.response.CartItemResponseDto;
import com.Restaurant_Management.System.dto.response.CartResponseDto;
import com.Restaurant_Management.System.entity.Cart;
import com.Restaurant_Management.System.entity.CartItems;
import com.Restaurant_Management.System.entity.FoodItem;
import com.Restaurant_Management.System.exception.EntryNotFoundException;
import com.Restaurant_Management.System.repo.CartRepo;
import com.Restaurant_Management.System.repo.FoodItemRepo;
import com.Restaurant_Management.System.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final FoodItemRepo foodItemRepo;
    private final CartRepo cartRepo;

    @Override
    public void addToCart(FoodCartRequestDto dto) {
        Cart cart = cartRepo.findByUserId(dto.getUserId());
        if( cart == null ) {
           cart = createNewCart(dto);
        }else {
            updateCartItems(cart, dto);
        }
        cartRepo.save(cart);
    }

    @Override
    public void removeFromCart(String userId, String foodId) {
        cartRepo.removeFoodItemFromCart(userId, foodId);
    }

    @Override
    public CartResponseDto getCartByUserId(String userId) {
        return null;
    }


    public Cart toCart(FoodCartRequestDto dto) {
        if (dto == null) throw new RuntimeException("Null");

        List<CartItems> cartItems = new ArrayList<>();
        double totalPrice = 0;

        for(FoodCartItemRequestDto cartDto : dto.getCartItems() ) {

            FoodItem foodItem = foodItemRepo.findFoodItemByFoodItemId(cartDto.getFoodItemId())
                    .orElseThrow(() -> new EntryNotFoundException("Not found"));


            // Create CartItem for each item in the cart
            CartItems cartItem = CartItems.builder()
                    .id(UUID.randomUUID().toString())
                    .foodName(foodItem.getName())// Generate a new ID for cart item
                    .foodItem(foodItem)  // Map the food item from the repository
                    .quantity(cartDto.getQuantity())  // Set the quantity from the DTO
                    .build();

            cartItems.add(cartItem);
            totalPrice += foodItem.getPrice() * cartDto.getQuantity();
        }
        Cart cart = Cart.builder()
                .cartId(UUID.randomUUID().toString())  // Generate a unique cart ID
                .userId(dto.getUserId())  // Set the user ID from the DTO
                .cartItems(cartItems)  // Set the list of cart items
                .totalPrice(totalPrice)  // Set the total price
                .createdAt(LocalDateTime.now())  // Set the current time
                .build();


        for (CartItems cartItem : cartItems) {
            cartItem.setFoodCart(cart);  // Associate the cart with the cart item
        }

        return cart;  // Return the fully constructed cart entity
    }

    private Cart createNewCart(FoodCartRequestDto dto) {
        List<CartItems> cartItems = new ArrayList<>();
        double totalPrice = 0;

        for (FoodCartItemRequestDto cartDto : dto.getCartItems()) {
            FoodItem foodItem = foodItemRepo.findFoodItemByFoodItemId(cartDto.getFoodItemId())
                    .orElseThrow(() -> new EntryNotFoundException("Food item not found"));

            CartItems cartItem = CartItems.builder()
                    .id(UUID.randomUUID().toString())
                    .foodItem(foodItem)
                    .foodName(foodItem.getName())
                    .quantity(cartDto.getQuantity())
                    .build();

            cartItems.add(cartItem);
            totalPrice += foodItem.getPrice() * cartDto.getQuantity();
        }

        Cart newCart = Cart.builder()
                .cartId(UUID.randomUUID().toString())
                .userId(dto.getUserId())
                .cartItems(cartItems)
                .totalPrice(totalPrice)
                .createdAt(LocalDateTime.now())
                .build();

        // Set cart reference for each cart item
        for (CartItems cartItem : cartItems) {
            cartItem.setFoodCart(newCart);
        }

        return newCart;
    }

    private void updateCartItems(Cart cart, FoodCartRequestDto dto) {
        double totalPrice = 0;

        for (FoodCartItemRequestDto cartDto : dto.getCartItems()) {
            FoodItem foodItem = foodItemRepo.findFoodItemByFoodItemId(cartDto.getFoodItemId())
                    .orElseThrow(() -> new EntryNotFoundException("Food item not found"));

            // Check if the food item already exists in the cart
            CartItems existingCartItem = cart.getCartItems().stream()
                    .filter(item -> item.getFoodItem().getFoodItemId().equals(foodItem.getFoodItemId()))
                    .findFirst()
                    .orElse(null);

            if (existingCartItem != null) {
                int updatedQuantity = existingCartItem.getQuantity() + cartDto.getQuantity();
                existingCartItem.setQuantity(updatedQuantity);
                totalPrice += foodItem.getPrice() * existingCartItem.getQuantity();
            } else {

                CartItems newCartItem = CartItems.builder()
                        .id(UUID.randomUUID().toString())
                        .foodItem(foodItem)
                        .foodName(foodItem.getName())
                        .quantity(cartDto.getQuantity())
                        .foodCart(cart)
                        .build();
                cart.getCartItems().add(newCartItem);
                totalPrice += foodItem.getPrice() * cartDto.getQuantity();
            }



        }


        cart.setTotalPrice(totalPrice);
    }



}

