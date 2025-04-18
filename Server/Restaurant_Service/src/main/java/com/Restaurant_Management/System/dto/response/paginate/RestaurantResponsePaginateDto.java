package com.Restaurant_Management.System.dto.response.paginate;

import com.Restaurant_Management.System.dto.response.RestaurantResponseDto;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
@Builder
public class RestaurantResponsePaginateDto {
    private long dataCount;
    private List<RestaurantResponseDto> dataList;
}
