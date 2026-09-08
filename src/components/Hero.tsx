import React from 'react';
import { MessageCircle, ExternalLink, Sparkles, CheckCircle2, ArrowDown, Terminal, Shield, Award } from 'lucide-react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(config.whatsappMessage)}`;

  return (
    <section id="inicio" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-b-0 transition-colors duration-200">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status availability badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-emerald-400/40 dark:border-emerald-500/30 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Disponible para nuevos proyectos de desarrollo web</span>
            </div>

            {/* MANDATORY H1 for SEO and User Requirement */}
            <h1 
              id="main-title-h1"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
            >
              Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">{config.name}</span>.
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 dark:text-slate-200">
                Desarrollador Web Frontend en HTML, CSS y JavaScript
              </span>
            </h1>

            {/* Subheadline description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {config.subheadline}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* WhatsApp direct contact button with specified number */}
              <a
                id="hero-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all group"
              >
                <MessageCircle className="w-5 h-5 fill-white/20 group-hover:scale-110 transition-transform" />
                <span>Contactar por WhatsApp</span>
                <span className="text-xs bg-emerald-700/60 px-2 py-0.5 rounded font-mono">
                  {config.whatsappNumber}
                </span>
              </a>

              {/* View Projects Anchor */}
              <a
                id="hero-projects-btn"
                href="#proyectos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-medium text-base shadow-xs transition-all"
              >
                <span>Ver Portafolio de Proyectos</span>
                <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </a>
            </div>

            {/* Key Quality Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                100% Adaptable a Celulares y Laptops
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Optimización SEO On-Page
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Código Limpio y Semántico
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {config.yearsOfExperience}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Años de Experiencia</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-300 font-mono">
                  {config.completedProjects}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Proyectos Terminados</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                  {config.satisfiedClients}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Clientes Satisfechos</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Profile Card & Code Window */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              
              {/* Decorative Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 dark:opacity-30 blur-lg" />
              
              {/* Card Container */}
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl space-y-5">
                
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={(config.avatarUrl && config.avatarUrl.trim()) ? config.avatarUrl.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={`Foto de perfil de ${config.name || 'Víctor Durán'} Desarrollador Web`}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md bg-slate-100 dark:bg-slate-800"
                      loading="eager"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.includes('unsplash.com')) {
                          target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                        }
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white">
                      ✓
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {config.name}
                      <Award className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </h2>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                      {config.title ? config.title.split('|')[0].trim() : 'Especialista en Frontend'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {config.location}
                    </p>
                  </div>
                </div>

                {/* Core Stack Badges */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    &lt;HTML5 /&gt;
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    #CSS3
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20">
                    JavaScript(ES6+)
                  </span>
                </div>

                {/* Code Terminal Mockup */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      victor-duran.js
                    </span>
                    <span className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </span>
                  </div>
                  <div className="space-y-1 leading-relaxed text-slate-400">
                    <p><span className="text-purple-400">const</span> <span className="text-emerald-300">developer</span> = &#123;</p>
                    <p className="pl-4">name: <span className="text-amber-300">"{config.name}"</span>,</p>
                    <p className="pl-4">stack: [<span className="text-teal-300">"HTML5"</span>, <span className="text-teal-300">"CSS3"</span>, <span className="text-teal-300">"JavaScript"</span>],</p>
                    <p className="pl-4">seoOptimized: <span className="text-emerald-400">true</span>,</p>
                    <p className="pl-4">responsive: <span className="text-emerald-400">true</span>,</p>
                    <p className="pl-4">directWhatsApp: <span className="text-amber-300">"{config.whatsappNumber}"</span></p>
                    <p>&#125;;</p>
                  </div>
                </div>

                {/* Direct quote */}
                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  "Desarrollo código limpio, estructurado y sin dependencias pesadas innecesarias. Cada sitio web que creo está pensado para vender y posicionar."
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
