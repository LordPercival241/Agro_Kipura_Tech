"use client";

interface TopbarProps {
  connectionStatus: "connecting" | "connected" | "disconnected";
}

export default function Topbar({ connectionStatus }: TopbarProps) {
  const handleThemeToggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("agroKipuraTheme", next);
  };

  const statusLabel = connectionStatus === "connected" ? "CONECTADO" : connectionStatus === "connecting" ? "Conectando..." : "SIN CONEXIÓN";
  const dotColor = connectionStatus === "connected" ? "#2D8B4E" : connectionStatus === "connecting" ? "#C9A84C" : "#EF4444";

  return (
    <div className="topbar">
      <h1 className="page-title">Transformando el campo peruano con inteligencia artificial</h1>
      <div className="topbar-actions">
        <div className="status-pill" style={connectionStatus !== "connecting" ? { color: dotColor, borderColor: `${dotColor}40` } : undefined}>
          <span className="status-dot" style={{ background: dotColor }} />
          {statusLabel}
        </div>
        <button className="theme-toggle" onClick={handleThemeToggle} title="Cambiar tema" aria-label="Cambiar entre modo claro y oscuro">
          <svg className="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          <svg className="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
        </button>
      </div>
    </div>
  );
}
