"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Flag, AlertTriangle, Timer, Medal,
  Compass, Info, RefreshCw, MapPin, Eye,
} from "lucide-react";

function PosBadge({ pos }) {
  const cls =
    pos === 1 ? "pos-p1" : pos === 2 ? "pos-p2" : pos === 3 ? "pos-p3" : "pos-default";
  return <span className={`pos-badge ${cls}`}>{pos}</span>;
}

export default function ResultsPage() {
  const [year, setYear] = useState("2023");
  const [location, setLocation] = useState("Monza");
  const [activeTab, setActiveTab] = useState("race");

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

    Promise.all([
      fetch(`https://f1analytics.ashutoshswamy.in/api/results?year=${year}&location=${encodeURIComponent(location)}`).then((r) => r.ok ? r.json() : null),
      fetch(`https://f1analytics.ashutoshswamy.in/api/quali?year=${year}&location=${encodeURIComponent(location)}`).then((r) => r.ok ? r.json() : null),
      fetch(`https://f1analytics.ashutoshswamy.in/api/track?year=${year}&location=${encodeURIComponent(location)}`).then((r) => r.ok ? r.json() : null),
    ])
      .then(([race, quali, track]) => {
        if (!race && !quali) throw new Error("No session data found. Check year and location spelling.");
        setRaceData(race);
        setQualiData(quali);
        setTrackData(track);
        setLoading(false);
        setFirstLoad(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to retrieve race records.");
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
          <p className="page-eyebrow">Session Archives</p>
          <h1 className="page-title glow-text">
            <Trophy size={26} style={{ color: "var(--f1-red)" }} />
            Race &amp; Qualifying Results
          </h1>
          <p className="page-subtitle">
            Full classifications, sector timings, and circuit data.
          </p>
        </div>
        <span className="f1-badge"><Flag size={10} /> Session Classifications</span>
      </motion.div>

      {/* Search form */}
      <motion.div
        className="f1-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form
          onSubmit={fetchResults}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.1rem", alignItems: "flex-end" }}
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
              placeholder="e.g. Monza or Spa"
              required
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
                <><Compass size={15} /> Search</>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="error-banner">
          <AlertTriangle size={17} style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="error-banner-title">Lookup Error</p>
            <p className="error-banner-body">{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {firstLoad && !loading && !error && (
        <motion.div className="f1-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="empty-state">
            <Trophy size={44} className="empty-state-icon" />
            <p className="empty-state-title">Classifications Database</p>
            <p className="empty-state-desc">
              Select a season and Grand Prix location above to view finishing placements and qualifying timings.
            </p>
          </div>
        </motion.div>
      )}

      {/* Results grid */}
      {!loading && !error && !firstLoad && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.75rem", alignItems: "start" }}>

          {/* Classification table */}
          <motion.div
            className="f1-card"
            className="grid-span-2"
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--card-border)", gap: 0, marginBottom: "0.25rem" }}>
              <button
                className={`f1-tab-btn ${activeTab === "race" ? "active" : ""}`}
                onClick={() => setActiveTab("race")}
                disabled={!raceData}
              >
                <Trophy size={14} /> GP Race
              </button>
              <button
                className={`f1-tab-btn ${activeTab === "quali" ? "active" : ""}`}
                onClick={() => setActiveTab("quali")}
                disabled={!qualiData}
              >
                <Timer size={14} /> Qualifying
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "race" && raceData && (
                <motion.div
                  key="race"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3
                    className="glow-text"
                    style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "var(--font-rajdhani)", letterSpacing: "0.02em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Flag size={16} style={{ color: "var(--f1-red)" }} /> {raceData.raceName}
                  </h3>
                  <div className="f1-table-wrapper">
                    <table className="f1-table">
                      <thead>
                        <tr>
                          <th style={{ width: 52, textAlign: "center" }}>Pos</th>
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
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.04 * idx }}
                          >
                            <td style={{ textAlign: "center" }}><PosBadge pos={r.position} /></td>
                            <td>
                              <div style={{ fontWeight: 700 }}>{r.driver}</div>
                              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>{r.driverFullName}</div>
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{r.team}</td>
                            <td style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>{r.grid}</td>
                            <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{r.fastestLapTime}</td>
                            <td style={{ fontSize: "0.78rem", fontWeight: 600, color: r.status === "Finished" ? "#22c55e" : "#ef4444" }}>{r.status}</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)", fontFamily: "var(--font-mono)" }}>+{r.points}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "quali" && qualiData && (
                <motion.div
                  key="quali"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  {/* Pole card */}
                  <motion.div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "linear-gradient(90deg, rgba(255,204,0,0.08) 0%, rgba(13,14,22,0.5) 100%)",
                      borderLeft: "3px solid #e6b800",
                      padding: "1rem 1.25rem",
                      borderRadius: 6,
                      border: "1px solid rgba(255,204,0,0.15)",
                    }}
                    whileHover={{ scale: 1.005 }}
                  >
                    <div>
                      <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#e6b800", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Medal size={12} /> Pole Position
                      </span>
                      <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: "0.15rem", fontFamily: "var(--font-rajdhani)", letterSpacing: "0.02em" }}>
                        {qualiData.poleDriver}
                      </h4>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Lap Time</span>
                      <h4 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "white", marginTop: "0.15rem" }}>
                        {qualiData.poleTime}
                      </h4>
                    </div>
                  </motion.div>

                  <div>
                    <h3
                      className="glow-text"
                      style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "var(--font-rajdhani)", letterSpacing: "0.02em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <Timer size={16} style={{ color: "var(--f1-red)" }} /> Qualifying Classification
                    </h3>
                    <div className="f1-table-wrapper">
                      <table className="f1-table">
                        <thead>
                          <tr>
                            <th style={{ width: 52, textAlign: "center" }}>Pos</th>
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
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.04 * idx }}
                            >
                              <td style={{ textAlign: "center" }}><PosBadge pos={r.position} /></td>
                              <td>
                                <div style={{ fontWeight: 700 }}>{r.driver}</div>
                                <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>{r.driverFullName}</div>
                              </td>
                              <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{r.team}</td>
                              <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{r.q1}</td>
                              <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{r.q2}</td>
                              <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 700, color: idx === 0 ? "#e6b800" : "white" }}>{r.q3}</td>
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

          {/* Track info card */}
          {trackData && (
            <motion.div
              className="f1-card"
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
            >
              <div className="card-header">
                <span className="card-title">
                  <Info size={15} style={{ color: "var(--f1-red)" }} />
                  Track Info
                </span>
                <span className="f1-badge">GP Profile</span>
              </div>

              <div>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.09em" }}>Official Name</span>
                <h4
                  className="glow-text"
                  style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "0.2rem", fontFamily: "var(--font-rajdhani)", letterSpacing: "0.02em" }}
                >
                  {trackData.raceName}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={12} /> {trackData.circuitName}
                </p>
              </div>

              <div className="info-list">
                {[
                  { k: "Round", v: `Round ${trackData.round}` },
                  { k: "Location", v: `${trackData.locality}, ${trackData.country}` },
                  { k: "Latitude", v: trackData.latitude, mono: true },
                  { k: "Longitude", v: trackData.longitude, mono: true },
                  { k: "Race Laps", v: `${trackData.totalLaps} laps`, accent: true },
                  { k: "Date", v: trackData.date },
                ].map(({ k, v, mono, accent }) => (
                  <div key={k} className="info-row">
                    <span className="info-key">{k}</span>
                    <span
                      className="info-value"
                      style={{
                        fontFamily: mono ? "var(--font-mono)" : undefined,
                        fontSize: mono ? "0.8rem" : undefined,
                        color: accent ? "var(--f1-red)" : undefined,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Circuit Sectors
                </p>
                <div className="sector-line">
                  <motion.div className="sector-node" style={{ left: "0%" }} whileHover={{ scale: 1.6 }} />
                  <motion.div className="sector-node" style={{ left: "33%", background: "#ff8000" }} whileHover={{ scale: 1.6 }} />
                  <motion.div className="sector-node" style={{ left: "66%", background: "#00e1d9" }} whileHover={{ scale: 1.6 }} />
                  <motion.div className="sector-node" style={{ left: "95%", background: "var(--f1-red)" }} whileHover={{ scale: 1.6 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Flag size={10} /> Start</span>
                  <span>S1</span>
                  <span>S2</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Trophy size={10} /> Podium</span>
                </div>
              </div>

              <a href={trackData.wiki} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                <motion.button
                  className="f1-btn"
                  style={{ width: "100%", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
                  whileHover={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye size={14} /> Wikipedia Guide
                </motion.button>
              </a>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
