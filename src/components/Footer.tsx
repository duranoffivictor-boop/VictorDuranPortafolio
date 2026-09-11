import React from 'react';
import { MessageCircle, Code, ArrowUp, Compass, Video, Facebook, Instagram, Twitter, Share2 } from 'lucide-react';
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
    { label: 'Por Qué Elegirme', href: '#ventajas' },
    { label: 'Preguntas Frecuentes', href: '#faq' },
    { label: 'Redes Sociales', href: '#redes-sociales' },
    { label: 'Reseñas & Clientes', href: '#resenas' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const socialLinks = [
    { name: 'TikTok', url: config.tiktokUrl, icon: Video, color: 'hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10' },
    { name: 'Facebook', url: config.facebookUrl, icon: Facebook, color: 'hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10' },
    { name: 'Instagram', url: config.instagramUrl, icon: Instagram, color: 'hover:text-fuchsia-400 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10' },
    { name: 'X', url: config.twitterUrl, icon: Twitter, color: 'hover:text-slate-200 hover:border-slate-500/50 hover:bg-slate-800' },
  ].filter(link => Boolean(link.url && link.url !== '#'));

  return (
    <footer id="main-footer" className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 text-xs sm:text-sm relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Barra de Navegación al final de la web with tactile bordered buttons */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono block">
                Barra de Navegación
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Acceso directo a las secciones del portafolio
              </span>
            </div>
          </div>

          <nav id="bottom-navigation-bar" aria-label="Navegación inferior" className="flex flex-wrap items-center justify-center gap-2">
            {footerNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-900 shadow-2xs transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer flex items-center gap-1.5"
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Code className="w-4 h-4" />
              </div>
              <span>{config.name}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-md">
              Desarrollador Web especializado en HTML5 semántico, CSS3 adaptable a móviles y laptops, y JavaScript interactivo de alto rendimiento.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                id="footer-whatsapp-badge"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/60 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold shadow-2xs transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {config.whatsappNumber}</span>
              </a>
            </div>

            {/* Social icons row */}
            {socialLinks.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block font-medium">Sígueme en redes:</span>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => {
                    const IconComp = social.icon;
                    return (
                      <a
                        key={social.name}
                        id={`footer-social-${social.name.toLowerCase()}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Perfil de ${social.name}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs text-slate-700 dark:text-slate-300 transition-all active:scale-95 shadow-2xs ${social.color}`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              <span>Navegación</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-emerald-500/50 hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 shadow-2xs transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer group"
                  >
                    <span>{link.label}</span>
                    <span className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 text-xs transition-colors">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              <span>Legal</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="btn-footer-privacy"
                  onClick={onOpenPrivacy}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-emerald-500/50 hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 shadow-2xs transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none text-left cursor-pointer group"
                >
                  <span>Políticas de Privacidad</span>
                  <span className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 text-xs transition-colors">📄</span>
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 text-xs font-medium shadow-2xs transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
