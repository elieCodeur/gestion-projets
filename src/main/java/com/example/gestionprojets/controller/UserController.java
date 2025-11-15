package com.example.gestionprojets.controller;

import com.example.gestionprojets.entity.Role;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.service.RoleService;
import com.example.gestionprojets.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
// @CrossOrigin a été supprimé car géré globalement dans SecurityConfig
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    // ✅ Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Créer un utilisateur
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        User savedUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // ✅ Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> existingUserOptional = userService.getUserById(id);

        if (existingUserOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User userToUpdate = existingUserOptional.get();

        if (userService.existsByEmail(userDetails.getEmail()) && !userToUpdate.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        userToUpdate.setFirstname(userDetails.getFirstname());
        userToUpdate.setLastname(userDetails.getLastname());
        userToUpdate.setEmail(userDetails.getEmail());
        userToUpdate.setRole(userDetails.getRole());

        User updatedUser = userService.saveUser(userToUpdate);
        return ResponseEntity.ok(updatedUser);
    }

    // ✅ Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> {
                    userService.deleteUser(user);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Récupérer tous les rôles
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }
}
