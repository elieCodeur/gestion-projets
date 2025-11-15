package com.example.gestionprojets.dto;

public class ProjectRequest {
    private String title;
    private String description;
    private String status;
    private Long creatorId; // ID du créateur (User)

    public ProjectRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }
}
