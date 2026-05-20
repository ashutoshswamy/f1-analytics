"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, LayoutDashboard, Activity, Flag, Trophy, Send, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/telemetry", label: "Telemetry", icon: Activity },
  { href: "/results", label: "Results", icon: Flag },
  { href: "/standings", label: "Standings", icon: Trophy },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="site-logo">
            <div className="logo-icon">
              <Gauge size={17} strokeWidth={2.5} />
            </div>
            <span className="logo-text">
              F1<span className="logo-text-light">ANALYTICS</span>
            </span>
          </Link>

          <nav className="site-nav">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link${active ? " nav-link-active" : ""}`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="header-right">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-badge"
            >
              <Send size={11} />
              <span>Bot Live</span>
              <span className="live-dot" />
            </a>

            <button
              className="mobile-menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`mobile-drawer${open ? " mobile-drawer-open" : ""}`}>
        <nav className="mobile-nav">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mobile-nav-link${active ? " mobile-nav-link-active" : ""}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mobile-drawer-footer">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-bot"
          >
            <Send size={14} />
            Telegram Bot Live
            <span className="live-dot" style={{ marginLeft: "auto" }} />
          </a>
        </div>
      </div>
    </>
  );
}
