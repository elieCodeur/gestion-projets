import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  if (!authContext) {
    return null; // ou un loader
  }

  const { login } = authContext;

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || "Email ou mot de passe incorrect.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Content de vous revoir !</h2>
          <p className="mt-2 text-gray-600">Connectez-vous pour accéder à vos projets.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg border border-red-300">
              {errors.root.message}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Adresse Email</label>
            <input
              id="email"
              {...register('email')}
              type="email"
              className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="votre.email@exemple.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Mot de passe</label>
            <input
              id="password"
              {...register('password')}
              type="password"
              className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="********"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white font-semibold bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out disabled:bg-indigo-400 disabled:scale-100"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Créez-en un !
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
