"use client";
import { useEffect, useState, useCallback } from "react";

interface SidebarProps {
  userName: string;
  onLogout: () => void;
}

const navItems = [
  { section: "overview", label: "Dashboard", icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></> },
  { section: "telemetry", label: "Telemetría", icon: <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /> },
  { section: "servicios", label: "Servicios", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></> },
  { section: "charts", label: "Gráficos", icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
  { section: "pillars", label: "Nuestra Estrategia", icon: <><path d="M2 20h20" /><path d="M5 20V10l7-7 7 7v10" /><path d="M9 20v-4h6v4" /></> },
  { section: "mapa", label: "Mapa del Perú", icon: <><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></> },
  { section: "gallery", label: "Regiones", icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></> },
  { section: "contacto", label: "Contacto", icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
];

export default function Sidebar({ userName, onLogout }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = useCallback((section: string) => {
    setActiveSection(section);
    const target = document.getElementById(section);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.innerWidth <= 992) setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      let current = "";
      for (const item of navItems) {
        const el = document.getElementById(item.section);
        if (el) {
          const top = el.offsetTop;
          const height = el.clientHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = item.section;
          }
        }
      }
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile toggle */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menú"
        style={{ display: "none", position: "fixed", top: 18, left: 16, zIndex: 200, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 8, padding: "0.35rem", cursor: "pointer" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>

      {isOpen && <div className="sidebar-backdrop active" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 40 40" width="34" height="34">
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--green-light)" strokeWidth="2" />
              <path d="M20 8 C12 14, 10 22, 20 32 C30 22, 28 14, 20 8Z" fill="var(--green-light)" opacity="0.8" />
              <path d="M20 12 C15 16, 14 22, 20 28 C26 22, 25 16, 20 12Z" fill="var(--green-accent)" opacity="0.6" />
            </svg>
            <div>
              <h2>Agro <span>Kipura</span></h2>
              <small>Tech Platform</small>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a href="#" key={item.section} className={`nav-item ${activeSection === item.section ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.section); }}>
              <svg className="nav-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
              <span className="nav-text">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">Productor</span>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout} title="Cerrar Sesión">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </div>
      </aside>
    </>
  );
}
