package com.example.pos1.pos1.service.impl;

import com.example.pos1.pos1.dto.request.RequestUserDto;
import com.example.pos1.pos1.dto.response.UserResponseDto;
import com.example.pos1.pos1.entity.ApplicationUser;
import com.example.pos1.pos1.entity.UserRole;
import com.example.pos1.pos1.exception.DuplicateEntryException;
import com.example.pos1.pos1.exception.EntryNotFoundException;
import com.example.pos1.pos1.jwt.JwtConfig;
import com.example.pos1.pos1.repo.ApplicationUserRepo;
import com.example.pos1.pos1.repo.ApplicationUserRoleRepo;
import com.example.pos1.pos1.security.SupportSpringApplicationUser;
import com.example.pos1.pos1.service.ApplicationUserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static com.example.pos1.pos1.security.ApplicationUserRole.ADMIN;
import static com.example.pos1.pos1.security.ApplicationUserRole.USER;

@Service
@RequiredArgsConstructor
public class ApplicationUserServiceImpl implements ApplicationUserService {

        private final ApplicationUserRepo userRepo;
        private final ApplicationUserRoleRepo roleRepo;
        private final PasswordEncoder passwordEncoder;
        private final JwtConfig jwtConfig;
        private final SecretKey secretKey;

        @Transactional
        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

            Optional<ApplicationUser> selectedUserData = userRepo.findByUsername(username);
            if (selectedUserData.isEmpty()) {
                throw new EntryNotFoundException(String.format("username %s not found", username));
            }
            Set<SimpleGrantedAuthority> grantedAuthorities = new HashSet<>();

            for (UserRole u : selectedUserData.get().getRoles()) {
                if (u.getRoleName().equals("ADMIN")) {
                    grantedAuthorities.addAll(ADMIN.grantedAuthorities());
                }
                if (u.getRoleName().equals("USER")) {
                    grantedAuthorities.addAll(USER.grantedAuthorities());
                }
            }


            return new SupportSpringApplicationUser(
                    selectedUserData.get().getUsername(),
                    selectedUserData.get().getPassword(),
                    selectedUserData.get().isAccountNonExpired(),
                    selectedUserData.get().isAccountNonLocked(),
                    selectedUserData.get().isCredentialsNonExpired(),
                    selectedUserData.get().isEnabled(),
                    grantedAuthorities
            );
        }

        @Override
        public void create(RequestUserDto dto) throws IOException {
            Optional<ApplicationUser> selectedUser = userRepo.findByUsername(dto.getUsername());
            if (selectedUser.isPresent()) {
                throw new DuplicateEntryException(String.format("user with email (%s) is exists", dto.getUsername()));
            }
            userRepo.save(createApplicationUser(dto));

        }

    @Override
    public void createAdmin(RequestUserDto dto) throws IOException {
        UserRole adminRole = roleRepo.findByRoleName("ADMIN")
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        // Create a Set of UserRole
        Set<UserRole> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);

        // Create and save user with ADMIN role
        ApplicationUser admin = ApplicationUser.builder()
                .userId(UUID.randomUUID().toString())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .roles(adminRoles)  // Pass the Set of roles
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(true)
                .build();

        userRepo.save(admin);
    }

    @Override
        public void initializeAdmin() throws IOException {
            Optional<ApplicationUser> selectedUser = userRepo.findByUsername("dilshananupriya.info@gmail.com");
            if (selectedUser.isPresent()) {
                return;
            }

            Optional<UserRole> selectedRole = roleRepo.findByRoleName("ADMIN");
            if (selectedRole.isEmpty()) {
                throw new EntryNotFoundException("role not found.");
            }

            Set<UserRole> selectedRoles = new HashSet<>();
            selectedRoles.add(selectedRole.get());

            userRepo.save(
                    ApplicationUser.builder()
                            .userId(UUID.randomUUID().toString())
                            .username("dilshananupriya.info@gmail.com")
                            .password(passwordEncoder.encode("dilshan@2002")) // must be encrypted //
                            .fullName("dilshan anupriya")
                            .roles(selectedRoles)
                            .isAccountNonExpired(true)
                            .isAccountNonLocked(true)
                            .isCredentialsNonExpired(true)
                            .isEnabled(true).build()
            );
        }

        @Override
        public UserResponseDto findData(String tokenHeader) {
            String realToken = tokenHeader.replace(jwtConfig.getTokenPrefix(), "");
            Jws<Claims> claimsJws = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(realToken);
            String username = claimsJws.getBody().getSubject();
            Optional<ApplicationUser> selectedUser = userRepo.findByUsername(username);
            if (selectedUser.isEmpty()) {
                throw new EntryNotFoundException(String.format("username %s not found", username));
            }
            return UserResponseDto.builder().username(selectedUser.get().getUsername()).fullName(selectedUser.get().getFullName()).build();
        }

        private ApplicationUser createApplicationUser(RequestUserDto dto) throws IOException {
            if (dto == null) {
                throw new RuntimeException("something went wrong..");
            }
            Optional<UserRole> selectedRole = roleRepo.findByRoleName("USER");
            if (selectedRole.isEmpty()) {
                throw new EntryNotFoundException("role not found.");
            }
            Set<UserRole> userRoles = new HashSet<>();
            userRoles.add(selectedRole.get());
            return ApplicationUser.builder()
                    .userId(UUID.randomUUID().toString())
                    .username(dto.getUsername().trim())
                    .password(passwordEncoder.encode(dto.getPassword())) // must be encrypted
                    .fullName(dto.getFullName().trim())
                    .roles(userRoles)
                    .isAccountNonExpired(true)
                    .isAccountNonLocked(true)
                    .isCredentialsNonExpired(true)
                    .isEnabled(true).build();

        }
}
