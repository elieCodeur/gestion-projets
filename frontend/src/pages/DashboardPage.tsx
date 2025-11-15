import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Book, BarChart2, Bell, Loader2, Eye } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: string;
}

const getStatusClasses = (status?: string) => {
  switch (status) {
    case 'En cours':
      return 'bg-blue-100 text-blue-800';
    case 'Terminé':
      return 'bg-green-100 text-green-800';
    case 'Nouveau':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, tasksCountResponse, messagesCountResponse] = await Promise.all([
          api.get('/projects/my-projects'),
          api.get('/tasks/count/completed'),
          api.get('/messages/count/unread')
        ]);

        setProjects(projectsResponse.data);
        setCompletedTasksCount(tasksCountResponse.data.count);
        setUnreadMessagesCount(messagesCountResponse.data.count);
        setError(null);
      } catch (err) {
        setError('Erreur lors de la récupération des données du tableau de bord.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bonjour, {user?.firstname || 'Étudiant'} !</h1>
          <p className="text-gray-600">Bienvenue sur votre tableau de bord.</p>
        </div>
        <Link to="/projects/new">
          <button className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer un projet
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Book className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <p className="text-gray-600">Projets Actifs</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : projects.filter(p => p.status !== 'Terminé').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <BarChart2 className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-gray-600">Tâches Terminées</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : completedTasksCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Bell className="h-8 w-8 text-red-500 mr-4" />
          <div>
            <p className="text-gray-600">Notifications</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : unreadMessagesCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes Projets</h2>
        {loading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="ml-4 text-gray-600">Chargement des projets...</p>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Vous n'avez encore aucun projet. Créez-en un pour commencer !</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition">
                  <div className="mb-4 sm:mb-0">
                    <p className="font-bold text-lg text-gray-800">{project.name}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClasses(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="w-full sm:w-1/3 flex items-center justify-end">
                    <div className="w-full mr-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progression</span>
                        <span className="text-sm font-semibold text-gray-800">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                    <Link to={`/projects/${project.id}`}>
                      <button className="flex items-center bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                        <Eye className="mr-2 h-5 w-5" />
                        Voir
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
