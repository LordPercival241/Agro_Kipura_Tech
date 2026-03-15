"use client";
import type { LatestData } from "@/hooks/useDashboardData";

export default function TelemetryGrid({ latest }: { latest: LatestData | null }) {
  const temp = latest ? `${latest.raw.temperature_c.toFixed(1)} °C` : "-- °C";
  const dew = latest ? `Punto de Rocío: ${latest.features.dew_point_c.toFixed(1)} °C` : "Punto Rocío: -- °C";
  const soil = latest ? `${latest.raw.soil_m_analog.toFixed(0)} RC` : "-- RC";
  const vpd = latest ? `${latest.features.vpd_kpa.toFixed(2)} kPa` : "-- kPa";
  const rh = latest ? `Humedad Relativa: ${latest.raw.humidity_air_pct.toFixed(0)} %` : "Humedad Relativa: -- %";
  const light = latest ? `${latest.raw.light_analog.toFixed(0)} RL` : "-- RL";
  const pressure = latest ? `Presión Atm.: ${(latest.raw.pressure_pa / 100).toFixed(1)} hPa` : "Presión Atm.: -- hPa";

  const tempPct = latest ? Math.min(100, (latest.raw.temperature_c / 45) * 100) : 0;
  const soilPct = latest ? Math.min(100, (latest.raw.soil_m_analog / 4095) * 100) : 0;
  const vpdPct = latest ? Math.min(100, (latest.features.vpd_kpa / 3) * 100) : 0;
  const lightPct = latest ? Math.min(100, (latest.raw.light_analog / 4095) * 100) : 0;

  return (
    <section className="telemetry-section" id="telemetry">
      <div className="section-header"><h3>Telemetría en Tiempo Real</h3></div>
      <div className="telemetry-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-icon-badge temp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /></svg>
            </span>
            <span className="metric-label">Temperatura Dosel</span>
          </div>
          <div className="metric-value">{temp}</div>
          <div className="metric-sub">{dew}</div>
          <div className="metric-bar"><div className="metric-bar-fill temp-bar" style={{ width: `${tempPct}%` }} /></div>
        </div>
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-icon-badge soil">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>
            </span>
            <span className="metric-label">Humedad Suelo</span>
          </div>
          <div className="metric-value">{soil}</div>
          <div className="metric-sub">Lectura Capacitiva</div>
          <div className="metric-bar"><div className="metric-bar-fill soil-bar" style={{ width: `${soilPct}%` }} /></div>
        </div>
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-icon-badge vpd">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>
            </span>
            <span className="metric-label">Déficit Presión (VPD)</span>
          </div>
          <div className="metric-value">{vpd}</div>
          <div className="metric-sub">{rh}</div>
          <div className="metric-bar"><div className="metric-bar-fill vpd-bar" style={{ width: `${vpdPct}%` }} /></div>
        </div>
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-icon-badge light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg>
            </span>
            <span className="metric-label">Luz / Presión Atm.</span>
          </div>
          <div className="metric-value">{light}</div>
          <div className="metric-sub">{pressure}</div>
          <div className="metric-bar"><div className="metric-bar-fill light-bar" style={{ width: `${lightPct}%` }} /></div>
        </div>
      </div>
    </section>
  );
}
