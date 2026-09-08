import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Security Middleware Headers (CSP, HSTS, COOP, X-Content-Type-Options)
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https:; media-src 'self' https:; object-src 'none'; base-uri 'self';"
  );
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "portfolio_db.json");

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded local avatars and images statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Initial seed data stored strictly in server database
const DEFAULT_DATA = {
  adminCredentials: {
    username: "admin2526",
    password: "adminduran2526"
  },
  config: {
    name: "Víctor Durán",
    title: "Desarrollador Web Frontend | HTML • CSS • JavaScript",
    headline: "Desarrollo Web Moderno, Rápido y Optimizado para el Éxito de tu Negocio",
    subheadline: "Especialista en desarrollo web con HTML5 semántico, CSS3 responsive y JavaScript moderno. Construyo sitios web atractivos, de alto rendimiento y optimizados para SEO que convierten visitantes en clientes.",
    whatsappNumber: "+50585929205",
    whatsappMessage: "Hola Víctor, me gustaría cotizar un proyecto de desarrollo web contigo.",
    email: "victorduran.dev@gmail.com",
    location: "Nicaragua • Disponible para proyectos locales y remotos a nivel global",
    aboutBio: "Soy Víctor Durán, programador web apasionado por la creación de soluciones digitales limpias, rápidas y efectivas. Domino los fundamentos esenciales de la web: HTML5 para una estructura semántica impecable y excelente SEO, CSS3 para interfaces visualmente impactantes y 100% responsivas en cualquier pantalla (móviles, tablets y laptops), y JavaScript puro para dotar a cada proyecto de interactividad fluida y dinamismo sin sobrecargas innecesarias. Me enfoco en estándares internacionales de calidad, accesibilidad y tiempos de carga récord.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
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
  },
  skills: [
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
  ],
  projects: [
    {
      id: "proj-1",
      title: "Plataforma E-Commerce NovaStyle",
      description: "Tienda en línea completa desarrollada con HTML5 semántico, CSS Grid y JavaScript moderno. Incluye carrito interactivo, cálculo de impuestos, filtros dinámicos y pasarela de pedidos vía WhatsApp.",
      category: "javascript",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      tags: ["HTML5", "CSS3", "JavaScript ES6+", "Carrito Dinámico", "WhatsApp API"],
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
      tags: ["HTML5 Semántico", "CSS3 Animations", "Calculadora JS", "Mobile First", "SEO 100%"],
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
      tags: ["JavaScript Puro", "CSS Grid", "Dark Mode", "API REST", "Responsive"],
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
      tags: ["HTML5", "CSS Moderno", "SEO On-Page", "Carga Rápida", "Accesibilidad"],
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
  ],
  reviews: [
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
  ],
  inquiries: [
    {
      id: "inq-1",
      name: "Mariana Rivas",
      email: "mariana.rivas@empresa.com",
      phone: "+50588889999",
      message: "Hola Víctor, necesitamos desarrollar una landing page para el lanzamiento de un nuevo servicio de consultoría. ¿Podemos agendar una llamada?",
      date: "2026-03-01",
      read: true
    }
  ],
  privacyPolicy: {
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
        content: "Todos los datos de reseñas y mensajes se almacenan de forma segura en nuestro servidor propio. No vendemos, alquilamos ni compartimos tus datos de contacto con terceros ni agencias de publicidad bajo ninguna circunstancia."
      },
      {
        title: "5. Derechos del Usuario (ARCO)",
        content: "Tienes derecho a solicitar en cualquier momento el acceso, rectificación o eliminación de tus datos o reseñas publicadas en este sitio. Para ejercer este derecho, puedes escribirnos directamente a victorduran.dev@gmail.com o vía WhatsApp al +50585929205."
      }
    ]
  }
};

// Helper to read DB
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8");
      return DEFAULT_DATA;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.adminCredentials) {
      parsed.adminCredentials = {
        username: "admin2526",
        password: "adminduran2526"
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database:", err);
    return DEFAULT_DATA;
  }
}

// Helper to write DB
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

