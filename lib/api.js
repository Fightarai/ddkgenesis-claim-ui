const res = await axios.get(`https://ddkgenesis-claim-api-to5k4.kinsta.app/api/claim-check?username=${username}`);
...
const [baseStats, distribution] = await Promise.all([
  axios.get("https://ddkgenesis-claim-api-to5k4.kinsta.app/api/claim-stats"),
  axios.get("https://ddkgenesis-claim-api-to5k4.kinsta.app/api/dnc-distribution")
]);

const api = axios.create({
  baseURL: "/api", // or empty if full URLs used
  timeout: 30000 // ⏱ Increase timeout to 30 seconds
});

export default api;
