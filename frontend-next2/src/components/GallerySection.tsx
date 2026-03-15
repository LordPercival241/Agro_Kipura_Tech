"use client";

const galleries = [
  { region: "sierra", img: "/images/hero_valle_sagrado.png", alt: "Valle Sagrado", tag: "Sierra", title: "Valle Sagrado", desc: "Papas, quinua y cultivos andinos a más de 3,000 m.s.n.m." },
  { region: "costa", img: "/images/costa_agriculture.png", alt: "Costa peruana", tag: "Costa", title: "Valles Costeros", desc: "Espárragos, uvas, arándanos y agroexportación de precisión." },
  { region: "selva", img: "/images/selva_agriculture.png", alt: "Selva peruana", tag: "Selva", title: "Amazonía Peruana", desc: "Café, cacao, frutas tropicales y agroforestería sostenible." },
  { region: "nativas", img: "/images/papas_nativas.png", alt: "Papas nativas", tag: "Biodiversidad", title: "Papas Nativas", desc: "Más de 3,000 variedades. Patrimonio agrícola del mundo." },
];

export default function GallerySection() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="section-header">
        <h3>Agricultura en las Tres Regiones del Perú</h3>
        <p>Tecnología de precisión adaptada a la diversidad geográfica y agrícola de nuestro país.</p>
      </div>
      <div className="gallery-grid">
        {galleries.map((g) => (
          <div className="gallery-card" key={g.region} data-region={g.region}>
            <img src={g.img} alt={g.alt} loading="lazy" />
            <div className="gallery-overlay">
              <span className="gallery-tag">{g.tag}</span>
              <h4>{g.title}</h4>
              <p>{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
