package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTaskRequest {
    private String title;
    private String description;
    private String status; // Pour changer le statut dans le Kanban
    private Long assignedUserId; // Pour réassigner la tâche
}
