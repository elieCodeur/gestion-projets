package com.example.gestionprojets.service;

import com.example.gestionprojets.dto.CreateTaskRequest;
import com.example.gestionprojets.dto.DTOMapper;
import com.example.gestionprojets.dto.TaskResponseDTO;
import com.example.gestionprojets.dto.UpdateTaskRequest;
import com.example.gestionprojets.entity.Sprint;
import com.example.gestionprojets.entity.Task;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.repository.SprintRepository;
import com.example.gestionprojets.repository.TaskRepository;
import com.example.gestionprojets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;
    private final DTOMapper dtoMapper; // Injecter le DTOMapper

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getTasksBySprintId(Long sprintId) {
        return taskRepository.findBySprintId(sprintId).stream()
                .map(dtoMapper::toTaskDTO) // Utiliser l'instance du mapper
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponseDTO createTask(CreateTaskRequest request) {
        Sprint sprint = sprintRepository.findById(request.getSprintId())
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        User assignedUser = null;
        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus("À faire");
        task.setSprint(sprint);
        task.setAssignedUser(assignedUser);

        Task savedTask = taskRepository.save(task);
        return dtoMapper.toTaskDTO(savedTask); // Utiliser l'instance du mapper
    }

    @Transactional
    public TaskResponseDTO updateTask(Long taskId, UpdateTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedUser(assignedUser);
        } else {
            task.setAssignedUser(null);
        }

        Task updatedTask = taskRepository.save(task);
        return dtoMapper.toTaskDTO(updatedTask); // Utiliser l'instance du mapper
    }

    @Transactional
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Transactional(readOnly = true)
    public long countCompletedTasksByUserId(Long userId) {
        return taskRepository.countByAssignedUserIdAndStatus(userId, "Terminé");
    }
}
