package com.example.gestionprojets.controller;

import com.example.gestionprojets.dto.MessageResponseDTO;
import com.example.gestionprojets.dto.SendMessageRequest;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(@RequestBody SendMessageRequest request, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        MessageResponseDTO sentMessage = messageService.sendMessage(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(sentMessage);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MessageResponseDTO>> getProjectMessages(@PathVariable Long projectId) {
        List<MessageResponseDTO> messages = messageService.getProjectMessages(projectId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/count/unread")
    public ResponseEntity<Map<String, Long>> countUnreadMessages(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        long count = messageService.countUnreadMessages(currentUser.getId());
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @PutMapping("/project/{projectId}/mark-as-read")
    public ResponseEntity<Void> markProjectMessagesAsRead(@PathVariable Long projectId, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        messageService.markMessagesAsRead(projectId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
