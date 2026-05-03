import "./globals.css";
import { ReactNode } from "react";
import { Syne, DM_Sans } from "next/font/google";
import Header from "../components/Header";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
});

export const metadata = {
  title: "JCPerez | Alquiler de Automóviles",
  description: "Sistema de gestión de alquiler de vehículos",
};

export default function DisposicionRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-slate-50 min-h-screen font-body">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
