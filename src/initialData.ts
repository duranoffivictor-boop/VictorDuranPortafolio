import { PortfolioData, SiteConfig, SkillItem, Project, Review, Inquiry, PrivacyPolicy } from './types';

export const INITIAL_CONFIG: SiteConfig = {
  name: "Víctor Durán",
  title: "Desarrollador Web Frontend | HTML • CSS • JavaScript",
  headline: "Desarrollo Web Moderno, Rápido y Optimizado para el Éxito de tu Negocio",
  subheadline: "Especialista en desarrollo web con HTML5 semántico, CSS3 responsive y JavaScript moderno. Construyo sitios web atractivos, de alto rendimiento y optimizados para SEO que convierten visitantes en clientes.",
  whatsappNumber: "+50585929205",
  whatsappMessage: "Hola Víctor, me gustaría cotizar un proyecto de desarrollo web contigo.",
  email: "victorduran.dev@gmail.com",
  location: "Nicaragua • Disponible para proyectos locales y remotos a nivel global",
  aboutBio: "Soy Víctor Durán, programador web apasionado por la creación de soluciones digitales limpias, rápidas y efectivas. Domino los fundamentos esenciales de la web: HTML5 para una estructura semántica impecable y excelente SEO, CSS3 para interfaces visualmente impactantes y 100% responsivas en cualquier pantalla (móviles, tablets y laptops), y JavaScript puro para dotar a cada proyecto de interactividad fluida y dinamismo sin sobrecargas innecesarias. Me enfoco en estándares internacionales de calidad, accesibilidad y tiempos de carga récord.",
  avatarUrl: "https://share.google/3Ldgsy3TPkFaTW6eh",
  yearsOfExperience: "4+",
  completedProjects: "35+",
  satisfiedClients: "100%",
  availableForFreelance: true,
  githubUrl: "https://github.com/duranoffivictor-boop",
  linkedinUrl: "https://linkedin.com",
  cvUrl: "#",
  tiktokUrl: "https://tiktok.com/@victorduran.dev",
  facebookUrl: "https://facebook.com/victorduran.dev",
  instagramUrl: "https://instagram.com/victorduran.dev",
  twitterUrl: "https://x.com/victorduran"
};

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: "html5",
    name: "HTML5 Semántico & SEO",
    category: "html",
    proficiency: 98,
    description: "Estructuración limpia con etiquetas semánticas para maximizar la indexación en motores de búsqueda (SEO On-Page) y accesibilidad universal (WCAG).",
    highlights: [
      "Etiquetado semántico (header, main, nav, article, section)",
      "Meta etiquetas OpenGraph y Twitter Cards para redes sociales",
      "Microdatos Schema.org (JSON-LD) para snippets enriquecidos",
      "Formularios optimizados con validación nativa"
    ],
    icon: "Code2"
  },
  {
    id: "css3",
    name: "CSS3 & Diseño Responsive",
    category: "css",
    proficiency: 95,
    description: "Maquetación moderna adaptativa para móviles, tablets y laptops mediante CSS Grid, Flexbox, animaciones sutiles y estilos ultrarrápidos.",
    highlights: [
      "Mobile-First Design (adaptación perfecta a cualquier resolución)",
      "CSS Grid y Flexbox avanzado para layouts complejos",
      "Animaciones y transiciones optimizadas por GPU",
      "Variables CSS y frameworks utilitarios como Tailwind CSS"
    ],
    icon: "Layout"
  },
  {
    id: "javascript",
    name: "JavaScript Moderno (ES6+)",
    category: "javascript",
    proficiency: 92,
    description: "Lógica de negocio en el cliente, manipulación reactiva del DOM, consumo de APIs REST mediante Fetch/Async-Await e interactividad premium.",
    highlights: [
      "Manipulación dinámica del DOM sin lag",
      "Peticiones asíncronas con Fetch API y promesas",
      "Almacenamiento local (LocalStorage, SessionStorage)",
      "Interactividad, validaciones en tiempo real y componentes modulares"
    ],
    icon: "Cpu"
  },
  {
    id: "performance",
    name: "Optimización & Rendimiento Web",
    category: "tools",
    proficiency: 94,
    description: "Auditoría Lighthouse con puntajes superiores a 95 en rendimiento, accesibilidad, buenas prácticas y SEO.",
    highlights: [
      "Compresión de assets e imágenes en formatos modernos (WebP)",
      "Optimización de Core Web Vitals (LCP, FID, CLS)",
      "Minificación y carga diferida (Lazy loading)",
      "Control de versiones con Git & GitHub"
    ],
    icon: "Zap"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Plataforma E-Commerce NovaStyle",
    description: "Tienda en línea completa desarrollada con HTML5 semántico, CSS Grid y JavaScript moderno. Incluye carrito interactivo, cálculo de impuestos, filtros dinámicos y pasarela de pedidos vía WhatsApp.",
    category: "javascript",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: [
      "HTML5",
      "CSS3",
      "JavaScript ES6+",
      "Carrito Dinámico",
      "WhatsApp API"
    ],
    demoUrl: "https://ejemplo.com/novastyle",
    githubUrl: "https://github.com/victorduran/novastyle",
    featured: true,
    features: [
      "Filtros de productos por precio y categoría en tiempo real",
      "Persistencia de carrito en LocalStorage",
      "Generador de orden automático directo al WhatsApp del vendedor",
      "Puntaje Lighthouse 99/100 en versión móvil"
    ]
  },
  {
    id: "proj-2",
    title: "Landing Page Inmobiliaria Prime",
    description: "Página de aterrizaje de alta conversión para bienes raíces de lujo. Diseñada con enfoque Mobile-First, animaciones CSS fluidas, calculadora de cuotas hipotecarias en JavaScript y botón flotante de WhatsApp.",
    category: "landing-page",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    tags: [
      "HTML5 Semántico",
      "CSS3 Animations",
      "Calculadora JS",
      "Mobile First",
      "SEO 100%"
    ],
    demoUrl: "https://ejemplo.com/prime-inmo",
    githubUrl: "https://github.com/victorduran/prime-landing",
    featured: true,
    features: [
      "Estructura 100% semántica para posicionamiento en Google",
      "Calculadora interactiva de pagos mensuales en JavaScript",
      "Formulario de contacto con validación instantánea",
      "Adaptación fluida a pantallas de teléfonos y computadoras portátiles"
    ]
  },
  {
    id: "proj-3",
    title: "Panel de Métricas & Dashboard Financiero",
    description: "Aplicación web interactiva construida en JavaScript puro y CSS moderno. Presenta visualizaciones interactivas de datos, conversor de divisas en tiempo real y modo oscuro integrado.",
    category: "javascript",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: [
      "JavaScript Puro",
      "CSS Grid",
      "Dark Mode",
      "API REST",
      "Responsive"
    ],
    demoUrl: "https://ejemplo.com/dashboard",
    githubUrl: "https://github.com/victorduran/dashboard-js",
    featured: true,
    features: [
      "Consumo asíncrono de tipos de cambio de divisas",
      "Tablas dinámicas ordenables y filtrables sin recargar la página",
      "Soporte para tema claro y tema oscuro con almacenamiento de preferencia",
      "Diseño modular y reutilizable"
    ]
  },
  {
    id: "proj-4",
    title: "Portal Corporativo Legal & Consultoría",
    description: "Sitio web corporativo optimizado para firmas profesionales. Código HTML5 ultraliviano, tipografía contrastada, tiempos de carga inferiores a 0.8s y botón de WhatsApp de asesoría inmediata.",
    category: "html-css",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: [
      "HTML5",
      "CSS Moderno",
      "SEO On-Page",
      "Carga Rápida",
      "Accesibilidad"
    ],
    demoUrl: "https://ejemplo.com/consultoria",
    githubUrl: "https://github.com/victorduran/corporate-web",
    featured: false,
    features: [
      "Metadatos OpenGraph y Schema.org para abogados y consultores",
      "Menú de navegación accesible en teclado y dispositivos táctiles",
      "Puntuación perfecta de accesibilidad WCAG 2.1 AA",
      "Contacto directo por WhatsApp y correo electrónico"
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    authorName: "Lic. Sofía Morales",
    authorRole: "Directora Ejecutiva",
    authorCompany: "Novatech Solutions",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Víctor renovó por completo nuestra landing page corporativa. Su conocimiento en HTML semántico y CSS responsivo hizo que nuestra web cargue en menos de un segundo tanto en laptops como en celulares. Nuestras solicitudes por WhatsApp se duplicaron el primer mes. Un profesional con altísimos estándares.",
    date: "2026-02-18",
    verified: true,
    status: "approved"
  },
  {
    id: "rev-2",
    authorName: "Ing. Carlos Mendoza",
    authorRole: "Head of Marketing",
    authorCompany: "Growth Digital Latam",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "El dominio que tiene Víctor de JavaScript puro y CSS Grid es impresionante. Desarrolló una calculadora interactiva de precios para nuestra plataforma sin depender de librerías pesadas. El código quedó limpio, ordenado y 100% optimizado para SEO.",
    date: "2026-02-05",
    verified: true,
    status: "approved"
  },
  {
    id: "rev-3",
    authorName: "Dra. Elena Rostrán",
    authorRole: "Fundadora",
    authorCompany: "Inmobiliaria Bosques de San Juan",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Excelente comunicación y entrega puntual. Supo plasmar la elegancia de nuestro catálogo de propiedades inmobiliarias. El botón directo a WhatsApp con mensaje predeterminado ha facilitado enormemente la atención rápida a clientes interesados.",
    date: "2026-01-22",
    verified: true,
    status: "approved"
  },
  {
    id: "rev-4",
    authorName: "Javier Alvarado",
    authorRole: "Gerente General",
    authorCompany: "Alvarado & Co. Distribuidora",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Tenía dudas sobre cómo mostrar nuestro catálogo digital, pero Víctor diseñó una landing page intuitiva, adaptable y moderna. La facilidad con la que un cliente desde su celular puede ver los productos y escribirnos directo a WhatsApp es fantástica.",
    date: "2026-01-10",
    verified: true,
    status: "approved"
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    name: "Mariana Rivas",
    email: "mariana.rivas@empresa.com",
    phone: "+50588889999",
    message: "Hola Víctor, necesitamos desarrollar una landing page para el lanzamiento de un nuevo servicio de consultoría. ¿Podemos agendar una llamada?",
    date: "2026-03-01",
    read: true
  }
];

