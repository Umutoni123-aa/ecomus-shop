import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor — runs before every request
client.interceptors.request.use((config) => {
  console.log(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor — runs after every response
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    console.error(`[ERROR] ${message}`);
    return Promise.reject(error);
  }
);

export default client;