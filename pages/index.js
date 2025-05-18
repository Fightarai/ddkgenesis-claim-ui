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
      setError("❌ User not found or server error.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1e052d] to-[#130013] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-500">
        🔍 Check Your vGRAMX
      </h1>

      {/* INPUT BOX */}
      <div className="relative w-full max-w-sm mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-5 py-3 bg-black border-2 border-purple-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
        />
      </div>

      <button
        onClick={checkClaim}
        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-black font-bold px-6 py-2 rounded-xl shadow-xl transition-all"
      >
        ✅ Check Now
      </button>

      {result && (
  <div className="mt-10 bg-[#180022]/90 border-2 border-purple-700 rounded-xl p-6 w-full max-w-xl text-left shadow-xl backdrop-blur-lg space-y-2">
    <p>👤 <span className="text-purple-200 font-semibold">Username:</span> {result.username}</p>
    <p>📛 <span className="text-purple-200 font-semibold">Full Name:</span> {result.name || "-"}</p>
    <p>📧 <span className="text-purple-200 font-semibold">Email:</span> {result.email || "-"}</p>
    <p>📱 <span className="text-purple-200 font-semibold">Phone:</span> {result.phone || "-"}</p>
    <p>🌍 <span className="text-purple-200 font-semibold">Country:</span> {result.county || "-"}</p>
    <p>📅 <span className="text-purple-200 font-semibold">Join Date:</span> {new Date(result.created).toLocaleDateString()}</p>
    <p>💎 <span className="text-blue-300 font-semibold">Eligible:</span> {result.vgramx_eligible} vGRAMX</p>
    <p>🧠 <span className="text-pink-400 font-semibold">Vyra77 Suggestion:</span> {result.suggestion}</p>
  </div>
)}


      {error && <p className="mt-6 text-red-500">{error}</p>}
    </div>
  );
}