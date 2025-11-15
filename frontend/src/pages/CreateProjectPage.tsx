import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

// Mise à jour du schéma pour inclure les sprints
const projectSchema = z.object({
  name: z.string().min(3, { message: 'Le nom du projet doit contenir au moins 3 caractères.' }),
  description: z.string().optional(),
  numberOfSprints: z.coerce.number().min(1, { message: 'Il doit y avoir au moins 1 sprint.' }).max(20, { message: 'Maximum 20 sprints.' }),
  sprintDurationInDays: z.coerce.number().min(7, { message: 'Un sprint doit durer au moins 7 jours.' }).max(30, { message: 'Un sprint ne peut pas dépasser 30 jours.' }),
});

type ProjectFormInputs = z.infer<typeof projectSchema>;

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInputs>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      sprintDurationInDays: 14, // Valeur par défaut de 2 semaines
    },
  });

  const onSubmit = async (data: ProjectFormInputs) => {
    try {
      setServerError(null);
      await api.post('/projects', data);
      navigate('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Une erreur s'est produite lors de la création du projet.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Créer un nouveau projet</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-300">
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Nom du projet <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="numberOfSprints" className="block mb-2 font-medium text-gray-700">
                Nombre de Sprints <span className="text-red-500">*</span>
              </label>
              <input
                id="numberOfSprints"
                type="number"
                {...register('numberOfSprints')}
                className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${
                  errors.numberOfSprints ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.numberOfSprints && <p className="mt-1 text-sm text-red-600">{errors.numberOfSprints.message}</p>}
            </div>
            <div>
              <label htmlFor="sprintDurationInDays" className="block mb-2 font-medium text-gray-700">
                Durée d'un sprint (en jours) <span className="text-red-500">*</span>
              </label>
              <input
                id="sprintDurationInDays"
                type="number"
                {...register('sprintDurationInDays')}
                className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${
                  errors.sprintDurationInDays ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.sprintDurationInDays && <p className="mt-1 text-sm text-red-600">{errors.sprintDurationInDays.message}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {isSubmitting ? 'Création...' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
