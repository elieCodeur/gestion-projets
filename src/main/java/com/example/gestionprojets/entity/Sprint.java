package com.example.gestionprojets.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set; // Importer Set

@Entity
@Table(name = "sprints")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int sprintNumber;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "sprint", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Task> tasks; // Utiliser Set

    // Constructeurs
    public Sprint() {}

    public Sprint(String name, int sprintNumber, LocalDate startDate, LocalDate endDate, String status, Project project) {
        this.name = name;
        this.sprintNumber = sprintNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.project = project;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public int getSprintNumber() { return sprintNumber; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getStatus() { return status; }
    public Project getProject() { return project; }
    public Set<Task> getTasks() { return tasks; } // Utiliser Set

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSprintNumber(int sprintNumber) { this.sprintNumber = sprintNumber; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setStatus(String status) { this.status = status; }
    public void setProject(Project project) { this.project = project; }
    public void setTasks(Set<Task> tasks) { this.tasks = tasks; } // Utiliser Set
}
