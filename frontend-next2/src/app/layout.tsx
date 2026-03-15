import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agro Kipura Tech | Inteligencia Artificial para la Agricultura Peruana",
  description:
    "Plataforma de monitoreo agrícola inteligente con IA. Conectamos la sabiduría ancestral del Perú con tecnología de precisión para optimizar cultivos en la Costa, Sierra y Selva.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