export const INITIAL_POLICY: PrivacyPolicy = {
  lastUpdated: "7 de marzo de 2026",
  title: "Políticas de Privacidad y Tratamiento de Datos",
  introduction: "En el portafolio y sitio web profesional de Víctor Durán (victorduran.dev), la privacidad y protección de los datos de nuestros visitantes y clientes es de máxima prioridad. Este documento detalla cómo se gestiona la información recopilada a través del sitio.",
  sections: [
    {
      title: "1. Información que recopilamos",
      content: "Recopilamos únicamente los datos que nos proporcionas de forma voluntaria a través de nuestro formulario de contacto o al dejar una reseña (como tu nombre, correo electrónico, número de teléfono y comentarios). No almacenamos información bancaria ni contraseñas de visitantes."
    },
    {
      title: "2. Uso de la Información",
      content: "La información recolectada se utiliza exclusivamente para: responder a tus consultas sobre presupuestos o proyectos de desarrollo web, publicar testimonios o reseñas que autorices en el portafolio, y coordinar comunicaciones directas mediante WhatsApp o correo electrónico."
    },
    {
      title: "3. Comunicación vía WhatsApp",
      content: "Al hacer clic en el botón de WhatsApp (+50585929205), serás redirigido a la aplicación oficial de WhatsApp de Meta Platforms, Inc. Las conversaciones mantenidas están protegidas por el cifrado de extremo a extremo propio de dicha plataforma."
    },
    {
      title: "4. Almacenamiento Seguro y Confidencialidad",
      content: "Todos los datos de reseñas y mensajes se almacenan de forma segura. No vendemos, alquilamos ni compartimos tus datos de contacto con terceros ni agencias de publicidad bajo ninguna circunstancia."
    },
    {
      title: "5. Derechos del Usuario (ARCO)",
      content: "Tienes derecho a solicitar en cualquier momento el acceso, rectificación o eliminación de tus datos o reseñas publicadas en este sitio. Para ejercer este derecho, puedes escribirnos directamente a victorduran.dev@gmail.com o vía WhatsApp al +50585929205."
    }
  ]
};

export const INITIAL_ADMIN_CREDENTIALS = {
  username: "admin2526",
  password: "adminduran2526"
};
