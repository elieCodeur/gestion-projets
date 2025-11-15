import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Folder, ListTodo, MessageSquare, BarChart2, LogOut } from 'lucide-react';

const MainLayout: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    return null;
  }

  const { logout } = authContext;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          <Link to="/dashboard" className="flex items-center">
            <LayoutDashboard className="mr-2 h-6 w-6" /> Gestion Projets
          </Link>
        </h1>
        <nav className="flex-1">
          <Link to="/dashboard" className="flex items-center py-2 px-4 rounded hover:bg-gray-200 text-gray-700 hover:text-indigo-600 transition duration-200 mb-2">
            <LayoutDashboard className="mr-3 h-5 w-5" /> Tableau de Bord
          </Link>
          <Link to="/projects" className="flex items-center py-2 px-4 rounded hover:bg-gray-200 text-gray-700 hover:text-indigo-600 transition duration-200 mb-2">
            <Folder className="mr-3 h-5 w-5" /> Mes Projets
          </Link>
          <Link to="/tasks" className="flex items-center py-2 px-4 rounded hover:bg-gray-200 text-gray-700 hover:text-indigo-600 transition duration-200 mb-2">
            <ListTodo className="mr-3 h-5 w-5" /> Tâches (Kanban)
          </Link>
          <Link to="/messages" className="flex items-center py-2 px-4 rounded hover:bg-gray-200 text-gray-700 hover:text-indigo-600 transition duration-200 mb-2">
            <MessageSquare className="mr-3 h-5 w-5" /> Messagerie
          </Link>
          <Link to="/stats" className="flex items-center py-2 px-4 rounded hover:bg-gray-200 text-gray-700 hover:text-indigo-600 transition duration-200 mb-2">
            <BarChart2 className="mr-3 h-5 w-5" /> Statistiques
          </Link>
        </nav>
        <div className="mt-auto">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center py-2 px-4 rounded hover:bg-red-100 text-red-600 hover:text-red-800 transition duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
