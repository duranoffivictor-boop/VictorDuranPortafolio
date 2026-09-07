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
    <section id="habilidades" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            Especialidades & Habilidades Técnicas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dominio en <span className="text-emerald-400">HTML5</span>, <span className="text-sky-400">CSS3</span> y <span className="text-yellow-400">JavaScript</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Sin rodeos ni frameworks innecesariamente pesados. Construyo soluciones enfocadas en lo que realmente importa para tu negocio: velocidad de carga, diseño atractivo y facilidad de uso.
          </p>
        </div>

        {/* Bio summary banner */}
        <div className="mt-10 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>¿Por qué elegir mi trabajo de desarrollo?</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {aboutBio}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <strong className="block text-white">100% Mobile & Laptop</strong>
                  <span className="text-slate-400">Diseñado para cualquier pantalla</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <Search className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="text-xs">
                  <strong className="block text-white">SEO Optimizado</strong>
                  <span className="text-slate-400">Estructura semántica para Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 group-hover:scale-105 transition-transform">
                    {getIcon(skill.icon)}
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/50">
                    {skill.proficiency}%
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {skill.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                  {skill.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress bar */}
              <div className="mt-6 pt-4 border-t border-slate-800/60">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Code Preview Window */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
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
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  activeCodeTab === 'html'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                index.html
              </button>
              <button
                onClick={() => setActiveCodeTab('css')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  activeCodeTab === 'css'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                estilos.css
              </button>
              <button
                onClick={() => setActiveCodeTab('js')}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
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
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
