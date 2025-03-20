package com.Restaurant_Management.System.api;


import com.Restaurant_Management.System.dto.request.RestaurantRequestDto;
import com.Restaurant_Management.System.service.RestaurantService;
import com.Restaurant_Management.System.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<StandardResponseDto> createRestaurant(
           @RequestBody RestaurantRequestDto dto
    ) {
        restaurantService.restaurantSave(dto);
        return new ResponseEntity<>(
                StandardResponseDto.builder()
                        .code(201)
                        .message("Successfully new restaurant  created!")
                        .data(null)
                        .build(),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDto> getRestaurant( @PathVariable("id") String restaurantId ) {

        return new ResponseEntity<>(
                StandardResponseDto.builder()
                        .code(200)
                        .message("Restaurant data!")
                        .data(restaurantService.restaurantFindById(restaurantId))
                        .build(),
                HttpStatus.OK
        );
    }

    @GetMapping("/list")
    public ResponseEntity<StandardResponseDto> getAllRestaurant(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size
    ) {

        return new ResponseEntity<>(
                StandardResponseDto.builder()
                        .code(200)
                        .message("Restaurant  List ")
                        .data( restaurantService.findAllRestaurant(searchText, page, size))
                        .build(),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponseDto> UpdateRestaurant(
            @PathVariable("id") String restaurantId,
            @RequestBody RestaurantRequestDto dto
    ) {
        restaurantService.restaurantUpdate(dto, restaurantId);
        return new ResponseEntity<>(
                StandardResponseDto.builder()
                        .code(201)
                        .message("Restaurant updated successfully!")
                        .data(null)
                        .build(),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponseDto> deleteRestaurant(@PathVariable("id") String restaurantId) {
        restaurantService.restaurantDeleteById(restaurantId);
        return new ResponseEntity<>(
                StandardResponseDto.builder()
                        .code(204)
                        .message("Restaurant deleted successfully!")
                        .data(null)
                        .build(),
                HttpStatus.NO_CONTENT
        );
    }


}
