import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const countryMap = { /* same as before, trimmed for brevity */ };

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
      }
    };

    fetchStats();
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

      {stats && (
        <div className="w-full max-w-2xl mt-4 text-sm text-gray-200 text-center space-y-6">
          <div className="bg-[#111] border border-purple-600 p-4 rounded-xl">
            <h3 className="text-base font-bold mb-1">📊 DNC Distribution by User Holding</h3>
            <p className="text-sm text-purple-300 mb-2">Vyra77 Insight: ✅ This data proves the token supply is fairly distributed with no central dominance. 99% of users hold less than 100 DNC.</p>
            <Bar
              data={{
                labels: stats.chart.map(e => e.range),
                datasets: [{
                  label: "Number of Users",
                  data: stats.chart.map(e => e.count),
                  backgroundColor: "rgba(147, 51, 234, 0.6)",
                  borderColor: "rgba(147, 51, 234, 1)",
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: "#fff" }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: "#ccc" }
                  },
                  x: {
                    ticks: { color: "#ccc" }
                  }
                }
              }}
            />
          </div>

          <div className="mt-6 text-sm text-gray-200 text-center space-y-2">
            <p>📌 <strong>Total Users:</strong> {stats.total_users.toLocaleString()}</p>
            <p>💰 <strong>Total DNC Liquid:</strong> {stats.total_main.toLocaleString()} | 🧊 <strong>Frozen:</strong> {stats.total_frozen.toLocaleString()}</p>
            <p>🔁 <strong>Last 3 Searches:</strong> {stats.last_searched.map((u, i) => <span key={i} className="ml-1 text-white">{u}</span>)}</p>
            <p>🌍 <strong>All Countries:</strong></p>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {Array.isArray(stats.all_countries) && stats.all_countries
                .filter(c => c && c._id)
                .map((c, i) => {
                  const code = String(c._id).toUpperCase();
                  return (
                    <span key={i} className="bg-[#1e1e1e] px-2 py-1 rounded text-sm text-white border border-purple-500">
                      {getFlagEmoji(code)} {countryMap[code] || code} ({c.count})
                    </span>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}