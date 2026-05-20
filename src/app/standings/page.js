"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Shield, AlertTriangle } from "lucide-react";

const TEAM_COLORS = {
  "red bull": "#3671c2",
  "ferrari": "#f91536",
  "mclaren": "#ff8000",
  "mercedes": "#27f4d2",
  "aston martin": "#229971",
  "alpine": "#0093cc",
  "williams": "#37bedd",
  "haas": "#b6babd",
  "sauber": "#52e252",
  "kick sauber": "#52e252",
  "alfa romeo": "#900000",
  "rb": "#66c0ec",
  "alphatauri": "#66c0ec",
  "racing point": "#f596c8",
  "force india": "#f596c8",
};

function getTeamColor(teamName) {
  if (!teamName) return "var(--card-border)";
  const clean = teamName.toLowerCase();
  for (const [key, hex] of Object.entries(TEAM_COLORS)) {
    if (clean.includes(key)) return hex;
  }
  return "rgba(255,255,255,0.12)";
}

function PosBadge({ pos }) {
  const cls =
    pos === 1 ? "pos-p1" : pos === 2 ? "pos-p2" : pos === 3 ? "pos-p3" : "pos-default";
  return <span className={`pos-badge ${cls}`}>{pos}</span>;
}

export default function StandingsPage() {
  const [year, setYear] = useState("2024");
  const [tab, setTab] = useState("drivers");
  const [driverStandings, setDriverStandings] = useState([]);
  const [teamStandings, setTeamStandings] = useState([]);
  const [roundNum, setRoundNum] = useState("—");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const url =
      tab === "drivers"
        ? `https://f1analytics.ashutoshswamy.in/api/standings/drivers?year=${year}`
        : `https://f1analytics.ashutoshswamy.in/api/standings/teams?year=${year}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${tab} standings`);
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setRoundNum(data.round || "—");
        if (tab === "drivers") setDriverStandings(data.standings || []);
        else setTeamStandings(data.standings || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(`Failed to retrieve ${tab} standings. Check year availability.`);
        setLoading(false);
      });

    return () => { active = false; };
  }, [year, tab]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Page Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <p className="page-eyebrow">World Championship</p>
          <h1 className="page-title glow-text">
            <Trophy size={26} style={{ color: "var(--f1-red)" }} />
            Standings
          </h1>
          <p className="page-subtitle">
            Points table and gaps for drivers and constructors.
          </p>
        </div>
        <span className="f1-badge">Round {roundNum}</span>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="f1-card"
        style={{ padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div style={{ display: "flex", borderBottom: "none", gap: "0" }}>
          <button
            className={`f1-tab-btn ${tab === "drivers" ? "active" : ""}`}
            onClick={() => { if (tab !== "drivers") { setTab("drivers"); setLoading(true); setError(null); } }}
          >
            <Users size={15} /> Drivers
          </button>
          <button
            className={`f1-tab-btn ${tab === "teams" ? "active" : ""}`}
            onClick={() => { if (tab !== "teams") { setTab("teams"); setLoading(true); setError(null); } }}
          >
            <Shield size={15} /> Constructors
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <span className="form-label" style={{ marginBottom: 0, whiteSpace: "nowrap" }}>Season</span>
          <select
            className="f1-select"
            value={year}
            style={{ width: "auto", padding: "0.4rem 0.75rem" }}
            onChange={(e) => { setYear(e.target.value); setLoading(true); setError(null); }}
          >
            {["2026","2025","2024","2023","2022","2021"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="error-banner">
          <AlertTriangle size={17} style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="error-banner-title">Standings Error</p>
            <p className="error-banner-body">{error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <motion.div
        className="f1-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 350 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="f1-spinner" />
            </motion.div>

          ) : tab === "drivers" ? (
            <motion.div key="drivers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="card-header">
                <span className="card-title">
                  <Users size={15} style={{ color: "var(--f1-red)" }} />
                  Drivers&apos; Championship &middot; {year}
                </span>
              </div>
              <div className="f1-table-wrapper">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: 52, textAlign: "center" }}>Pos</th>
                      <th>Driver</th>
                      <th>Constructor</th>
                      <th style={{ textAlign: "center" }}>Wins</th>
                      <th style={{ textAlign: "right" }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((d, idx) => {
                      const color = getTeamColor(d.team);
                      return (
                        <motion.tr
                          key={idx}
                          style={{ borderLeft: `3px solid ${color}` }}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.025 * idx }}
                        >
                          <td style={{ textAlign: "center" }}>
                            <PosBadge pos={d.position} />
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                              <div style={{
                                width: 34,
                                height: 22,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--card-border)",
                                borderRadius: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.72rem",
                                fontWeight: 900,
                                color,
                                fontFamily: "var(--font-mono)",
                                flexShrink: 0,
                              }}>
                                {d.driver}
                              </div>
                              <span style={{ fontWeight: 700 }}>{d.driverFullName}</span>
                            </div>
                          </td>
                          <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{d.team}</td>
                          <td style={{ textAlign: "center", fontWeight: 700, color: d.wins > 0 ? "white" : "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                            {d.wins}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
                            {d.points}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

          ) : (
            <motion.div key="teams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="card-header">
                <span className="card-title">
                  <Shield size={15} style={{ color: "var(--f1-red)" }} />
                  Constructors&apos; Championship &middot; {year}
                </span>
              </div>
              <div className="f1-table-wrapper">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: 52, textAlign: "center" }}>Pos</th>
                      <th>Constructor</th>
                      <th style={{ textAlign: "center" }}>Wins</th>
                      <th style={{ textAlign: "right" }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStandings.map((t, idx) => {
                      const color = getTeamColor(t.team);
                      return (
                        <motion.tr
                          key={idx}
                          style={{ borderLeft: `3px solid ${color}` }}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.025 * idx }}
                        >
                          <td style={{ textAlign: "center" }}>
                            <PosBadge pos={t.position} />
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                              <div style={{ width: 4, height: 28, background: color, borderRadius: 2, flexShrink: 0 }} />
                              <span style={{ fontWeight: 700 }}>{t.team}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 700, color: t.wins > 0 ? "white" : "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                            {t.wins}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
                            {t.points}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
