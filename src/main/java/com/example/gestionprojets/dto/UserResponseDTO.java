package com.example.gestionprojets.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private List<TaskResponseDTO> assignedTasks;

    public UserResponseDTO(Long id, String firstname, String lastname, String email, List<TaskResponseDTO> assignedTasks) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.assignedTasks = assignedTasks;
    }
}
