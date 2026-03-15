"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Radar } from "react-chartjs-2";
import { generatePDF } from "../utils/pdfGenerator";
import { FinancialReport } from "./ReportTemplates/FinancialReport";
import { CropReport } from "./ReportTemplates/CropReport";
import { CarbonReport } from "./ReportTemplates/CarbonReport";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);

interface StrategicHubProps {
  activePillar: string | null;
  onClose: () => void;
}

export default function StrategicHub({ activePillar, onClose }: StrategicHubProps) {
  if (!activePillar) return null;

  // Custom Chart Style Constants
  const glassEffect = "rgba(255, 255, 255, 0.05)";
  const accentGreen = "#10B981";
  const accentBlue = "#3B82F6";
  const accentGold = "#F59E0B";
  const accentRed = "#EF4444";

  const renderAIContent = () => {
    const data = {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
      datasets: [
        {
          label: "VPD (Vapor Pressure Deficit) kPa",
          data: [0.2, 0.4, 1.2, 2.8, 2.4, 0.8, 0.3],
          borderColor: accentBlue,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: accentBlue,
        },
        {
          label: "Estrés Estomático (Predicho)",
          data: [5, 5, 20, 85, 70, 15, 5],
          borderColor: accentRed,
          backgroundColor: "transparent",
          borderDash: [5, 5],
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    };

    const handleDownloadCropPDF = async () => {
      const template = document.getElementById('crop-report-template');
      if (template) template.style.display = 'block';
      await generatePDF('crop-report-template', `REPORTE_CULTIVO_${new Date().toISOString().slice(0, 10)}.pdf`);
      if (template) template.style.display = 'none';
    };

    return (
      <div className="premium-view">
        <header className="premium-header">
          <div className="header-icon ai-glow">🧠</div>
          <div className="header-text">
            <h2>Agro-Brain IA: Bio-Métrica Cuántica</h2>
            <p>Análisis de correlación multivariable entre microclisma, VPD y fotosíntesis neta.</p>
          </div>
          <button className="download-report-btn" onClick={handleDownloadCropPDF}>
            <span className="btn-icon">📥</span> REPORTE TÉCNICO
          </button>
        </header>

        {/* Hidden Template for PDF */}
        <CropReport data={{
          farmName: "Fundo Santa Rosa",
          vpd: "1.45",
          gdd: "840",
          cropStage: "Floración avanzada",
          healthScore: "Óptimo (85%)"
        }} />

        <div className="premium-grid">
          <div className="main-viz glass-panel">
            <div className="chart-header">
              <h4>Correlación VPD vs. Respuesta Foliar</h4>
              <span className="live-tag">LIVE ANALYSIS</span>
            </div>
            <div className="chart-wrapper">
              <Line data={data} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "rgba(255,255,255,0.5)" } },
                  x: { grid: { display: false }, ticks: { color: "rgba(255,255,255,0.5)" } }
                },
                plugins: { legend: { labels: { color: "#fff", font: { size: 10 } } } }
              }} />
            </div>
          </div>

          <div className="side-analytics">
            <div className="metric-box glass-panel">
              <span className="mb-label">VPD Actual</span>
              <span className="mb-value">1.45 <small>kPa</small></span>
              <div className="mb-indicator warning" style={{ width: "70%" }}></div>
              <p className="mb-desc">Transpiración acelerada. Riesgo de cierre estomático en 2h.</p>
            </div>
            <div className="metric-box glass-panel">
              <span className="mb-label">GDD (Thermal Sum)</span>
              <span className="mb-value">840 <small>°C/día</small></span>
              <div className="mb-indicator success" style={{ width: "85%" }}></div>
              <p className="mb-desc">Etapa fenológica: **Floración avanzada**. Consumo hídrico máximo.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCreditContent = () => {
    const radarData = {
      labels: ["Estabilidad Hídrica", "Resiliencia Térmica", "Eficiencia Nutricional", "Sostenibilidad CO2", "Integridad de Datos IoT"],
      datasets: [
        {
          label: "Tu Perfil (Fundo Santa Rosa)",
          data: [95, 82, 88, 94, 100],
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          borderColor: accentGreen,
          borderWidth: 2,
          pointBackgroundColor: accentGreen,
        },
        {
          label: "Top 10% Regional",
          data: [90, 85, 92, 80, 95],
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: accentBlue,
          borderWidth: 1,
          borderDash: [2, 2],
          pointRadius: 0,
        },
      ],
    };

    return (
      <div className="premium-view">
        <header className="premium-header">
          <div className="header-icon credit-glow">💎</div>
          <div className="header-text">
            <h2>Agro-Score: Intelligence Financial Hub</h2>
            <p>Tu solvencia técnica transformada en competitividad financiera de alto nivel.</p>
          </div>
        </header>

        <div className="premium-grid items-center">
          <div className="radar-viz glass-panel">
            <Radar data={radarData} options={{ 
              scales: { 
                r: { 
                  grid: { color: "rgba(255,255,255,0.1)" }, 
                  angleLines: { color: "rgba(255,255,255,0.1)" }, 
                  pointLabels: { color: "rgba(255,255,255,0.7)", font: { size: 11, weight: "bold" } },
                  ticks: { display: false }
                } 
              }, 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom", labels: { color: "#fff", padding: 20 } } }
            }} />
          </div>

          <div className="report-generator glass-panel gold-border">
            <div className="report-seal">
              <svg viewBox="0 0 100 100" width="60">
                <circle cx="50" cy="50" r="45" fill="none" stroke={accentGold} strokeWidth="2" strokeDasharray="5 2" />
                <path d="M30 50 L45 65 L70 35" fill="none" stroke={accentGold} strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Financial Evidence Report</h3>
            <div className="report-metrics">
              <div className="rm-row"><span>Risk Rating:</span> <strong>AAA+</strong></div>
              <div className="rm-row"><span>Sensor Uptime:</span> <strong>99.98%</strong></div>
              <div className="rm-row"><span>Water Efficiency:</span> <strong>+24% vs Avg</strong></div>
            </div>
            <button className="gold-action-btn" onClick={async () => {
              const template = document.getElementById('financial-report-template');
              if (template) template.style.display = 'block';
              await generatePDF('financial-report-template', `EXPEDIENTE_BANCARIO_${new Date().toISOString().slice(0, 10)}.pdf`);
              if (template) template.style.display = 'none';
            }}>
              <span className="btn-icon">📄</span> GENERAR EXPEDIENTE BANCARIO
            </button>
            <p className="footer-note">Verificado mediante algoritmos de integridad de Agro Kipura Tech.</p>

            {/* Hidden Template for PDF */}
            <FinancialReport data={{
              farmName: "Fundo Santa Rosa",
              riskRating: "AAA+",
              sensorUptime: "99.98%",
              waterEfficiency: "+24%",
              valuation: "250,000.00",
              roiProjected: "18.5%",
              iotIntegrityScore: "100%",
              operationalCost: "-12% (IA Optimized)"
            }} />
          </div>
        </div>
      </div>
    );
  };

  const renderTraceabilityContent = () => {
    return (
      <div className="premium-view">
        <header className="premium-header">
          <div className="header-icon trace-glow">🏷️</div>
          <div className="header-text">
            <h2>Pasaporte Digital: Trazabilidad Global</h2>
            <p>La historia inmutable de cada fruto, desde la raíz hasta el mercado global.</p>
          </div>
        </header>

        <div className="passport-container-modern glass-panel">
          <div className="passport-inner">
            <div className="passport-header-brand">
              <div className="brand-logotype">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="none" stroke={accentGreen} strokeWidth="1" />
                  <path d="M20 8 L20 32 M12 20 L28 20" stroke={accentGreen} strokeWidth="2" opacity="0.5" />
                  <circle cx="20" cy="20" r="5" fill={accentGreen} />
                </svg>
                <span>AGRO KIPURA <strong>CERTIFIED</strong></span>
              </div>
              <div className="passport-id">ID-BATCH: #AK-2026-PE-04</div>
            </div>

            <div className="passport-body">
              <div className="passport-qr-section">
                <div className="qr-wrapper">
                  <svg viewBox="0 0 100 100" width="140" height="140">
                    <rect width="100" height="100" fill="#fff" />
                    {/* Simplified QR Pattern */}
                    <rect x="10" y="10" width="20" height="20" fill="#000" />
                    <rect x="70" y="10" width="20" height="20" fill="#000" />
                    <rect x="10" y="70" width="20" height="20" fill="#000" />
                    <rect x="40" y="40" width="20" height="20" fill="#000" />
                    <rect x="50" y="70" width="10" height="10" fill="#333" />
                  </svg>
                </div>
                <div className="batch-status-chip">STATUS: EXPORT READY</div>
              </div>

              <div className="passport-details-grid">
                <div className="pd-item">
                  <span className="pd-label">VARIEDAD</span>
                  <span className="pd-value">Blueberry (Biloxi)</span>
                </div>
                <div className="pd-item">
                  <span className="pd-label">GDD ACUMULADO</span>
                  <span className="pd-value">1,240 °D</span>
                </div>
                <div className="pd-item">
                  <span className="pd-label">ORIGEN</span>
                  <span className="pd-value">Valle de Olmos, Perú</span>
                </div>
                <div className="pd-item">
                  <span className="pd-label">HUELLA HÍDRICA</span>
                  <span className="pd-value">Low (0.42 m³/kg)</span>
                </div>
                <div className="pd-item large">
                  <span className="pd-label">LOG DE INTEGRIDAD SENSORIAL</span>
                  <div className="integrity-bar">
                    <div className="ib-segment success"></div>
                    <div className="ib-segment success"></div>
                    <div className="ib-segment success"></div>
                    <div className="ib-segment warning"></div>
                    <div className="ib-segment success"></div>
                    <div className="ib-segment success"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCarbonContent = () => {
    const barsData = {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datasets: [
        {
          label: "Captura Real (ton CO2e)",
          data: [0.8, 1.2, 1.5, 2.1, 2.4, 2.8],
          backgroundColor: accentGreen,
          borderRadius: 8,
        },
        {
          label: "Proyección ML",
          data: [0.9, 1.3, 1.8, 2.5, 3.2, 4.0],
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          borderColor: accentGreen,
          borderWidth: 1,
          borderDash: [2, 2],
          borderRadius: 8,
        }
      ],
    };

    return (
      <div className="premium-view">
        <header className="premium-header">
          <div className="header-icon carbon-glow">🌱</div>
          <div className="header-text">
            <h2>Activos de Carbono & Salud Holística</h2>
            <p>Monetización de la regeneración ecosistémica mediante créditos de carbono certificados.</p>
          </div>
          <button className="download-report-btn" onClick={async () => {
            const template = document.getElementById('carbon-report-template');
            if (template) template.style.display = 'block';
            await generatePDF('carbon-report-template', `BONOS_CARBONO_${new Date().toISOString().slice(0, 10)}.pdf`);
            if (template) template.style.display = 'none';
          }}>
            <span className="btn-icon">📥</span> DESCARGAR CERTIFICADO
          </button>
        </header>

        {/* Hidden Template for PDF */}
        <CarbonReport data={{
          farmName: "Fundo Santa Rosa",
          totalCapture: "12.4 ton CO2e",
          projectionML: "45.0 ton CO2e/año",
          marketValue: "1,240.00",
          soilHealth: "85%",
          organicMatter: "4.2%",
          npkBalance: "Balanceado"
        }} />

        <div className="premium-grid">
          <div className="main-viz glass-panel">
            <div className="chart-header">
              <h4>Forecast de Captura de Carbono (Machine Learning)</h4>
            </div>
            <div className="chart-wrapper">
              <Bar data={barsData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "rgba(255,255,255,0.5)" } },
                  x: { grid: { display: false }, ticks: { color: "rgba(255,255,255,0.5)" } }
                }
              }} />
            </div>
          </div>

          <div className="side-analytics">
            <div className="carbon-wallet glass-panel">
              <span className="cw-label">BALANCE ESTIMADO</span>
              <span className="cw-value">$ 1,240.00</span>
              <p className="cw-desc">Valor en mercado voluntario (VCM) basado en standard Verra/Gold Standard.</p>
              <button className="cw-btn">PRE-VENTA DE BONOS</button>
            </div>
            <div className="soil-metirc glass-panel">
              <div className="soil-labels">
                <span>MO (Materia Orgánica): <strong>4.2%</strong></span>
                <span>NPK Balance: <strong>Balanced</strong></span>
              </div>
              <div className="soil-rings">
                <div className="ring-progress" style={{ "--p": "85", "--c": accentGreen } as any}>85%</div>
                <div className="ring-text">Salud del Suelo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="strategic-overlay-modern">
      <div className="strategic-modal-modern glass-morph">
        <button className="close-btn-modern" onClick={onClose}>✕</button>
        <div className="modal-inner-modern">
          {activePillar === "ai" && renderAIContent()}
          {activePillar === "credit" && renderCreditContent()}
          {activePillar === "trace" && renderTraceabilityContent()}
          {activePillar === "carbon" && renderCarbonContent()}
        </div>
      </div>

      <style jsx>{`
        .strategic-overlay-modern {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0.95) 100%);
          backdrop-filter: blur(15px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .strategic-modal-modern {
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          background: rgba(15, 15, 15, 0.7);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 40px;
          position: relative;
          overflow-y: auto;
          box-shadow: 0 50px 100px rgba(0,0,0,0.8);
        }
        .glass-morph {
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .close-btn-modern {
          position: absolute;
          top: 30px;
          right: 30px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          z-index: 100;
          transition: all 0.3s;
        }
        .close-btn-modern:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }
        .modal-inner-modern { padding: 60px 50px; }

        .premium-header { display: flex; gap: 30px; align-items: center; margin-bottom: 50px; }
        .header-icon {
          width: 80px;
          height: 80px;
          background: rgba(20, 20, 20, 0.5);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }
        .ai-glow { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); border-color: ${accentBlue}; }
        .credit-glow { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); border-color: ${accentGreen}; }
        .trace-glow { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); border-color: ${accentGold}; }
        .carbon-glow { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); border-color: ${accentGreen}; }

        .header-text h2 { margin: 0; font-size: 2.4rem; font-weight: 900; letter-spacing: -1px; background: linear-gradient(90deg, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header-text p { color: rgba(255,255,255,0.5); margin: 8px 0 0; font-size: 1.15rem; font-weight: 400; }

        .premium-grid { display: grid; grid-template-columns: 1fr 340px; gap: 30px; }
        .premium-grid.items-center { align-items: center; }
        
        .glass-panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 25px;
          padding: 30px;
        }

        .chart-wrapper { height: 320px; margin-top: 20px; }
        .live-tag {
          font-size: 0.65rem;
          font-weight: 800;
          color: ${accentRed};
          padding: 3px 8px;
          border: 1px solid ${accentRed};
          border-radius: 5px;
          letter-spacing: 1px;
        }

        .side-analytics { display: flex; flex-direction: column; gap: 20px; }
        .metric-box { display: flex; flex-direction: column; gap: 10px; }
        .mb-label { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.4); }
        .mb-value { font-size: 2.2rem; font-weight: 800; color: #fff; }
        .mb-indicator { height: 4px; border-radius: 2px; background: #333; position: relative; }
        .mb-indicator::after { content: ''; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: inherit; filter: blur(4px); }
        .mb-indicator.warning { background: ${accentBlue}; }
        .mb-indicator.success { background: ${accentGreen}; }
        .mb-desc { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin: 0; line-height: 1.5; }

        .radar-viz { height: 450px; }
        .report-generator { text-align: center; display: flex; flex-direction: column; gap: 20px; }
        .gold-border { border: 1px solid rgba(245, 158, 11, 0.3); background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(0,0,0,0)); }
        .report-metrics { background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; }
        .rm-row { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .gold-action-btn { background: ${accentGold}; color: #000; border: none; padding: 18px; border-radius: 15px; font-weight: 900; font-size: 0.85rem; cursor: pointer; transition: all 0.3s; }
        .gold-action-btn:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(245,158,11,0.4); }

        .download-report-btn {
          margin-left: auto;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10B981;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .download-report-btn:hover {
          background: #10B981;
          color: #000;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }

        .passport-container-modern { padding: 40px; background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0)); border-color: rgba(255,255,255,0.1); }
        .passport-header-brand { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 25px; margin-bottom: 35px; }
        .brand-logotype { display: flex; align-items: center; gap: 15px; font-size: 1.1rem; letter-spacing: 1px; color: rgba(255,255,255,0.8); }
        .passport-id { font-family: monospace; color: ${accentGreen}; }
        .passport-body { display: flex; gap: 40px; }
        .qr-wrapper { background: white; padding: 15px; border-radius: 15px; }
        .batch-status-chip { margin-top: 20px; font-size: 0.7rem; font-weight: 900; padding: 6px 12px; background: ${accentGreen}20; color: ${accentGreen}; border: 1px solid ${accentGreen}; border-radius: 20px; text-align: center; }
        .passport-details-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .pd-item { display: flex; flex-direction: column; gap: 5px; }
        .pd-item.large { grid-column: span 2; }
        .pd-label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.3); }
        .pd-value { font-size: 1.1rem; font-weight: 700; color: #fff; }
        .integrity-bar { height: 6px; display: flex; gap: 4px; margin-top: 8px; }
        .ib-segment { flex: 1; border-radius: 3px; }
        .ib-segment.success { background: ${accentGreen}; opacity: 0.7; }
        .ib-segment.warning { background: ${accentGold}; opacity: 0.7; }

        .carbon-wallet { background: linear-gradient(135deg, ${accentGreen}20, transparent); }
        .cw-value { font-size: 2.8rem; font-weight: 900; display: block; margin: 10px 0; color: ${accentGreen}; }
        .cw-btn { width: 100%; padding: 14px; background: transparent; border: 1px solid ${accentGreen}; color: ${accentGreen}; border-radius: 12px; font-weight: 800; cursor: pointer; margin-top: 15px; transition: all 0.3s; }
        .cw-btn:hover { background: ${accentGreen}; color: #000; }
        .soil-rings { display: flex; align-items: center; gap: 20px; margin-top: 20px; }
        .ring-progress {
          width: 80px; height: 80px; border-radius: 50%;
          background: radial-gradient(closest-side, #111 88%, transparent 0% 100%),
                      conic-gradient(${accentGreen} calc(var(--p) * 1%), #222 0);
          display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: #fff;
        }

        @media screen and (max-width: 900px) {
          .premium-grid { grid-template-columns: 1fr; }
          .modal-inner-modern { padding: 40px 20px; }
          .passport-body { flex-direction: column; align-items: center; }
        }

        @media print {
          .strategic-overlay-modern { background: white; }
          .strategic-modal-modern { height: auto; border: none; background: white; color: black; }
          .close-btn-modern, .gold-action-btn, .cw-btn { display: none; }
          .glass-panel { border: 1px solid #eee; background: white; color: black; }
          .header-text h2 { -webkit-text-fill-color: black; }
          .header-icon { border: 1px solid #eee; }
        }
      `}</style>
    </div>
  );
}
