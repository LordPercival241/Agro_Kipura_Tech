"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { generatePDF } from "@/utils/pdfGenerator";

interface Metrics {
  vpd: string;
  temp: string;
  hum: string;
  soil: string;
}

interface Product {
  id: number;
  name: string;
  farmer: string;
  location: string;
  price: number;
  stock: string;
  stockVal: number;
  minOrder: string;
  minOrderVal: number;
  region: string;
  department: string;
  category: string;
  verified: boolean;
  image: string;
  traceId: string;
  substances: string[];
  description: string;
  metrics: Metrics;
}

const PRODUCTS: Product[] = [
  // COSTA
  { 
    id: 1, name: "Arándanos Premium", farmer: "Camposol", location: "Valle de Chao", 
    price: 18500, stock: "200 TM", stockVal: 200, minOrder: "5 TM", minOrderVal: 5, region: "Costa", department: "La Libertad", 
    category: "Frutas", verified: true, image: "https://images.unsplash.com/photo-1491933302421-f5973392079a?w=800", 
    traceId: "KP-AR-9901", substances: ["Fertirrigación de Precisión", "Control Biológico"],
    description: "Variedad Biloxi/Ventura. Calibre superior con monitoreo de VPD.",
    metrics: { vpd: "1.2 kPa", temp: "22.4°C", hum: "65%", soil: "28%" }
  },
  { 
    id: 2, name: "Uva Red Globe Export", farmer: "El Pedregal S.A.", location: "Pampa de Villacurí", 
    price: 4500, stock: "600 TM", stockVal: 600, minOrder: "15 TM", minOrderVal: 15, region: "Costa", department: "Ica", 
    category: "Frutas", verified: true, image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800", 
    traceId: "KP-UV-8802", substances: ["Bajo en Nitratos", "Luz UV-C Controlada"],
    description: "Uva de mesa con firmeza garantizada por sensores de suelo.",
    metrics: { vpd: "1.5 kPa", temp: "28.1°C", hum: "45%", soil: "22%" }
  },
  { 
    id: 3, name: "Palta Hass Selección", farmer: "Agrícola Cerro Prieto", location: "Valle de Chepén", 
    price: 7200, stock: "450 TM", stockVal: 450, minOrder: "10 TM", minOrderVal: 10, region: "Costa", department: "Lambayeque", 
    category: "Frutas", verified: true, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800", 
    traceId: "KP-PL-7703", substances: ["Cero Pesticidas", "Riego por Goteo"],
    description: "Contenido de aceite certificado. Cosecha programada por IA.",
    metrics: { vpd: "0.9 kPa", temp: "24.5°C", hum: "70%", soil: "35%" }
  },
  { 
    id: 4, name: "Espárrago Verde Fino", farmer: "Danper Trujillo", location: "Valle de Moche", 
    price: 5800, stock: "150 TM", stockVal: 150, minOrder: "5 TM", minOrderVal: 5, region: "Costa", department: "La Libertad", 
    category: "Hortalizas", verified: true, image: "https://images.unsplash.com/photo-1515471204579-f30b05024b1d?w=800", 
    traceId: "KP-ES-6604", substances: ["Nitrógeno Orgánico", "Sync IoT"],
    description: "Turiones de calibre 12-16mm, enfriamiento inmediato post-cosecha.",
    metrics: { vpd: "1.1 kPa", temp: "21.2°C", hum: "80%", soil: "42%" }
  },
  { 
    id: 5, name: "Mango Kent Export", farmer: "Sunshine Export", location: "Tambo Grande", 
    price: 4200, stock: "800 TM", stockVal: 800, minOrder: "20 TM", minOrderVal: 20, region: "Costa", department: "Piura", 
    category: "Frutas", verified: true, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800", 
    traceId: "KP-MN-5505", substances: ["Control de Mosca de la Fruta", "Humedad Controlada"],
    description: "Mango con alto brix, monitoreado desde la floración.",
    metrics: { vpd: "1.8 kPa", temp: "30.5°C", hum: "60%", soil: "25%" }
  },
  { 
    id: 6, name: "Caña de Azúcar", farmer: "Casa Grande", location: "Chicama", 
    price: 950, stock: "5000 TM", stockVal: 5000, minOrder: "500 TM", minOrderVal: 500, region: "Costa", department: "La Libertad", 
    category: "Industrial", verified: true, image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800", 
    traceId: "KP-CA-4406", substances: ["Bio-fertilización", "Zafra Mecanizada"],
    description: "Materia prima industrial con alta pureza de sacarosa.",
    metrics: { vpd: "1.3 kPa", temp: "26.8°C", hum: "55%", soil: "30%" }
  },

  // SIERRA
  { 
    id: 7, name: "Quinua Blanca Real", farmer: "Alisur S.A.C.", location: "Altiplano Puno", 
    price: 6500, stock: "120 TM", stockVal: 120, minOrder: "2 TM", minOrderVal: 2, region: "Sierra", department: "Puno", 
    category: "Granos", verified: true, image: "https://images.unsplash.com/photo-1586201375761-8386303ed294?w=800", 
    traceId: "KP-QN-3307", substances: ["Certificado Orgánico", "Ancestral"],
    description: "Pseudocereal de altura, libre de saponinas mediante proceso seco.",
    metrics: { vpd: "0.8 kPa", temp: "15.4°C", hum: "40%", soil: "20%" }
  },
  { 
    id: 8, name: "Papa Blanca Industrial", farmer: "Agropia", location: "Valle del Mantaro", 
    price: 1100, stock: "2000 TM", stockVal: 2000, minOrder: "50 TM", minOrderVal: 50, region: "Sierra", department: "Junín", 
    category: "Tubérculos", verified: true, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800", 
    traceId: "KP-PP-2208", substances: ["Sin Químicos Sintéticos", "Control de Heladas"],
    description: "Papa de alta materia seca, ideal para procesamiento industrial.",
    metrics: { vpd: "0.7 kPa", temp: "14.2°C", hum: "50%", soil: "45%" }
  },
  { 
    id: 9, name: "Café de Altura Special", farmer: "Finca Rosenheim", location: "Oxapampa/Pasco", 
    price: 28000, stock: "15 TM", stockVal: 15, minOrder: "0.5 TM", minOrderVal: 0.5, region: "Sierra", department: "Pasco", 
    category: "Café", verified: true, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", 
    traceId: "KP-CF-1109", substances: ["Sombra Natural", "Cosecha Selectiva"],
    description: "86+ puntos en taza. Perfil cítrico y achocolatado.",
    metrics: { vpd: "1.0 kPa", temp: "18.5°C", hum: "75%", soil: "38%" }
  },
  { 
    id: 10, name: "Alcachofa Exportación", farmer: "Alsur Perú", location: "Valles Interandinos", 
    price: 4800, stock: "300 TM", stockVal: 300, minOrder: "10 TM", minOrderVal: 10, region: "Sierra", department: "Huanuco", 
    category: "Hortalizas", verified: true, image: "https://images.unsplash.com/photo-1518735817511-098523c9f28d?w=800", 
    traceId: "KP-AL-0010", substances: ["Manejo Integrado de Plagas"],
    description: "Fondos de alcachofa de calibre uniforme para conserva.",
    metrics: { vpd: "1.2 kPa", temp: "19.8°C", hum: "65%", soil: "32%" }
  },
  { 
    id: 11, name: "Aguaymanto Súperfood", farmer: "Villa Andina", location: "Montañas de Cajamarca", 
    price: 12500, stock: "40 TM", stockVal: 40, minOrder: "1 TM", minOrderVal: 1, region: "Sierra", department: "Cajamarca", 
    category: "Frutas", verified: true, image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?w=800", 
    traceId: "KP-AG-9911", substances: ["Recolección Sostenible", "Libre de Pesticidas"],
    description: "Fruta deshidratada o fresca con alto contenido de vitamina C.",
    metrics: { vpd: "0.9 kPa", temp: "17.4°C", hum: "55%", soil: "28%" }
  },

  // SELVA
  { 
    id: 12, name: "Cacao Fino de Aroma", farmer: "Machu Picchu Foods", location: "Valle del Huallaga", 
    price: 15500, stock: "250 TM", stockVal: 250, minOrder: "10 TM", minOrderVal: 10, region: "Selva", department: "San Martín", 
    category: "Cacao", verified: true, image: "https://images.unsplash.com/photo-1542617300-97061d4e0e56?w=800", 
    traceId: "KP-CC-8812", substances: ["Fermentación Controlada", "Orgánico"],
    description: "Cacao con perfil de sabor complejo, monitoreo de temperatura de secado.",
    metrics: { vpd: "1.4 kPa", temp: "29.2°C", hum: "85%", soil: "40%" }
  },
  { 
    id: 13, name: "Palma Aceitera Bulk", farmer: "Grupo Palmas", location: "Palmas del Espino", 
    price: 3200, stock: "3000 TM", stockVal: 3000, minOrder: "200 TM", minOrderVal: 200, region: "Selva", department: "San Martín", 
    category: "Industrial", verified: true, image: "https://images.unsplash.com/photo-1520023472714-c689ea34375b?w=800", 
    traceId: "KP-PA-7713", substances: ["RSPO Certified", "Trazabilidad Satelital"],
    description: "Aceite crudo de palma sustentable para industria cosmética/alimento.",
    metrics: { vpd: "1.6 kPa", temp: "31.5°C", hum: "78%", soil: "35%" }
  },
  { 
    id: 14, name: "Castañas del Amazonas", farmer: "Candela Perú", location: "Puerto Maldonado", 
    price: 35000, stock: "20 TM", stockVal: 20, minOrder: "1 TM", minOrderVal: 1, region: "Selva", department: "Madre de Dios", 
    category: "Frutos Secos", verified: true, image: "https://images.unsplash.com/photo-1425136737562-fabb3fe05fc5?w=800", 
    traceId: "KP-CS-6614", substances: ["Cuidado de Bioma", "Secado Solar"],
    description: "Nueces silvestres recolectadas por comunidades locales.",
    metrics: { vpd: "1.1 kPa", temp: "27.4°C", hum: "90%", soil: "42%" }
  },
  { 
    id: 15, name: "Banano Orgánico", farmer: "APPBOSA", location: "Valle del Chira", 
    price: 2800, stock: "1200 TM", stockVal: 1200, minOrder: "40 TM", minOrderVal: 40, region: "Selva", department: "Piura", 
    category: "Frutas", verified: true, image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800", 
    traceId: "KP-BN-5515", substances: ["Fair Trade Certified", "Bio-Control"],
    description: "Banano de exportación, cumplimiento estricto de LMR.",
    metrics: { vpd: "1.5 kPa", temp: "32.1°C", hum: "70%", soil: "30%" }
  },
  { 
    id: 16, name: "Café Amazónico", farmer: "Perhusa", location: "Valles de Chanchamayo", 
    price: 19500, stock: "600 TM", stockVal: 600, minOrder: "50 TM", minOrderVal: 50, region: "Selva", department: "Junín", 
    category: "Café", verified: true, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", 
    traceId: "KP-CF-4416", substances: ["Manejo de Ecosistemas", "Sin Herbicidas"],
    description: "Café de cuerpo robusto cultivado en selva alta central.",
    metrics: { vpd: "1.2 kPa", temp: "23.4°C", hum: "82%", soil: "45%" }
  },
];

