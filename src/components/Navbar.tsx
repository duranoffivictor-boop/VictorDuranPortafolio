import React, { useState } from 'react';
import { MessageCircle, Menu, X, ShieldCheck, Code, Sparkles } from 'lucide-react';

interface NavbarProps {
  name: string;
  whatsappNumber: string;
  whatsappMessage: string;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  name,
  whatsappNumber,
  whatsappMessage,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Habilidades', href: '#habilidades' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Reseñas & Clientes', href: '#resenas' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a
            id="brand-logo-link"
            href="#inicio"
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Code className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors block leading-tight">
                {name}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Web Developer (HTML • CSS • JS)
              </span>
            </div>
          </a>

          {/* Desktop Navigation with tactile bordered buttons */}
          <nav id="desktop-navigation" aria-label="Navegación principal" className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl border border-slate-800 bg-slate-950/70 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-800/90 bg-slate-900/90 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-800/90 shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner active:bg-slate-950 active:border-emerald-400 select-none cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* WhatsApp CTA */}
            <a
              id="navbar-whatsapp-cta"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-emerald-400/40 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:border-emerald-300 transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>WhatsApp</span>
              <span className="text-[11px] bg-emerald-700/60 px-1.5 py-0.5 rounded font-mono">
                {whatsappNumber}
              </span>
            </a>

            {/* Admin Trigger */}
            <button
              id="navbar-admin-trigger"
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20 active:bg-amber-950/50'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700 active:bg-slate-950'
              }`}
              title="Panel de Administración"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAdminLoggedIn ? 'Panel Admin Activo' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              id="navbar-mobile-wa-quick"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-emerald-400/40 bg-emerald-500 text-white shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none"
              aria-label="Abrir WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none"
              aria-label="Alternar menú móvil"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-sm font-medium text-slate-200 hover:text-white hover:border-emerald-500/50 hover:bg-slate-800/80 shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:bg-slate-950 active:shadow-inner active:border-emerald-400 select-none"
              >
                <span>{link.label}</span>
                <span className="text-slate-500 text-xs">→</span>
              </a>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <a
              id="mobile-menu-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-emerald-400/40 bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar a {whatsappNumber}</span>
            </a>

            <button
              id="mobile-menu-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-medium text-xs hover:bg-slate-700 transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
