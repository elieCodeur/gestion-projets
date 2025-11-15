import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2, KanbanSquare, Calendar, Flag, MessageSquare, Edit, Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Interfaces
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

// Schemas de validation
const editProjectSchema = z.object({
  name: z.string().min(3, { message: 'Le nom du projet doit contenir au moins 3 caractères.' }),
  description: z.string().optional(),
  status: z.string(),
});
type EditProjectFormInputs = z.infer<typeof editProjectSchema>;

const sprintSchema = z.object({
  name: z.string().min(3, { message: 'Le nom du sprint doit contenir au moins 3 caractères.' }),
  startDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), { message: 'Date de début invalide.' }),
  endDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), { message: 'Date de fin invalide.' }),
  status: z.string().optional(),
});
type SprintFormInputs = z.infer<typeof sprintSchema>;

// Fonctions utilitaires
const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Actif': return 'bg-blue-100 text-blue-800';
    case 'Terminé': return 'bg-green-100 text-green-800';
    case 'À venir': return 'bg-gray-100 text-gray-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

// Composant principal
const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register: registerProject,
    handleSubmit: handleProjectSubmit,
    formState: { errors: projectErrors, isSubmitting: projectIsSubmitting },
    reset: resetProjectForm,
  } = useForm<EditProjectFormInputs>({ resolver: zodResolver(editProjectSchema) });

  const {
    register: registerSprint,
    handleSubmit: handleSprintSubmit,
    formState: { errors: sprintErrors, isSubmitting: sprintIsSubmitting },
    reset: resetSprintForm,
  } = useForm<SprintFormInputs>({ resolver: zodResolver(sprintSchema) });

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const response = await api.get<Project>(`/projects/${projectId}`);
      setProject(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la récupération des détails du projet.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Gestion du Projet ---
  const handleEditProject = (data: EditProjectFormInputs) => {
    if (!project) return;
    setServerError(null);
    api.put(`/projects/${project.id}`, data)
      .then(() => {
        setShowEditProjectModal(false);
        fetchProjectDetails();
      })
      .catch((err) => setServerError(err.response?.data?.message || "Une erreur s'est produite."));
  };

  const handleDeleteProject = () => {
    if (!project || !window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`)) return;
    api.delete(`/projects/${project.id}`)
      .then(() => navigate('/projects'))
      .catch((err) => setServerError(err.response?.data?.message || "Une erreur s'est produite."));
  };

  const openEditProjectModal = () => {
    if (project) {
      resetProjectForm({ name: project.name, description: project.description, status: project.status });
      setShowEditProjectModal(true);
    }
  };

  // --- Gestion des Sprints ---
  const handleCreateSprint = (data: SprintFormInputs) => {
    if (!projectId) return;
    setServerError(null);
    api.post('/sprints', { ...data, projectId: Number(projectId) })
      .then(() => {
        setShowSprintModal(false);
        fetchProjectDetails();
      })
      .catch((err) => setServerError(err.response?.data?.message || "Une erreur s'est produite."));
  };

  const handleUpdateSprint = (data: SprintFormInputs) => {
    if (!currentSprint) return;
    setServerError(null);
    api.put(`/sprints/${currentSprint.id}`, data)
      .then(() => {
        setShowSprintModal(false);
        fetchProjectDetails();
      })
      .catch((err) => setServerError(err.response?.data?.message || "Une erreur s'est produite."));
  };

  const handleDeleteSprint = (sprintId: number, sprintName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le sprint "${sprintName}" ?`)) return;
    api.delete(`/sprints/${sprintId}`)
      .then(() => fetchProjectDetails())
      .catch((err) => setServerError(err.response?.data?.message || "Une erreur s'est produite."));
  };

  const openCreateSprintModal = () => {
    setCurrentSprint(null);
    resetSprintForm({ name: '', startDate: '', endDate: '', status: 'À venir' });
    setShowSprintModal(true);
  };

  const openEditSprintModal = (sprint: Sprint) => {
    setCurrentSprint(sprint);
    resetSprintForm({
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
    });
    setShowSprintModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;
  }

  if (error || !project) {
    return <div className="text-center p-8 text-red-600">{error || 'Projet non trouvé.'}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition duration-200 mr-4">
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Détails du Projet</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </div>
          <div className="flex space-x-3">
            <Link to={`/projects/${project.id}/messages`}><button className="flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"><MessageSquare className="mr-2 h-5 w-5" /> Messagerie</button></Link>
            <button onClick={openEditProjectModal} className="flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"><Edit className="mr-2 h-5 w-5" /> Modifier</button>
            <button onClick={handleDeleteProject} className="flex items-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300"><Trash2 className="mr-2 h-5 w-5" /> Supprimer</button>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm font-semibold text-gray-700">Progression globale : {project.progress}%</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Sprints</h2>
          <button onClick={openCreateSprintModal} className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"><PlusCircle className="mr-2 h-5 w-5" /> Ajouter un Sprint</button>
        </div>
        <div className="space-y-4">
          {project.sprints.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun sprint pour ce projet. Créez-en un !</p>
          ) : (
            [...project.sprints]
              .sort((a, b) => a.sprintNumber - b.sprintNumber)
              .map(sprint => (
                <div key={sprint.id} className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{sprint.name} (Sprint {sprint.sprintNumber})</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClasses(sprint.status)}`}><Flag className="inline-block mr-1 h-3 w-3" />{sprint.status}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0"><Calendar className="mr-2 h-4 w-4" />{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={() => openEditSprintModal(sprint)} className="flex items-center bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"><Edit className="mr-2 h-5 w-5" /> Modifier</button>
                    <button onClick={() => handleDeleteSprint(sprint.id, sprint.name)} className="flex items-center bg-red-500 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300"><Trash2 className="mr-2 h-5 w-5" /> Supprimer</button>
                    <Link to={`/projects/${project.id}/sprints/${sprint.id}/kanban`}><button className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"><KanbanSquare className="mr-2 h-5 w-5" /> Voir Kanban</button></Link>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showEditProjectModal && project && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Modifier le projet</h2>
            <form onSubmit={handleProjectSubmit(handleEditProject)} className="space-y-4">
              {serverError && <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-300">{serverError}</div>}
              <div>
                <label htmlFor="editName" className="block mb-2 font-medium text-gray-700">Nom du projet</label>
                <input id="editName" {...registerProject('name')} className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${projectErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                {projectErrors.name && <p className="mt-1 text-sm text-red-600">{projectErrors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="editDescription" className="block mb-2 font-medium text-gray-700">Description</label>
                <textarea id="editDescription" {...registerProject('description')} rows={3} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="editStatus" className="block mb-2 font-medium text-gray-700">Statut</label>
                <select id="editStatus" {...registerProject('status')} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500">
                  <option value="Nouveau">Nouveau</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditProjectModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-300">Annuler</button>
                <button type="submit" disabled={projectIsSubmitting} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-300">{projectIsSubmitting ? 'Modification...' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSprintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{currentSprint ? 'Modifier le Sprint' : 'Ajouter un nouveau Sprint'}</h2>
            <form onSubmit={handleSprintSubmit(currentSprint ? handleUpdateSprint : handleCreateSprint)} className="space-y-4">
              {serverError && <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-300">{serverError}</div>}
              <div>
                <label htmlFor="sprintName" className="block mb-2 font-medium text-gray-700">Nom du Sprint</label>
                <input id="sprintName" {...registerSprint('name')} className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${sprintErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                {sprintErrors.name && <p className="mt-1 text-sm text-red-600">{sprintErrors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="startDate" className="block mb-2 font-medium text-gray-700">Date de début</label>
                <input id="startDate" type="date" {...registerSprint('startDate')} className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${sprintErrors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                {sprintErrors.startDate && <p className="mt-1 text-sm text-red-600">{sprintErrors.startDate.message}</p>}
              </div>
              <div>
                <label htmlFor="endDate" className="block mb-2 font-medium text-gray-700">Date de fin</label>
                <input id="endDate" type="date" {...registerSprint('endDate')} className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${sprintErrors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                {sprintErrors.endDate && <p className="mt-1 text-sm text-red-600">{sprintErrors.endDate.message}</p>}
              </div>
              {currentSprint && (
                <div>
                  <label htmlFor="sprintStatus" className="block mb-2 font-medium text-gray-700">Statut</label>
                  <select id="sprintStatus" {...registerSprint('status')} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500">
                    <option value="À venir">À venir</option>
                    <option value="Actif">Actif</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowSprintModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-300">Annuler</button>
                <button type="submit" disabled={sprintIsSubmitting} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-300">{sprintIsSubmitting ? (currentSprint ? 'Modification...' : 'Création...') : (currentSprint ? 'Enregistrer' : 'Créer')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
