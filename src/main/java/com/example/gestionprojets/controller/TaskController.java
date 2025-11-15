package com.example.gestionprojets.controller;

import com.example.gestionprojets.dto.CreateTaskRequest;
import com.example.gestionprojets.dto.TaskResponseDTO;
import com.example.gestionprojets.dto.UpdateTaskRequest;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/sprint/{sprintId}") // Modifier le chemin pour utiliser sprintId
    public ResponseEntity<List<TaskResponseDTO>> getTasksBySprintId(@PathVariable Long sprintId) {
        List<TaskResponseDTO> tasks = taskService.getTasksBySprintId(sprintId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody CreateTaskRequest request) {
        TaskResponseDTO createdTask = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long taskId, @RequestBody UpdateTaskRequest request) {
        TaskResponseDTO updatedTask = taskService.updateTask(taskId, request);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count/completed")
    public ResponseEntity<Map<String, Long>> countCompletedTasks(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        long count = taskService.countCompletedTasksByUserId(currentUser.getId());
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }
}
