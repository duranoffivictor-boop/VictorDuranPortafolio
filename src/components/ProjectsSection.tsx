import React, { useState } from 'react';
import { Project } from '../types';
import { MessageCircle, CheckCircle } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
  whatsappNumber: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, whatsappNumber }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const categories = [
    { id: 'all', label: 'Todos los Proyectos' },
    { id: 'landing-page', label: 'Landing Pages' },
    { id: 'javascript', label: 'JavaScript Apps' },
    { id: 'html-css', label: 'HTML & CSS Puro' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="proyectos" className="py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full">
            Portafolio & Trabajos Destacados
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Proyectos Web Reales Desarrollados a Medida
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Ejemplos de páginas web, tiendas y aplicaciones diseñadas con HTML5 semántico, CSS3 adaptable y JavaScript dinámico.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid with Desktop 3-Column Adaptation */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {filteredProjects.map((project) => {
            const projectWaText = encodeURIComponent(`Hola Víctor, estuve viendo tu proyecto "${project.title}" y me gustaría cotizar una web similar para mi negocio.`);
            const projectWaUrl = `https://wa.me/${cleanPhone}?text=${projectWaText}`;

            return (
              <article
                key={project.id}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-emerald-950/40 shadow-sm transition-all flex flex-col justify-between group"
              >
                {/* Project Image Container */}
                <div className="relative h-52 sm:h-56 lg:h-52 xl:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={(project.image && project.image.trim()) ? project.image.trim() : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 dark:from-slate-950 dark:via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/90 dark:bg-slate-900/90 text-emerald-800 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xs">
                    {project.category.toUpperCase()}
                  </span>

                  {project.featured && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-md">
                      Destacado
                    </span>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-5 sm:p-6 lg:p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Features list */}
                    {project.features && project.features.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-900">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Características clave:
                        </p>
                        <ul className="space-y-1.5">
                          {project.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action: WhatsApp Cotizar */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
                    <a
                      href={projectWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Cotizar Proyecto Similar</span>
                    </a>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
