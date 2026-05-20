"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RefreshCw, Users, Shield, Award, Medal } from "lucide-react";

// Official F1 Team brand colors mapping
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
  "force india": "#f596c8"
};

function getTeamColor(teamName) {
  if (!teamName) return "var(--card-border)";
  const cleanName = teamName.toLowerCase();
  for (const [key, hex] of Object.entries(TEAM_COLORS)) {
    if (cleanName.includes(key)) return hex;
  }
  return "rgba(255, 255, 255, 0.1)"; // default fallback
}

export default function StandingsPage() {
  const [year, setYear] = useState("2024");
  const [standingsTab, setStandingsTab] = useState("drivers"); // 'drivers' or 'teams'
  
  const [driverStandings, setDriverStandings] = useState([]);
  const [teamStandings, setTeamStandings] = useState([]);
  const [roundNum, setRoundNum] = useState("0");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const apiEndpoint = standingsTab === "drivers" 
      ? `http://localhost:8000/api/standings/drivers?year=${year}`
      : `http://localhost:8000/api/standings/teams?year=${year}`;

    fetch(apiEndpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${standingsTab} standings`);
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setRoundNum(data.round || "N/A");
        if (standingsTab === "drivers") {
          setDriverStandings(data.standings || []);
        } else {
          setTeamStandings(data.standings || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setError(`Failed to retrieve F1 ${standingsTab} standings. Check year availability.`);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [year, standingsTab]);

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
            <Trophy size={28} style={{ color: "var(--f1-red)" }} /> World Championship Standings
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Check the standings logs and points gaps for active drivers and constructor manufacturers.
          </p>
        </div>
        <span className="f1-badge">Round {roundNum}</span>
      </motion.div>

      {/* Control panel (Form select + Tab toggle) */}
      <motion.div 
        className="f1-card" 
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div style={{ display: "flex", borderBottom: "1px solid var(--card-border)", gap: "0.5rem" }}>
          <button 
            className={`f1-tab-btn ${standingsTab === "drivers" ? "active" : ""}`}
            onClick={() => {
              if (standingsTab !== "drivers") {
                setStandingsTab("drivers");
                setLoading(true);
                setError(null);
              }
            }}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Users size={16} /> Driver Standings
          </button>
          <button 
            className={`f1-tab-btn ${standingsTab === "teams" ? "active" : ""}`}
            onClick={() => {
              if (standingsTab !== "teams") {
                setStandingsTab("teams");
                setLoading(true);
                setError(null);
              }
            }}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Shield size={16} /> Constructor Standings
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: "150px" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Season:</span>
          <select 
            className="f1-select" 
            value={year} 
            onChange={(e) => {
              setYear(e.target.value);
              setLoading(true);
              setError(null);
            }} 
            style={{ padding: "0.4rem 0.75rem" }}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          className="f1-card" 
          style={{ borderLeft: "4px solid #ef4444", background: "rgba(239, 68, 68, 0.08)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ color: "#f87171", fontWeight: 700 }}>⚠️ Database Standings Error</p>
          <p style={{ fontSize: "0.85rem", marginTop: "0.15rem", color: "var(--text-secondary)" }}>{error}</p>
        </motion.div>
      )}

      {/* Main Table Content */}
      <motion.div 
        className="f1-card" 
        style={{ padding: "1.5rem" }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="f1-spinner"></div>
            </motion.div>
          ) : standingsTab === "drivers" ? (
            <motion.div
              key="drivers-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="glow-text" style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Award size={18} style={{ color: "var(--f1-red)" }} /> Drivers&apos; World Championship Standings ({year})
              </h2>
              <div className="f1-table-wrapper">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px", textAlign: "center" }}>Pos</th>
                      <th>Driver</th>
                      <th>Constructor</th>
                      <th style={{ textAlign: "center" }}>Wins</th>
                      <th style={{ textAlign: "right" }}>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((d, idx) => {
                      const color = getTeamColor(d.team);
                      return (
                        <motion.tr 
                          key={idx} 
                          style={{ borderLeft: `3px solid ${color}` }}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * idx }}
                        >
                          <td style={{ textAlign: "center", fontWeight: 800, color: d.position <= 3 ? "gold" : "inherit" }}>
                            {d.position}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{
                                width: "32px",
                                height: "22px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--card-border)",
                                borderRadius: "3px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "0.75rem",
                                fontWeight: 900,
                                color: color
                              }}>
                                {d.driver}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700 }}>{d.driverFullName}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{d.team}</td>
                          <td style={{ textAlign: "center", fontWeight: 600, color: d.wins > 0 ? "white" : "var(--text-muted)" }}>{d.wins}</td>
                          <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)", fontSize: "1rem" }}>{d.points}</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="teams-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="glow-text" style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Shield size={18} style={{ color: "var(--f1-red)" }} /> Constructors&apos; World Championship Standings ({year})
              </h2>
              <div className="f1-table-wrapper">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px", textAlign: "center" }}>Pos</th>
                      <th>Constructor Team</th>
                      <th style={{ textAlign: "center" }}>Wins</th>
                      <th style={{ textAlign: "right" }}>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStandings.map((t, idx) => {
                      const color = getTeamColor(t.team);
                      return (
                        <motion.tr 
                          key={idx} 
                          style={{ borderLeft: `3px solid ${color}` }}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * idx }}
                        >
                          <td style={{ textAlign: "center", fontWeight: 800, color: t.position <= 3 ? "gold" : "inherit" }}>
                            {t.position}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{
                                width: "6px",
                                height: "24px",
                                background: color,
                                borderRadius: "3px"
                              }}></div>
                              <span style={{ fontWeight: 700 }}>{t.team}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, color: t.wins > 0 ? "white" : "var(--text-muted)" }}>{t.wins}</td>
                          <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)", fontSize: "1rem" }}>{t.points}</td>
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
