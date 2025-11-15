package com.example.gestionprojets.service;

import com.example.gestionprojets.dto.DTOMapper;
import com.example.gestionprojets.dto.MessageResponseDTO;
import com.example.gestionprojets.dto.SendMessageRequest;
import com.example.gestionprojets.entity.Message;
import com.example.gestionprojets.entity.Project;
import com.example.gestionprojets.entity.User;
import com.example.gestionprojets.repository.MessageRepository;
import com.example.gestionprojets.repository.ProjectRepository;
import com.example.gestionprojets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final DTOMapper dtoMapper; // Injecter le DTOMapper

    @Transactional
    public MessageResponseDTO sendMessage(SendMessageRequest request, User sender) {
        User receiver = null;
        if (request.getReceiverId() != null) {
            receiver = userRepository.findById(request.getReceiverId())
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));
        }

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
        }

        if (receiver == null && project == null) {
            throw new RuntimeException("Message must have a receiver or be associated with a project.");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setProject(project);
        message.setContent(request.getContent());
        message.setSentAt(LocalDateTime.now());
        message.setRead(false);

        Message savedMessage = messageRepository.save(message);
        return dtoMapper.toMessageDTO(savedMessage); // Utiliser l'instance du mapper
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getProjectMessages(Long projectId) {
        return messageRepository.findByProjectIdOrderBySentAtAsc(projectId).stream()
                .map(dtoMapper::toMessageDTO) // Utiliser l'instance du mapper
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countUnreadMessages(Long userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markMessagesAsRead(Long projectId, Long userId) {
        List<Message> messages = messageRepository.findByProjectIdAndReceiverIdAndIsReadFalse(projectId, userId);
        messages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(messages);
    }
}