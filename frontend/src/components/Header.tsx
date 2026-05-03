"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../images/JCPerez.png";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/vehiculos", label: "Vehículos" },
  { href: "/admin", label: "Administración" },
  { href: "/operaciones", label: "Operaciones" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Franja principal: logo + nombre */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md ring-2 ring-blue-100">
              <Image
                src={Logo}
                alt="JCPerez"
                width={72}
                height={72}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 font-head leading-tight">
                JCPerez
              </p>
              <p className="text-sm text-gray-500 font-medium leading-tight">
                Alquiler de Automóviles
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-400 italic">
            Sistema de Gestión de Flota
          </div>
        </div>

        {/* Barra de navegación */}
        <nav className="flex items-center gap-0.5 py-2">
          {LINKS.map(({ href, label }) => {
            const activo = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activo
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
