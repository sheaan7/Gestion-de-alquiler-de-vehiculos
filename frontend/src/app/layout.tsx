import "./globals.css";
import { ReactNode } from "react";
import Header from "../components/Header";

export const metadata = {
  title: "JCPerez | Alquiler de Automóviles",
  description: "Sistema de gestión de alquiler de vehículos",
};

export default function DisposicionRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
