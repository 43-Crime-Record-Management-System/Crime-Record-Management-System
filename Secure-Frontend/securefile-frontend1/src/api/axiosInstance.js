import axios from "axios";
import { AUTH_API_URL } from "../config";

const baseAuthURL = AUTH_API_URL.replace(/\/auth$/, "");

const axiosInstance = axios.create({
  baseURL: baseAuthURL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;