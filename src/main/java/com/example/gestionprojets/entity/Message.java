package com.example.gestionprojets.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    @Column(nullable = false)
    private boolean isRead = false;

    // Constructeurs
    public Message() {}

    // Getters
    public Long getId() { return id; }
    public User getSender() { return sender; }
    public User getReceiver() { return receiver; }
    public Project getProject() { return project; }
    public String getContent() { return content; }
    public LocalDateTime getSentAt() { return sentAt; }
    public boolean isRead() { return isRead; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setSender(User sender) { this.sender = sender; }
    public void setReceiver(User receiver) { this.receiver = receiver; }
    public void setProject(Project project) { this.project = project; }
    public void setContent(String content) { this.content = content; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    public void setRead(boolean read) { isRead = read; }
}
