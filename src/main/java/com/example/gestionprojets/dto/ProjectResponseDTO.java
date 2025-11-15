package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String status;
    private int progress;
    private List<SprintResponseDTO> sprints;
    private long unreadMessagesCount; // Nouveau champ pour les messages non lus
}
