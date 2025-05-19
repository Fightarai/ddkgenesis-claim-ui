import { useState, useEffect } from "react";
import api from "../lib/api";

const countryMap = {
  MY: "Malaysia", ID: "Indonesia", BD: "Bangladesh", IN: "India", PH: "Philippines",
  SG: "Singapore", TH: "Thailand", VN: "Vietnam", JP: "Japan", CN: "China",
  US: "United States", GB: "United Kingdom", AU: "Australia", CA: "Canada", AE: "UAE"
};

const getFlagEmoji = (code) =>
  code?.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );

const getTimeSince = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  return `${years}y ${remainingDays}d ago`;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  const checkClaim = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.get(`/api/claim-check?username=${username}`);
      setResult(res.data);
    } catch (err) {
      setError("❌ User not found or API got error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    api.get("/api/claim-stats").then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans px-6 py-10 flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-10 text-center">
        🔍 Check Your DDK Legacy (Pre-order ETPS) for vGRAMX
      </h1>

      <div className="bg-[#121212] border border-purple-700 rounded-xl shadow-lg p-6 w-full max-w-md mb-8">
        <label className="block text-sm text-purple-300 mb-2">Username or Email</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. fxbitlab or name@email.com"
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

      <div className="w-full max-w-2xl bg-[#0f0f0f] border border-[#3b1367] rounded-xl shadow-xl p-6 text-sm sm:text-base space-y-3">
        {result ? (
          <>
            <p><strong>👤 Username:</strong> {result.username || "-"}</p>
            <p><strong>📛 Full Name:</strong> {result.name || "-"}</p>
            <p><strong>📧 Email:</strong> {result.email || "-"}</p>
            <p><strong>📱 Phone:</strong> {result.phone || "-"}</p>
            <p>
              <strong>🌍 Country:</strong> {result.county ? `${getFlagEmoji(result.county)} ${countryMap[result.county.toUpperCase()] || result.county}` : "-"}
            </p>
            <p>
              <strong>📅 Join Date:</strong> {result.created ? `${new Date(result.created).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} (${getTimeSince(result.created)})` : "-"}
            </p>
            <p><strong>💎 Eligible:</strong> {result.vgramx_eligible} vGRAMX</p>
            <p className="text-sm text-purple-300 ml-2">
              Breakdown: {parseFloat(result.quantity_main).toFixed(6)} from <strong>Active Wallet</strong> + {parseFloat(result.quantity_fractional).toFixed(6)} from <strong>Frozen Holdings</strong>
            </p>
            <p className="pt-2 text-pink-300 font-semibold">
              🧠 Vyra77 Suggestion:
              <span className="text-white font-normal ml-1">{result.suggestion}</span>
            </p>
          </>
        ) : (
          <p className="text-gray-400 text-center">👤 User info will appear here after checking.</p>
        )}

        {error && <p className="mt-3 text-red-400 font-medium">{error}</p>}
      </div>

      {stats && (
        <div className="w-full max-w-2xl mt-10 text-sm text-gray-200 text-center space-y-2">
          <p>📊 <strong>Total Users:</strong> {stats.total_users.toLocaleString()}</p>
          <p>💰 <strong>Total DNC Liquid:</strong> {stats.total_main.toLocaleString()} | 🧊 <strong>Frozen:</strong> {stats.total_frozen.toLocaleString()}</p>
          <p>🔁 <strong>Last 3 Searches:</strong> {stats.last_searched.map((u, i) => <span key={i} className="ml-1 text-white">{u}</span>)}</p>
          <p>🌍 <strong>All Countries:</strong></p>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {stats.all_countries.map((c, i) => (
              <span key={i} className="bg-[#1e1e1e] px-2 py-1 rounded text-sm text-white border border-purple-500">
                {getFlagEmoji(c._id)} {countryMap[c._id] || c._id} ({c.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}