import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const countryMap = { /* same as before */ };

const getFlagEmoji = (code) => {
  try {
    const str = String(code || "").toUpperCase();
    return str.replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt())
    );
  } catch {
    return "🏳️";
  }
};

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
  const [loadingStats, setLoadingStats] = useState(true);

  const checkClaim = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.get(`https://ddkgenesis-claim-api-to5k4.kinsta.app/api/claim-check?username=${username}`);
      setResult(res.data);
    } catch (err) {
      setError("❌ User not found or API got error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [baseStats, distribution] = await Promise.all([
          axios.get("https://ddkgenesis-claim-api-to5k4.kinsta.app/api/claim-stats"),
          axios.get("https://ddkgenesis-claim-api-to5k4.kinsta.app/api/dnc-distribution")
        ]);
        setStats({
          ...baseStats.data,
          chart: distribution.data.chart
        });
      } catch (err) {
        console.error("📉 Failed to fetch stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans px-6 py-10 flex flex-col items-center justify-center relative">

      {/* Full screen blur loading overlay */}
      {loadingStats && (
        {loadingStats && (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-opacity-70 mb-4"></div>
    <p className="text-purple-200 text-center px-4 text-sm">⚙️ Initializing and analyzing 9 years of legacy data. Please wait...</p>
  </div>
)}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-opacity-70 mb-4"></div>
          <p className="text-purple-200 text-center px-4 text-sm">⚙️ Initializing and analyzing 9 years of legacy data. Please wait...</p>
        </div>
      )}

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

      {/* ...result and stats blocks follow (unchanged)... */}

    </div>
  );
}