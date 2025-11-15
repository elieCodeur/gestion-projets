package com.example.gestionprojets.controller;

import com.example.gestionprojets.dto.CreateSprintRequest;
import com.example.gestionprojets.dto.SprintResponseDTO;
import com.example.gestionprojets.dto.UpdateSprintRequest;
import com.example.gestionprojets.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
public class SprintController {

    private final SprintService sprintService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SprintResponseDTO>> getSprintsByProjectId(@PathVariable Long projectId) {
        List<SprintResponseDTO> sprints = sprintService.getSprintsByProjectId(projectId);
        return ResponseEntity.ok(sprints);
    }

    @PostMapping
    public ResponseEntity<SprintResponseDTO> createSprint(@RequestBody CreateSprintRequest request) {
        SprintResponseDTO createdSprint = sprintService.createSprint(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSprint);
    }

    @PutMapping("/{sprintId}")
    public ResponseEntity<SprintResponseDTO> updateSprint(@PathVariable Long sprintId, @RequestBody UpdateSprintRequest request) {
        SprintResponseDTO updatedSprint = sprintService.updateSprint(sprintId, request);
        return ResponseEntity.ok(updatedSprint);
    }

    @DeleteMapping("/{sprintId}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long sprintId) {
        sprintService.deleteSprint(sprintId);
        return ResponseEntity.noContent().build();
    }
}
