"use client";
import type { LatestData } from "@/hooks/useDashboardData";

export default function PredictionCard({ latest, onOpenAI }: { latest: LatestData | null; onOpenAI: () => void }) {
  const status = latest?.ml.status || "Analizando Sensores...";
  const alert = latest?.ml.alert || "Esperando recepción de primera telemetría del ESP32.";
  const color = latest?.ml.color || "var(--green-primary)";

  return (
    <section className="prediction-section" id="prediction-card" onClick={onOpenAI} style={{ cursor: 'pointer' }}>
      <div className="prediction-card ripple-effect">
        <div className="prediction-header">
          <div className="prediction-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" /><path d="M12 12V2" /><path d="M8 6c2 2 6 2 8 0" /></svg>
          </div>
          <div>
            <h3>Salud del Cultivo — IA Predictiva</h3>
            <p className="ai-confidence">Modelo: Árbol de Decisión · Exactitud: <strong>96.0%</strong></p>
          </div>
          <div className="open-hub-badge">VER DETALLE IA →</div>
        </div>
        <div className="prediction-body-premium">
          <div className="pb-status">
            <h2 className="ai-status" style={{ color }}>{status}</h2>
            <p className="ai-alert">{alert}</p>
          </div>
          
          <div className="pb-risk-summary">
            <div className="mini-risk-item">
              <span className="mr-label">Hongos</span>
              <div className="mr-bar"><div className="mr-fill" style={{ width: (latest?.raw.humidity_air_pct || 0) > 80 ? '70%' : '15%', background: '#F59E0B' }}></div></div>
            </div>
            <div className="mini-risk-item">
              <span className="mr-label">Plagas</span>
              <div className="mr-bar"><div className="mr-fill" style={{ width: (latest?.raw.temperature_c || 0) > 25 ? '80%' : '20%', background: '#EF4444' }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .prediction-body-premium { display: flex; align-items: center; justify-content: space-between; padding: 1.8rem 1.4rem; gap: 30px; }
        .pb-status { flex: 1; text-align: left; }
        .pb-risk-summary { display: flex; flex-direction: column; gap: 12px; min-width: 140px; }
        .mini-risk-item { display: flex; flex-direction: column; gap: 4px; }
        .mr-label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .mr-bar { width: 100%; height: 4px; background: rgba(0,0,0,0.05); border-radius: 2px; overflow: hidden; }
        .mr-fill { height: 100%; transition: width 0.5s ease; }
        .open-hub-badge { margin-left: auto; font-size: 0.7rem; font-weight: 800; color: var(--green-primary); }
        .ripple-effect { position: relative; overflow: hidden; }
        @media (max-width: 600px) { .prediction-body-premium { flex-direction: column; text-align: center; } .pb-status { text-align: center; } }
      `}</style>
    </section>
  );
}
