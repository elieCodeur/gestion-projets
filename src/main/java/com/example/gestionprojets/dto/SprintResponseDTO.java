package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprintResponseDTO {
    private Long id;
    private String name;
    private int sprintNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private List<TaskResponseDTO> tasks;
}
