import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Loader2, Edit, Trash2 } from 'lucide-react';
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

const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projectName}" ? Cette action est irréversible.`)) return;
    
    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects(); // Recharger la liste des projets
    } catch (err) {
      setError('Erreur lors de la suppression du projet.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-4 text-gray-600">Chargement des projets...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mes Projets</h1>
          <p className="text-gray-600">Gérez tous vos projets ici.</p>
        </div>
        <Link to="/projects/new">
          <button className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer un projet
          </button>
        </Link>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
                    <button className="flex items-center bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mr-2">
                      <Eye className="mr-2 h-5 w-5" />
                      Voir
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="flex items-center bg-red-500 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                  >
                    <Trash2 className="mr-2 h-5 w-5" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;
