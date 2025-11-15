package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateProjectRequest {
    private String name;
    private String description;
    private int numberOfSprints;
    private int sprintDurationInDays; // Ex: 14 pour des sprints de 2 semaines
}
