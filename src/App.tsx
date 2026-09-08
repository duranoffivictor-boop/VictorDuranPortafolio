import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { SocialSection } from './components/SocialSection';
import { ContactSection } from './components/ContactSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PrivacyModal } from './components/PrivacyModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { PortfolioService } from './services/portfolioService';
import { INITIAL_CONFIG, INITIAL_POLICY, INITIAL_SKILLS, INITIAL_PROJECTS, INITIAL_REVIEWS } from './initialData';
import { PortfolioData, SiteConfig, Project, Review, PrivacyPolicy, SkillItem } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy>(INITIAL_POLICY);
  
  const [loading, setLoading] = useState(false);
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

  // Fetch all live data (Hybrid: Server API with Local Storage fallback)
  const loadPortfolioData = async () => {
    try {
      const data = await PortfolioService.getFullPortfolio(authToken);
      if (data.config) setConfig(data.config);
      if (data.skills) setSkills(data.skills);
      if (data.projects) setProjects(data.projects);
      if (data.reviews) setReviews(data.reviews);
      if (data.privacyPolicy) setPrivacyPolicy(data.privacyPolicy);
    } catch (err) {
      console.warn("Portfolio data loaded from local cache:", err);
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

        {/* Social Media Networks (TikTok, Facebook, Instagram, X/Twitter, GitHub, LinkedIn) */}
        <SocialSection config={config} />

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
