import { useState } from "react";
import api from "../lib/api";

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const checkClaim = async () => {
    try {
      const res = await api.get(`/api/claim-check?username=${username}`);
      setResult(res.data);
      setError("");
    } catch (err) {
      setResult(null);
      setError("User not found or error. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🔍 Check Your vGRAMX</h1>
      <input
        type="text"
        className="text-black px-4 py-2 rounded w-64"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className="mt-4 bg-green-500 px-4 py-2 rounded"
        onClick={checkClaim}
      >
        Check Now
      </button>

      {result && (
        <div className="bg-gray-800 p-6 rounded mt-6 max-w-lg w-full text-left">
          <p><strong>👤 Username:</strong> {result.username}</p>
          <p><strong>💎 Eligible:</strong> {result.vgramx_eligible} vGRAMX</p>
          <p><strong>🧠 Suggestion:</strong> {result.suggestion}</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
}