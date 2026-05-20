"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flag, Trophy, Clock, ChevronRight, Zap, Calendar, MapPin, Play } from "lucide-react";

export default function Dashboard() {
  const [nextRace, setNextRace] = useState(null);
  const [lastRace, setLastRace] = useState(null);
  const [loadingNext, setLoadingNext] = useState(true);
  const [loadingLast, setLoadingLast] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Next Race Countdown
    fetch("http://localhost:8000/api/next_race")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load next race");
        return res.json();
      })
      .then((data) => {
        setNextRace(data);
        setLoadingNext(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingNext(false);
      });

    // Fetch Last Race Results
    fetch("http://localhost:8000/api/last_race")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load last race");
        return res.json();
      })
      .then((data) => {
        setLastRace(data);
        setLoadingLast(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingLast(false);
        setError("Unable to connect to the F1 backend. Ensure `python run.py` is running.");
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Hero Welcome banner */}
      <motion.div 
        className="f1-card" 
        style={{
          background: "linear-gradient(135deg, rgba(225, 6, 0, 0.15) 0%, rgba(16, 18, 27, 0.9) 100%)",
          borderLeft: "4px solid var(--f1-red)",
          padding: "2.5rem 2rem",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <h1 className="glow-text" style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Flag size={28} style={{ color: "var(--f1-red)" }} /> F1 Analytics Hub
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "800px" }}>
              Explore visual telemetry overlays, look up driver speed metrics, track head-to-head match-ups, and review live season classifications. Synchronized instantly with your Telegram Bot.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/telemetry" style={{ textDecoration: "none" }}>
              <motion.button 
                className="f1-btn" 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--f1-red-glow)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={16} /> Compare Telemetry
              </motion.button>
            </Link>
            <Link href="/standings" style={{ textDecoration: "none" }}>
              <motion.button 
                className="f1-btn" 
                style={{ backgroundColor: "#202430", border: "1px solid var(--card-border)" }}
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                View Standings
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          className="f1-card" 
          style={{ borderLeft: "4px solid #ef4444", background: "rgba(239, 68, 68, 0.08)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p style={{ color: "#f87171", fontWeight: "600" }}>⚠️ Backend Connection Status</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.25rem", color: "var(--text-secondary)" }}>{error}</p>
        </motion.div>
      )}

      {/* Main Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
        alignItems: "start"
      }}>
        {/* Upcoming Race Countdown */}
        <motion.div 
          className="f1-card" 
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -4, borderColor: "var(--card-hover-border)", boxShadow: "0 8px 32px 0 var(--f1-red-glow)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={20} style={{ color: "var(--f1-red)" }} /> Upcoming Grand Prix
            </h2>
            <span className="f1-badge">Countdown</span>
          </div>

          {loadingNext ? (
            <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
              <div className="f1-spinner"></div>
            </div>
          ) : nextRace?.completed ? (
            <div style={{ textAlign: "center", padding: "2rem 0", flexGrow: 1 }}>
              <Trophy size={48} style={{ color: "gold", marginBottom: "1rem" }} />
              <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>Season Completed</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>All scheduled rounds have been completed.</p>
            </div>
          ) : nextRace ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flexGrow: 1 }}>
              <div>
                <h3 className="glow-text" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{nextRace.raceName}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Calendar size={14} /> Round {nextRace.round} | {nextRace.circuitName}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <MapPin size={14} /> {nextRace.locality}, {nextRace.country}
                </p>
              </div>

              {/* Visual Countdown grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid var(--card-border)"
              }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "white" }}>{nextRace.countdown.days}</p>
                  <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Days</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "white" }}>{nextRace.countdown.hours}</p>
                  <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Hours</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "white" }}>{nextRace.countdown.minutes}</p>
                  <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Mins</p>
                </motion.div>
              </div>

              {/* Sessions Schedule */}
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                  Weekend Schedule (UTC)
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {nextRace.sessions.map((s, idx) => (
                    <div key={idx} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem",
                      background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                      borderRadius: "4px",
                      fontSize: "0.85rem"
                    }}>
                      <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Play size={10} style={{ color: "var(--f1-red)" }} /> {s.session}
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>{s.date} {s.time.replace("Z", "")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>Upcoming race schedule details temporarily unavailable.</p>
            </div>
          )}
        </motion.div>

        {/* Last Completed GP classification */}
        <motion.div 
          className="f1-card" 
          style={{ gridColumn: "span 2", display: "flex", flexDirection: "column" }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -4, borderColor: "var(--card-hover-border)", boxShadow: "0 8px 32px 0 var(--f1-red-glow)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Trophy size={20} style={{ color: "var(--f1-red)" }} /> Last Race Results
            </h2>
            {lastRace && <span className="f1-badge">Round {lastRace.round}</span>}
          </div>

          {loadingLast ? (
            <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <div className="f1-spinner"></div>
            </div>
          ) : lastRace ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 className="glow-text" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{lastRace.raceName}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={14} /> {lastRace.circuit} ({lastRace.locality}, {lastRace.country})
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Session Date</p>
                  <p style={{ fontWeight: 600 }}>{lastRace.date}</p>
                </div>
              </div>

              <div className="f1-table-wrapper">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px", textAlign: "center" }}>Pos</th>
                      <th>Driver</th>
                      <th>Constructor</th>
                      <th style={{ textAlign: "center" }}>Grid</th>
                      <th style={{ textAlign: "right" }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastRace.results.map((r, idx) => (
                      <motion.tr 
                        key={idx} 
                        style={{
                          borderLeft: r.position <= 3 ? "3px solid #ffcc00" : "none" // Gold touch for podium finishes
                        }}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
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
                        <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)" }}>
                          +{r.points}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: "right" }}>
                <Link href="/results" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  color: "var(--f1-red)",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase"
                }}>
                  Search Full Race Archive <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>Race classification database temporarily unavailable.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
