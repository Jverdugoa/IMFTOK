import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier IA | Asistente de Estilismo Personal & Guardarropa Inteligente",
  description: "Organiza tu guardarropa con fotos, descubre tu colorimetría y genera las mejores combinaciones con un estilista personal potenciado por IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 selection:bg-terracotta-100 selection:text-terracotta-700">
        {children}
      </body>
    </html>
  );
}
