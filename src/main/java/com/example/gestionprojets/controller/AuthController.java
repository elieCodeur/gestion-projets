package com.example.gestionprojets.controller;

import com.example.gestionprojets.dto.ErrorResponse;
import com.example.gestionprojets.dto.LoginRequest;
import com.example.gestionprojets.dto.LoginResponse;
import com.example.gestionprojets.dto.RegisterRequest;
import com.example.gestionprojets.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin a été supprimé car géré globalement dans SecurityConfig
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            LoginResponse resp = authService.register(req);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        LoginResponse resp = authService.login(req);
        return ResponseEntity.ok(resp);
    }
}
