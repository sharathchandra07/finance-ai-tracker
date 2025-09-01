import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // your backend server
});

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
