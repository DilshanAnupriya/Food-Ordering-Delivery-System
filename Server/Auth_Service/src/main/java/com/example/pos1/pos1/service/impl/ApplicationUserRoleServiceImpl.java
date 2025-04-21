package com.example.pos1.pos1.service.impl;


import com.example.pos1.pos1.entity.UserRole;
import com.example.pos1.pos1.repo.ApplicationUserRoleRepo;
import com.example.pos1.pos1.service.ApplicationUserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@RequiredArgsConstructor
@Service
public class ApplicationUserRoleServiceImpl implements ApplicationUserRoleService {


    private final ApplicationUserRoleRepo applicationUserRoleRepo;

    @Override
    public void initializeRoles() {
        List<UserRole> applicationUserRoles
                = applicationUserRoleRepo.findAll();
        if(applicationUserRoles.isEmpty()){

            UserRole admin = UserRole.builder()
                    .roleId(UUID.randomUUID().toString())
                    .roleName("ADMIN")
                    .build();

            UserRole user = UserRole.builder()
                    .roleId(UUID.randomUUID().toString())
                    .roleName("USER")
                    .build();

            applicationUserRoleRepo.saveAll(List.of(admin,user));
        }
    }

}
