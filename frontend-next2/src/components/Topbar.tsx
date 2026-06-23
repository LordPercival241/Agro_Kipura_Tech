"use client";

interface TopbarProps {
  connectionStatus: "connecting" | "connected" | "disconnected";
  isSensorReady: boolean;
}

export default function Topbar({ connectionStatus, isSensorReady }: TopbarProps) {
  const handleThemeToggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("agroKipuraTheme", next);
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/export/csv");
      if (!response.ok) throw new Error("Error al descargar el archivo");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agro_kipura_historial_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download error:", error);
      alert("No se pudo descargar el historial. Asegúrate de que el backend esté corriendo.");
    }
  };

  const statusLabel = 
    connectionStatus === "connected" 
      ? (isSensorReady ? "CONECTADO" : "ESPERANDO SENSOR") 
      : (connectionStatus === "connecting" ? "Conectando..." : "SIN CONEXIÓN");
  
  const dotColor = 
    connectionStatus === "connected" 
      ? (isSensorReady ? "#2D8B4E" : "#C9A84C") 
      : (connectionStatus === "connecting" ? "#C9A84C" : "#EF4444");

  return (
    <div className="topbar">
      <h1 className="page-title">Transformando el campo peruano con inteligencia artificial</h1>
      <div className="topbar-actions">
        <div className="status-pill" style={connectionStatus !== "connecting" ? { color: dotColor, borderColor: `${dotColor}40` } : undefined}>
          <span className="status-dot" style={{ background: dotColor }} />
          {statusLabel}
        </div>
        <button className="btn-export-topbar" onClick={handleDownloadCSV} title="Descargar Historial Excel (CSV)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          <span>Exportar</span>
        </button>
        <button className="theme-toggle" onClick={handleThemeToggle} title="Cambiar tema" aria-label="Cambiar entre modo claro y oscuro">
          <svg className="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          <svg className="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
        </button>
      </div>

      <style jsx>{`
        .btn-export-topbar {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #10b981;
          padding: 0.45rem 0.9rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .btn-export-topbar:hover {
          background: #10b981;
          color: #fff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        [data-theme="dark"] .btn-export-topbar {
          background: rgba(16, 185, 129, 0.15);
        }
      `}</style>
    </div>
  );
}
