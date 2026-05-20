"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Gauge, Search, Sparkles, HelpCircle, AlertCircle, RefreshCw,
  Activity, Clock, Database, TrendingUp, Zap, StopCircle,
} from "lucide-react";

const CustomTooltip = ({ active, payload, label, driver1, driver2 }) => {
  if (!active || !payload?.length || !driver1 || !driver2) return null;
  const dp = payload[0].payload;
  return (
    <div style={{
      background: "rgba(9,10,17,0.97)",
      border: "1px solid rgba(255,255,255,0.12)",
      padding: "0.9rem 1rem",
      borderRadius: 7,
      fontSize: "0.82rem",
      boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
      color: "white",
      minWidth: 230,
    }}>
      <p style={{ fontWeight: 800, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.35rem", marginBottom: "0.55rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
        Distance: <span style={{ color: "var(--f1-red)" }}>{label} m</span>
      </p>
      {[{ d: driver1, s: 1 }, { d: driver2, s: 2 }].map(({ d, s }) => (
        <div key={s} style={{ display: "flex", flexDirection: "column", gap: "0.12rem", marginBottom: s === 1 ? "0.65rem" : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: d.color }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
            {d.fullName} ({d.code})
          </div>
          <div style={{ paddingLeft: "0.8rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "0.1rem 0.85rem", color: "var(--text-secondary)", fontSize: "0.76rem", fontFamily: "var(--font-mono)" }}>
            <span>Speed</span><strong style={{ color: "white" }}>{dp[`speed${s}`]?.toFixed(1)} km/h</strong>
            <span>Throttle</span><strong style={{ color: "white" }}>{dp[`throttle${s}`]?.toFixed(0)}%</strong>
            <span>Brake</span><strong style={{ color: dp[`brake${s}`] > 0 ? "#ef4444" : "var(--text-secondary)" }}>{dp[`brake${s}`] > 0 ? "ON" : "OFF"}</strong>
            <span>Gear</span><strong style={{ color: "white" }}>{dp[`gear${s}`]}</strong>
          </div>
        </div>
      ))}
    </div>
  );
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
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const fetchTelemetry = (e) => {
    if (e) e.preventDefault();
    if (!year || !location || !driver1 || !driver2) return;

    setLoading(true);
    setError(null);
    setTelemetryData(null);
    setChartData([]);

    fetch(`https://f1analytics.ashutoshswamy.in/api/telemetry?year=${year}&location=${encodeURIComponent(location)}&driver1=${driver1.trim()}&driver2=${driver2.trim()}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(d.detail || "Failed to load telemetry."); });
        return res.json();
      })
      .then((data) => {
        setTelemetryData(data);
        setChartData(
          data.driver1.telemetry.map((pt1, idx) => {
            const pt2 = data.driver2.telemetry[idx] || {};
            return {
              distance: Math.round(pt1.distance),
              speed1: pt1.speed, speed2: pt2.speed ?? null,
              throttle1: pt1.throttle, throttle2: pt2.throttle ?? null,
              brake1: pt1.brake ? 100 : 0, brake2: pt2.brake ? 100 : 0,
              gear1: pt1.gear, gear2: pt2.gear ?? null,
            };
          })
        );
        setLoading(false);
        setFirstLoad(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to retrieve telemetry. Check spelling and abbreviations.");
        setLoading(false);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Page Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <p className="page-eyebrow">Driver Analysis</p>
          <h1 className="page-title glow-text">
            <Gauge size={26} style={{ color: "var(--f1-red)" }} />
            Telemetry Comparison
          </h1>
          <p className="page-subtitle">
            Throttle, speed, and brake overlays on the fastest session lap.
          </p>
        </div>
        <span className="f1-badge"><Zap size={10} /> Interactive Overlay</span>
      </motion.div>

      {/* Form */}
      <motion.div
        className="f1-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form
          onSubmit={fetchTelemetry}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.1rem", alignItems: "flex-end" }}
        >
          <div>
            <label className="form-label">Season Year</label>
            <select className="f1-select" value={year} onChange={(e) => setYear(e.target.value)}>
              {["2026","2025","2024","2023","2022","2021"].map((y) => (
                <option key={y} value={y}>{y} Season</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Grand Prix Location</label>
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
            <label className="form-label">Driver 1</label>
            <input
              type="text"
              className="f1-input"
              value={driver1}
              onChange={(e) => setDriver1(e.target.value.toUpperCase())}
              placeholder="e.g. VER"
              maxLength={3}
              required
              style={{ fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.05em" }}
            />
          </div>

          <div>
            <label className="form-label">Driver 2</label>
            <input
              type="text"
              className="f1-input"
              value={driver2}
              onChange={(e) => setDriver2(e.target.value.toUpperCase())}
              placeholder="e.g. HAM"
              maxLength={3}
              required
              style={{ fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.05em" }}
            />
          </div>

          <div>
            <motion.button
              type="submit"
              className="f1-btn"
              style={{ width: "100%", height: 42 }}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <><RefreshCw size={15} className="animate-spin" /> Fetching...</>
              ) : (
                <><Search size={15} /> Load Telemetry</>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Cache loading notice */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="info-banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Sparkles size={18} style={{ color: "#60a5fa", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="info-banner-title"><Database size={13} /> Cache Extraction In Progress</p>
              <p className="info-banner-body">
                First-time telemetry loading extracts 30–50 MB from official F1 databases. This may take 15–30 seconds. Subsequent lookups are instantaneous.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={17} style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="error-banner-title">Telemetry Error</p>
            <p className="error-banner-body">{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {firstLoad && !loading && !error && (
        <motion.div className="f1-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="empty-state">
            <HelpCircle size={44} className="empty-state-icon" />
            <p className="empty-state-title">Telemetry Visualizer Ready</p>
            <p className="empty-state-desc">
              Select a race season, Grand Prix venue, and two driver codes above, then click{" "}
              <strong>Load Telemetry</strong>.
            </p>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {telemetryData && chartData.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Driver summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[telemetryData.driver1, telemetryData.driver2].map((d, i) => (
              <motion.div
                key={i}
                className="f1-card"
                style={{ borderLeft: `3px solid ${d.color}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                whileHover={{ y: -3, boxShadow: `0 8px 28px 0 ${d.color}22` }}
              >
                <div>
                  <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.4rem" }}>
                    Driver {i + 1} &middot; Fastest Lap
                  </p>
                  <h2 style={{ fontSize: "1.9rem", fontWeight: 700, fontFamily: "var(--font-rajdhani)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "0.4rem", lineHeight: 1 }}>
                    <Activity size={20} style={{ color: d.color }} /> {d.code}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.2rem" }}>{d.fullName}</p>

                  <div className="driver-stat-grid">
                    <span>Top Speed</span>
                    <span className="driver-stat-value">{d.stats?.maxSpeed?.toFixed(1)} km/h</span>
                    <span>Avg Speed</span>
                    <span className="driver-stat-value">{d.stats?.avgSpeed?.toFixed(1)} km/h</span>
                    <span>Avg Throttle</span>
                    <span className="driver-stat-value">{d.stats?.avgThrottle?.toFixed(1)}%</span>
                  </div>
                </div>

                <div style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 5,
                  border: "1px solid var(--card-border)",
                }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={12} /> Lap Time
                  </span>
                  <span style={{ fontWeight: 800, color: d.color, fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
                    {d.lapTime}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="f1-card" style={{ padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

            {[
              {
                id: "speed",
                icon: <TrendingUp size={15} style={{ color: "var(--f1-red)" }} />,
                label: "Speed Profile Overlay",
                unit: "Speed (km/h) vs Track Distance (m)",
                height: 260,
                key1: "speed1", key2: "speed2",
                yDomain: ["auto","auto"],
                yLabel: "Speed (km/h)",
                type: "monotone",
              },
              {
                id: "throttle",
                icon: <Zap size={15} style={{ color: "var(--f1-red)" }} />,
                label: "Throttle Trace Overlay",
                unit: "Throttle %",
                height: 160,
                key1: "throttle1", key2: "throttle2",
                yDomain: [0, 100],
                yLabel: "Throttle %",
                type: "monotone",
              },
              {
                id: "brake",
                icon: <StopCircle size={15} style={{ color: "var(--f1-red)" }} />,
                label: "Brake Application Trace",
                unit: "ON / OFF",
                height: 140,
                key1: "brake1", key2: "brake2",
                yDomain: [0, 100],
                yLabel: "Brake",
                type: "step",
                isLast: true,
              },
            ].map(({ id, icon, label, unit, height, key1, key2, yDomain, yLabel, type, isLast }) => (
              <div key={id}>
                <h3 style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.9rem", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)" }}>
                  {icon} {label} <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>— {unit}</span>
                </h3>
                <div style={{ width: "100%", height }}>
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        syncId="f1-telemetry"
                        margin={{ top: 5, right: 30, left: 10, bottom: isLast ? 20 : 5 }}
                        onMouseEnter={() => setHoveredChart(id)}
                        onMouseLeave={() => setHoveredChart(null)}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis
                          dataKey="distance"
                          type="number"
                          domain={["auto","auto"]}
                          hide={!isLast}
                          stroke="var(--text-secondary)"
                          tick={{ fontSize: 10 }}
                          label={isLast ? { value: "Distance (m)", position: "bottom", offset: 5, fill: "var(--text-secondary)", fontSize: 11, fontWeight: 600 } : undefined}
                        />
                        <YAxis
                          stroke="var(--text-secondary)"
                          tick={{ fontSize: 10 }}
                          domain={yDomain}
                          ticks={id === "brake" ? [0, 100] : undefined}
                          tickFormatter={id === "brake" ? (v) => (v === 100 ? "ON" : "OFF") : undefined}
                          label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 0, fill: "var(--text-secondary)", fontSize: 11, fontWeight: 600 }}
                        />
                        {hoveredChart === id && (
                          <Tooltip content={<CustomTooltip driver1={telemetryData.driver1} driver2={telemetryData.driver2} />} />
                        )}
                        <Legend verticalAlign="top" height={24} iconType="circle" />
                        {[
                          { key: key1, driver: telemetryData.driver1 },
                          { key: key2, driver: telemetryData.driver2 },
                        ].map(({ key, driver }, idx) => (
                          <Line
                            key={key}
                            type={type}
                            dataKey={key}
                            name={driver.code}
                            stroke={driver.color}
                            strokeWidth={idx === 0 ? 2.5 : 2}
                            dot={false}
                            connectNulls
                            strokeDasharray={idx === 1 && telemetryData.driver1.color === telemetryData.driver2.color ? "5 5" : "0"}
                            activeDot={{ r: 5 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
