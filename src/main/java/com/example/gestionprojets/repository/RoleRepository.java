package com.example.gestionprojets.repository;

import com.example.gestionprojets.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name); // Ajout de cette méthode
    boolean existsByName(String name);
}
