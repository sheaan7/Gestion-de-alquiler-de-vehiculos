import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Alquiler de vehiculos",
  description: "Frontend para gestion de alquiler"
};

export default function DisposicionRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
