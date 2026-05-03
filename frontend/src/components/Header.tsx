"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../images/JCPerez.png";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/vehiculos", label: "Vehículos" },
  { href: "/admin", label: "Admin" },
  { href: "/operaciones", label: "Operaciones" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src={Logo} alt="JCPerez" width={40} height={40} className="rounded-full object-cover" />
          <span className="font-bold text-gray-800 text-sm sm:text-base">
            JCPerez <span className="text-gray-400 font-normal">| Alquiler de Automóviles</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const activo = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activo
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
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