export default function MarketplacePage() {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [filterRegion, setFilterRegion] = useState("Todas");
  const [filterDept, setFilterDept] = useState("Todos");
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(0);

  useEffect(() => {
    if (selectedProduct) {
      setModalQty(selectedProduct.minOrderVal);
    }
  }, [selectedProduct]);

  const departments = useMemo(() => {
    const list = PRODUCTS.filter(p => filterRegion === "Todas" || p.region === filterRegion).map(p => p.department);
    return ["Todos", ...Array.from(new Set(list))];
  }, [filterRegion]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const regionMatch = filterRegion === "Todas" || p.region === filterRegion;
      const deptMatch = filterDept === "Todos" || p.department === filterDept;
      return regionMatch && deptMatch;
    });
  }, [filterRegion, filterDept]);

  const addToCartInternal = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? {...i, qty: i.qty + qty} : i);
      return [...prev, { product, qty }];
    });
    setIsCartOpen(true);
  };

  const handleDownloadCert = async () => {
    if (selectedProduct) {
      await generatePDF("quality-cert-content", `Certificado_${selectedProduct.traceId}.pdf`);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <div className="marketplace-root dark-theme">
      <div className="market-nav-bar glass-panel">
        <div className="container nav-flex">
          <div className="role-switcher">
            <button className={role === "buyer" ? "active" : ""} onClick={() => { setRole("buyer"); setSelectedProduct(null); }}>Comprar (Wholesale)</button>
            <button className={role === "seller" ? "active" : ""} onClick={() => { setRole("seller"); setSelectedProduct(null); }}>Vender (Productor)</button>
          </div>
          <button className="cart-badge" onClick={() => setIsCartOpen(true)}>Bolsa Mayorista ({cart.length})</button>
        </div>
      </div>

      <main className="container main-market">
        {role === "buyer" ? (
          <div className="animate-fade">
            <header className="view-header">
              <h1>Mercado Nacional Agro-Industrial</h1>
              <p>Abastecimiento directo con trazabilidad IoT de las empresas líderes del Perú.</p>
            </header>

            <div className="market-layout">
              <aside className="sidebar-filters glass-panel">
                <div className="filter-group">
                  <h3>Región Natural</h3>
                  {["Todas", "Costa", "Sierra", "Selva"].map(r => (
                    <button key={r} onClick={() => { setFilterRegion(r); setFilterDept("Todos"); }} className={filterRegion === r ? "active" : ""}>{r}</button>
                  ))}
                </div>
                <div className="filter-group">
                  <h3>Departamento</h3>
                  <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="dept-select">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </aside>

              <div className="catalog-content">
                <div className="product-grid">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="p-card glass-panel" onClick={() => setSelectedProduct(p)}>
                      <div className="p-img">
                        <img src={p.image} alt={p.name} />
                        <div className="p-overlay-tag">VERIFICADO</div>
                      </div>
                      <div className="p-body">
                        <div className="p-loc"><span>{p.department}</span> • <span>{p.region}</span></div>
                        <h4>{p.name}</h4>
                        <p className="p-farmer"><span className="firm">{p.farmer}</span> | <span className="location-txt">{p.location}</span></p>
                        <div className="p-wholesale-info">
                          <div className="stat"><label>Stock</label><span>{p.stock}</span></div>
                          <div className="stat"><label>P. Mínimo</label><span>{p.minOrder}</span></div>
                        </div>
                        <div className="p-footer">
                          <span className="price-tag">S/.{p.price.toLocaleString()} <small>/TM</small></span>
                          <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCartInternal(p, p.minOrderVal); }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade">
            <header className="view-header"><h1>Centro de Operaciones Agrícolas</h1></header>
            <div className="seller-dashboard">
              <div className="stats-grid">
                <div className="s-card glass-panel green"><h5>Cosecha Despachada</h5><div className="val">2,480 TM</div><small>Wholesale Corporativo</small></div>
                <div className="s-card glass-panel blue"><h5>Certificaciones Aktivas</h5><div className="val">06</div><small>GlobalG.A.P / Organic</small></div>
                <div className="s-card glass-panel gold"><h5>Puntaje de Productor</h5><div className="val">98%</div><small>Ranking de Confianza</small></div>
              </div>
              <div className="publish-sec glass-panel">
                <h3>Publicar Lote de Producción</h3>
                <div className="form-grid">
                  <div className="f-group"><label>Producto</label><input type="text" placeholder="Ej: Arándanos Biloxi" /></div>
                  <div className="f-group"><label>Empresa / Campo</label><input type="text" placeholder="Ej: Fundo El Sol S.A." /></div>
                  <div className="f-group"><label>Precio x TM (S/.)</label><input type="number" placeholder="12500" /></div>
                  <div className="f-group"><label>Ubicación (Valle/Dpto)</label><input type="text" placeholder="Ej: Virú, La Libertad" /></div>
                </div>
                <div className="sync-banner glass-panel">
                  <div className="icon">⚡</div>
                  <div className="txt"><h5>Trazabilidad en Tiempo Real</h5><p>VPD: 1.2 kPa | Temp: 22.4°C | Humedad Suelo: 45% (Certificado AgroPredict)</p></div>
                </div>
                <button className="btn-final">Emitir Certificado y Publicar</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal glass-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-grid">
              <div className="modal-visual">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <div className="visual-overlay"></div>
                
                {/* Live Data Panel Over Image */}
                <div className="live-data-panel glass-panel">
                  <div className="live-header"><span className="live-dot"></span> DATOS EN VIVO IoT</div>
                  <div className="metrics-grid">
                    <div className="metric">
                      <label>VPD</label>
                      <span>{selectedProduct.metrics.vpd}</span>
                    </div>
                    <div className="metric">
                      <label>Temp</label>
                      <span>{selectedProduct.metrics.temp}</span>
                    </div>
                    <div className="metric">
                      <label>Humedad</label>
                      <span>{selectedProduct.metrics.hum}</span>
                    </div>
                    <div className="metric">
                      <label>Suelo</label>
                      <span>{selectedProduct.metrics.soil}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-details">
                <div className="modal-scroll-area">
                  <div className="trace-header">
                    <div className="trace-badge">LOT-ID: {selectedProduct.traceId}</div>
                    <div className="status-pill"><span className="dot"></span> Verificado IoT 24/7</div>
                  </div>
                  
                  <h2>{selectedProduct.name}</h2>
                  
                  <div className="meta-info">
                    <div className="meta-item">
                      <label>Productor Líder</label>
                      <span>{selectedProduct.farmer}</span>
                    </div>
                    <div className="meta-item">
                      <label>Origen Campo</label>
                      <span>{selectedProduct.location}, {selectedProduct.department}</span>
                    </div>
                  </div>
                  
                  <div className="description-box">
                    <p>{selectedProduct.description}</p>
                    <div className="data-value-callout">
                      <strong>VALOR AGREGADO:</strong> Monitoreo satelital activo asegura un brix compensado y ausencia de estrés hídrico durante la maduración.
                    </div>
                  </div>

                  <div className="passport-card glass-panel">
                    <div className="passport-header">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <h5>AGRO-PASAPORTE DIGITAL</h5>
                    </div>
                    <div className="tag-list">
                      {selectedProduct.substances.map(s => <span key={s} className="tag">✓ {s}</span>)}
                      <span className="tag premium">✓ Residuo Cero</span>
                      <span className="tag premium">✓ Calidad Exportación</span>
                    </div>
                  </div>
                </div>

                <div className="modal-actions-footer">
                  <div className="order-controls">
                    <div className="qty-selector">
                      <label>Cantidad (TM)</label>
                      <div className="qty-input">
                        <button onClick={() => setModalQty(Math.max(selectedProduct.minOrderVal, modalQty - 5))}>-</button>
                        <input type="number" value={modalQty} onChange={(e) => setModalQty(Math.max(selectedProduct.minOrderVal, parseFloat(e.target.value) || 0))} />
                        <button onClick={() => setModalQty(Math.min(selectedProduct.stockVal, modalQty + 5))}>+</button>
                      </div>
                      <small>Pedido Mínimo: {selectedProduct.minOrder}</small>
                    </div>
                    <div className="price-info">
                      <span className="unit">Total Estimado (S/.)</span>
                      <span className="val">{(selectedProduct.price * modalQty).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="btn-group">
                    <button className="download-btn" onClick={handleDownloadCert}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    </button>
                    <button className="quote-btn" onClick={() => { addToCartInternal(selectedProduct, modalQty); setSelectedProduct(null); }}>
                      Solicitar Cotización B2B
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'none' }}>
              <div id="quality-cert-content" style={{ padding: '60px', color: '#000', background: '#fff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                 <div style={{ textAlign: 'center', borderBottom: '3px solid #10b981', paddingBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#065f46', fontSize: '28px' }}>CERTIFICADO DE ORIGEN Y CALIDAD</h1>
                    <p style={{ margin: '10px 0', fontSize: '14px', letterSpacing: '2px' }}>AGROPREDICT SMART SYSTEM</p>
                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>ID RASTREO: {selectedProduct.traceId}</p>
                 </div>
                 <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h3 style={{ borderBottom: '1px solid #eee' }}>DETALLES DEL PRODUCTO</h3>
                      <p><strong>Nombre:</strong> {selectedProduct.name}</p>
                      <p><strong>Categoría:</strong> {selectedProduct.category}</p>
                      <p><strong>TM Ofrecidas:</strong> {selectedProduct.stock}</p>
                    </div>
                    <div>
                      <h3 style={{ borderBottom: '1px solid #eee' }}>ORIGEN CORPORATIVO</h3>
                      <p><strong>Empresa:</strong> {selectedProduct.farmer}</p>
                      <p><strong>Campos:</strong> {selectedProduct.location}</p>
                      <p><strong>Ubicación:</strong> {selectedProduct.department}, Perú</p>
                    </div>
                 </div>
                 <div style={{ marginTop: '40px', padding: '30px', background: '#f0fdf4', border: '1px solid #10b981', borderRadius: '15px' }}>
                    <h3 style={{ color: '#065f46', marginTop: 0 }}>DECLARACIÓN TÉCNICA AGRO-IA</h3>
                    <p>AgroPredict certifica que este lote ha sido cultivado bajo <strong>parámetros de stress hídrico controlado</strong> y monitoreo constante de <strong>VPD (Déficit de Presión de Vapor)</strong>.</p>
                    <p><strong>Seguridad Alimentaria:</strong> Se garantiza la **ausencia total de agroquímicos sintéticos** y pesticidas prohibidos. El cultivo fue fertilizado mediante métodos orgánicos y minerales certificados.</p>
                    <p><strong>Monitoreo:</strong> 24/7 Conexión Satelital e IoT.</p>
                 </div>
                 <div style={{ marginTop: '50px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', textAlign: 'left', fontSize: '12px', color: '#666' }}>
                      <p>Firma Digital: 88f2-99a1-77b3-22c4</p>
                      <p>Fecha de Emisión: {new Date().toLocaleDateString()}</p>
                    </div>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://agropredict.com/verify-lot/" alt="QR" style={{ display: 'block', margin: '20px auto' }} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer glass-panel" onClick={e => e.stopPropagation()}>
            <header>
              <h2>Operaciones B2B</h2>
              <button onClick={() => setIsCartOpen(false)}>✕</button>
            </header>
            <div className="cart-items">
              {cart.length === 0 ? <div className="empty">Sin operaciones activas</div> : cart.map(i => (
                <div key={i.product.id} className="item">
                  <img src={i.product.image} />
                  <div className="info">
                    <h5>{i.product.name}</h5>
                    <p>{i.qty} TM x S/. {i.product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <footer>
                <div className="total-row">
                  <span>Inversión Estimada</span>
                  <span>S/. {cartTotal.toLocaleString()}</span>
                </div>
                <button className="confirm-btn">Confirmar Interés Mayorista</button>
              </footer>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .marketplace-root { min-height: 100vh; background: #08090a; color: #fff; padding-top: 60px; font-family: 'Inter', sans-serif; }
        .container { max-width: 1300px; margin: 0 auto; padding: 0 30px; }
        .market-nav-bar { position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-flex { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
        .role-switcher { display: flex; background: rgba(0,0,0,0.5); padding: 5px; border-radius: 40px; }
        .role-switcher button { border: none; background: none; color: #666; padding: 10px 24px; border-radius: 30px; cursor: pointer; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; transition: 0.3s; }
        .role-switcher button.active { background: #10b981; color: #000; }
        .cart-badge { background: rgba(255,193,7,0.1); border: 1px solid #ffc107; color: #ffc107; padding: 10px 20px; border-radius: 30px; font-weight: 800; cursor: pointer; font-size: 0.8rem; }

        .view-header { margin: 60px 0; text-align: center; }
        .view-header h1 { font-size: 3.8rem; font-weight: 950; letter-spacing: -1.5px; margin-bottom: 12px; background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .view-header p { color: #10b981; font-weight: 700; font-size: 1.2rem; letter-spacing: 0.5px; }

        .market-layout { display: grid; grid-template-columns: 280px 1fr; gap: 40px; }
        .sidebar-filters { padding: 30px; border-radius: 30px; position: sticky; top: 100px; height: fit-content; }
        .filter-group { margin-bottom: 35px; }
        .filter-group h3 { font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; font-weight: 900; }
        .filter-group button { display: block; width: 100%; text-align: left; background: none; border: none; color: #777; padding: 14px; border-radius: 12px; cursor: pointer; transition: 0.2s; font-weight: 600; }
        .filter-group button:hover { color: #fff; background: rgba(255,255,255,0.02); }
        .filter-group button.active { color: #10b981; background: rgba(16, 185, 129, 0.08); font-weight: 900; }
        .dept-select { width: 100%; background: #000; border: 1px solid #222; color: #fff; padding: 15px; border-radius: 12px; font-weight: 600; appearance: none; }

        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
        .p-card { border-radius: 30px; overflow: hidden; cursor: pointer; transition: 0.4s cubic-bezier(0.2, 0, 0, 1); border: 1px solid rgba(255,255,255,0.03); background: rgba(255, 255, 255, 0.01); }
        .p-card:hover { transform: translateY(-12px) scale(1.02); border-color: rgba(16, 185, 129, 0.3); box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25); }
        .p-img { position: relative; height: 200px; }
        .p-img img { width: 100%; height: 100%; object-fit: cover; }
        .p-overlay-tag { position: absolute; top: 20px; right: 20px; background: #10b981; color: #000; padding: 6px 12px; border-radius: 8px; font-size: 0.6rem; font-weight: 950; }
        .p-body { padding: 25px; }
        .p-loc { font-size: 0.6rem; color: #444; text-transform: uppercase; font-weight: 900; margin-bottom: 6px; letter-spacing: 1px; }
        .p-body h4 { font-size: 1.4rem; font-weight: 900; margin-bottom: 4px; color: #fff; }
        .p-farmer { font-size: 0.85rem; color: #666; margin-bottom: 15px; }
        .p-farmer .firm { color: #eee; font-weight: 700; }
        .location-txt { color: #10b981; font-weight: 600; }
        .p-wholesale-info { display: flex; gap: 20px; padding-bottom: 18px; border-bottom: 1px solid #111; margin-bottom: 18px; }
        .stat label { display: block; font-size: 0.5rem; color: #444; text-transform: uppercase; margin-bottom: 4px; font-weight: 900; }
        .stat span { font-size: 1rem; font-weight: 900; color: #ccc; }
        .p-footer { display: flex; justify-content: space-between; align-items: center; }
        .price-tag { font-size: 1.5rem; font-weight: 950; }
        .price-tag small { font-size: 0.75rem; color: #555; }
        .add-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; transition: 0.3s cubic-bezier(0.2, 0, 0, 1); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
        .add-btn:hover { background: #10b981; color: #000; border-color: #10b981; transform: rotate(90deg); }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); padding: 20px; }
        .product-modal { width: 100%; max-width: 1100px; height: 90vh; max-height: 850px; border-radius: 40px; overflow: hidden; position: relative; background: #0c0d0e; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 50px 100px rgba(0,0,0,0.5); }
        .close-btn { position: absolute; top: 25px; right: 25px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; z-index: 100; font-size: 1.2rem; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { background: #ef4444; border-color: #ef4444; transform: rotate(90deg); }
        .modal-grid { display: grid; grid-template-columns: 1fr 1.2fr; height: 100%; }
        .modal-visual { position: relative; background: #000; overflow: hidden; }
        .modal-visual img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s cubic-bezier(0.2, 0, 0, 1); }
        .modal-visual:hover img { transform: scale(1.05); }
        .visual-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(to top, #0c0d0e, transparent); }
        
        .live-data-panel { position: absolute; top: 30px; left: 30px; right: 30px; padding: 25px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); z-index: 5; }
        .live-header { font-size: 0.7rem; font-weight: 900; color: #10b981; letter-spacing: 2px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
        .live-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: blink 1s infinite; }
        @keyframes blink { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .metric label { display: block; font-size: 0.55rem; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 4px; font-weight: 800; }
        .metric span { font-size: 1rem; font-weight: 900; color: #fff; }

        .modal-details { padding: 0; display: flex; flex-direction: column; height: 100%; position: relative; }
        .modal-scroll-area { padding: 60px; overflow-y: auto; flex: 1; }
        .modal-scroll-area::-webkit-scrollbar { width: 6px; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        .trace-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .trace-badge { background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; padding: 8px 16px; border-radius: 40px; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; }
        .status-pill { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #10b981; font-weight: 700; }
        .status-pill .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }

        .modal-details h2 { font-size: 3.5rem; font-weight: 950; letter-spacing: -2px; line-height: 1.1; margin-bottom: 30px; background: linear-gradient(135deg, #fff 0%, #aaa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .meta-item label { display: block; font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 900; margin-bottom: 8px; letter-spacing: 1.5px; }
        .meta-item span { font-size: 1.1rem; font-weight: 700; color: #eee; }

        .description-box { color: #888; line-height: 1.8; margin-bottom: 40px; font-size: 1rem; border-left: 3px solid #10b981; padding-left: 20px; }
        .data-value-callout { margin-top: 15px; font-size: 0.85rem; color: #10b981; background: rgba(16, 185, 129, 0.05); padding: 12px; border-radius: 10px; }
        
        .passport-card { padding: 35px; border-radius: 30px; background: rgba(16, 185, 129, 0.03); border: 1px solid rgba(16, 185, 129, 0.1); }
        .passport-header { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; color: #10b981; }
        .passport-header h5 { font-size: 0.75rem; letter-spacing: 3px; font-weight: 900; margin: 0; }
        .tag-list { display: flex; flex-wrap: wrap; gap: 12px; }
        .tag { background: rgba(255,255,255,0.03); padding: 10px 20px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; color: #999; border: 1px solid rgba(255,255,255,0.05); }
        .tag.premium { color: #fff; border: 1px solid rgba(16, 185, 129, 0.3); background: rgba(16,185,129,0.1); box-shadow: 0 4px 15px rgba(16,185,129,0.1); }

        .modal-actions-footer { padding: 40px 60px; background: #0e1011; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 30px; }
        .order-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: flex-end; }
        .qty-selector label { display: block; font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; }
        .qty-input { display: flex; align-items: center; background: #000; border: 1px solid #222; border-radius: 15px; overflow: hidden; width: fit-content; }
        .qty-input button { width: 50px; height: 50px; background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; transition: 0.2s; }
        .qty-input button:hover { background: rgba(255,255,255,0.05); }
        .qty-input input { width: 80px; background: none; border: none; text-align: center; color: #fff; font-size: 1.2rem; font-weight: 900; border-left: 1px solid #111; border-right: 1px solid #111; }
        .qty-selector small { display: block; margin-top: 8px; font-size: 0.7rem; color: #444; font-weight: 700; }

        .price-info .unit { font-size: 0.7rem; color: #555; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; display: block; margin-bottom: 4px; }
        .price-info .val { font-size: 2.8rem; font-weight: 950; display: block; line-height: 1; color: #fff; }
        .price-info .val::before { content: 'S/. '; font-size: 1.5rem; color: #10b981; vertical-align: middle; margin-right: 5px; }

        .btn-group { display: flex; gap: 20px; }
        .download-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0 25px; height: 65px; border-radius: 20px; font-weight: 800; cursor: pointer; transition: 0.3s; display: flex; align-items: center; }
        .download-btn:hover { background: #fff; color: #000; border-color: #fff; transform: translateY(-3px); }
        .quote-btn { flex: 1; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #000; height: 65px; border-radius: 22px; font-weight: 950; cursor: pointer; transition: 0.4s cubic-bezier(0.2, 0, 0, 1); border: none; box-shadow: 0 20px 40px rgba(16,185,129,0.25); font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .quote-btn:hover { transform: translateY(-5px); box-shadow: 0 25px 50px rgba(16,185,129,0.4); }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 50px; }
        .s-card { padding: 35px; border-radius: 30px; text-align: center; }
        .s-card h5 { font-size: 0.7rem; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
        .s-card .val { font-size: 2.5rem; font-weight: 950; }
        .publish-sec { max-width: 900px; margin: 0 auto; padding: 50px; border-radius: 40px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .f-group label { display: block; font-size: 0.75rem; color: #444; font-weight: 900; text-transform: uppercase; margin-bottom: 12px; }
        .f-group input { width: 100%; background: #000; border: 1px solid #222; padding: 18px; border-radius: 15px; color: #fff; font-weight: 600; }
        .btn-final { width: 100%; padding: 22px; background: #10b981; color: #000; font-weight: 950; font-size: 1.1rem; border-radius: 20px; margin-top: 40px; cursor: pointer; }

        .cart-drawer { position: absolute; right: 0; top: 0; height: 100%; width: 500px; background: #000; padding: 50px; border-left: 1px solid #111; display: flex; flex-direction: column; }
        .cart-drawer h2 { font-size: 2rem; font-weight: 950; }
        .confirm-btn { width: 100%; padding: 22px; background: #10b981; color: #000; font-weight: 950; font-size: 1.2rem; border-radius: 20px; cursor: pointer; margin-top: 30px; }

        .glass-panel { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .animate-fade { animation: fadeIn 0.5s cubic-bezier(0.2, 0, 0, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
