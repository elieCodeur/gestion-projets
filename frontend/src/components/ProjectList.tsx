import React from "react";

export default function ProjectList() {
  const projects = [
    { id: "1", title: "Projet A", description: "Description A", status: "todo" },
    { id: "2", title: "Projet B", description: "Description B", status: "in_progress" },
  ];

  return (
    <div className="grid gap-4">
      {projects.map(p => (
        <div key={p.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-gray-600 text-sm">{p.description}</p>
            <span className={`text-xs mt-1 inline-block px-2 py-1 rounded ${p.status === "todo" ? "bg-yellow-100 text-yellow-800" : p.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
              {p.status === "todo" ? "À faire" : p.status === "in_progress" ? "En cours" : "Terminé"}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="text-blue-600 hover:text-blue-800">Edit</button>
            <button className="text-red-600 hover:text-red-800">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
