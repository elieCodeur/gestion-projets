package com.example.gestionprojets.entity;

import jakarta.persistence.*;
import java.util.Set; // Importer Set

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Sprint> sprints; // Utiliser Set

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<Message> messages; // Utiliser Set

    // Constructeurs
    public Project() {}

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public User getOwner() { return owner; }
    public Set<Sprint> getSprints() { return sprints; } // Utiliser Set
    public Set<Message> getMessages() { return messages; } // Utiliser Set

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(String status) { this.status = status; }
    public void setOwner(User owner) { this.owner = owner; }
    public void setSprints(Set<Sprint> sprints) { this.sprints = sprints; } // Utiliser Set
    public void setMessages(Set<Message> messages) { this.messages = messages; } // Utiliser Set
}
