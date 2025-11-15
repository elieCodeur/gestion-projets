import React, { useEffect, useState } from "react";

export default function TaskModal({ isOpen, task, onSave, onClose }: { isOpen:boolean; task?:any|null; onSave:(content:string)=>void; onClose:()=>void }) {
  const [content, setContent] = useState("");
  useEffect(()=> setContent(task?.content || ""), [task, isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">{task ? "Modifier tâche" : "Nouvelle tâche"}</h2>
        <textarea value={content} onChange={(e)=> setContent(e.target.value)} placeholder="Contenu" className="w-full border px-3 py-2 rounded mb-4"></textarea>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
          <button onClick={()=> { if(content.trim()) onSave(content); }} className="px-4 py-2 rounded bg-indigo-600 text-white">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
