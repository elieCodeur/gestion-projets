package com.example.gestionprojets.repository;

import com.example.gestionprojets.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findBySprintId(Long sprintId); // Remplacer findByProjectId par findBySprintId

    long countByAssignedUserIdAndStatus(Long userId, String status);
}
