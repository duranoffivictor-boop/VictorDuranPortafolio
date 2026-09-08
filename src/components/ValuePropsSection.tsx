import React from 'react';
import { 
  Zap, 
  Smartphone, 
  Search, 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp,
  Award
} from 'lucide-react';

interface ValuePropsSectionProps {
  whatsappNumber: string;
}

export const ValuePropsSection: React.FC<ValuePropsSectionProps> = ({ whatsappNumber }) => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const quoteWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hola Víctor, vi tu metodología y garantías de trabajo en tu sitio web. Me gustaría solicitar un diagnóstico y presupuesto para mi proyecto web.'
  )}`;

  const advantages = [
    {
      icon: Zap,
      title: 'Velocidad de Carga Extrema',
      subtitle: '95+ en Google Lighthouse',
      description: 'El 53% de los usuarios abandonan sitios que tardan más de 3 segundos en cargar. Programo sin librerías pesadas innecesarias para asegurar una carga casi instantánea que Google premia en sus resultados.',
      badge: 'Core Web Vitals',
      color: 'amber'
    },
    {
      icon: Smartphone,
      title: '100% Adaptable a Móviles (Mobile First)',
      subtitle: 'Diseño Responsive Impecable',
      description: 'Más del 70% de tus clientes navegarán desde un smartphone. Cada layout, menú y botón se adapta fluidamente a teléfonos, tablets y computadoras de escritorio.',
      badge: 'Multi-pantalla',
      color: 'emerald'
    },
    {
      icon: Search,
      title: 'Optimización SEO On-Page desde el Día 1',
      subtitle: 'Visibilidad en Google y Motores',
      description: 'Estructuración semántica HTML5, metadatos enriquecidos, etiquetas OpenGraph y Schema.org JSON-LD para que tu empresa sea indexada con prioridad y destaque con estrellas en los resultados de búsqueda.',
      badge: 'Posicionamiento Orgánico',
      color: 'indigo'
    },
    {
      icon: ShieldCheck,
      title: 'Garantía de Satisfacción Total',
      subtitle: 'Ajustes Hasta Tu Aprobación',
      description: 'Trabajamos con hitos claros y revisiones continuas. No damos por terminado el proyecto hasta que el diseño y la funcionalidad cumplan al 100% tus expectativas y requerimientos.',
      badge: 'Tranquilidad Total',
      color: 'teal'
    },
    {
      icon: Clock,
      title: 'Entregas Puntuales y Sin Retrasos',
      subtitle: 'Fechas de Entrega Claras',
      description: 'Compromiso riguroso con los plazos acordados. Desde landing pages en 3 a 5 días hasta sitios corporativos completos entregados a tiempo para tu lanzamiento.',
      badge: 'Puntualidad 100%',
      color: 'rose'
    },
    {
      icon: MessageCircle,
      title: 'Comunicación Directa por WhatsApp',
      subtitle: 'Sin Intermediarios ni Burocracia',
      description: 'Trato directo desarrollador-cliente. Te respondo con agilidad, comparto avances en tiempo real y resuelvo dudas sin tecnicismos complicados.',
      badge: 'Atención Ágil',
      color: 'emerald'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Diagnóstico & Presupuesto Gratuito',
      desc: 'Analizamos tus objetivos, tu público objetivo y las funciones necesarias para enviarte una cotización transparente sin compromisos.'
    },
    {
      step: '02',
      title: 'Estructura & Arquitectura Web',
      desc: 'Definimos la jerarquía visual, los textos persuasivos y la disposición de elementos enfocados en convertir visitantes en ventas.'
    },
    {
      step: '03',
      title: 'Programación & Optimización SEO',
      desc: 'Escribimos código limpio en HTML5, CSS3 y JavaScript moderno con pruebas exhaustivas en móviles y auditoría de velocidad.'
    },
    {
      step: '04',
      title: 'Lanzamiento & Soporte Continuo',
      desc: 'Publicamos tu sitio web, configuramos el dominio y te entrego soporte técnico y garantía para asegurar un éxito sostenido.'
    }
  ];

  return (
    <section id="ventajas" className="py-20 bg-slate-50 dark:bg-slate-900/70 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1 rounded-full">
            Ventajas Competitivas & Metodología
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ¿Por Qué Elegir a Víctor Durán Para Tu Sitio Web?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            No solo creo páginas web bonitas: construyo herramientas digitales rápidas, adaptables y optimizadas para posicionar en Google y generar clientes potenciales de forma constante.
          </p>
        </div>

        {/* 6 Core Value Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <article
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {adv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {adv.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      {adv.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {adv.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Estándar de calidad verificado</span>
                </div>
              </article>
            );
          })}
        </div>

        {/* 4-Step Process Section */}
        <div className="mt-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Proceso Transparente
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ¿Cómo Trabajamos Juntos? (Paso a Paso)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Un flujo de trabajo claro y sin sorpresas desde el primer mensaje hasta la publicación de tu web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => (
              <div 
                key={i} 
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3"
              >
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                  {st.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick CTA inside value banner */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Diagnóstico Web y Presupuesto en Menos de 2 Horas
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Respuesta inmediata con estimación clara de costo y tiempos de entrega.
                </span>
              </div>
            </div>

            <a
              href={quoteWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Cotización sin Compromiso</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
