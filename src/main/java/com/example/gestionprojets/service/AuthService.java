package com.example.gestionprojets.service;

import com.example.gestionprojets.dto.LoginRequest;
import com.example.gestionprojets.dto.LoginResponse;
import com.example.gestionprojets.dto.RegisterRequest;
import com.example.gestionprojets.entity.Role;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.repository.RoleRepository;
import com.example.gestionprojets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Role userRole = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));

        // Remplacer le builder par un constructeur et des setters
        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        
        userRepository.save(user);
        
        var jwtToken = jwtService.generateToken(user);
        return new LoginResponse(jwtToken); // Utiliser le constructeur
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));
        
        var jwtToken = jwtService.generateToken(user);
        return new LoginResponse(jwtToken); // Utiliser le constructeur
    }
}
