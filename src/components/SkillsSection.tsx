import React, { useState } from 'react';
import { SkillItem } from '../types';
import { Code2, Layout, Cpu, Zap, Check, Copy, Laptop, Smartphone, Search } from 'lucide-react';

interface SkillsSectionProps {
  skills: SkillItem[];
  aboutBio: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, aboutBio }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    html: `<!-- HTML5 Semántico & SEO por Víctor Durán -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Landing Page de Alta Conversión | Negocio</title>
  <meta name="description" content="Sitio web optimizado con carga en menos de 1 segundo." />
  <!-- OpenGraph y Schema.org estructurado -->
</head>
<body>
  <header class="site-header">
    <nav aria-label="Menú principal">...</nav>
  </header>
  <main>
    <article class="featured-service">
      <h1>Estructura pensada para posicionar en Google</h1>
    </article>
  </main>
</body>
</html>`,
    css: `/* CSS3 Moderno, Responsive & Optimizado */
:root {
  --primary-color: #10b981;
  --text-dark: #0f172a;
}

/* Layout con CSS Grid adaptativo */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Mobile-First y animación fluida */
@media (max-width: 768px) {
  .hero-container {
    padding: 1rem;
    flex-direction: column;
  }
}`,
    js: `// JavaScript ES6+ Limpio y Asíncrono
const contactForm = document.querySelector("#contact-form");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  
  // Procesamiento rápido y validación en tiempo real
  const payload = Object.fromEntries(formData.entries());
  
  // Redirección directa y segura a WhatsApp
  const phone = "50585929205";
  const text = encodeURIComponent(\`Hola Víctor, mi nombre es \${payload.name}: \${payload.message}\`);
  window.open(\`https://wa.me/\${phone}?text=\${text}\`, "_blank");
});`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-6 h-6 text-orange-400" />;
      case 'Layout': return <Layout className="w-6 h-6 text-sky-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-yellow-400" />;
      default: return <Zap className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="habilidades" className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full">
            Especialización Técnica
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Desarrollo Web Frontend Moderno y Eficiente
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            {aboutBio || 'Construyo sitios web limpios, rápidos y accesibles dominando las tecnologías fundamentales de la web moderna: HTML5, CSS3 y JavaScript.'}
          </p>
        </div>

        {/* Feature Highlights: Adaptable & Optimized */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Diseño Adaptado a Computadoras</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Estructura expansiva de alta resolución con grillas avanzadas, márgenes equilibrados y navegación de escritorio fluida.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Mobile-First 100% Responsivo</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Diseñado y probado en teléfonos celulares y tablets para asegurar una experiencia táctil intuitiva y botones ergonómicos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">SEO On-Page & Alta Velocidad</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Estructura semántica, metadatos enriquecidos y código ligero sin plugins innecesarios para máxima velocidad en Google.
            </p>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-xs group-hover:scale-105 transition-transform">
                    {getIcon(skill.icon)}
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {skill.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {skill.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  {skill.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Static Progress bar */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Dominio Técnico</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Code Preview Window */}
        <div className="mt-16 bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-slate-400 ml-2">ejemplo-codigo-limpio.dev</span>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveCodeTab('html')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeCodeTab === 'html'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                index.html
              </button>
              <button
                onClick={() => setActiveCodeTab('css')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeCodeTab === 'css'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                estilos.css
              </button>
              <button
                onClick={() => setActiveCodeTab('js')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeCodeTab === 'js'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                app.js
              </button>
            </div>

            {/* Copy code button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copiar código"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-sm text-slate-300 bg-slate-950/70 leading-relaxed">
            <pre>
              <code>{codeSnippets[activeCodeTab]}</code>
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
};
