import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { PlusCircle, Edit, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  sprintId: number;
  assignedUserId?: number;
  assignedUserFirstname?: string;
  assignedUserLastname?: string;
}

interface Column {
  id: string;
  title: string;
  status: string;
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'À faire', status: 'À faire' },
  { id: 'in_progress', title: 'En cours', status: 'En cours' },
  { id: 'done', title: 'Terminé', status: 'Terminé' },
];

const KanbanBoard: React.FC = () => {
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'À faire',
    assignedUserId: undefined as number | undefined,
  });

  useEffect(() => {
    if (sprintId) {
      fetchTasks(Number(sprintId));
    }
  }, [sprintId]);

  const fetchTasks = async (sId: number) => {
    try {
      setLoading(true);
      const response = await api.get<Task[]>(`/tasks/sprint/${sId}`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la récupération des tâches.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!form.title.trim() || !sprintId) return;
    try {
      const newTask = {
        title: form.title,
        description: form.description,
        sprintId: Number(sprintId),
        assignedUserId: form.assignedUserId,
      };
      const response = await api.post<Task>('/tasks', newTask);
      setTasks((prev) => [...prev, response.data]);
      setShowModal(false);
      setForm({ title: '', description: '', status: 'À faire', assignedUserId: undefined });
    } catch (err) {
      setError('Erreur lors de la création de la tâche.');
      console.error(err);
    }
  };

  const handleUpdateTask = async () => {
    if (!currentTask || !sprintId) return;
    try {
      const updatedTaskData = {
        title: form.title,
        description: form.description,
        status: form.status,
        assignedUserId: form.assignedUserId,
      };
      const response = await api.put<Task>(`/tasks/${currentTask.id}`, updatedTaskData);
      setTasks((prev) => prev.map((t) => (t.id === currentTask.id ? response.data : t)));
      setShowModal(false);
      setCurrentTask(null);
      setForm({ title: '', description: '', status: 'À faire', assignedUserId: undefined });
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche.');
      console.error(err);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const draggedTask = tasks.find((task) => task.id === Number(draggableId));
    if (!draggedTask) return;

    const newStatus = initialColumns.find((col) => col.id === destination.droppableId)?.status;
    if (!newStatus) return;

    const updatedTasks = tasks.map((task) =>
      task.id === Number(draggableId) ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${draggedTask.id}`, { status: newStatus });
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut de la tâche.');
      console.error(err);
      setTasks(tasks);
    }
  };

  const openCreateModal = () => {
    setCurrentTask(null);
    setForm({ title: '', description: '', status: 'À faire', assignedUserId: undefined });
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUserId: task.assignedUserId,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-4 text-lg text-gray-700">Chargement du tableau Kanban...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-100 border border-red-300 rounded-lg">
        <p className="font-bold text-xl">Erreur</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition duration-200 mr-4"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Tableau Kanban</h1>
          <p className="text-sm text-gray-500">Projet {projectId} - Sprint {sprintId}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Ajouter une tâche
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialColumns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white shadow-lg rounded-xl p-4 min-h-[400px] flex flex-col"
                >
                  <h2 className="font-semibold text-lg mb-3 border-b pb-2 text-gray-800">{column.title}</h2>
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                    {tasks
                      .filter((task) => task.status === column.status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-grab"
                            >
                              <h3 className="font-semibold text-gray-800">{task.title}</h3>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              {task.assignedUserFirstname && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Assigné à: {task.assignedUserFirstname} {task.assignedUserLastname}
                                </p>
                              )}
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => openEditModal(task)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal de création/édition de tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {currentTask ? 'Modifier la tâche' : 'Ajouter une nouvelle tâche'}
            </h2>
            <input
              type="text"
              placeholder="Titre de la tâche"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 w-full mb-3 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <textarea
              placeholder="Description de la tâche"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-gray-300 w-full mb-3 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
            {currentTask && (
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-gray-300 w-full mb-3 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            )}
            <input
              type="number"
              placeholder="ID utilisateur assigné (optionnel)"
              value={form.assignedUserId || ''}
              onChange={(e) =>
                setForm({ ...form, assignedUserId: e.target.value ? Number(e.target.value) : undefined })
              }
              className="border border-gray-300 w-full mb-4 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-300"
              >
                Annuler
              </button>
              <button
                onClick={currentTask ? handleUpdateTask : handleCreateTask}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-300"
              >
                {currentTask ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
