"use client";
import { useState } from "react";

const pillars = [
  { number: "01", title: "Acceso Justo y Competitivo a Mercados", tag: "Comercialización", action: "mercados", metric: "+3,200 agricultores conectados",
    body: "Conectamos a los agricultores directamente con compradores nacionales e internacionales, eliminando intermediarios que reducen sus márgenes.",
    items: ["Datos de precios en tiempo real de mercados mayoristas.", "Trazabilidad del producto desde la parcela hasta el consumidor.", "Conexión directa con cadenas de supermercados y exportadores.", "Certificaciones digitales de origen y calidad."] },
  { number: "02", title: "Gestión Financiera Rural", tag: "Finanzas", action: "finanzas", metric: "S/. 2.4M en créditos facilitados",
    body: "Herramientas de control financiero diseñadas específicamente para la realidad del pequeño y mediano agricultor peruano:",
    items: ["Registro de costos de producción simplificado por campaña agrícola.", "Análisis de rentabilidad por cultivo y por parcela.", "Acceso a microcréditos respaldados por historial productivo verificado.", "Reportes financieros automáticos para cooperativas y bancos."] },
  { number: "03", title: "Adaptación Climática y Uso Eficiente del Agua", tag: "Sostenibilidad", action: "clima", metric: "-40% consumo de agua",
    body: "Nuestro sistema de sensores IoT y modelos de IA permiten anticipar y responder a los desafíos del cambio climático:",
    items: ["Pronóstico microclimático a nivel de parcela.", "Riego inteligente que reduce el consumo de agua hasta un 40%.", "Alertas tempranas de heladas, sequías y plagas.", "Recomendaciones de cultivos alternativos basadas en IA."] },
  { number: "04", title: "Gestión de Datos en Contextos de Baja Conectividad", tag: "Tecnología", action: "conectividad", metric: "Funcional desde 0 kbps",
    body: "Diseñado para funcionar en las zonas más remotas del Perú, donde la conectividad a internet es limitada o inexistente:",
    items: ["Modo offline completo con sincronización automática.", "Comunicación ESP-NOW de largo alcance (300m+) sin WiFi.", "Compresión inteligente de datos para mínimo ancho de banda.", "Interoperabilidad satelital para zonas sin cobertura."] },
];

const modalContent: Record<string, { title: string; content: string }> = {
  mercados: { title: "Acceso Justo y Competitivo a Mercados", content: "<h4>Nuestra Visión</h4><p>Creemos que cada agricultor peruano merece acceso justo a los mercados.</p><h4>Lo que ofrecemos</h4><p>Un marketplace digital donde compradores verificados conectan directamente con productores.</p><h4>Impacto medido</h4><p>Los agricultores incrementaron ingresos en 35% al eliminar intermediarios.</p>" },
  finanzas: { title: "Gestión Financiera Rural", content: "<h4>El desafío</h4><p>El 78% de los pequeños agricultores no lleva registro formal de costos.</p><h4>Nuestra solución</h4><p>Contabilidad agrícola simplificada que funciona offline.</p><h4>Resultados</h4><p>S/. 2.4M en microcréditos facilitados. 92% reportaron mejor comprensión de su rentabilidad.</p>" },
  clima: { title: "Adaptación Climática y Uso Eficiente del Agua", content: "<h4>La urgencia</h4><p>Perú es el tercer país más vulnerable al cambio climático.</p><h4>Tecnología aplicada</h4><p>Sensores IoT + IA para alertas tempranas y riego inteligente.</p><h4>Resultados</h4><p>-40% consumo de agua, anticipación de heladas con 48 horas.</p>" },
  conectividad: { title: "Gestión de Datos en Baja Conectividad", content: "<h4>La realidad</h4><p>60%+ de zonas agrícolas tienen conectividad limitada.</p><h4>Arquitectura resiliente</h4><p>Plataforma offline-first con ESP-NOW y sincronización inteligente.</p><h4>Innovación</h4><p>Integración satelital y transmisión de datos de un día en 2KB.</p>" },
};

export default function PillarsSection() {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <section className="pillars-section" id="pillars">
        <div className="section-header">
          <h3>Nuestra Estrategia</h3>
          <p>Cómo Agro Kipura Tech aborda los principales desafíos del agro peruano.</p>
        </div>
        <div className="pillars-detailed">
          {pillars.map((p) => (
            <div className="pillar-detail-card" key={p.action}>
              <div className="pillar-detail-header">
                <div className="pillar-number">{p.number}</div>
                <div><h4>{p.title}</h4><span className="pillar-tag">{p.tag}</span></div>
              </div>
              <div className="pillar-detail-body">
                <p>{p.body}</p>
                <ul>{p.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="pillar-detail-footer">
                <span className="pillar-metric">{p.metric}</span>
                <button className="btn-pillar" onClick={() => setModal(p.action)}>Más información</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {modal && modalContent[modal] && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalContent[modal].title}</h3>
              <button className="modal-close" onClick={() => setModal(null)} aria-label="Cerrar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalContent[modal].content }} />
            <div className="modal-footer">
              <button className="btn-submit" onClick={() => { setModal(null); document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }); }}>Solicitar Asesoría</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
