package com.Restaurant_Management.System.service.impl;

import com.Restaurant_Management.System.dto.request.RestaurantRequestDto;
import com.Restaurant_Management.System.dto.response.RestaurantResponseDto;
import com.Restaurant_Management.System.dto.response.paginate.RestaurantResponsePaginateDto;
import com.Restaurant_Management.System.entity.Restaurant;
import com.Restaurant_Management.System.exception.EntryNotFoundException;
import com.Restaurant_Management.System.repo.RestaurantRepo;
import com.Restaurant_Management.System.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.management.RuntimeErrorException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepo restaurantRepo;

    @Override
    public void restaurantSave(RestaurantRequestDto dto) {
        restaurantRepo.save(toRestaurant(dto));

    }

    @Override
    public void restaurantUpdate(RestaurantRequestDto dto, String id) {
        Restaurant restaurant = restaurantRepo.findById(id).orElseThrow(()-> new EntryNotFoundException("not found"));

        restaurant.setRestaurantName(dto.getRestaurantName());
        restaurant.setRestaurantName(dto.getRestaurantName());
        restaurant.setRestaurantPhone(dto.getRestaurantPhone());
        restaurant.setRestaurantEmail(dto.getRestaurantEmail());
        restaurant.setRestaurantAddress(dto.getRestaurantAddress());
        restaurant.setAvailability(dto.isAvailability());
        restaurant.setRating(dto.getRating());

        restaurantRepo.save(restaurant);


    }

    @Override
    public RestaurantResponseDto restaurantFindById(String id) {
        return  toRestaurantResponseDto(
             restaurantRepo.findById(id).orElseThrow(()-> new EntryNotFoundException("not found"))
        );

    }

    @Override
    public void restaurantDeleteById(String id) {
        restaurantRepo.deleteById(id);
    }

    @Override
    public RestaurantResponsePaginateDto findAllRestaurant(String searchText, int page, int size) {
        return RestaurantResponsePaginateDto.builder()
                .dataCount(restaurantRepo.countAllRestaurant(searchText))
                .dataList(
                        restaurantRepo.findAllRestaurant(searchText, PageRequest.of(page,size))
                .stream()
                .map(this::toRestaurantResponseDto)
                .collect(Collectors.toList()))
                .build();
    }

    private Restaurant toRestaurant(RestaurantRequestDto dto) {
        if(dto==null) throw new RuntimeException("null");
        return  Restaurant.builder()
                .restaurantId(UUID.randomUUID().toString())
                .restaurantName(dto.getRestaurantName())
                .restaurantPhone(dto.getRestaurantPhone())
                .restaurantEmail(dto.getRestaurantEmail())
                .restaurantAddress(dto.getRestaurantAddress())
                .availability(dto.isAvailability())
                .rating(dto.getRating())
                .build();
    }
    private RestaurantResponseDto toRestaurantResponseDto(Restaurant restaurant) {
        if(restaurant==null) throw new RuntimeException("null");
        return  RestaurantResponseDto.builder()
                .restaurantId(restaurant.getRestaurantId())
                .restaurantName(restaurant.getRestaurantName())
                .restaurantPhone(restaurant.getRestaurantPhone())
                .restaurantEmail(restaurant.getRestaurantEmail())
                .restaurantAddress(restaurant.getRestaurantAddress())
                .availability(restaurant.isAvailability())
                .rating(restaurant.getRating())
                .build();
    }
}
