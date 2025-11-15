// src/utils/api.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attacher token si présent (pour chaque requête)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      // typesafe assign
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Gestion globale des erreurs (ex : 401)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
      // Optionnel: redirection centralisée depuis l'app
    }
    return Promise.reject(err);
  }
);

export default api;
