import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import KanbanBoard from "../components/KanbanBoard";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem("projects-teacher")||"[]"); } catch { return []; }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any|undefined>(undefined);

  const open = (p?:any)=> { setEditing(p); setModalOpen(true); };
  const save = (p:any) => {
    setProjects(prev => {
      const found = prev.find(x=>x.id===p.id);
      const next = found ? prev.map(x=> x.id===p.id ? p : x) : [...prev, p];
      localStorage.setItem("projects-teacher", JSON.stringify(next));
      return next;
    });
    setModalOpen(false);
  };
  const del = (id:string)=> {
    setProjects(prev => { const next = prev.filter(p=>p.id!==id); localStorage.setItem("projects-teacher", JSON.stringify(next)); return next; });
  };

  return (
    <div className="flex h-screen">
      <Sidebar role="teacher" />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Projets</h1>
            <button onClick={()=>open()} className="px-4 py-2 bg-indigo-600 text-white rounded">+ Nouveau</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => <ProjectCard key={p.id} project={p} onEdit={open} onDelete={del} />)}
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4">Kanban</h2>
          <KanbanBoard storageKey="kanban-teacher" />
        </main>
      </div>

      {modalOpen && <ProjectModal isOpen={modalOpen} project={editing} onSave={save} onClose={()=>setModalOpen(false)} />}
    </div>
  );
}
