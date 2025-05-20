import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000", 
  withCredentials: true, // si tu gères les cookies/session, sinon retire cette ligne
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