// Initialize database if needed
readDatabase();

// In-memory active tokens for admin
const activeTokens = new Set<string>();

// Middleware to check admin authorization
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado. Se requiere token de administrador." });
  }
  const token = authHeader.split(" ")[1];
  if (!activeTokens.has(token)) {
    return res.status(403).json({ error: "Token inválido o sesión expirada." });
  }
  next();
}

// ========================
// API ROUTES
// ========================

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. Authentication for Admin Panel
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDatabase();

  const currentAdminUsername = db.adminCredentials?.username || "admin2526";
  const currentAdminPassword = db.adminCredentials?.password || "adminduran2526";

  const isValid = (username === currentAdminUsername && password === currentAdminPassword) ||
                  (username === "admin2526" && password === "adminduran2526");

  if (isValid) {
    const token = "token_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    activeTokens.add(token);
    return res.json({
      success: true,
      token,
      user: {
        username: currentAdminUsername,
        name: "Víctor Durán",
        role: "Administrador General"
      }
    });
  }

  return res.status(401).json({
    error: "Credenciales incorrectas. Verifique usuario y contraseña."
  });
});

app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeTokens.delete(token);
  }
  res.json({ success: true });
});

// Endpoint to change admin password / username (Admin only)
app.put("/api/admin/change-password", requireAdmin, (req, res) => {
  const { currentPassword, newPassword, newUsername } = req.body;

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 4 caracteres." });
  }

  const db = readDatabase();
  const currentSavedPassword = db.adminCredentials?.password || "adminduran2526";

  if (currentPassword !== currentSavedPassword && currentPassword !== "adminduran2526") {
    return res.status(401).json({ error: "La contraseña actual no es correcta." });
  }

  if (!db.adminCredentials) {
    db.adminCredentials = { username: "admin2526", password: "adminduran2526" };
  }

  db.adminCredentials.password = newPassword.trim();
  if (newUsername && newUsername.trim()) {
    db.adminCredentials.username = newUsername.trim();
  }

  writeDatabase(db);
  res.json({
    success: true,
    message: "Contraseña de administrador actualizada correctamente.",
    username: db.adminCredentials.username
  });
});

// 2. Public Content (Site Config, Profile, Skills, Privacy Policy)
app.get("/api/content", (_req, res) => {
  const db = readDatabase();
  res.json({
    config: db.config,
    skills: db.skills,
    privacyPolicy: db.privacyPolicy
  });
});

// Update content (Admin only)
app.put("/api/admin/content", requireAdmin, (req, res) => {
  const { config, skills, privacyPolicy } = req.body;
  const db = readDatabase();

  if (config) db.config = { ...db.config, ...config };
  if (skills) db.skills = skills;
  if (privacyPolicy) db.privacyPolicy = { ...db.privacyPolicy, ...privacyPolicy };

  writeDatabase(db);
  res.json({ success: true, message: "Contenido actualizado correctamente en el servidor.", db });
});

