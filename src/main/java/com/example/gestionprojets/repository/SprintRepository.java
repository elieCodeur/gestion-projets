package com.example.gestionprojets.repository;

import com.example.gestionprojets.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    // Méthode pour trouver les sprints d'un projet donné, triés par numéro de sprint
    List<Sprint> findByProjectIdOrderBySprintNumberAsc(Long projectId);
}
