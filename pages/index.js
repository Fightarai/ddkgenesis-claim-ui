import { useState } from "react";
import api from "../lib/api";

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans px-6 py-10 flex flex-col items-center justify-center">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-10">
        🔍 Check Your vGRAMX
      </h1>

      {/* Input Block */}
      <div className="bg-[#121212] border border-purple-700 rounded-xl shadow-lg p-6 w-full max-w-md mb-8">
        <label className="block text-sm text-purple-300 mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full px-4 py-2 rounded bg-black text-white border-2 border-[#292929] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />

        <button
          onClick={checkClaim}
          disabled={loading || !username}
          className="mt-6 w-full py-2 text-white font-semibold rounded shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transition-all"
        >
          {loading ? "⏳ Checking..." : "✅ Check Now"}
        </button>
      </div>

      {/* Always Visible Info Box */}
      <div className="w-full max-w-2xl bg-[#0f0f0f] border border-[#3b1367] rounded-xl shadow-xl p-6 text-sm sm:text-base space-y-3">
        {result ? (
          <>
            <p><strong>👤 Username:</strong> {result.username}</p>
            <p><strong>📛 Full Name:</strong> {result.name || "-"}</p>
            <p><strong>📧 Email:</strong> {result.email || "-"}</p>
            <p><strong>📱 Phone:</strong> {result.phone || "-"}</p>
            <p><strong>🌍 Country:</strong> {result.county || "-"}</p>
            <p><strong>📅 Join Date:</strong> {new Date(result.created).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>💎 Eligible:</strong> {result.vgramx_eligible} vGRAMX</p>
            <p className="pt-2 text-pink-300 font-semibold">
              🧠 Vyra77 Suggestion:
              <span className="text-white font-normal ml-1">{result.suggestion}</span>
            </p>
          </>
        ) : (
          <p className="text-gray-400 text-center">
            👤 User info will appear here after checking.
          </p>
        )}

        {error && (
          <p className="mt-3 text-red-400 font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}