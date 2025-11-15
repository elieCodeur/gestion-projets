package com.example.gestionprojets.service;

import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Injection du repository
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Récupérer un utilisateur par ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // ✅ Sauvegarder ou mettre à jour un utilisateur
    public User saveUser(User user) {
        // Note: Lors de la sauvegarde, assurez-vous que le mot de passe est encodé
        // et que l'email est unique si c'est une nouvelle création.
        return userRepository.save(user);
    }

    // ✅ Supprimer un utilisateur
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    // ✅ Vérifier si un email existe déjà (remplace existsByUsername)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // ✅ Récupérer un utilisateur par email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
