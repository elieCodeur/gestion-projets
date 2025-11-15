package com.example.gestionprojets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendMessageRequest {
    private Long receiverId; // ID du destinataire (pour message privé)
    private Long projectId;  // ID du projet (pour message de groupe/projet)
    private String content;
}
