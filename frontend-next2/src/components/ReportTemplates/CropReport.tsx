import React from 'react';

interface CropReportProps {
  data: {
    farmName: string;
    vpd: string;
    gdd: string;
    cropStage: string;
    healthScore: string;
  };
}

export const CropReport: React.FC<CropReportProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div id="crop-report-template" style={{ 
      display: 'none',
      backgroundColor: 'white', 
      color: '#1a1a1a', 
      fontFamily: 'sans-serif',
      width: '210mm',
      boxSizing: 'border-box'
    }}>
      <div style={{ padding: '20mm', minHeight: '297mm', boxSizing: 'border-box' }}>
        <div style={{ borderLeft: '10px solid #10B981', padding: '30px', minHeight: '257mm', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', pageBreakInside: 'avoid' }}>
            <div>
              <h1 style={{ margin: 0, color: '#10B981' }}>AGRO KIPURA TECH</h1>
              <p style={{ margin: 0, fontWeight: 'bold' }}>REPORTE TÉCNICO DE ESTADO DEL CULTIVO</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9pt' }}>
              <p><strong>Fundo:</strong> {data.farmName}</p>
              <p><strong>Emisión:</strong> {currentDate}</p>
            </div>
          </header>

          <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
            <h3 style={{ background: '#f0fdf4', padding: '10px', margin: '0 0 10px 0' }}>1. Diagnóstico Bio-Métrica</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['VPD Actual', `${data.vpd} kPa`],
                  ['GDD Acumulado', `${data.gdd} °C/día`],
                  ['Etapa Fenológica', data.cropStage],
                  ['Indice de Salud', data.healthScore]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px', border: '1px solid #eee' }}>{row[0]}</td>
                    <td style={{ padding: '12px', border: '1px solid #eee', fontWeight: 'bold' }}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
            <h3 style={{ background: '#f0fdf4', padding: '10px', margin: '0 0 10px 0' }}>2. Análisis de Inteligencia Artificial</h3>
            <p style={{ lineHeight: '1.6', fontSize: '10pt', textAlign: 'justify' }}>
              Los modelos predictivos de Agro-Brain indican parámetros de transpiración estables con eficiencia fotosintética óptima para el predio <strong>{data.farmName}</strong>. 
              Se sugiere validación de riego de precisión en el microclismo local para maximizar el potencial de desarrollo.
            </p>
          </section>

          <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
            <h3 style={{ background: '#f0fdf4', padding: '10px', margin: '0 0 10px 0' }}>3. Trazabilidad de Integridad</h3>
            <div style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', padding: '10px', border: '1px solid #f0fdf4' }}>
              Certificado mediante el Pasaporte Digital de Agro Kipura Tech. Los datos presentados son el resultado de la sincronización de nodos IoT validados punto a punto.
            </div>
          </section>

          <footer style={{ marginTop: 'auto', paddingTop: '40px', pageBreakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ width: '250px', fontSize: '10pt' }}>
                <div style={{ borderBottom: '1px solid #1a1a1a', marginBottom: '10px' }}></div>
                Validación Técnica por:<br/>
                <strong>Dante Olivas</strong><br/>
                Founder - Agro Kipura Tech
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', border: '2px solid #10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8pt', color: '#10B981', fontWeight: 'bold' }}>
                  AK-TECH
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
