package com.example.gestionprojets.controller;

import com.example.gestionprojets.entity.Role;
import com.example.gestionprojets.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*") // autorise les appels depuis ton front ou Postman
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // ➤ POST /api/roles : créer un rôle
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        Role savedRole = roleService.createRole(role);
        return ResponseEntity.ok(savedRole);
    }

    // ➤ GET /api/roles : lister tous les rôles
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
}
