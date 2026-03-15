"use client";
import type { LatestData } from "@/hooks/useDashboardData";

export default function PredictionCard({ latest }: { latest: LatestData | null }) {
  const status = latest?.ml.status || "Analizando Sensores...";
  const alert = latest?.ml.alert || "Esperando recepción de primera telemetría del ESP32.";
  const color = latest?.ml.color || "var(--green-primary)";

  return (
    <section className="prediction-section" id="prediction-card">
      <div className="prediction-card">
        <div className="prediction-header">
          <div className="prediction-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" /><path d="M12 12V2" /><path d="M8 6c2 2 6 2 8 0" /></svg>
          </div>
          <div>
            <h3>Salud del Cultivo — IA Predictiva</h3>
            <p className="ai-confidence">Confianza Modelo LightGBM: <strong>92.5%</strong></p>
          </div>
        </div>
        <div className="prediction-body">
          <h2 className="ai-status" style={{ color }}>{status}</h2>
          <p className="ai-alert">{alert}</p>
        </div>
      </div>
    </section>
  );
}
