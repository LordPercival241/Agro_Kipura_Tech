"use client";
import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  farmer: string;
  price: string;
  stock: string;
  image: string;
  category: string;
  substances: string[];
  verified: boolean;
  telemetry_link: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Papa Amarilla Tumbay",
    farmer: "Asociación Agro-Huánuco",
    price: "S/. 3.50 / kg",
    stock: "450 kg",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400",
    category: "Tubérculos",
    substances: ["Fertilizante Orgánico", "Cero Plaguicidas Químicos"],
    verified: true,
    telemetry_link: "#ai",
  },
  {
    id: 2,
    name: "Palta Hass Exportación",
    farmer: "Cooperativa Fundo Verde",
    price: "S/. 7.20 / kg",
    stock: "1,200 kg",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400",
    category: "Frutas",
    substances: ["Control Biológico", "Bajo en Nitratos"],
    verified: true,
    telemetry_link: "#ai",
  },
  {
    id: 3,
    name: "Cacao Chuncho Cusco",
    farmer: "Comunidad Quillabamba",
    price: "S/. 15.00 / kg",
    stock: "80 kg",
    image: "https://images.unsplash.com/photo-1599596234551-7ba87f5261c4?auto=format&fit=crop&q=80&w=400",
    category: "Cereales/Cacao",
    substances: ["100% Orgánico", "Sombra Natural"],
    verified: true,
    telemetry_link: "#ai",
  }
];

export default function MarketplaceSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="marketplace-section" id="marketplace">
      <div className="section-header">
        <div className="badge-premium">VENTA DIRECTA</div>
        <h3>Mercado de Cosechas Verificadas</h3>
        <p>Transparencia total: Conoce el historial de cada producto directamente desde nuestros sensores IoT.</p>
      </div>

      <div className="market-container">
        <div className="market-filters glass-panel">
          <button className="filter-pill active">Todos</button>
          <button className="filter-pill">Frutas</button>
          <button className="filter-pill">Tubérculos</button>
          <button className="filter-pill">Verduras</button>
          <button className="btn-add-harvest">+ Publicar mi Cosecha</button>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="product-card glass-panel">
              <div className="product-img-wrapper">
                <img src={p.image} alt={p.name} />
                {p.verified && <span className="verified-seal">✓ Verificado AgroPredict</span>}
              </div>
              <div className="product-info">
                <span className="p-category">{p.category}</span>
                <h4>{p.name}</h4>
                <p className="p-farmer">Por: {p.farmer}</p>
                
                <div className="p-trace-preview">
                  <span className="trace-label">Trazabilidad Química:</span>
                  <div className="substance-tags">
                    {p.substances.map(s => <span key={s} className="s-tag">{s}</span>)}
                  </div>
                </div>

                <div className="p-footer">
                  <div className="p-price-block">
                    <span className="p-price">{p.price}</span>
                    <span className="p-stock">Stock: {p.stock}</span>
                  </div>
                  <button className="btn-view-passport" onClick={() => setSelectedProduct(p)}>
                    Pasaporte Digital →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="passport-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="passport-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-header">
              <span className="verified-badge">PASAPORTE DIGITAL DE CULTIVO</span>
              <h2>{selectedProduct.name}</h2>
              <p>Registro inmutable respaldado por AgroPredict Tech.</p>
            </div>
            
            <div className="modal-content">
              <div className="trace-history-grid">
                <div className="trace-item">
                  <label>Fase de Crecimiento</label>
                  <p>Cosechado / Listo para Envío</p>
                </div>
                <div className="trace-item">
                  <label>Uso de Agroquímicos</label>
                  <ul className="substance-list">
                    {selectedProduct.substances.map(s => <li key={s}>{s}</li>)}
                    <li>Fungicidas: Ninguno (Control por VPD)</li>
                  </ul>
                </div>
                <div className="trace-item">
                  <label>Condiciones Ambientales Promedio</label>
                  <div className="mini-stats">
                    <div className="m-stat"><span>Temp:</span> 22.4°C</div>
                    <div className="m-stat"><span>Hum:</span> 68%</div>
                  </div>
                </div>
                <div className="trace-item">
                  <label>Identificador de Lote</label>
                  <p>KP-2025-00{selectedProduct.id}</p>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="btn-buy-now">Contactar Productor (Directo)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .marketplace-section { padding: 80px 0; }
        .badge-premium { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(16, 185, 129, 0.1); color: var(--green-light); font-size: 0.7rem; font-weight: 800; margin-bottom: 15px; border: 1px solid rgba(16, 185, 129, 0.2); }
        .market-filters { display: flex; gap: 12px; padding: 20px; border-radius: 30px; margin-bottom: 40px; align-items: center; }
        .filter-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); padding: 8px 18px; border-radius: 20px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
        .filter-pill.active { background: var(--green-light); color: #000; border-color: var(--green-light); }
        .btn-add-harvest { margin-left: auto; background: var(--accent-gold); color: #000; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 700; cursor: pointer; }
        
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .product-card { border-radius: 24px; overflow: hidden; transition: transform 0.3s; border: 1px solid rgba(255,255,255,0.08); }
        .product-card:hover { transform: translateY(-10px); }
        .product-img-wrapper { position: relative; height: 200px; }
        .product-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .verified-seal { position: absolute; bottom: 12px; left: 12px; background: rgba(16,185,129,0.9); color: #fff; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; backdrop-filter: blur(4px); }
        
        .product-info { padding: 25px; }
        .p-category { font-size: 0.7rem; font-weight: 800; color: var(--green-light); text-transform: uppercase; margin-bottom: 8px; display: block; }
        .product-info h4 { font-size: 1.25rem; margin-bottom: 5px; color: var(--text-primary); }
        .p-farmer { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px; }
        
        .p-trace-preview { margin-bottom: 25px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; }
        .trace-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .substance-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .s-tag { font-size: 0.65rem; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px; color: var(--text-secondary); }
        
        .p-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); pt: 20px; }
        .p-price-block { display: flex; flex-direction: column; }
        .p-price { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }
        .p-stock { font-size: 0.75rem; color: var(--text-muted); }
        .btn-view-passport { background: none; border: none; color: var(--green-light); font-weight: 700; font-size: 0.85rem; cursor: pointer; padding: 0; }
        
        /* Modal */
        .passport-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        .passport-modal { width: 90%; max-width: 600px; border-radius: 32px; padding: 40px; border: 1px solid var(--accent-gold); position: relative; }
        .close-modal { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 2rem; color: var(--text-secondary); cursor: pointer; }
        .modal-header { text-align: center; margin-bottom: 35px; }
        .verified-badge { font-size: 0.75rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 1px; }
        .modal-header h2 { font-size: 1.8rem; margin: 10px 0; }
        
        .trace-history-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
        .trace-item label { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 8px; }
        .substance-list { list-style: none; padding: 0; margin: 0; }
        .substance-list li { font-size: 0.9rem; color: var(--text-primary); margin-bottom: 4px; padding-left: 15px; position: relative; }
        .substance-list li::before { content: "•"; position: absolute; left: 0; color: var(--green-light); }
        .mini-stats { display: flex; gap: 15px; }
        .m-stat { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
        .btn-buy-now { width: 100%; background: var(--green-light); color: #000; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: transform 0.2s; }
        .btn-buy-now:hover { transform: scale(1.02); }

        @media (max-width: 768px) {
          .trace-history-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
