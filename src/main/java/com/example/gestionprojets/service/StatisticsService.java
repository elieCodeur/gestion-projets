package com.example.gestionprojets.service;

import com.example.gestionprojets.dto.DTOMapper;
import com.example.gestionprojets.dto.ProjectResponseDTO;
import com.example.gestionprojets.dto.SprintResponseDTO; // Importez SprintResponseDTO
import com.example.gestionprojets.dto.StatisticsResponseDTO;
import com.example.gestionprojets.entity.Project;
import com.example.gestionprojets.entity.Sprint;
import com.example.gestionprojets.entity.Task;
import com.example.gestionprojets.repository.MessageRepository;
import com.example.gestionprojets.repository.ProjectRepository;
import com.example.gestionprojets.repository.SprintRepository;
import com.example.gestionprojets.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final MessageRepository messageRepository;
    private final DTOMapper dtoMapper;

    @Transactional(readOnly = true)
    public StatisticsResponseDTO getUserStatistics(Long userId) {
        List<Project> userProjectsEntities = projectRepository.findByOwnerIdWithSprintsAndTasks(userId);

        List<ProjectResponseDTO> userProjects = userProjectsEntities.stream()
                                                                    .map(project -> dtoMapper.toProjectDTO(project, userId))
                                                                    .collect(Collectors.toList());

        long totalProjects = userProjects.size();
        long completedProjects = userProjects.stream().filter(p -> "Terminé".equals(p.getStatus())).count();
        long activeProjects = totalProjects - completedProjects;

        long totalSprints = 0;
        long activeSprints = 0;
        long completedSprints = 0;
        long totalTasks = 0;
        long completedTasks = 0;
        double totalProgressSum = 0;

        for (ProjectResponseDTO project : userProjects) {
            totalProgressSum += project.getProgress();

            if (project.getSprints() != null) {
                totalSprints += project.getSprints().size();
                for (SprintResponseDTO sprint : project.getSprints()) {
                    if ("Actif".equals(sprint.getStatus())) {
                        activeSprints++;
                    } else if ("Terminé".equals(sprint.getStatus())) {
                        completedSprints++;
                    }

                    if (sprint.getTasks() != null) {
                        totalTasks += sprint.getTasks().size();
                        completedTasks += sprint.getTasks().stream().filter(t -> "Terminé".equals(t.getStatus())).count();
                    }
                }
            }
        }

        double averageProjectProgress = totalProjects > 0 ? totalProgressSum / totalProjects : 0;
        long unreadMessages = messageRepository.countByReceiverIdAndIsReadFalse(userId);

        return new StatisticsResponseDTO(
                totalProjects,
                activeProjects,
                completedProjects,
                totalSprints,
                activeSprints,
                completedSprints,
                totalTasks,
                completedTasks,
                averageProjectProgress,
                unreadMessages
        );
    }
}
