package com.example.gestionprojets.repository;

import com.example.gestionprojets.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Méthode requise par notre UserDetailsService pour charger l'utilisateur par son email
    Optional<User> findByEmail(String email);

    // Méthode utilisée lors de l'inscription pour vérifier si un email est déjà pris
    boolean existsByEmail(String email);
}
