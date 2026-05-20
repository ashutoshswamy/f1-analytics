import { Outfit, Rajdhani, JetBrains_Mono } from "next/font/google";
import { Gauge, CheckCircle2, Bot, Wifi } from "lucide-react";
import NavBar from "./components/NavBar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata = {
  title: "F1 Analytics Hub — Telemetry & Race Data",
  description:
    "Premium Formula 1 real-time statistics, live standings, circuit telemetry comparisons, and interactive speed plots.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <div className="app-container">
          <NavBar />

          <main className="main-content">{children}</main>

          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <Gauge size={15} style={{ color: "var(--f1-red)" }} />
                <span>F1 Analytics Hub</span>
              </div>
              <p className="footer-description">
                Real-time caching powered by <strong>FastF1</strong> Python API
                and <strong>Jolpi Ergast F1 Mirror</strong>.
              </p>
              <div className="footer-status">
                <span className="status-item">
                  <CheckCircle2 size={12} style={{ color: "#22c55e" }} />
                  Caching Enabled
                </span>
                <span className="status-divider">·</span>
                <span className="status-item">
                  <Bot size={12} style={{ color: "#60a5fa" }} />
                  Bot Connected
                </span>
                <span className="status-divider">·</span>
                <span className="status-item">
                  <Wifi size={12} style={{ color: "#a78bfa" }} />
                  API Active
                </span>
              </div>
              <p className="footer-legal">
                © 2026 F1 Analytics Hub. Unofficial fan application.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
