package com.example.gestionprojets.repository;

import com.example.gestionprojets.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Trouver tous les messages pour un projet donné, triés par date d'envoi
    List<Message> findByProjectIdOrderBySentAtAsc(Long projectId);

    // Trouver tous les messages entre deux utilisateurs, triés par date d'envoi
    List<Message> findBySenderIdAndReceiverIdOrderBySentAtAsc(Long senderId, Long receiverId);
    List<Message> findByReceiverIdAndSenderIdOrderBySentAtAsc(Long receiverId, Long senderId);

    // Nouvelle méthode pour compter les messages non lus d'un utilisateur (tous projets confondus)
    long countByReceiverIdAndIsReadFalse(Long receiverId);

    // Nouvelle méthode pour trouver les messages non lus d'un projet pour un utilisateur
    List<Message> findByProjectIdAndReceiverIdAndIsReadFalse(Long projectId, Long receiverId);

    // Nouvelle méthode pour compter les messages non lus d'un projet pour un utilisateur
    long countByProjectIdAndReceiverIdAndIsReadFalse(Long projectId, Long receiverId);
}
