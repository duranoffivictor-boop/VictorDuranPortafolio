import React, { useState } from 'react';
import { MessageCircle, Menu, X, ShieldCheck, Code, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  name: string;
  whatsappNumber: string;
  whatsappMessage: string;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  name,
  whatsappNumber,
  whatsappMessage,
  onOpenAdmin,
  isAdminLoggedIn,
  theme,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Habilidades', href: '#habilidades' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Por Qué Elegirme', href: '#ventajas' },
    { label: 'Preguntas Frecuentes', href: '#faq' },
    { label: 'Reseñas & Clientes', href: '#resenas' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-200">
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
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block leading-tight">
                {name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Web Developer (HTML • CSS • JS)
              </span>
            </div>
          </a>

          {/* Desktop Navigation with tactile bordered buttons */}
          <nav id="desktop-navigation" aria-label="Navegación principal" className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/70 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 xl:px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800/90 bg-transparent hover:bg-white dark:hover:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:shadow-xs transition-all duration-150 ease-out active:scale-95 select-none cursor-pointer whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5">
            {/* Theme Toggle Button (Light/Dark Switcher) */}
            <button
              id="theme-toggle-desktop-btn"
              onClick={onToggleTheme}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all duration-150 ease-out active:translate-y-0.5 active:scale-95 select-none cursor-pointer shadow-sm ${
                theme === 'dark'
                  ? 'bg-slate-800/95 border-amber-400/75 text-amber-200 hover:bg-slate-800 hover:border-amber-300 hover:text-amber-100 shadow-[0_0_14px_rgba(251,191,36,0.22)]'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-900 shadow-xs'
              }`}
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? (
                <>
                  <span className="w-5 h-5 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner">
                    <Sun className="w-3 h-3 stroke-[2.5] transition-transform hover:rotate-45" />
                  </span>
                  <span className="font-semibold tracking-wide text-amber-100 hidden xl:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <span className="w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-inner">
                    <Moon className="w-3 h-3 stroke-[2.5] transition-transform hover:-rotate-12" />
                  </span>
                  <span className="font-semibold tracking-wide text-slate-800 hidden xl:inline">Modo Oscuro</span>
                </>
              )}
            </button>

            {/* WhatsApp CTA */}
            <a
              id="navbar-whatsapp-cta"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-400/40 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:border-emerald-300 transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>WhatsApp</span>
              <span className="text-[11px] bg-emerald-700/60 px-1.5 py-0.5 rounded font-mono hidden xl:inline">
                {whatsappNumber}
              </span>
            </a>

            {/* Admin Trigger */}
            <button
              id="navbar-admin-trigger"
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer whitespace-nowrap ${
                isAdminLoggedIn
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/20 active:bg-amber-950/50'
                  : 'bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
              title="Panel de Administración"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isAdminLoggedIn ? 'Admin Activo' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile menu and controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Theme Switcher Icon */}
            <button
              id="navbar-theme-toggle-mobile"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border-2 transition-all duration-150 ease-out active:translate-y-0.5 active:scale-95 select-none cursor-pointer flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-slate-800 border-amber-400/80 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.25)] hover:border-amber-300 hover:bg-slate-750'
                  : 'bg-white border-slate-300 text-indigo-600 shadow-xs hover:border-indigo-400 hover:bg-indigo-50/60'
              }`}
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <Moon className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>

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
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none"
              aria-label="Alternar menú móvil"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/95 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-white hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-xs transition-all duration-100 ease-out active:translate-y-1 active:scale-95 select-none"
              >
                <span>{link.label}</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">→</span>
              </a>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2.5">
            {/* Theme Toggle in Mobile Menu */}
            <button
              id="mobile-menu-theme-btn"
              onClick={onToggleTheme}
              className={`flex items-center justify-between w-full py-3 px-4 rounded-xl border-2 transition-all duration-150 ease-out active:translate-y-0.5 active:scale-95 select-none ${
                theme === 'dark'
                  ? 'bg-slate-800/95 border-amber-400/75 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.18)]'
                  : 'bg-white border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <span className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner">
                    <Sun className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-inner">
                    <Moon className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                )}
                <span className="font-semibold text-sm">
                  {theme === 'dark' ? 'Modo Oscuro (Activo)' : 'Modo Claro (Activo)'}
                </span>
              </div>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}>
                Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
              </span>
            </button>

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
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

