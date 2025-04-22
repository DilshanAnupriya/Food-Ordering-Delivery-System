package com.Restaurant_Management.System.repo;

import com.Restaurant_Management.System.entity.FoodItem;
import com.Restaurant_Management.System.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FoodItemRepo extends JpaRepository<FoodItem, String> {
    @Query(nativeQuery = true,value = "SELECT * FROM food_items WHERE items_name LIKE %?1% OR category LIKE %?1%")
    public Page<FoodItem> findAllFoodItem(String searchText, Pageable pageable);

    Optional<FoodItem> findFoodItemByFoodItemId(String id);


    @Query(nativeQuery = true,value = "SELECT COUNT(*) FROM food_items WHERE items_name LIKE %?1% OR category LIKE %?1%")
    public long countAllFoodItems(String searchText);

    @Query(value = "SELECT DISTINCT category FROM food_items", nativeQuery = true)
    List<String> findAllCategories();
}
