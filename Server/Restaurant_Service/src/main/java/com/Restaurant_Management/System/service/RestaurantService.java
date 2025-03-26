package com.Restaurant_Management.System.service;

import com.Restaurant_Management.System.dto.request.RestaurantRequestDto;
import com.Restaurant_Management.System.dto.response.RestaurantResponseDto;
import com.Restaurant_Management.System.dto.response.paginate.RestaurantResponsePaginateDto;
import com.Restaurant_Management.System.entity.Restaurant;

public interface RestaurantService {

    public void restaurantSave(RestaurantRequestDto dto);
    public void restaurantUpdate(RestaurantRequestDto dto, String id);
    public RestaurantResponseDto restaurantFindById(String id);
    public void restaurantDeleteById(String id);
    public RestaurantResponsePaginateDto findAllRestaurant(String searchText, int page, int size);
    public void setRestaurantAvailability(String id, boolean availability);
    public  void setOrderAvailability(String id, boolean OrderAvailability);
}
