// lib/axios.js
import axios from "axios";


// in production, there's no localhost so we have to make this dynamic

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});


// ✅ Attach token from localStorage automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken"); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
/*
(config) => { ... }

This is a function that gets the Axios request config — the object that includes:
url
method
headers
body (data)
You're allowed to modify this config before the request is sent.
*/
