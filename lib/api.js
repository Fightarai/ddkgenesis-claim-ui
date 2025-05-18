import axios from "axios";

const api = axios.create({
  baseURL: "https://ddkgenesis-claim-api-to5k4.kinsta.app", // your backend
  timeout: 10000
});

export default api;