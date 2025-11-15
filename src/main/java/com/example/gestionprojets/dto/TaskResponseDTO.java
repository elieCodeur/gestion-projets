package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private Long sprintId; // Remplacer projectId par sprintId
    private Long assignedUserId;
    private String assignedUserFirstname;
    private String assignedUserLastname;
}
