package com.example.gestionprojets.service;

import com.example.gestionprojets.dto.CreateSprintRequest;
import com.example.gestionprojets.dto.DTOMapper;
import com.example.gestionprojets.dto.SprintResponseDTO;
import com.example.gestionprojets.dto.UpdateSprintRequest;
import com.example.gestionprojets.entity.Project;
import com.example.gestionprojets.entity.Sprint;
import com.example.gestionprojets.repository.ProjectRepository;
import com.example.gestionprojets.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final DTOMapper dtoMapper; // Injecter le DTOMapper

    @Transactional(readOnly = true)
    public List<SprintResponseDTO> getSprintsByProjectId(Long projectId) {
        return sprintRepository.findByProjectIdOrderBySprintNumberAsc(projectId).stream()
                .map(dtoMapper::toSprintDTO) // Utiliser l'instance du mapper
                .collect(Collectors.toList());
    }

    @Transactional
    public SprintResponseDTO createSprint(CreateSprintRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Déterminer le prochain numéro de sprint
        int nextSprintNumber = sprintRepository.findByProjectIdOrderBySprintNumberAsc(project.getId()).size() + 1;

        Sprint sprint = new Sprint();
        sprint.setName(request.getName());
        sprint.setSprintNumber(nextSprintNumber);
        sprint.setStartDate(request.getStartDate());
        sprint.setEndDate(request.getEndDate());
        sprint.setStatus("À venir"); // Statut par défaut
        sprint.setProject(project);

        Sprint savedSprint = sprintRepository.save(sprint);
        return dtoMapper.toSprintDTO(savedSprint); // Utiliser l'instance du mapper
    }

    @Transactional
    public SprintResponseDTO updateSprint(Long sprintId, UpdateSprintRequest request) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        if (request.getName() != null) {
            sprint.setName(request.getName());
        }
        if (request.getStartDate() != null) {
            sprint.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            sprint.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            sprint.setStatus(request.getStatus());
        }

        Sprint updatedSprint = sprintRepository.save(sprint);
        return dtoMapper.toSprintDTO(updatedSprint); // Utiliser l'instance du mapper
    }

    @Transactional
    public void deleteSprint(Long sprintId) {
        sprintRepository.deleteById(sprintId);
    }
}