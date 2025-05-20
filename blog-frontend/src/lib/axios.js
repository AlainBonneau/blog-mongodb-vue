import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_GRAPHQL_URL, 
  withCredentials: true, // si tu gères les cookies/session, sinon retire cette ligne
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
