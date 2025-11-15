import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: number;
  senderId: number;
  senderFirstname: string;
  senderLastname: string;
  content: string;
  sentAt: string;
}

const MessagePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessageContent, setNewMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId) {
      fetchMessages(Number(projectId));
    }
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (pId: number) => {
    try {
      setLoading(true);
      const response = await api.get<Message[]>(`/messages/project/${pId}`);
      setMessages(response.data);
      setError(null);
      if (user && response.data.length > 0) {
        await api.put(`/messages/project/${pId}/mark-as-read`);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des messages.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || !projectId) return;
    try {
      const request = {
        projectId: Number(projectId),
        content: newMessageContent,
      };
      const response = await api.post<Message>('/messages', request);
      setMessages((prev) => [...prev, response.data]);
      setNewMessageContent('');
    } catch (err) {
      setError("Erreur lors de l'envoi du message.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="ml-4 text-lg text-gray-700">Chargement des messages...</p>
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
    <div className="p-6 bg-gray-50 min-h-full flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition duration-200 mr-4"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Messagerie du Projet {projectId}</h1>
      </div>

      <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto mb-4 flex flex-col space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucun message pour ce projet. Soyez le premier à envoyer un message !</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                  msg.senderId === user?.id
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {msg.senderId === user?.id ? 'Vous' : `${msg.senderFirstname} ${msg.senderLastname}`}
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <div className="text-right text-xs mt-1 opacity-80">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
        <textarea
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Écrivez votre message..."
          className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none mr-4"
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          className="flex items-center bg-indigo-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          <Send className="mr-2 h-5 w-5" /> Envoyer
        </button>
      </div>
    </div>
  );
};

export default MessagePage;
