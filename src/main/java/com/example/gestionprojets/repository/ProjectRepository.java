package com.example.gestionprojets.repository;

import com.example.gestionprojets.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Trouve tous les projets appartenant à un utilisateur spécifique par son ID
    // Utilise "LEFT JOIN FETCH" pour charger les sprints et leurs tâches en une seule requête
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.sprints s LEFT JOIN FETCH s.tasks WHERE p.owner.id = :ownerId")
    List<Project> findByOwnerIdWithSprintsAndTasks(Long ownerId);
}