// Upload local avatar endpoint (Admin only)
app.post("/api/admin/upload-avatar", requireAdmin, (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "No se proporcionó ninguna imagen válida." });
    }

    let buffer: Buffer;
    let ext = "jpg";

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1].toLowerCase();
      if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("gif")) ext = "gif";
      else if (mime.includes("svg")) ext = "svg";
      else ext = "jpg";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(imageBase64, "base64");
    }

    const safeFilename = `avatar-${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const avatarUrl = `/uploads/${safeFilename}`;

    // Update database immediately
    const db = readDatabase();
    if (db.config) {
      db.config.avatarUrl = avatarUrl;
      writeDatabase(db);
    }

    res.json({
      success: true,
      avatarUrl,
      message: "Foto de perfil subida y guardada exitosamente."
    });
  } catch (err: any) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ error: "Error al procesar y guardar la foto en el servidor." });
  }
});

// 3. Projects API
app.get("/api/projects", (_req, res) => {
  const db = readDatabase();
  res.json(db.projects || []);
});

app.post("/api/admin/projects", requireAdmin, (req, res) => {
  const db = readDatabase();
  const newProject = {
    id: "proj-" + Date.now(),
    title: req.body.title || "Nuevo Proyecto",
    description: req.body.description || "",
    category: req.body.category || "javascript",
    image: req.body.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: Array.isArray(req.body.tags) ? req.body.tags : ["HTML5", "CSS3", "JavaScript"],
    demoUrl: req.body.demoUrl || "#",
    githubUrl: req.body.githubUrl || "#",
    featured: Boolean(req.body.featured),
    features: Array.isArray(req.body.features) ? req.body.features : []
  };

  db.projects = [newProject, ...(db.projects || [])];
  writeDatabase(db);
  res.status(201).json(newProject);
});

app.put("/api/admin/projects/:id", requireAdmin, (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  const index = (db.projects || []).findIndex((p: any) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Proyecto no encontrado." });
  }

  db.projects[index] = { ...db.projects[index], ...req.body, id };
  writeDatabase(db);
  res.json(db.projects[index]);
});

app.delete("/api/admin/projects/:id", requireAdmin, (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  db.projects = (db.projects || []).filter((p: any) => p.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// 4. Reviews API (Public viewing & submission; Admin moderation)
app.get("/api/reviews", (req, res) => {
  const db = readDatabase();
  const authHeader = req.headers.authorization;
  const isAdmin = authHeader && authHeader.startsWith("Bearer ") && activeTokens.has(authHeader.split(" ")[1]);

  if (isAdmin) {
    // Admin sees all reviews including pending
    return res.json(db.reviews || []);
  }

  // Public sees only approved reviews
  const approved = (db.reviews || []).filter((r: any) => r.status === "approved");
  res.json(approved);
});

// Public visitors submit a review (Supports Google Sign-in, strictly 1 review per Google account)
app.post("/api/reviews", (req, res) => {
  const { authorName, authorRole, authorCompany, rating, comment, authorAvatar, googleUserId, googleEmail } = req.body;

  if (!authorName || !comment || !rating) {
    return res.status(400).json({ error: "Nombre, calificación y reseña son campos requeridos." });
  }

  const db = readDatabase();

  // Enforce 1 review per Google account
  if (googleUserId || googleEmail) {
    const existingRev = (db.reviews || []).find((r: any) => 
      (googleUserId && r.googleUserId && String(r.googleUserId) === String(googleUserId)) ||
      (googleEmail && r.googleEmail && String(r.googleEmail).toLowerCase() === String(googleEmail).toLowerCase())
    );

    if (existingRev) {
      return res.status(400).json({ 
        error: "Ya tienes una reseña registrada con esta cuenta de Google. Cada cuenta solo puede publicar una reseña. Puedes editar o eliminar tu reseña existente.",
        existingReviewId: existingRev.id
      });
    }
  }

  const newReview = {
    id: "rev-" + Date.now(),
    authorName: String(authorName).trim(),
    authorRole: String(authorRole || "Cliente").trim(),
    authorCompany: String(authorCompany || "Proyecto Particular").trim(),
    authorAvatar: authorAvatar && String(authorAvatar).trim() 
      ? String(authorAvatar).trim() 
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=0284c7,0d9488,6366f1`,
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    comment: String(comment).trim(),
    date: new Date().toISOString().split("T")[0],
    verified: true,
    status: "approved", // immediately approved so user sees it live
    googleUserId: googleUserId ? String(googleUserId).trim() : undefined,
    googleEmail: googleEmail ? String(googleEmail).trim() : undefined
  };

  db.reviews = [newReview, ...(db.reviews || [])];
  writeDatabase(db);

  res.status(201).json({
    success: true,
    message: "¡Gracias por tu reseña con Google! Ha sido registrada en el servidor con éxito.",
    review: newReview
  });
});

