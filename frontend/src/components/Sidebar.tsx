import React, { useState } from "react";
import { Home, Folder, User, Moon, Sun } from "lucide-react";

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col p-4">
      <div className="text-2xl font-bold mb-6 text-indigo-600">ProjManager</div>
      <nav className="flex-1 flex flex-col gap-2">
        <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <Home size={20} /> Tableau de bord
        </button>
        <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <Folder size={20} /> Projets
        </button>
        <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <User size={20} /> Profil
        </button>
      </nav>
      <div className="mt-6 flex justify-center">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </aside>
  );
}
