"use client";
import React, { useState } from "react";
import StrategicHub from "./StrategicHub";
import type { LatestData } from "@/hooks/useDashboardData";

export default function ServicesPillars({ 
  latest, 
  history, 
  activePillar, 
  setActivePillar 
}: { 
  latest: LatestData | null;
  history: any[];
  activePillar: string | null;
  setActivePillar: (id: string | null) => void;
}) {

  const pillars = [
    {
      id: "ai",
      title: "Agro-Brain (IA)",
      icon: "🧠",
      desc: "Predicción de maduración y alertas preventivas de plagas.",
      status: "Activo",
      chip: "Predicción: 85%",
      color: "var(--blue-primary)",
    },
    {
      id: "credit",
      title: "Agro-Score (Crédito)",
      icon: "💳",
      desc: "Historial crediticio digital basado en estabilidad de cultivo.",
      status: "Disponible",
      chip: "Score: 92/100",
      color: "var(--map-sierra)",
    },
    {
      id: "trace",
      title: "Trazabilidad QR",
      icon: "🏷️",
      desc: "Certificado de calidad exportable para mercados globales.",
      status: "Generando",
      chip: "Lote: #A-2025",
      color: "var(--accent-gold)",
    },
    {
      id: "carbon",
      title: "Bonos de Carbono",
      icon: "🌱",
      desc: "Monetización por salud de suelo y captura de CO2.",
      status: "Monitoreando",
      chip: "2.4 ton CO2/ha",
      color: "var(--green-primary)",
    },
  ];

  return (
    <section className="services-pillars-section" id="servicios">
      <div className="section-header">
        <h3>Estrategia de Maximización de Datos</h3>
        <p>Transformamos la telemetría en activos financieros y operativos inteligentes.</p>
      </div>

      <div className="pillars-grid">
        {pillars.map((p) => (
          <div key={p.id} className="pillar-card-modern" onClick={() => setActivePillar(p.id)}>
            <div className="pillar-icon-wrapper" style={{ background: `${p.color}15`, color: p.color }}>
              <span className="pillar-emoji">{p.icon}</span>
            </div>
            <div className="pillar-content">
              <div className="pillar-header">
                <h4>{p.title}</h4>
                <span className="pillar-chip" style={{ background: `${p.color}20`, color: p.color }}>{p.chip}</span>
              </div>
              <p>{p.desc}</p>
              <div className="pillar-footer">
                <span className="pillar-status">
                  <span className="status-dot" style={{ background: p.color }} />
                  {p.status}
                </span>
                <button className="pillar-action-btn" style={{ color: p.color }} onClick={() => setActivePillar(p.id)}>
                  Ver Detalle →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <StrategicHub
        activePillar={activePillar}
        onClose={() => setActivePillar(null)}
        latest={latest}
        history={history}
      />

      <style jsx>{`
        .services-pillars-section {
          padding: 60px 0;
        }
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .pillar-card-modern {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 30px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 22px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .pillar-card-modern:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .pillar-card-modern::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at top right, rgba(255,255,255,0.05), transparent);
          pointer-events: none;
        }
        .pillar-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: inset 0 0 15px rgba(255,255,255,0.05);
        }
        .pillar-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .pillar-header h4 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .pillar-chip {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }
        .pillar-card-modern p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }
        .pillar-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid var(--border-color);
        }
        .pillar-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        .pillar-action-btn {
          background: none;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s;
        }
        .pillar-action-btn:hover {
          transform: translateX(4px);
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
