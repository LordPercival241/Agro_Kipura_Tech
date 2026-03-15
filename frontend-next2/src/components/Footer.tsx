"use client";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Agro Kipura Tech</h4>
            <p>Inteligencia artificial al servicio de la agricultura peruana. Costa, Sierra y Selva.</p>
          </div>
          <div className="footer-col">
            <h4>Plataforma</h4>
            <a href="#overview" className="footer-link">Dashboard</a>
            <a href="#telemetry" className="footer-link">Telemetría</a>
            <a href="#charts" className="footer-link">Gráficos</a>
            <a href="#gallery" className="footer-link">Regiones</a>
          </div>
          <div className="footer-col">
            <h4>Estrategia</h4>
            <a href="#pillars" className="footer-link">Mercados Justos</a>
            <a href="#pillars" className="footer-link">Gestión Financiera</a>
            <a href="#pillars" className="footer-link">Adaptación Climática</a>
            <a href="#pillars" className="footer-link">Baja Conectividad</a>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <a href="#contacto" className="footer-link">Solicitar Asesoría</a>
            <a href="mailto:info@agrokipura.com" className="footer-link">info@agrokipura.com</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Agro Kipura Tech. Todos los derechos reservados. Perú.</p>
        </div>
      </div>
    </footer>
  );
}
