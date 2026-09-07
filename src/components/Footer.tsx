import React from 'react';
import { MessageCircle, Code, ArrowUp, Compass } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenPrivacy }) => {
  const currentYear = new Date().getFullYear();
  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(config.whatsappMessage)}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerNavLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Habilidades', href: '#habilidades' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Reseñas & Clientes', href: '#resenas' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs sm:text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Barra de Navegación al final de la web with tactile bordered buttons */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block">
                Barra de Navegación
              </span>
              <span className="text-[11px] text-slate-400">
                Acceso directo a las secciones del portafolio
              </span>
            </div>
          </div>

          <nav id="bottom-navigation-bar" aria-label="Navegación inferior" className="flex flex-wrap items-center justify-center gap-2">
            {footerNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-950/90 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-900 shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner active:bg-slate-950 active:border-emerald-400 select-none cursor-pointer flex items-center gap-1.5"
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Code className="w-4 h-4" />
              </div>
              <span>{config.name}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Desarrollador Web especializado en HTML5 semántico, CSS3 adaptable a móviles y laptops, y JavaScript interactivo de alto rendimiento.
            </p>
            <div className="pt-2">
              <a
                id="footer-whatsapp-badge"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/60 text-xs text-emerald-400 hover:text-emerald-300 font-semibold shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {config.whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Navegación</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-emerald-500/50 hover:text-white text-slate-300 shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner active:bg-slate-950 active:border-emerald-400 select-none cursor-pointer group"
                  >
                    <span>{link.label}</span>
                    <span className="text-slate-500 group-hover:text-emerald-400 text-xs transition-colors">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Legal</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="btn-footer-privacy"
                  onClick={onOpenPrivacy}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-emerald-500/50 hover:text-white text-slate-300 shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner active:bg-slate-950 active:border-emerald-400 select-none text-left cursor-pointer group"
                >
                  <span>Políticas de Privacidad</span>
                  <span className="text-slate-500 group-hover:text-emerald-400 text-xs transition-colors">📄</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {config.name}. Todos los derechos reservados. Desarrollado con HTML5, CSS3 y JavaScript.</p>
          
          <button
            id="btn-footer-scroll-top"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:text-white text-slate-300 text-xs font-medium shadow-sm transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner active:bg-slate-950 select-none cursor-pointer"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
