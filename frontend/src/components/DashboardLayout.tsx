// src/pages/Dashboard.tsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { Project } from "../components/types";
import KanbanBoard from "../components/KanbanBoard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const openModal = (project?: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const saveProject = (project: Project) => {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === project.id);
      return exists ? prev.map((p) => (p.id === project.id ? project : p)) : [...prev, project];
    });
    setModalOpen(false);
  };

  const deleteProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="flex h-screen">
      <Sidebar role={user!.role} />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">{user?.role === "teacher" ? "Projets à gérer" : "Mes projets"}</h1>
        <button onClick={() => openModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">+ Nouveau projet</button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={openModal} onDelete={deleteProject} />
          ))}
        </div>
        <h2 className="text-xl font-bold mt-10 mb-4">Kanban</h2>
        <KanbanBoard />
      </div>
      {modalOpen && <ProjectModal isOpen={modalOpen} project={editingProject} onSave={saveProject} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
