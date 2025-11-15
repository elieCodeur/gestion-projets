import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, KanbanSquare } from 'lucide-react';
import api from '../services/api';

// Interfaces pour correspondre aux DTOs du backend
interface Sprint {
  id: number;
  name: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: string;
  sprints: Sprint[];
}

const KanbanHubPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects/my-projects');
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la récupération des projets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-4 text-lg text-gray-700">Chargement des projets pour Kanban...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sélectionnez un Sprint pour le Kanban</h1>
      
      {projects.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Vous n'avez encore aucun projet. Créez-en un pour commencer à utiliser le Kanban !</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              
              {project.sprints.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun sprint défini pour ce projet.</p>
              ) : (
                <div className="space-y-2">
                  {[...project.sprints] // Créer une copie pour ne pas muter l'état original
                    .sort((a, b) => a.sprintNumber - b.sprintNumber) // Trier les sprints par leur numéro
                    .map(sprint => (
                      <Link key={sprint.id} to={`/projects/${project.id}/sprints/${sprint.id}/kanban`}>
                        <button className="w-full flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm">
                          <KanbanSquare className="mr-2 h-4 w-4" />
                          {sprint.name}
                        </button>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanHubPage;
