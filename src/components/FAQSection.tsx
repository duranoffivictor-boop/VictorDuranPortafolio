import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'precio' | 'tiempos' | 'seo' | 'soporte' | 'general';
}

interface FAQSectionProps {
  whatsappNumber: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'precio',
    question: '¿Cuánto cuesta desarrollar una página web o landing page profesional?',
    answer: 'El costo varía según la complejidad y objetivos del proyecto. Una Landing Page enfocada en ventas suele partir desde tarifas muy accesibles para emprendedores y negocios locales, mientras que sitios corporativos con múltiples secciones o catálogos interactivos tienen presupuestos personalizados. Envíame un mensaje por WhatsApp y en menos de 2 horas te entrego un presupuesto transparente y sin compromiso.'
  },
  {
    id: 'faq-2',
    category: 'tiempos',
    question: '¿En cuánto tiempo estará terminado y publicado mi sitio web?',
    answer: 'Una Landing Page de alta conversión típicamente se entrega en un plazo de 3 a 5 días hábiles. Sitios web empresariales o portafolios más amplios toman entre 7 y 14 días laborables. Establecemos una fecha de entrega fija en el acuerdo para que puedas planificar tus lanzamientos con total tranquilidad.'
  },
  {
    id: 'faq-3',
    category: 'seo',
    question: '¿Mi página web aparecerá en los primeros lugares de Google?',
    answer: '¡Sí! Todos los proyectos que desarrollo se construyen con arquitectura SEO On-Page estricta: código semántico HTML5, metaetiquetas OpenGraph, datos estructurados Schema.org (JSON-LD), tiempos de carga de menos de 1 segundo (Core Web Vitals) y sitemap indexable. Esto le da a tu sitio la base técnica indispensable que Google exige para posicionar frente a tus competidores.'
  },
  {
    id: 'faq-4',
    category: 'general',
    question: '¿El sitio web se adaptará correctamente a teléfonos celulares y tablets?',
    answer: 'Totalmente. Aplico metodología Mobile-First. Más del 75% del tráfico proviene de dispositivos móviles, por lo que cada botón, imagen, texto y formulario se prueba y optimiza para que la navegación en iPhone, Android, tablets y laptops sea fluida, cómoda y visualmente atractiva.'
  },
  {
    id: 'faq-5',
    category: 'general',
    question: '¿Qué información o materiales necesito tener listos para comenzar?',
    answer: 'Para comenzar solo necesitas: una idea clara de los servicios o productos que ofreces, tu logo (si ya cuentas con uno), los datos de contacto que deseas publicar (WhatsApp, correo, redes) y los textos o fotos que quieras incluir. Si aún no tienes textos o imágenes redactados, no te preocupes: te asesoro para redactar contenido vendedor y seleccionar fotografías profesionales de alta calidad.'
  },
  {
    id: 'faq-6',
    category: 'soporte',
    question: '¿Cómo se realizan los pagos y qué garantías tengo sobre el trabajo?',
    answer: 'El esquema estándar de trabajo es 50% de anticipo para dar inicio al proyecto y el 50% restante una vez que revises la web en el servidor de pruebas y estés 100% satisfecho con el resultado final. Además, cuentas con garantía de ajustes gratuitos durante los primeros días tras la entrega para asegurar que todo funcione a la perfección.'
  },
  {
    id: 'faq-7',
    category: 'soporte',
    question: '¿Ofreces servicio de mantenimiento, actualizaciones y soporte técnico?',
    answer: 'Sí. Tras el lanzamiento no te dejo solo: ofrezco planes flexibles de mantenimiento web preventivo, cambios de contenido, monitoreo de seguridad y soporte técnico directo por WhatsApp para que tu sitio web se mantenga siempre activo, rápido y actualizado.'
  }
];

export const FAQSection: React.FC<FAQSectionProps> = ({ whatsappNumber }) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true, // Keep the first FAQ open by default for immediate preview
    'faq-3': true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const customQuestionWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hola Víctor, tengo una pregunta sobre el desarrollo de páginas web que no encontré en las preguntas frecuentes. ¿Podrías asesorarme?'
  )}`;

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-900 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1 rounded-full">
            Respuestas Claras & Transparentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Preguntas Frecuentes de Clientes
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Resolvemos tus dudas sobre precios, plazos de entrega, posicionamiento en Google, adaptación a celulares y proceso de trabajo.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-10 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en preguntas frecuentes (ej. precio, google, celular, pagos, tiempo)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              { id: 'all', label: 'Todas las Preguntas' },
              { id: 'precio', label: 'Precios & Cotización' },
              { id: 'tiempos', label: 'Tiempos de Entrega' },
              { id: 'seo', label: 'SEO & Google' },
              { id: 'soporte', label: 'Pagos & Garantía' },
              { id: 'general', label: 'Diseño & Celulares' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-8 space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No encontramos preguntas que coincidan con tu búsqueda.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Escríbeme directamente por WhatsApp y te responderé de inmediato.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = Boolean(openItems[faq.id]);
              return (
                <article
                  key={faq.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'border-emerald-400/70 dark:border-emerald-500/50 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    id={`btn-faq-${faq.id}`}
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 bg-transparent hover:bg-slate-50/80 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800/80 transition-colors"
                  >
                    <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen 
                        ? 'bg-emerald-500 text-white rotate-180' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div 
                      id={`content-faq-${faq.id}`}
                      className="px-5 sm:px-6 pb-6 pt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/90 bg-white dark:bg-slate-900 animate-in fade-in duration-150"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* WhatsApp Custom Question Box */}
        <div className="mt-12 bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-300 dark:border-emerald-800/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                ¿Tienes alguna otra duda o consulta específica?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Platícame sobre tu negocio y te daré asesoría gratuita personalizada por WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={customQuestionWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 transition-all cursor-pointer shrink-0"
          >
            <span>Preguntar por WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
