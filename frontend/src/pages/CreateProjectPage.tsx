import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2, ArrowLeft } from 'lucide-react'; // Importer ArrowLeft

// ... (le reste du code du schéma reste le même)

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  // ... (le reste du code des états et fonctions reste le même)

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition duration-200 mr-4"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Créer un nouveau projet</h1>
      </div>
      
      {/* Le reste du JSX reste le même */}
    </div>
  );
};

export default CreateProjectPage;
