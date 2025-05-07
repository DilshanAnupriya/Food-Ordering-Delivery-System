package com.example.pos1.pos1.service;

import com.example.pos1.pos1.dto.request.RequestAdminDto;
import com.example.pos1.pos1.dto.request.RequestUserDto;
import com.example.pos1.pos1.dto.response.UserResponseDto;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;

public interface ApplicationUserService extends UserDetailsService {

    public void create(RequestUserDto dto) throws IOException;
    public void createAdmin(RequestAdminDto dto) throws IOException;
    public void initializeAdmin() throws IOException;
    UserResponseDto findData(String tokenHeader);

}
