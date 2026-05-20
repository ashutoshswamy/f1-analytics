import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title: "🏎️ F1 Telemetry & Analytics Hub",
  description: "Premium Formula 1 real-time statistics, live standings, circuit telemetry comparisons, and interactive speed plots.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased">
        <div className="app-container">
          {/* Header Navigation */}
          <header style={{
            background: "rgba(10, 11, 16, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            padding: "1rem 2rem",
          }}>
            <div style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <Link href="/" style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                color: "inherit"
              }}>
                <span className="glow-text" style={{
                  color: "var(--f1-red)",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  fontFamily: "var(--font-outfit)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}>
                  🏎️ F1<span style={{ color: "white" }}>ANALYTICS</span>
                </span>
              </Link>

              <nav style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center"
              }}>
                <Link href="/" style={{
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  transition: "color 0.2s"
                }} className="nav-link">
                  Dashboard
                </Link>
                <Link href="/telemetry" style={{
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  transition: "color 0.2s"
                }} className="nav-link">
                  Telemetry Comparison
                </Link>
                <Link href="/results" style={{
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  transition: "color 0.2s"
                }} className="nav-link">
                  Race Results
                </Link>
                <Link href="/standings" style={{
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  transition: "color 0.2s"
                }} className="nav-link">
                  Standings
                </Link>
              </nav>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="f1-badge" style={{ textDecoration: "none" }}>
                  <span>📢 Telegram Bot Live</span>
                </a>
              </div>
            </div>
          </header>

          {/* Main App Workspace */}
          <main className="main-content">
            {children}
          </main>

          {/* Premium Footer */}
          <footer style={{
            background: "#050609",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            padding: "2.5rem 2rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textAlign: "center"
          }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
              <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: 600 }}>
                🏎️ F1 Telemetry & Analytics Dashboard
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Real-time caching powered by <strong>FastF1</strong> Python API and <strong>Jolpi Ergast F1 Mirror</strong>.
              </p>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                marginTop: "1rem",
                fontSize: "0.8rem"
              }}>
                <span>🏁 Caching Enabled</span>
                <span>•</span>
                <span>🤖 Bot Connected</span>
                <span>•</span>
                <span>⚡ Live API Status: Active</span>
              </div>
              <p style={{ marginTop: "1.5rem", fontSize: "0.75rem" }}>
                © 2026 F1 Analytics Hub. Built for Formula 1 enthusiasts. Unofficial fan application.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
