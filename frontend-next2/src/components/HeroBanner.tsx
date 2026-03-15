"use client";
import { useState, useEffect, useCallback } from "react";

const slides = [
  { image: "/images/hero_valle_sagrado.png", title: "Tecnología Agrícola para todo el Perú", desc: "Monitoreo inteligente y predicción de cultivos con IA para la Costa, Sierra y Selva." },
  { image: "/images/costa_agriculture.png", title: "Eficiencia en la Costa", desc: "Optimización de riego y agroexportación de precisión en valles costeros." },
  { image: "/images/papas_nativas.png", title: "Producción en la Sierra", desc: "Tecnología aplicada a cultivos ancestrales como la papa nativa y la quinua en la agricultura familiar andina." },
  { image: "/images/selva_agriculture.png", title: "Riqueza en la Selva", desc: "Agroforestería sostenible y monitoreo de cultivos tropicales con IA en la Amazonía." },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const showSlide = useCallback((index: number) => setCurrentSlide(index), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-banner" id="overview">
      <div className="hero-slides">
        {slides.map((slide, idx) => (
          <div key={idx} className={`hero-slide ${idx === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url('${slide.image}')` }} />
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-text">
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].desc}</p>
      </div>
      <div className="hero-badge"><span className="badge-live">EN VIVO</span></div>
      <div className="hero-indicators">
        {slides.map((_, idx) => (
          <button key={idx} className={`hero-dot ${idx === currentSlide ? "active" : ""}`}
            onClick={() => showSlide(idx)} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
    </section>
  );
}
