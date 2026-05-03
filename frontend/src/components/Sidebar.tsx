"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "../images/JCPerez.png";

const NAV_ITEMS = [
  { href: "/", icon: "◈", label: "Dashboard" },
  { href: "/vehiculos", icon: "⊕", label: "Flota de Vehículos" },
  { href: "/admin", icon: "≡", label: "Administración" },
  { href: "/operaciones", icon: "◷", label: "Operaciones" },
];

export default function Sidebar() {
  const ruta = usePathname();

  const esActiva = (href: string) =>
    href === "/" ? ruta === "/" : ruta.startsWith(href);

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image src={Logo} alt="JCPerez" width={36} height={36} style={{ borderRadius: 8 }} />
        <div>
          <div
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: 16,
              color: "var(--accent)",
              letterSpacing: -0.3,
              lineHeight: 1.1,
            }}
          >
            JCPerez
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>
            Alquiler de Automóviles
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "8px 10px 6px",
          }}
        >
          Principal
        </div>
        {NAV_ITEMS.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all .15s",
              marginBottom: 2,
              background: esActiva(href) ? "rgba(232,255,71,.08)" : "transparent",
              color: esActiva(href) ? "var(--accent)" : "var(--muted)",
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        v1.0 — Sistema de Gestión
      </div>
    </aside>
  );
}
