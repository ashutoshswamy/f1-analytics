"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flag,
  Trophy,
  Clock,
  ChevronRight,
  Zap,
  Calendar,
  MapPin,
  Play,
  AlertTriangle,
} from "lucide-react";

function PosBadge({ pos }) {
  const cls =
    pos === 1 ? "pos-p1" : pos === 2 ? "pos-p2" : pos === 3 ? "pos-p3" : "pos-default";
  return <span className={`pos-badge ${cls}`}>{pos}</span>;
}

export default function Dashboard() {
  const [nextRace, setNextRace] = useState(null);
  const [lastRace, setLastRace] = useState(null);
  const [loadingNext, setLoadingNext] = useState(true);
  const [loadingLast, setLoadingLast] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://f1analytics.ashutoshswamy.in/api/next_race")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load next race");
        return res.json();
      })
      .then((data) => { setNextRace(data); setLoadingNext(false); })
      .catch(() => setLoadingNext(false));

    fetch("https://f1analytics.ashutoshswamy.in/api/last_race")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load last race");
        return res.json();
      })
      .then((data) => { setLastRace(data); setLoadingLast(false); })
      .catch((err) => {
        setLoadingLast(false);
        setError("Unable to connect to the F1 backend. Ensure `python run.py` is running.");
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Hero */}
      <motion.div
        className="f1-card"
        style={{
          background: "linear-gradient(135deg, rgba(225,6,0,0.1) 0%, var(--card-bg) 55%)",
          borderLeft: "3px solid var(--f1-red)",
          padding: "2.5rem 2rem",
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="hero-card-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <p className="page-eyebrow">Formula 1 · Season 2026</p>
            <h1
              style={{
                fontFamily: "var(--font-rajdhani)",
                fontSize: "2.6rem",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                marginBottom: "0.65rem",
              }}
            >
              <span style={{ color: "var(--f1-red)" }}>F1</span> Analytics Hub
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "520px", lineHeight: 1.65 }}>
              Explore telemetry overlays, speed comparisons, head-to-head matchups,
              and live season standings — synced with the Telegram bot.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
            <Link href="/telemetry" style={{ textDecoration: "none" }}>
              <motion.button
                className="f1-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap size={15} /> Compare Telemetry
              </motion.button>
            </Link>
            <Link href="/standings" style={{ textDecoration: "none" }}>
              <motion.button
                className="f1-btn"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)" }}
                whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
              >
                View Standings
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          className="error-banner"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertTriangle size={18} style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="error-banner-title">Backend Connection Error</p>
            <p className="error-banner-body">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem", alignItems: "start" }}>

        {/* Upcoming Race */}
        <motion.div
          className="f1-card"
          style={{ display: "flex", flexDirection: "column" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          whileHover={{ y: -3 }}
        >
          <div className="card-header">
            <span className="card-title">
              <Clock size={16} style={{ color: "var(--f1-red)" }} />
              Upcoming Grand Prix
            </span>
            <span className="f1-badge">Countdown</span>
          </div>

          {loadingNext ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
              <div className="f1-spinner" />
            </div>
          ) : nextRace?.completed ? (
            <div className="empty-state">
              <Trophy size={44} className="empty-state-icon" style={{ color: "gold", opacity: 1 }} />
              <p className="empty-state-title">Season Completed</p>
              <p className="empty-state-desc">All scheduled rounds have been completed.</p>
            </div>
          ) : nextRace ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flexGrow: 1 }}>
              <div>
                <h3 className="glow-text" style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "var(--font-rajdhani)", letterSpacing: "0.02em" }}>
                  {nextRace.raceName}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Calendar size={13} /> Round {nextRace.round} &middot; {nextRace.circuitName}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <MapPin size={13} /> {nextRace.locality}, {nextRace.country}
                </p>
              </div>

              <div className="countdown-grid">
                {[
                  { value: nextRace.countdown.days, label: "Days" },
                  { value: nextRace.countdown.hours, label: "Hours" },
                  { value: nextRace.countdown.minutes, label: "Mins" },
                ].map(({ value, label }) => (
                  <motion.div key={label} className="countdown-box" whileHover={{ scale: 1.04 }}>
                    <div className="countdown-value">{value}</div>
                    <div className="countdown-label">{label}</div>
                  </motion.div>
                ))}
              </div>

              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                  Weekend Schedule (UTC)
                </p>
                <div className="session-list">
                  {nextRace.sessions.map((s, idx) => (
                    <div key={idx} className="session-row">
                      <span className="session-name">
                        <Play size={9} style={{ color: "var(--f1-red)" }} />
                        {s.session}
                      </span>
                      <span className="session-time">
                        {s.date} {s.time.replace("Z", "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-desc">Upcoming race schedule temporarily unavailable.</p>
            </div>
          )}
        </motion.div>

        {/* Last Race */}
        <motion.div
          className="f1-card"
          className="grid-span-2"
          style={{ display: "flex", flexDirection: "column" }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          whileHover={{ y: -3 }}
        >
          <div className="card-header">
            <span className="card-title">
              <Trophy size={16} style={{ color: "var(--f1-red)" }} />
              Last Race Results
            </span>
            {lastRace && <span className="f1-badge"><Flag size={10} /> Round {lastRace.round}</span>}
          </div>

          {loadingLast ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
              <div className="f1-spinner" />
            </div>
          ) : lastRace ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3
                    className="glow-text"
                    style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-rajdhani)", letterSpacing: "0.02em" }}
                  >
                    {lastRace.raceName}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={13} /> {lastRace.circuit} &middot; {lastRace.locality}, {lastRace.country}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</p>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", marginTop: "0.15rem" }}>{lastRace.date}</p>
                </div>
              </div>

              <div className="f1-table-wrapper">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: 52, textAlign: "center" }}>Pos</th>
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
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 * idx }}
                      >
                        <td style={{ textAlign: "center" }}>
                          <PosBadge pos={r.position} />
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{r.driver}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{r.driverFullName}</div>
                        </td>
                        <td style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{r.team}</td>
                        <td style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                          {r.grid}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 800, color: "var(--f1-red)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                          +{r.points}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: "right" }}>
                <Link
                  href="/results"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    color: "var(--f1-red)",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Full Race Archive <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-desc">Race classification temporarily unavailable.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
