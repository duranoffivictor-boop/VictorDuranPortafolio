import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PrivacyModal } from './components/PrivacyModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { PortfolioData, SiteConfig, Project, Review, PrivacyPolicy, SkillItem } from './types';
import { Loader2 } from 'lucide-react';

const FALLBACK_CONFIG: SiteConfig = {
  name: "Víctor Durán",
  title: "Desarrollador Web Frontend | HTML • CSS • JavaScript",
  headline: "Desarrollo Web Moderno, Rápido y Optimizado para el Éxito de tu Negocio",
  subheadline: "Especialista en desarrollo web con HTML5 semántico, CSS3 responsive y JavaScript moderno. Construyo sitios web atractivos, de alto rendimiento y optimizados para SEO que convierten visitantes en clientes.",
  whatsappNumber: "+50585929205",
  whatsappMessage: "Hola Víctor, me gustaría cotizar un proyecto de desarrollo web contigo.",
  email: "victorduran.dev@gmail.com",
  location: "Nicaragua • Proyectos locales e internacionales",
  aboutBio: "Soy Víctor Durán, desarrollador web enfocado en la construcción de interfaces rápidas, responsivas y optimizadas para posicionamiento en buscadores (SEO).",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  yearsOfExperience: "4+",
  completedProjects: "35+",
  satisfiedClients: "100%",
  availableForFreelance: true,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  cvUrl: "#"
};

const FALLBACK_POLICY: PrivacyPolicy = {
  lastUpdated: "7 de marzo de 2026",
  title: "Políticas de Privacidad y Tratamiento de Datos",
  introduction: "En este sitio web profesional la privacidad es fundamental.",
  sections: [
    {
      title: "1. Información que recopilamos",
      content: "Recopilamos únicamente datos facilitados voluntariamente por formularios de contacto o reseñas públicas."
    }
  ]
};

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(FALLBACK_CONFIG);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy>(FALLBACK_POLICY);
  
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Ensure no old token persists in localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('vd_admin_token');
      sessionStorage.removeItem('vd_admin_token');
    } catch (_) {}
  }, []);

  const handleSetAuthToken = (token: string | null) => {
    setAuthToken(token);
    try {
      if (!token) {
        localStorage.removeItem('vd_admin_token');
        sessionStorage.removeItem('vd_admin_token');
      }
    } catch (_) {}
  };

  // Fetch all live data from server
  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const [contentRes, projectsRes, reviewsRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/projects'),
        fetch('/api/reviews', {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
        })
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        if (contentData.config) setConfig(contentData.config);
        if (contentData.skills) setSkills(contentData.skills);
        if (contentData.privacyPolicy) setPrivacyPolicy(contentData.privacyPolicy);
      }

      if (projectsRes.ok) {
        const projData = await projectsRes.json();
        setProjects(projData);
      }

      if (reviewsRes.ok) {
        const revData = await reviewsRes.json();
        setReviews(revData);
      }
    } catch (err) {
      console.error("Error loading portfolio data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, [authToken]);

  // Synchronize dynamic document title and meta tags when config changes
  useEffect(() => {
    if (config.name) {
      document.title = `${config.name} | ${config.title ? config.title.split('|')[0].trim() : 'Desarrollador Web Frontend'}`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && config.subheadline) {
        metaDesc.setAttribute('content', config.subheadline);
      }
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${config.name} | Desarrollador Web Frontend`);
      }

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${config.name} | Desarrollador Web Frontend`);
      }
    }
  }, [config.name, config.title, config.subheadline]);

  if (loading && !config.name) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Cargando portafolio de Víctor Durán...</p>
      </div>
    );
  }

  const portfolioData: PortfolioData = {
    config,
    skills,
    projects,
    reviews,
    privacyPolicy
  };

  return (
    <div id="portfolio-app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        name={config.name}
        whatsappNumber={config.whatsappNumber}
        whatsappMessage={config.whatsappMessage}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={Boolean(authToken)}
      />

      {/* Main Content Sections with Semantic Layout */}
      <main className="flex-1">
        {/* Hero Section with H1, WhatsApp Button & Profile Details */}
        <Hero config={config} />

        {/* Technical Skills: HTML5, CSS3, JavaScript, Web Optimization */}
        <SkillsSection skills={skills} aboutBio={config.aboutBio} />

        {/* Filterable Projects Portfolio */}
        <ProjectsSection projects={projects} whatsappNumber={config.whatsappNumber} />

        {/* High Standards Reviews & Interactive Rating Submission Form */}
        <ReviewsSection 
          reviews={reviews} 
          onReviewSubmitted={loadPortfolioData} 
        />

        {/* Contact Section with WhatsApp Direct and Inquiry Form */}
        <ContactSection config={config} />
      </main>

      {/* Footer with Legal Links */}
      <Footer
        config={config}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Always Visible Floating WhatsApp Button with Pulse effect */}
      <FloatingWhatsApp
        phoneNumber={config.whatsappNumber}
        defaultMessage={config.whatsappMessage}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        policy={privacyPolicy}
      />

      {/* Admin Panel Modal with Login and Server Sync */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          handleSetAuthToken(null);
        }}
        data={portfolioData}
        onDataUpdated={loadPortfolioData}
        authToken={authToken}
        setAuthToken={handleSetAuthToken}
      />

    </div>
  );
}
