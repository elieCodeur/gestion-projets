package com.example.gestionprojets.service;

import com.example.gestionprojets.dto.CreateProjectRequest;
import com.example.gestionprojets.dto.DTOMapper;
import com.example.gestionprojets.dto.ProjectResponseDTO;
import com.example.gestionprojets.dto.UpdateProjectRequest;
import com.example.gestionprojets.entity.Project;
import com.example.gestionprojets.entity.Sprint;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final DTOMapper dtoMapper; // Injecter le DTOMapper

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getProjectsByOwnerId(Long ownerId) {
        return projectRepository.findByOwnerIdWithSprintsAndTasks(ownerId).stream()
                .map(project -> dtoMapper.toProjectDTO(project, ownerId)) // Passer l'ID de l'utilisateur
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(Long projectId, Long currentUserId) { // Ajouter currentUserId
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return dtoMapper.toProjectDTO(project, currentUserId); // Passer l'ID de l'utilisateur
    }

    @Transactional
    public ProjectResponseDTO createProject(CreateProjectRequest request, User owner) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(owner);
        project.setStatus("Nouveau");

        Set<Sprint> sprints = new HashSet<>();
        LocalDate sprintStartDate = LocalDate.now();
        for (int i = 1; i <= request.getNumberOfSprints(); i++) {
            LocalDate sprintEndDate = sprintStartDate.plusDays(request.getSprintDurationInDays() - 1);
            Sprint sprint = new Sprint("Sprint " + i, i, sprintStartDate, sprintEndDate, i == 1 ? "Actif" : "À venir", project);
            sprints.add(sprint);
            sprintStartDate = sprintEndDate.plusDays(1);
        }
        project.setSprints(sprints);
        
        Project savedProject = projectRepository.save(project);
        return dtoMapper.toProjectDTO(savedProject, owner.getId()); // Passer l'ID de l'utilisateur
    }

    @Transactional
    public ProjectResponseDTO updateProject(Long projectId, UpdateProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        Project updatedProject = projectRepository.save(project);
        // Ici, nous n'avons pas l'ID de l'utilisateur courant, ce qui est un problème.
        // Pour l'instant, nous allons passer null ou 0L, mais il faudra le récupérer.
        return dtoMapper.toProjectDTO(updatedProject, updatedProject.getOwner().getId()); // Supposons que l'owner est l'utilisateur courant
    }

    @Transactional
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }
}
