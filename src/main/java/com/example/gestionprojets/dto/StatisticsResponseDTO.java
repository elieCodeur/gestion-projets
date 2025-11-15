package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatisticsResponseDTO {
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long totalSprints;
    private long activeSprints;
    private long completedSprints;
    private long totalTasks;
    private long completedTasks;
    private double averageProjectProgress;
    private long unreadMessages;
}
