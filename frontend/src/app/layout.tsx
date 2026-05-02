import { ReactNode } from "react";

export const metadata = {
  title: "Alquiler de vehiculos",
  description: "Frontend basico para gestion de alquiler"
};

export default function DisposicionRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