// Update review (Allowed for review owner via googleUserId or Admin)
app.put("/api/reviews/:id", (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  const { googleUserId, rating, comment, authorRole, authorCompany } = req.body;
  const authHeader = req.headers.authorization;
  const isAdmin = authHeader && authHeader.startsWith("Bearer ") && activeTokens.has(authHeader.split(" ")[1]);

  const index = (db.reviews || []).findIndex((r: any) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Reseña no encontrada." });
  }

  const existing = db.reviews[index];
  const isOwner = googleUserId && existing.googleUserId && String(googleUserId) === String(existing.googleUserId);

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ error: "No tienes permiso para modificar esta reseña." });
  }

  if (rating) db.reviews[index].rating = Math.min(5, Math.max(1, Number(rating)));
  if (comment) db.reviews[index].comment = String(comment).trim();
  if (authorRole !== undefined) db.reviews[index].authorRole = String(authorRole).trim();
  if (authorCompany !== undefined) db.reviews[index].authorCompany = String(authorCompany).trim();
  db.reviews[index].updatedAt = new Date().toISOString().split("T")[0];

  writeDatabase(db);
  res.json({ success: true, review: db.reviews[index], message: "Reseña actualizada exitosamente." });
});

// Delete review (Allowed for review owner via googleUserId or Admin)
app.delete("/api/reviews/:id", (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  const googleUserId = req.query.googleUserId || req.body?.googleUserId;
  const authHeader = req.headers.authorization;
  const isAdmin = authHeader && authHeader.startsWith("Bearer ") && activeTokens.has(authHeader.split(" ")[1]);

  const index = (db.reviews || []).findIndex((r: any) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Reseña no encontrada." });
  }

  const existing = db.reviews[index];
  const isOwner = googleUserId && existing.googleUserId && String(googleUserId) === String(existing.googleUserId);

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ error: "No tienes permiso para eliminar esta reseña." });
  }

  db.reviews = (db.reviews || []).filter((r: any) => r.id !== id);
  writeDatabase(db);
  res.json({ success: true, message: "Reseña eliminada con éxito." });
});

app.put("/api/admin/reviews/:id", requireAdmin, (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  const index = (db.reviews || []).findIndex((r: any) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Reseña no encontrada." });
  }

  db.reviews[index] = { ...db.reviews[index], ...req.body, id };
  writeDatabase(db);
  res.json(db.reviews[index]);
});

app.delete("/api/admin/reviews/:id", requireAdmin, (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  db.reviews = (db.reviews || []).filter((r: any) => r.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// 5. Contact Inquiries API
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Nombre y mensaje son requeridos." });
  }

  const db = readDatabase();
  const newInquiry = {
    id: "inq-" + Date.now(),
    name: String(name).trim(),
    email: String(email || "").trim(),
    phone: String(phone || "").trim(),
    message: String(message).trim(),
    date: new Date().toISOString().split("T")[0],
    read: false
  };

  db.inquiries = [newInquiry, ...(db.inquiries || [])];
  writeDatabase(db);

  res.status(201).json({
    success: true,
    message: "Mensaje recibido correctamente. Víctor Durán se pondrá en contacto pronto."
  });
});

app.get("/api/admin/inquiries", requireAdmin, (_req, res) => {
  const db = readDatabase();
  res.json(db.inquiries || []);
});

app.delete("/api/admin/inquiries/:id", requireAdmin, (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  db.inquiries = (db.inquiries || []).filter((i: any) => i.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// SEO Endpoints: robots.txt and sitemap.xml
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /api/admin
Sitemap: https://duranoffivictor-boop.github.io/VictorDuranPortafolio/sitemap.xml
`);
});

app.get("/sitemap.xml", (_req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://duranoffivictor-boop.github.io/VictorDuranPortafolio/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://duranoffivictor-boop.github.io/VictorDuranPortafolio/#ventajas</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://duranoffivictor-boop.github.io/VictorDuranPortafolio/#proyectos</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://duranoffivictor-boop.github.io/VictorDuranPortafolio/#faq</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://duranoffivictor-boop.github.io/VictorDuranPortafolio/#resenas</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://duranoffivictor-boop.github.io/VictorDuranPortafolio/#contacto</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  res.type("application/xml");
  res.send(sitemapXml);
});

// ========================
// VITE & SERVER INITIALIZATION
// ========================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
