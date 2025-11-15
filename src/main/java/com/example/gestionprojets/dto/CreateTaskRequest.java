package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTaskRequest {
    private String title;
    private String description;
    private Long sprintId; // Remplacer projectId par sprintId
    private Long assignedUserId;
}
