import React, { useEffect, useState } from "react";

export default function ProjectModal({ isOpen, project, onSave, onClose }: { isOpen:boolean; project?:any; onSave:(p:any)=>void; onClose:()=>void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  useEffect(()=> {
    if (project) { setName(project.name); setDescription(project.description); } else { setName(""); setDescription(""); }
  }, [project, isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">{project ? "Modifier projet" : "Nouveau projet"}</h2>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nom du projet" className="w-full border px-3 py-2 rounded mb-3"/>
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 rounded mb-4"></textarea>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
          <button onClick={()=> onSave({ id: project?.id || Date.now().toString(), name, description, tasks: project?.tasks || [] })} className="px-4 py-2 rounded bg-indigo-600 text-white">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
