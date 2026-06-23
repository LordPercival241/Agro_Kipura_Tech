"use client";
import { useState, useEffect } from "react";
import LoginScreen from "@/components/LoginScreen";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import HeroBanner from "@/components/HeroBanner";
import PredictionCard from "@/components/PredictionCard";
import PillarsSection from "@/components/PillarsSection";
import TelemetryGrid from "@/components/TelemetryGrid";
import ChartSection from "@/components/ChartSection";
import MapSection from "@/components/MapSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ServicesPillars from "@/components/ServicesPillars";
import { useDashboardData } from "@/hooks/useDashboardData";

interface User {
  name: string;
  email: string;
  region: string;
  cultivo: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const { latest, history, connectionStatus, isSensorReady } = useDashboardData();

  useEffect(() => {
    const savedTheme = localStorage.getItem("agroKipuraTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const saved = localStorage.getItem("agroKipuraUser");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setReady(true);
  }, []);

  const handleLogin = (u: User) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem("agroKipuraUser");
    setUser(null);
  };

  if (!ready) return null;

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="dashboard-app">
      <Sidebar userName={user.name} onLogout={handleLogout} />
      <main className="main-content">
        <Topbar connectionStatus={connectionStatus} isSensorReady={isSensorReady} />
        <div className="content-scroll">
          <HeroBanner />
          <PredictionCard latest={latest} onOpenAI={() => setActivePillar("ai")} />
          <TelemetryGrid latest={latest} />
          <ServicesPillars 
            latest={latest} 
            history={history} 
            activePillar={activePillar} 
            setActivePillar={setActivePillar} 
          />
          <ChartSection history={history} />
          <MapSection />
          <GallerySection />
          <PillarsSection />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </div>
  );
}
