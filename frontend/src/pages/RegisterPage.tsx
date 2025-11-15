import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../context/AuthContext';

const registerSchema = z.object({
  firstname: z.string().min(1, { message: 'Le prénom est requis' }),
  lastname: z.string().min(1, { message: 'Le nom est requis' }),
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  role: z.enum(['STUDENT', 'TEACHER'], { message: 'Veuillez sélectionner un rôle valide' }),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  if (!authContext) {
    return null; // ou un loader
  }

  const { register: authRegister } = authContext; // Renommer pour éviter le conflit

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await authRegister(data);
      navigate('/dashboard'); // Rediriger vers le tableau de bord après l'inscription
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || "Une erreur s'est produite lors de l'inscription.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700">Inscription</h2>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
              {errors.root.message}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block mb-1 font-medium text-gray-700">Prénom</label>
              <input
                id="firstname"
                {...register('firstname')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.firstname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'
                }`}
                placeholder="Votre prénom"
              />
              {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname.message}</p>}
            </div>
            <div>
              <label htmlFor="lastname" className="block mb-1 font-medium text-gray-700">Nom</label>
              <input
                id="lastname"
                {...register('lastname')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.lastname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'
                }`}
                placeholder="Votre nom"
              />
              {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              id="email"
              {...register('email')}
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'
              }`}
              placeholder="votre.email@exemple.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Mot de passe</label>
            <input
              id="password"
              {...register('password')}
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'
                }`}
              placeholder="********"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Je suis un...</label>
            <select
              id="role"
              {...register('role')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                errors.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'
              }`}
            >
              <option value="">Sélectionner un rôle</option>
              <option value="STUDENT">Étudiant</option>
              <option value="TEACHER">Professeur</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition duration-300 ease-in-out disabled:bg-blue-400 disabled:scale-100"
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <p className="text-center text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
