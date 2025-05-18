import { useState } from "react";
import api from "../lib/api";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const checkClaim = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.get(`/api/claim-check?username=${username}`);
      setResult(res.data);
    } catch (err) {
      setError("❌ User not found or API error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a001a] via-[#120022] to-black text-white px-6 py-10 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-md mb-10">
        🔍 Check Your vGRAMX
      </h1>

      <div className="bg-[#1e032f] border border-purple-600 rounded-xl shadow-lg p-6 w-full max-w-md">
        <label className="block text-sm text-purple-300 mb-2">Enter Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. kalam"
          className="w-full px-4 py-2 rounded bg-black text-white border-2 border-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
        />

        <button
          onClick={checkClaim}
          disabled={loading || !username}
          className="mt-5 w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-500 hover:to-purple-600 transition-all text-white font-semibold shadow-md"
        >
          {loading ? "⏳ Checking..." : "✅ Check Now"}
        </button>
      </div>

      {result && (
        <div className="mt-10 w-full max-w-lg p-6 rounded-xl border border-purple-700 bg-[#140020]/80 shadow-2xl text-sm sm:text-base backdrop-blur-xl">
          <p className="mb-2"><strong>👤 Username:</strong> {result.username}</p>
          <p className="mb-2"><strong>📛 Full Name:</strong> {result.name || "-"}</p>
          <p className="mb-2"><strong>📧 Email:</strong> {result.email || "-"}</p>
          <p className="mb-2"><strong>📱 Phone:</strong> {result.phone || "-"}</p>
          <p className="mb-2"><strong>🌍 Country:</strong> {result.county || "-"}</p>
          <p className="mb-2"><strong>📅 Join Date:</strong> {new Date(result.created).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <p className="mb-2"><strong>💎 Eligible:</strong> {result.vgramx_eligible} vGRAMX</p>
          <p className="mt-4 text-pink-300 font-semibold">
            🧠 Vyra77 Suggestion: <span className="text-white font-normal">{result.suggestion}</span>
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 text-red-400 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}