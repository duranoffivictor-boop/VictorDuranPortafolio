import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Video, 
  ExternalLink, 
  Share2, 
  Sparkles,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import { SiteConfig } from '../types';

interface SocialSectionProps {
  config: SiteConfig;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ config }) => {
  const socialNetworks = [
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@victorduran.dev',
      description: 'Videos cortos, tutoriales de HTML/CSS/JS, tips de código y trucos de maquetación rápida.',
      badge: 'Videos & Tips',
      url: config.tiktokUrl || 'https://tiktok.com/@victorduran.dev',
      icon: Video,
      color: 'from-pink-500/20 via-rose-500/10 to-cyan-500/10',
      borderHover: 'hover:border-pink-500/60',
      iconColor: 'text-pink-400',
      btnBg: 'bg-pink-500 hover:bg-pink-600',
      textColor: 'text-pink-400'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'Víctor Durán Web',
      description: 'Artículos, casos de éxito de proyectos web, asesorías digitales y novedades para negocios.',
      badge: 'Comunidad & Negocios',
      url: config.facebookUrl || 'https://facebook.com/victorduran.dev',
      icon: Facebook,
      color: 'from-blue-600/20 via-blue-500/10 to-indigo-500/10',
      borderHover: 'hover:border-blue-500/60',
      iconColor: 'text-blue-400',
      btnBg: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-400'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@victorduran.dev',
      description: 'Diseño UI/UX, carruseles educativos, detrás de escena de desarrollo y muestras de interfaces.',
      badge: 'UI/UX & Lifestyle',
      url: config.instagramUrl || 'https://instagram.com/victorduran.dev',
      icon: Instagram,
      color: 'from-purple-600/20 via-pink-500/10 to-amber-500/10',
      borderHover: 'hover:border-purple-500/60',
      iconColor: 'text-fuchsia-400',
      btnBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500',
      textColor: 'text-fuchsia-400'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      handle: '@victorduran',
      description: 'Hilos sobre desarrollo frontend, recursos web gratuitos, rendimiento y tendencias tech.',
      badge: 'Noticias & Hilos',
      url: config.twitterUrl || 'https://x.com/victorduran',
      icon: Twitter,
      color: 'from-slate-700/30 via-slate-800/20 to-slate-900/30',
      borderHover: 'hover:border-slate-400/60',
      iconColor: 'text-slate-200',
      btnBg: 'bg-slate-800 hover:bg-slate-700 border border-slate-700',
      textColor: 'text-slate-300'
    }
  ];

  return (
    <section id="redes-sociales" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-900 overflow-hidden transition-colors duration-200">
      {/* Glow ambient background elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-emerald-800 dark:text-emerald-400 shadow-xs">
            <Share2 className="w-3.5 h-3.5" />
            <span>Presencia Digital & Comunidad</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Conéctate Conmigo en Redes Sociales
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Sígueme en mis canales oficiales para ver contenido práctico sobre desarrollo web, proyectos en vivo, consejos de programación y tips de optimización.
          </p>
        </div>

        {/* Social Grid (TikTok, Facebook, Instagram, X/Twitter) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialNetworks.map((net) => {
            const IconComponent = net.icon;

            return (
              <div
                key={net.id}
                id={`social-card-${net.id}`}
                className={`group relative bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 ${net.borderHover} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Background soft gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${net.color} opacity-20 dark:opacity-30 group-hover:opacity-50 dark:group-hover:opacity-60 rounded-2xl transition-opacity pointer-events-none`} />

                <div className="relative space-y-4">
                  {/* Top Header inside Card */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center ${net.iconColor} shadow-inner group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {net.badge}
                    </span>
                  </div>

                  {/* Title & Handle */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                      <span>{net.name}</span>
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {net.handle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[3rem]">
                    {net.description}
                  </p>
                </div>

                {/* Card CTA Action Button */}
                <div className="relative pt-6 mt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <a
                    id={`btn-social-link-${net.id}`}
                    href={net.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white ${net.btnBg} transition-all duration-100 ease-out active:scale-95 shadow-md group/btn`}
                  >
                    <span>Visitar {net.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Contact Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-950/50 dark:via-slate-900 dark:to-teal-950/50 border border-emerald-300 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mx-auto sm:mx-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">¿Prefieres atención inmediata?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Escríbeme por WhatsApp al <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{config.whatsappNumber}</strong> y cotiza tu sitio web en minutos.
              </p>
            </div>
          </div>

          <a
            id="social-section-whatsapp-btn"
            href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(config.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Chatear por WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
