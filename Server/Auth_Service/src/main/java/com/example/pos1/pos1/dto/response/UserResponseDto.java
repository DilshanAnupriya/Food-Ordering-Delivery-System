package com.example.pos1.pos1.dto.response;


import lombok.*;
import org.checkerframework.checker.units.qual.A;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDto {
    private String username;
    private String fullName;
    private String contact;
}
