"use client";
import { useState, FormEvent } from "react";

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string; region: string; cultivo: string }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("login-email") as HTMLInputElement).value;
    setTimeout(() => {
      const user = { name: email.split("@")[0], email, region: "sierra", cultivo: "papa" };
      localStorage.setItem("agroKipuraUser", JSON.stringify(user));
      onLogin(user);
      setLoading(false);
    }, 800);
  };

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const newUser = {
      name: (form.elements.namedItem("reg-name") as HTMLInputElement).value,
      email: (form.elements.namedItem("reg-email") as HTMLInputElement).value,
      region: (form.elements.namedItem("reg-region") as HTMLSelectElement).value,
      cultivo: (form.elements.namedItem("reg-cultivo") as HTMLSelectElement).value,
    };
    setTimeout(() => {
      localStorage.setItem("agroKipuraUser", JSON.stringify(newUser));
      onLogin(newUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-screen">
      <div className="login-bg-overlay" />
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon-login">
            <svg viewBox="0 0 40 40" width="52" height="52">
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--green-primary)" strokeWidth="2" />
              <path d="M20 8 C12 14, 10 22, 20 32 C30 22, 28 14, 20 8Z" fill="var(--green-primary)" opacity="0.8" />
              <path d="M20 12 C15 16, 14 22, 20 28 C26 22, 25 16, 20 12Z" fill="var(--green-light)" opacity="0.6" />
            </svg>
          </div>
          <h1>Agro <span>Kipura Tech</span></h1>
          <p className="login-subtitle">Inteligencia Artificial para la Agricultura Peruana</p>
        </div>

        {!showRegister ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="login-email">Correo Electrónico</label>
              <div className="input-wrapper">
                <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                <input type="email" name="login-email" placeholder="tu@correo.com" required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="login-password">Contraseña</label>
              <div className="input-wrapper">
                <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <input type="password" name="login-password" placeholder="Ingresa tu contraseña" required />
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              <span>{loading ? "Verificando..." : "Iniciar Sesión"}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <div className="login-divider"><span>o</span></div>
            <button type="button" className="btn-register" onClick={() => setShowRegister(true)}>Crear Cuenta Nueva</button>
          </form>
        ) : (
          <form className="login-form fade-in" onSubmit={handleRegister}>
            <div className="input-group">
              <label>Nombre Completo</label>
              <div className="input-wrapper">
                <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input type="text" name="reg-name" placeholder="Nombre y apellido" required />
              </div>
            </div>
            <div className="input-group">
              <label>Correo Electrónico</label>
              <div className="input-wrapper">
                <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                <input type="email" name="reg-email" placeholder="tu@correo.com" required />
              </div>
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <input type="password" name="reg-password" placeholder="Mínimo 6 caracteres" required minLength={6} />
              </div>
            </div>
            <div className="input-group">
              <label>Región</label>
              <div className="input-wrapper">
                <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <select name="reg-region" required>
                  <option value="">Selecciona tu región...</option>
                  <option value="costa">Costa</option>
                  <option value="sierra">Sierra</option>
                  <option value="selva">Selva</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Tipo de Cultivo Principal</label>
              <div className="input-wrapper">
                <svg className="input-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" /><path d="M12 12V2" /><path d="M8 6c2 2 6 2 8 0" /></svg>
                <select name="reg-cultivo" required>
                  <option value="">Selecciona tu cultivo...</option>
                  <option value="papa">Papa</option>
                  <option value="maiz">Maíz</option>
                  <option value="quinua">Quinua</option>
                  <option value="arroz">Arroz</option>
                  <option value="cafe">Café</option>
                  <option value="cacao">Cacao</option>
                  <option value="esparragos">Espárragos</option>
                  <option value="uva">Uva</option>
                  <option value="hortalizas">Hortalizas</option>
                  <option value="frutas">Frutas Tropicales</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              <span>{loading ? "Creando cuenta..." : "Crear Cuenta"}</span>
            </button>
            <button type="button" className="btn-register" onClick={() => setShowRegister(false)}>Volver a Iniciar Sesión</button>
          </form>
        )}
        <p className="login-footer-text">Plataforma Agrícola Nacional — Perú</p>
      </div>
    </div>
  );
}
