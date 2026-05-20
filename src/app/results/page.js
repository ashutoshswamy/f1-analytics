"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Zap, Compass, Info, RefreshCw, Calendar, Clock, MapPin, Eye } from "lucide-react";

export default function ResultsPage() {
  const [year, setYear] = useState("2023");
  const [location, setLocation] = useState("Monza");
  const [activeTab, setActiveTab] = useState("race"); // 'race' or 'quali'

  const [raceData, setRaceData] = useState(null);
  const [qualiData, setQualiData] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);

  const fetchResults = (e) => {
    if (e) e.preventDefault();
    if (!year || !location) return;

    setLoading(true);
    setError(null);
    setRaceData(null);
    setQualiData(null);
    setTrackData(null);

    const raceUrl = `https://f1analytics.ashutoshswamy.in/api/results?year=${year}&location=${encodeURIComponent(location)}`;
    const qualiUrl = `https://f1analytics.ashutoshswamy.in/api/quali?year=${year}&location=${encodeURIComponent(location)}`;
    const trackUrl = `https://f1analytics.ashutoshswamy.in/api/track?year=${year}&location=${encodeURIComponent(location)}`;

    Promise.all([
      fetch(raceUrl).then(res => res.ok ? res.json() : null),
      fetch(qualiUrl).then(res => res.ok ? res.json() : null),
      fetch(trackUrl).then(res => res.ok ? res.json() : null)
    ])
    .then(([race, quali, track]) => {
      if (!race && !quali) {
        throw new Error("No session classification records found. Check year and location spelling.");
      }
      setRaceData(race);
      setQualiData(quali);
      setTrackData(track);
      setLoading(false);
      setFirstLoad(false);
    })
    .catch((err) => {
      console.error(err);
      setError(err.message || "Failed to retrieve race records.");
      setLoading(false);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <motion.div 
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="glow-text" style={{ fontSize: "2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🏆 Race & Qualifying Results
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Search the archives for full finishing placements, qualifying sector timings, and track characteristics.
          </p>
        </div>
        <span className="f1-badge">🏁 Session Classifications</span>
      </motion.div>

      {/* Input panel */}
      <motion.div 
        className="f1-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={fetchResults} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
              placeholder="e.g. Monza or Spa"
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
                  <Compass size={16} /> Search Classification
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {error && (
        <motion.div 
          className="f1-card" 
          style={{ borderLeft: "4px solid #ef4444", background: "rgba(239, 68, 68, 0.08)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ color: "#f87171", fontWeight: 700 }}>⚠️ Database Lookup Error</p>
          <p style={{ fontSize: "0.85rem", marginTop: "0.15rem", color: "var(--text-secondary)" }}>{error}</p>
        </motion.div>
      )}

      {/* Landing display */}
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
          <Award size={48} style={{ color: "var(--text-muted)" }} />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Classifications Database</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "500px" }}>
            Select a season and race location above to view the full classification reports and track profile guides.
          </p>
        </motion.div>
      )}

      {/* Main Results Grid */}
      {!loading && !error && !firstLoad && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
          alignItems: "start"
        }}>
          
          {/* Classification Table */}
          <motion.div 
            className="f1-card" 
            style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "1.5rem" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Tabs */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid var(--card-border)",
              gap: "1rem"
            }}>
              <button 
                className={`f1-tab-btn ${activeTab === "race" ? "active" : ""}`}
                onClick={() => setActiveTab("race")}
                disabled={!raceData}
              >
                🏆 GP Race Classification
              </button>
              <button 
                className={`f1-tab-btn ${activeTab === "quali" ? "active" : ""}`}
                onClick={() => setActiveTab("quali")}
                disabled={!qualiData}
              >
                ⏱️ Qualifying Times
              </button>
            </div>

            {/* Tab contents with transitions */}
            <AnimatePresence mode="wait">
              {activeTab === "race" && raceData && (
                <motion.div
                  key="race-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="glow-text" style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>
                    🏁 {raceData.raceName} Race Finishing Placements
                  </h3>
                  <div className="f1-table-wrapper">
                    <table className="f1-table">
                      <thead>
                        <tr>
                          <th style={{ width: "60px", textAlign: "center" }}>Pos</th>
                          <th>Driver</th>
                          <th>Constructor</th>
                          <th style={{ textAlign: "center" }}>Grid</th>
                          <th>Fastest Lap</th>
                          <th>Status</th>
                          <th style={{ textAlign: "right" }}>Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raceData.results.map((r, idx) => (
                          <motion.tr 
                            key={idx}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * idx }}
                          >
                            <td style={{ textAlign: "center", fontWeight: 800, color: r.position <= 3 ? "gold" : "inherit" }}>
                              {r.position}
                            </td>
                            <td>
                              <div style={{ fontWeight: 700 }}>{r.driver}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{r.driverFullName}</div>
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{r.team}</td>
                            <td style={{ textAlign: "center", color: "var(--text-muted)" }}>{r.grid}</td>
                            <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{r.fastestLapTime}</td>
                            <td style={{ fontSize: "0.8rem", color: r.status === "Finished" ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                              {r.status}
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)" }}>
                              +{r.points}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "quali" && qualiData && (
                <motion.div
                  key="quali-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                >
                  {/* Pole position card */}
                  <motion.div 
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "linear-gradient(90deg, rgba(255,204,0,0.1) 0%, rgba(16,18,27,0.5) 100%)",
                      borderLeft: "4px solid #ffcc00",
                      padding: "1rem 1.5rem",
                      borderRadius: "8px",
                      border: "1px solid var(--card-border)"
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div>
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "gold", fontWeight: 700 }}>🥇 Pole Position Winner</span>
                      <h4 style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: "0.15rem" }}>{qualiData.poleDriver}</h4>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Lap Time</span>
                      <h4 style={{ fontSize: "1.3rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "white" }}>{qualiData.poleTime}</h4>
                    </div>
                  </motion.div>

                  <div>
                    <h3 className="glow-text" style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>
                      ⏱️ Shootout Timings classification
                    </h3>
                    <div className="f1-table-wrapper">
                      <table className="f1-table">
                        <thead>
                          <tr>
                            <th style={{ width: "60px", textAlign: "center" }}>Pos</th>
                            <th>Driver</th>
                            <th>Constructor</th>
                            <th style={{ textAlign: "center" }}>Q1</th>
                            <th style={{ textAlign: "center" }}>Q2</th>
                            <th style={{ textAlign: "center" }}>Q3</th>
                          </tr>
                        </thead>
                        <tbody>
                          {qualiData.results.map((r, idx) => (
                            <motion.tr 
                              key={idx}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * idx }}
                            >
                              <td style={{ textAlign: "center", fontWeight: 800 }}>{r.position}</td>
                              <td>
                                <div style={{ fontWeight: 700 }}>{r.driver}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{r.driverFullName}</div>
                              </td>
                              <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{r.team}</td>
                              <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{r.q1}</td>
                              <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{r.q2}</td>
                              <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700, color: idx === 0 ? "#ffcc00" : "white" }}>{r.q3}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Circuit Metadata Card (Sidebar) */}
          {trackData && (
            <motion.div 
              className="f1-card" 
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Info size={18} style={{ color: "var(--f1-red)" }} /> Track Information
                </h3>
                <span className="f1-badge">GP Profile</span>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Official Grand Prix Name</span>
                <h4 className="glow-text" style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: "0.15rem" }}>{trackData.raceName}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={12} /> {trackData.circuitName}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Round #</span>
                  <span style={{ fontWeight: 700 }}>Round {trackData.round}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Locality</span>
                  <span style={{ fontWeight: 700 }}>{trackData.locality}, {trackData.country}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Latitude</span>
                  <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{trackData.latitude}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Longitude</span>
                  <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{trackData.longitude}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Race Laps</span>
                  <span style={{ fontWeight: 700, color: "var(--f1-red)" }}>{trackData.totalLaps} Laps</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Date Scheduled</span>
                  <span style={{ fontWeight: 700 }}>{trackData.date}</span>
                </div>
              </div>

              {/* Styled Circuit sector line */}
              <div>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Circuit Sectors Map
                </p>
                <div className="sector-line">
                  <motion.div className="sector-node" style={{ left: "0%" }} whileHover={{ scale: 1.5 }} title="Start/Finish Line"></motion.div>
                  <motion.div className="sector-node" style={{ left: "33%", background: "#ff8000" }} whileHover={{ scale: 1.5 }} title="Sector 1 End"></motion.div>
                  <motion.div className="sector-node" style={{ left: "66%", background: "#00e1d9" }} whileHover={{ scale: 1.5 }} title="Sector 2 End"></motion.div>
                  <motion.div className="sector-node" style={{ left: "95%", background: "var(--f1-red)" }} whileHover={{ scale: 1.5 }} title="Podium Finish"></motion.div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  <span>🏁 Start</span>
                  <span>S1</span>
                  <span>S2</span>
                  <span>🏆 Podium</span>
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <a 
                  href={trackData.wiki} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <motion.button 
                    className="f1-btn" 
                    style={{ width: "100%", background: "transparent", border: "1px solid var(--card-border)" }}
                    whileHover={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.02)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye size={14} style={{ marginRight: "0.4rem", display: "inline" }} /> Read Wikipedia Guide
                  </motion.button>
                </a>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
