import React from 'react';

interface FinancialReportProps {
  data: {
    farmName: string;
    riskRating: string; // e.g. "AAA+"
    sensorUptime: string; // e.g. "99.98%"
    waterEfficiency: string; // e.g. "+24%"
    valuation: string; // e.g. "$250,000.00"
    roiProjected: string; // e.g. "18.5%"
    iotIntegrityScore: string; // e.g. "100%"
    operationalCost: string; // e.g. "-12% (Optimization)"
  };
}

export const FinancialReport: React.FC<FinancialReportProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div id="financial-report-template" style={{ 
      display: 'none',
      backgroundColor: 'white', 
      color: '#1a1a1a', 
      fontFamily: '"Times New Roman", Times, serif',
      width: '210mm',
      boxSizing: 'border-box',
    }}>
      <div style={{ padding: '20mm', minHeight: '297mm', boxSizing: 'border-box' }}>
        <div style={{ border: '3px double #F59E0B', padding: '30px', minHeight: '257mm', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Watermark */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', fontSize: '100pt', color: 'rgba(0,0,0,0.03)', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap' }}>
            VERIFIED
          </div>

          <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #F59E0B', paddingBottom: '20px', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
            <div>
              <h1 style={{ margin: 0, color: '#F59E0B', fontSize: '28pt', fontWeight: 'bold' }}>AGRO KIPURA TECH</h1>
              <p style={{ margin: 0, fontSize: '12pt', letterSpacing: '3px', fontWeight: 'bold' }}>FINANCIAL INTELLIGENCE HUB</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10pt' }}>
              <p><strong>FOLIO:</strong> #AK-BANK-{Math.floor(Date.now() / 10000)}</p>
              <p><strong>EMISIÓN:</strong> {currentDate}</p>
            </div>
          </header>

          <section style={{ marginBottom: '30px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '16pt', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '5px solid #F59E0B', paddingLeft: '15px' }}>I. Resumen Ejecutivo</h2>
            <p style={{ lineHeight: '1.6', fontSize: '11pt', textAlign: 'justify' }}>
              Certificación de solvencia técnica y operativa para <strong>{data.farmName}</strong>. Validado mediante protocolos de integridad IoT.
            </p>
          </section>

          <section style={{ marginBottom: '30px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '16pt', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '5px solid #F59E0B', paddingLeft: '15px' }}>II. Riesgo y Retorno</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div style={{ padding: '15px', border: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#10B981' }}>{data.riskRating}</div>
                <div style={{ fontSize: '8pt', color: '#666' }}>Risk Rating</div>
              </div>
              <div style={{ padding: '15px', border: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{data.roiProjected}</div>
                <div style={{ fontSize: '8pt', color: '#666' }}>ROI Proyectado</div>
              </div>
              <div style={{ padding: '15px', border: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{data.iotIntegrityScore}</div>
                <div style={{ fontSize: '8pt', color: '#666' }}>Integridad IoT</div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '16pt', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '5px solid #F59E0B', paddingLeft: '15px' }}>III. Evaluación ESG</h2>
            <p style={{ lineHeight: '1.6', fontSize: '11pt', textAlign: 'justify' }}>
              Cumplimiento con estándares internacionales de sostenibilidad y gobernanza de datos.
            </p>
          </section>

          <section style={{ marginBottom: '30px', position: 'relative', zIndex: 1, pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '16pt', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '5px solid #F59E0B', paddingLeft: '15px' }}>IV. Auditoría de Integridad</h2>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                'CONEXIÓN SEGURA END-TO-END (AES-256)',
                'SEGURIDAD DE DATOS DE NUEVA GENERACIÓN',
                'VALIDACIÓN DE FIRMA DIGITAL DE DISPOSITIVOS',
                'TIMESTAMP ENCRIPTADO EN BLOCKCHAIN DE TRAZA'
              ].map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  backgroundColor: '#f8fafc', 
                  padding: '10px 15px', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  pageBreakInside: 'avoid'
                }}>
                  <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '9pt' }}>[OK]</span>
                  <span style={{ fontSize: '9pt', fontFamily: 'monospace', color: '#334155' }}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <footer style={{ marginTop: 'auto', paddingTop: '50px', position: 'relative', zIndex: 1, pageBreakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ width: '250px', fontSize: '10pt' }}>
                <div style={{ borderBottom: '1px solid #000', marginBottom: '10px' }}></div>
                Certificación Emitida por:<br/>
                <strong>Dante Olivas</strong><br/>
                Founder - Agro Kipura Tech
              </div>
              
              <div style={{ textAlign: 'center', width: '120px' }}>
                <div style={{ width: '80px', height: '80px', border: '2px solid #F59E0B', margin: '0 auto 10px', borderRadius: '5px', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px dashed #F59E0B' }}></div>
                </div>
                <div style={{ fontSize: '7pt' }}>#AK-FOUNDER-VERIFIED</div>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '8pt', color: '#999', marginTop: '40px' }}>Documento Confidencial. ©2026 Agro Kipura Tech.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
