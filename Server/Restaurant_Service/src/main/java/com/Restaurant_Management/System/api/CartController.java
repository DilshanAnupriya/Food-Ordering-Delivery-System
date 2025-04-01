package com.Restaurant_Management.System.api;


import com.Restaurant_Management.System.dto.request.FoodCartRequestDto;
import com.Restaurant_Management.System.service.CartService;
import com.Restaurant_Management.System.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<StandardResponseDto> addToCart(
            @RequestBody FoodCartRequestDto dto
            ){
        cartService.addToCart(dto);
        return new ResponseEntity<>(
                StandardResponseDto.builder()
                        .code(201)
                        .message("  added to cart!")
                        .data(null)
                        .build(),
                HttpStatus.CREATED
        );
    }
}
