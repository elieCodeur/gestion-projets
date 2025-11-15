import React from "react";

export default function StatsBoard() {
  const stats = { todo: 3, in_progress: 5, done: 2 };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-semibold">À faire</h3>
        <p className="text-3xl font-bold mt-2">{stats.todo}</p>
      </div>
      <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-semibold">En cours</h3>
        <p className="text-3xl font-bold mt-2">{stats.in_progress}</p>
      </div>
      <div className="bg-green-100 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-semibold">Terminé</h3>
        <p className="text-3xl font-bold mt-2">{stats.done}</p>
      </div>
    </div>
  );
}
