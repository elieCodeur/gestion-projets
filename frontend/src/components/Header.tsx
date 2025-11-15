import React, { useState } from "react";
import { PlusCircle, Bell, User } from "lucide-react";

interface HeaderProps {
  onCreateProject: () => void;
}

export default function Header({ onCreateProject }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow-md rounded-xl mb-6">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Gestion des projets</h1>

      <div className="flex items-center gap-4">
        {/* Bouton créer projet */}
        <button
          onClick={onCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          <PlusCircle size={20} /> Nouveau projet
        </button>

        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Menu utilisateur */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <User size={20} />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Profil
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Paramètres
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
