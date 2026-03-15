"use client";
import { useState, FormEvent } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-card">
        <div className="contact-header">
          <h2>¿Listo para optimizar tus cultivos?</h2>
          <p>Déjanos tus datos para integrar la precisión de la inteligencia artificial con la sabiduría agrícola de tu región.</p>
        </div>
        {!submitted ? (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label htmlFor="nombre">Nombre Completo</label><input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required /></div>
              <div className="form-group"><label htmlFor="email-contact">Correo Electrónico</label><input type="email" id="email-contact" name="email" placeholder="tu@correo.com" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="telefono">Teléfono</label><input type="tel" id="telefono" name="telefono" placeholder="+51 999 999 999" /></div>
              <div className="form-group"><label htmlFor="region-contact">Región</label>
                <select id="region-contact" name="region"><option value="">Seleccionar...</option><option value="costa">Costa</option><option value="sierra">Sierra</option><option value="selva">Selva</option></select>
              </div>
            </div>
            <div className="form-group"><label htmlFor="mensaje">¿En qué podemos ayudarte?</label><textarea id="mensaje" name="mensaje" rows={4} placeholder="Cuéntanos sobre tu cultivo, región y necesidades..." /></div>
            <button type="submit" className="btn-submit" disabled={loading}>
              <span>{loading ? "Enviando solicitud..." : "Enviar Solicitud de Asesoría"}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </form>
        ) : (
          <div className="form-message fade-in">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <h3>Solicitud enviada exitosamente</h3>
            <p>Un especialista de Agro Kipura Tech se comunicará contigo pronto.</p>
            <button type="button" className="btn-back-form" onClick={() => setSubmitted(false)}>Enviar otra solicitud</button>
          </div>
        )}
      </div>
    </section>
  );
}
