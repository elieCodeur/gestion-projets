import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Loader2, Folder, CheckCircle, ListTodo, Flag, MessageSquare, BarChart2 } from 'lucide-react'; // Ajout de BarChart2

interface Statistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSprints: number;
  activeSprints: number;
  completedSprints: number;
  totalTasks: number;
  completedTasks: number;
  averageProjectProgress: number;
  unreadMessages: number;
}

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get<Statistics>('/statistics/my-stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la récupération des statistiques.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-4 text-lg text-gray-700">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-100 border border-red-300 rounded-lg">
        <p className="font-bold text-xl">Erreur</p>
        <p>{error || 'Impossible de charger les statistiques.'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Vos Statistiques Globales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projets */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Folder className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <p className="text-gray-600">Projets Totaux</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalProjects}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Folder className="h-8 w-8 text-indigo-500 mr-4" />
          <div>
            <p className="text-gray-600">Projets Actifs</p>
            <p className="text-2xl font-bold text-gray-800">{stats.activeProjects}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-gray-600">Projets Terminés</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completedProjects}</p>
          </div>
        </div>

        {/* Sprints */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Flag className="h-8 w-8 text-purple-500 mr-4" />
          <div>
            <p className="text-gray-600">Sprints Totaux</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalSprints}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Flag className="h-8 w-8 text-orange-500 mr-4" />
          <div>
            <p className="text-gray-600">Sprints Actifs</p>
            <p className="text-2xl font-bold text-gray-800">{stats.activeSprints}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-gray-600">Sprints Terminés</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completedSprints}</p>
          </div>
        </div>

        {/* Tâches */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <ListTodo className="h-8 w-8 text-red-500 mr-4" />
          <div>
            <p className="text-gray-600">Tâches Totales</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalTasks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-gray-600">Tâches Terminées</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completedTasks}</p>
          </div>
        </div>

        {/* Progression Moyenne */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <BarChart2 className="h-8 w-8 text-teal-500 mr-4" />
          <div>
            <p className="text-gray-600">Progression Moyenne des Projets</p>
            <p className="text-2xl font-bold text-gray-800">{stats.averageProjectProgress.toFixed(1)}%</p>
          </div>
        </div>

        {/* Messages non lus */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <MessageSquare className="h-8 w-8 text-pink-500 mr-4" />
          <div>
            <p className="text-gray-600">Messages non lus</p>
            <p className="text-2xl font-bold text-gray-800">{stats.unreadMessages}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
