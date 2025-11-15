import React from "react";
import { PlusCircle } from "lucide-react";

interface NavbarProps {
  onAddProject: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddProject }) => {
  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3">
      <h2 className="text-xl font-bold text-gray-800">Tableau de projets</h2>
      <button
        onClick={onAddProject}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
      >
        <PlusCircle size={20} />
        Nouveau projet
      </button>
    </div>
  );
};

export default Navbar;
