package com.User_Service.util;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StandardResponseDto {
    private int code;
    private String message;
    private Object data;
}
