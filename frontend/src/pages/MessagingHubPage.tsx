import React from 'react';
import { MessageSquare } from 'lucide-react';

const MessagingHubPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-full flex flex-col items-center justify-center text-center">
      <MessageSquare className="h-16 w-16 text-indigo-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">Messagerie</h1>
      <p className="text-gray-600 mt-2 max-w-md">
        Ceci est le hub central pour toutes vos communications.
        Pour l'instant, la messagerie est organisée par projet.
      </p>
      <p className="text-gray-600 mt-2 max-w-md">
        Veuillez sélectionner un projet depuis la page "Mes Projets" pour voir et envoyer des messages.
      </p>
    </div>
  );
};

export default MessagingHubPage;
