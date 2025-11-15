import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-indigo-700">
          Bienvenue sur <span className="text-blue-600">Gestion Projets</span>
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          Organisez, collaborez et réussissez vos projets académiques avec intelligence.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <Link to="/login">
            <button className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out">
              Se connecter
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full sm:w-auto bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 transform hover:scale-105 transition duration-300 ease-in-out">
              S'inscrire
            </button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Pour créer un projet, veuillez vous connecter ou créer un compte.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
