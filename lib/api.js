// lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "", // Leave blank if you use full URLs in index.js
  timeout: 30000
});

export default api;