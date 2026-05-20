"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Gauge, Search, Sparkles, HelpCircle, AlertCircle, RefreshCw, Activity, Clock } from "lucide-react";

// Custom unified tooltip displaying metrics for both drivers at any hovered track point
const CustomTooltip = ({ active, payload, label, driver1, driver2 }) => {
  if (active && payload && payload.length && driver1 && driver2) {
    const dataPoint = payload[0].payload;
    return (
      <div style={{
        background: "rgba(10, 11, 16, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        padding: "1rem",
        borderRadius: "8px",
        fontSize: "0.85rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        color: "white",
        minWidth: "240px"
      }}>
        <p style={{ fontWeight: 800, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.4rem", marginBottom: "0.6rem" }}>
          🏁 Distance: <span style={{ color: "var(--f1-red)" }}>{label} m</span>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Driver 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: driver1.color }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: driver1.color }}></span>
              {driver1.fullName} ({driver1.code})
            </div>
            <div style={{ paddingLeft: "0.8rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
              <span>Speed:</span> <strong style={{ color: "white" }}>{dataPoint.speed1?.toFixed(1)} km/h</strong>
              <span>Throttle:</span> <strong style={{ color: "white" }}>{dataPoint.throttle1?.toFixed(0)}%</strong>
              <span>Brake:</span> <strong style={{ color: dataPoint.brake1 > 0 ? "#ef4444" : "var(--text-secondary)" }}>{dataPoint.brake1 > 0 ? "ON" : "OFF"}</strong>
              <span>Gear:</span> <strong style={{ color: "white" }}>{dataPoint.gear1}</strong>
            </div>
          </div>

          {/* Driver 2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: driver2.color }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: driver2.color }}></span>
              {driver2.fullName} ({driver2.code})
            </div>
            <div style={{ paddingLeft: "0.8rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
              <span>Speed:</span> <strong style={{ color: "white" }}>{dataPoint.speed2?.toFixed(1)} km/h</strong>
              <span>Throttle:</span> <strong style={{ color: "white" }}>{dataPoint.throttle2?.toFixed(0)}%</strong>
              <span>Brake:</span> <strong style={{ color: dataPoint.brake2 > 0 ? "#ef4444" : "var(--text-secondary)" }}>{dataPoint.brake2 > 0 ? "ON" : "OFF"}</strong>
              <span>Gear:</span> <strong style={{ color: "white" }}>{dataPoint.gear2}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function TelemetryPage() {
  const [year, setYear] = useState("2023");
  const [location, setLocation] = useState("Monza");
  const [driver1, setDriver1] = useState("VER");
  const [driver2, setDriver2] = useState("HAM");
  
  const [telemetryData, setTelemetryData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hoveredChart, setHoveredChart] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const fetchTelemetry = (e) => {
    if (e) e.preventDefault();
    if (!year || !location || !driver1 || !driver2) return;

    setLoading(true);
    setError(null);
    setTelemetryData(null);
    setChartData([]);

    const url = `https://f1analytics.ashutoshswamy.in/api/telemetry?year=${year}&location=${encodeURIComponent(location)}&driver1=${driver1.trim()}&driver2=${driver2.trim()}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.detail || "Failed to load telemetry data.");
          });
        }
        return res.json();
      })
      .then((data) => {
        setTelemetryData(data);
        
        // Merge perfectly aligned datasets from backend
        const merged = data.driver1.telemetry.map((pt1, idx) => {
          const pt2 = data.driver2.telemetry[idx] || {};
          return {
            distance: Math.round(pt1.distance),
            speed1: pt1.speed,
            speed2: pt2.speed ?? null,
            throttle1: pt1.throttle,
            throttle2: pt2.throttle ?? null,
            brake1: pt1.brake ? 100 : 0,
            brake2: pt2.brake ? 100 : 0,
            gear1: pt1.gear,
            gear2: pt2.gear ?? null
          };
        });
        
        setChartData(merged);
        setLoading(false);
        setFirstLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to retrieve telemetry data. Make sure spelling and abbreviations are correct.");
        setLoading(false);
      });
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Banner */}
      <motion.div 
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="glow-text" style={{ fontSize: "2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Gauge size={28} style={{ color: "var(--f1-red)" }} /> Telemetry Comparison
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Compare the throttle, speed overlays, and brake performance of any two drivers on their fastest session lap.
          </p>
        </div>
        <span className="f1-badge">⚡ Interactive Overlay</span>
      </motion.div>

      {/* Input Selection form panel */}
      <motion.div 
        className="f1-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={fetchTelemetry} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1.25rem",
          alignItems: "flex-end"
        }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Season Year
            </label>
            <select className="f1-select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="2026">2026 Season</option>
              <option value="2025">2025 Season</option>
              <option value="2024">2024 Season</option>
              <option value="2023">2023 Season</option>
              <option value="2022">2022 Season</option>
              <option value="2021">2021 Season</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Grand Prix Location
            </label>
            <input 
              type="text" 
              className="f1-input" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="e.g. Monza"
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Driver 1 (Abbreviation)
            </label>
            <input 
              type="text" 
              className="f1-input" 
              value={driver1} 
              onChange={(e) => setDriver1(e.target.value.toUpperCase())} 
              placeholder="e.g. VER"
              maxLength={3}
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Driver 2 (Abbreviation)
            </label>
            <input 
              type="text" 
              className="f1-input" 
              value={driver2} 
              onChange={(e) => setDriver2(e.target.value.toUpperCase())} 
              placeholder="e.g. HAM"
              maxLength={3}
              required 
            />
          </div>

          <div>
            <motion.button 
              type="submit" 
              className="f1-btn" 
              style={{ width: "100%", height: "42px" }} 
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Fetching...
                </>
              ) : (
                <>
                  <Search size={16} /> Load Telemetry
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Alert Warning for first-time session cache loading */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="f1-card" 
            style={{
              borderLeft: "4px solid #3b82f6",
              background: "rgba(59, 130, 246, 0.08)",
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <Sparkles size={20} style={{ color: "#60a5fa" }} />
              <div>
                <p style={{ color: "#93c5fd", fontWeight: 700 }}>📂 Cache Extraction In Progress</p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.15rem", color: "var(--text-secondary)" }}>
                  First-time telemetry loading requires extracting massive datasets (approx 30-50MB) from official F1 databases. This can take 15 to 30 seconds. Subsequent lookups will be instantaneous!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          className="f1-card" 
          style={{ borderLeft: "4px solid #ef4444", background: "rgba(239, 68, 68, 0.08)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <AlertCircle size={20} style={{ color: "#f87171" }} />
            <div>
              <p style={{ color: "#f87171", fontWeight: 700 }}>Telemetry Generation Error</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.15rem", color: "var(--text-secondary)" }}>{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Plot Section */}
      {firstLoad && !loading && !error && (
        <motion.div 
          className="f1-card" 
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HelpCircle size={48} style={{ color: "var(--text-muted)" }} />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Telemetry Visualizer Ready</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "500px" }}>
            Select a race season, Grand Prix venue, and driver abbreviation grid above, then click <strong>Load Telemetry</strong> to render the telemetry plot.
          </p>
        </motion.div>
      )}

      {telemetryData && chartData.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Telemetry Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {/* Driver 1 */}
            <motion.div 
              className="f1-card" 
              style={{ borderLeft: `4px solid ${telemetryData.driver1.color}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              whileHover={{ y: -3, boxShadow: `0 8px 24px 0 ${telemetryData.driver1.color}25` }}
            >
              <div>
                <p style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Driver 1 fastest lap</p>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Activity size={22} style={{ color: telemetryData.driver1.color }} /> {telemetryData.driver1.code}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{telemetryData.driver1.fullName}</p>
                
                {/* Visual Stats Block */}
                <div style={{
                  marginTop: "1rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.4rem 1rem",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  background: "rgba(255,255,255,0.01)",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid var(--card-border)"
                }}>
                  <span>Top Speed:</span> <strong style={{ color: "white", textAlign: "right" }}>{telemetryData.driver1.stats?.maxSpeed?.toFixed(1)} km/h</strong>
                  <span>Avg Speed:</span> <strong style={{ color: "white", textAlign: "right" }}>{telemetryData.driver1.stats?.avgSpeed?.toFixed(1)} km/h</strong>
                  <span>Avg Throttle:</span> <strong style={{ color: "white", textAlign: "right" }}>{telemetryData.driver1.stats?.avgThrottle?.toFixed(1)}%</strong>
                </div>
              </div>
              
              <div style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0.75rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "6px"
              }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={12} /> Lap Time:
                </span>
                <span style={{ fontWeight: 800, color: telemetryData.driver1.color }}>{telemetryData.driver1.lapTime}</span>
              </div>
            </motion.div>

            {/* Driver 2 */}
            <motion.div 
              className="f1-card" 
              style={{ borderLeft: `4px solid ${telemetryData.driver2.color}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              whileHover={{ y: -3, boxShadow: `0 8px 24px 0 ${telemetryData.driver2.color}25` }}
            >
              <div>
                <p style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Driver 2 fastest lap</p>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Activity size={22} style={{ color: telemetryData.driver2.color }} /> {telemetryData.driver2.code}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{telemetryData.driver2.fullName}</p>
                
                {/* Visual Stats Block */}
                <div style={{
                  marginTop: "1rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.4rem 1rem",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  background: "rgba(255,255,255,0.01)",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid var(--card-border)"
                }}>
                  <span>Top Speed:</span> <strong style={{ color: "white", textAlign: "right" }}>{telemetryData.driver2.stats?.maxSpeed?.toFixed(1)} km/h</strong>
                  <span>Avg Speed:</span> <strong style={{ color: "white", textAlign: "right" }}>{telemetryData.driver2.stats?.avgSpeed?.toFixed(1)} km/h</strong>
                  <span>Avg Throttle:</span> <strong style={{ color: "white", textAlign: "right" }}>{telemetryData.driver2.stats?.avgThrottle?.toFixed(1)}%</strong>
                </div>
              </div>

              <div style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0.75rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "6px"
              }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={12} /> Lap Time:
                </span>
                <span style={{ fontWeight: 800, color: telemetryData.driver2.color }}>{telemetryData.driver2.lapTime}</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Recharts Stacked Telemetry plots */}
          <div className="f1-card" style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Speed Overlay Chart */}
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.5rem", color: "white" }}>
                📊 Speed Profile Overlay (Speed km/h vs Track Distance m)
              </h3>
              <div style={{ width: "100%", height: "260px" }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      syncId="f1-telemetry"
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      onMouseEnter={() => setHoveredChart("speed")}
                      onMouseLeave={() => setHoveredChart(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="distance" type="number" domain={['auto', 'auto']} hide={true} />
                      <YAxis 
                        stroke="var(--text-secondary)"
                        tick={{ fontSize: 10 }}
                        domain={['auto', 'auto']}
                        label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', offset: 0, fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
                      />
                      {hoveredChart === "speed" && <Tooltip content={<CustomTooltip driver1={telemetryData.driver1} driver2={telemetryData.driver2} />} />}
                      <Legend verticalAlign="top" height={24} iconType="circle" />
                      <Line 
                        type="monotone" 
                        dataKey="speed1" 
                        name={telemetryData.driver1.code} 
                        stroke={telemetryData.driver1.color} 
                        strokeWidth={2.5}
                        dot={false}
                        connectNulls={true}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="speed2" 
                        name={telemetryData.driver2.code} 
                        stroke={telemetryData.driver2.color} 
                        strokeWidth={2.5}
                        dot={false}
                        connectNulls={true}
                        strokeDasharray={telemetryData.driver1.color === telemetryData.driver2.color ? "5 5" : "0"} 
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Throttle Overlay Chart */}
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.5rem", color: "white" }}>
                ⚡ Throttle Trace Overlay (%)
              </h3>
              <div style={{ width: "100%", height: "160px" }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      syncId="f1-telemetry"
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      onMouseEnter={() => setHoveredChart("throttle")}
                      onMouseLeave={() => setHoveredChart(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="distance" type="number" domain={['auto', 'auto']} hide={true} />
                      <YAxis 
                        stroke="var(--text-secondary)"
                        tick={{ fontSize: 10 }}
                        domain={[0, 100]}
                        label={{ value: 'Throttle %', angle: -90, position: 'insideLeft', offset: 0, fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
                      />
                      {hoveredChart === "throttle" && <Tooltip content={<CustomTooltip driver1={telemetryData.driver1} driver2={telemetryData.driver2} />} />}
                      <Line 
                        type="monotone" 
                        dataKey="throttle1" 
                        name={telemetryData.driver1.code} 
                        stroke={telemetryData.driver1.color} 
                        strokeWidth={2}
                        dot={false}
                        connectNulls={true}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="throttle2" 
                        name={telemetryData.driver2.code} 
                        stroke={telemetryData.driver2.color} 
                        strokeWidth={2}
                        dot={false}
                        connectNulls={true}
                        strokeDasharray={telemetryData.driver1.color === telemetryData.driver2.color ? "5 5" : "0"} 
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Brake Overlay Chart */}
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.5rem", color: "white" }}>
                🛑 Brake Application Trace (ON / OFF)
              </h3>
              <div style={{ width: "100%", height: "140px" }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      syncId="f1-telemetry"
                      margin={{ top: 5, right: 30, left: 10, bottom: 20 }}
                      onMouseEnter={() => setHoveredChart("brake")}
                      onMouseLeave={() => setHoveredChart(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="distance" 
                        type="number"
                        domain={['auto', 'auto']}
                        stroke="var(--text-secondary)"
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Distance in Meters', position: 'bottom', offset: 5, fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
                      />
                      <YAxis 
                        stroke="var(--text-secondary)"
                        tick={{ fontSize: 10 }}
                        domain={[0, 100]}
                        ticks={[0, 100]}
                        tickFormatter={(val) => val === 100 ? "ON" : "OFF"}
                        label={{ value: 'Brake Status', angle: -90, position: 'insideLeft', offset: 0, fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
                      />
                      {hoveredChart === "brake" && <Tooltip content={<CustomTooltip driver1={telemetryData.driver1} driver2={telemetryData.driver2} />} />}
                      <Line 
                        type="step" 
                        dataKey="brake1" 
                        name={telemetryData.driver1.code} 
                        stroke={telemetryData.driver1.color} 
                        strokeWidth={2}
                        dot={false}
                        connectNulls={true}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="step" 
                        dataKey="brake2" 
                        name={telemetryData.driver2.code} 
                        stroke={telemetryData.driver2.color} 
                        strokeWidth={2}
                        dot={false}
                        connectNulls={true}
                        strokeDasharray={telemetryData.driver1.color === telemetryData.driver2.color ? "5 5" : "0"} 
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
