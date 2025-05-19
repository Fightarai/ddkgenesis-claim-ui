import axios from "axios";

const api = axios.create({
  baseURL: "/api", // or empty if full URLs used
  timeout: 50000 // ⏱ Increase timeout to 30 seconds
});

export default api;
