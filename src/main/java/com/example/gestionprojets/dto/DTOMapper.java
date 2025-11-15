package com.example.gestionprojets.dto;

import com.example.gestionprojets.entity.Message;
import com.example.gestionprojets.entity.Project;
import com.example.gestionprojets.entity.Sprint;
import com.example.gestionprojets.entity.Task;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component // Rendre DTOMapper un composant Spring
@RequiredArgsConstructor // Pour l'injection du repository
public class DTOMapper {

    private final MessageRepository messageRepository;

    public TaskResponseDTO toTaskDTO(Task task) {
        Long assignedUserId = task.getAssignedUser() != null ? task.getAssignedUser().getId() : null;
        String assignedUserFirstname = task.getAssignedUser() != null ? task.getAssignedUser().getFirstname() : null;
        String assignedUserLastname = task.getAssignedUser() != null ? task.getAssignedUser().getLastname() : null;

        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getSprint() != null ? task.getSprint().getId() : null,
                assignedUserId,
                assignedUserFirstname,
                assignedUserLastname
        );
    }

    public SprintResponseDTO toSprintDTO(Sprint sprint) {
        return new SprintResponseDTO(
                sprint.getId(),
                sprint.getName(),
                sprint.getSprintNumber(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.getStatus(),
                sprint.getTasks() != null
                        ? sprint.getTasks().stream().map(this::toTaskDTO).collect(Collectors.toList())
                        : Collections.emptyList()
        );
    }

    // Cette méthode prend maintenant l'ID de l'utilisateur courant
    public ProjectResponseDTO toProjectDTO(Project project, Long currentUserId) {
        Set<Sprint> sprints = project.getSprints();
        int progress = 0;
        String status = "Nouveau";

        if (sprints != null && !sprints.isEmpty()) {
            List<Task> allTasks = sprints.stream()
                                        .flatMap(s -> Optional.ofNullable(s.getTasks()).orElse(Collections.emptySet()).stream())
                                        .collect(Collectors.toList());

            if (!allTasks.isEmpty()) {
                long completedTasks = allTasks.stream().filter(t -> "Terminé".equals(t.getStatus())).count();
                progress = (int) (((double) completedTasks / allTasks.size()) * 100);

                if (progress == 100) {
                    status = "Terminé";
                } else if (progress > 0) {
                    status = "En cours";
                }
            }
        }

        // Calculer les messages non lus pour ce projet et cet utilisateur
        long unreadMessages = messageRepository.countByProjectIdAndReceiverIdAndIsReadFalse(project.getId(), currentUserId);

        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                status,
                progress,
                sprints != null ? sprints.stream().map(this::toSprintDTO).collect(Collectors.toList()) : Collections.emptyList(),
                unreadMessages
        );
    }

    public UserResponseDTO toUserDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getAssignedTasks() != null
                        ? user.getAssignedTasks().stream().map(this::toTaskDTO).collect(Collectors.toList())
                        : Collections.emptyList()
        );
    }

    public MessageResponseDTO toMessageDTO(Message message) {
        return new MessageResponseDTO(
                message.getId(),
                message.getSender() != null ? message.getSender().getId() : null,
                message.getSender() != null ? message.getSender().getFirstname() : null,
                message.getSender() != null ? message.getSender().getLastname() : null,
                message.getReceiver() != null ? message.getReceiver().getId() : null,
                message.getReceiver() != null ? message.getReceiver().getFirstname() : null,
                message.getReceiver() != null ? message.getReceiver().getLastname() : null,
                message.getProject() != null ? message.getProject().getId() : null,
                message.getProject() != null ? message.getProject().getName() : null,
                message.getContent(),
                message.getSentAt()
        );
    }
}
