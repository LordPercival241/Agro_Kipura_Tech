import React from 'react';

interface CarbonReportProps {
  data: {
    farmName: string;
    totalCapture: string;
    projectionML: string;
    marketValue: string;
    soilHealth: string;
    organicMatter: string;
    npkBalance: string;
  };
}

export const CarbonReport: React.FC<CarbonReportProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div id="carbon-report-template" style={{ 
      display: 'none',
      backgroundColor: 'white', 
      color: '#1a1a1a', 
      fontFamily: 'sans-serif',
      width: '210mm',
      boxSizing: 'border-box'
    }}>
      <div style={{ padding: '20mm', minHeight: '297mm', boxSizing: 'border-box' }}>
        <div style={{ border: '1px solid #10B981', padding: '30px', minHeight: '257mm', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #10B981', paddingBottom: '20px', marginBottom: '30px', pageBreakInside: 'avoid' }}>
            <div>
              <h1 style={{ margin: 0, color: '#10B981', fontSize: '24pt' }}>CERTIFICADO DE ACTIVOS DE CARBONO</h1>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '10pt' }}>AGRO KIPURA TECH - REGENERATIVE UNIT</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9pt' }}>
              <p><strong>Certificado N°:</strong> #AK-CO2-{Math.floor(Date.now() / 100000)}</p>
              <p><strong>Fecha de Emisión:</strong> {currentDate}</p>
            </div>
          </header>

          <section style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '14pt', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>1. Resumen de Captura Ecosistémica</h2>
            <p style={{ fontSize: '11pt', textAlign: 'justify' }}>Se certifica que el predio <strong>{data.farmName}</strong> ha generado los siguientes activos ambientales verificados por IA y monitoreo IoT:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '10px', textAlign: 'center', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '9pt', color: '#166534', textTransform: 'uppercase' }}>Captura Real</div>
                <div style={{ fontSize: '22pt', fontWeight: 'bold', color: '#10B981' }}>{data.totalCapture}</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '10px', textAlign: 'center', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '9pt', color: '#166534', textTransform: 'uppercase' }}>Proyección Estimada</div>
                <div style={{ fontSize: '22pt', fontWeight: 'bold', color: '#10B981' }}>{data.projectionML}</div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '14pt', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>2. Indicadores Biológicos Validados</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #eee' }}>Indicador</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #eee' }}>Valor</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #eee' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Materia Orgánica (MO)', data.organicMatter, 'Óptimo'],
                  ['Balance NPK', data.npkBalance, 'Estable'],
                  ['Indice de Salud Suelo', data.soilHealth, 'Excelente']
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px', border: '1px solid #eee' }}>{row[0]}</td>
                    <td style={{ padding: '12px', border: '1px solid #eee', fontWeight: 'bold' }}>{row[1]}</td>
                    <td style={{ padding: '12px', border: '1px solid #eee', color: '#10B981' }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <footer style={{ marginTop: 'auto', paddingTop: '40px', textAlign: 'center', pageBreakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
              <div style={{ width: '220px' }}>
                <div style={{ borderBottom: '1px solid #333', marginBottom: '10px' }}></div>
                Validado por:<br/>
                <strong>Dante Olivas</strong><br/>
                Founder - Agro Kipura Tech
              </div>
              <div style={{ width: '220px' }}>
                <div style={{ borderBottom: '1px solid #333', marginBottom: '10px' }}></div>
                Unidad de Regeneración<br/>
                Agro Kipura Tech
              </div>
            </div>
            <p style={{ fontSize: '7pt', color: '#999' }}>Certificado Digital Inmutable. ©2026 Agro Kipura Tech.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
