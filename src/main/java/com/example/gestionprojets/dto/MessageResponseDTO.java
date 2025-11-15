package com.example.gestionprojets.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private Long senderId;
    private String senderFirstname;
    private String senderLastname;
    private Long receiverId;
    private String receiverFirstname;
    private String receiverLastname;
    private Long projectId;
    private String projectName;
    private String content;
    private LocalDateTime sentAt;

    public MessageResponseDTO(Long id, Long senderId, String senderFirstname, String senderLastname, Long receiverId, String receiverFirstname, String receiverLastname, Long projectId, String projectName, String content, LocalDateTime sentAt) {
        this.id = id;
        this.senderId = senderId;
        this.senderFirstname = senderFirstname;
        this.senderLastname = senderLastname;
        this.receiverId = receiverId;
        this.receiverFirstname = receiverFirstname;
        this.receiverLastname = receiverLastname;
        this.projectId = projectId;
        this.projectName = projectName;
        this.content = content;
        this.sentAt = sentAt;
    }
}
