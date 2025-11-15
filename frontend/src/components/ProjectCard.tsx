import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function ProjectCard({ project, onEdit, onDelete }: { project: any; onEdit: (p:any)=>void; onDelete:(id:string)=>void }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button onClick={() => onEdit(project)} className="text-yellow-600"><Edit size={16}/></button>
          <button onClick={() => onDelete(project.id)} className="text-red-600"><Trash2 size={16}/></button>
        </div>
      </div>
    </div>
  );
}
