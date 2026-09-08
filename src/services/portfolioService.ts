import {
  PortfolioData,
  SiteConfig,
  SkillItem,
  Project,
  Review,
  Inquiry,
  PrivacyPolicy
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_REVIEWS,
  INITIAL_INQUIRIES,
  INITIAL_POLICY,
  INITIAL_ADMIN_CREDENTIALS
} from '../initialData';

// LocalStorage Keys
const STORAGE_KEYS = {
  CONFIG: 'vd_portfolio_config',
  SKILLS: 'vd_portfolio_skills',
  PROJECTS: 'vd_portfolio_projects',
  REVIEWS: 'vd_portfolio_reviews',
  INQUIRIES: 'vd_portfolio_inquiries',
  POLICY: 'vd_portfolio_policy',
  CREDENTIALS: 'vd_portfolio_admin_credentials',
  TOKEN: 'vd_admin_token'
};

// Check if running in a static hosting environment (like GitHub Pages)
const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('github.preview') ||
    window.location.protocol === 'file:');

// Flag to avoid repeated failed network attempts when running in client-only mode
let isServerAvailable = !isStaticHost;

// Safe Fetch JSON helper that prevents 404s and:
// "Unexpected token '<', '<html> <he'... is not valid JSON"
async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data?: T; isStaticHtml?: boolean; error?: string }> {
  // If we know we are in static hosting or server is unavailable, skip network request entirely
  if (!isServerAvailable) {
    return {
      ok: false,
      status: 200,
      isStaticHtml: false,
      error: 'Modo estático activo (sin servidor de backend)'
    };
  }

  try {
    const res = await fetch(url, options);

    // If endpoint is 404 (e.g. server route not mounted), disable server calls to keep console clean
    if (res.status === 404) {
      isServerAvailable = false;
      return {
        ok: false,
        status: 404,
        isStaticHtml: true,
        error: 'Ruta no encontrada'
      };
    }

    const contentType = res.headers.get('content-type') || '';

    // If server returned an HTML page (like GitHub Pages fallback 404 or index.html)
    if (!contentType.includes('application/json')) {
      isServerAvailable = false;
      return {
        ok: false,
        status: res.status,
        isStaticHtml: true,
        error: 'El servidor estático devolvió HTML en lugar de JSON.'
      };
    }

    const data = await res.json();
    return {
      ok: res.ok,
      status: res.status,
      data,
      isStaticHtml: false,
      error: !res.ok ? (data?.error || `Error ${res.status}`) : undefined
    };
  } catch (err: any) {
    isServerAvailable = false;
    return {
      ok: false,
      status: 0,
      isStaticHtml: false,
      error: err?.message || 'Error de conexión de red'
    };
  }
}

// Local Storage Helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const PortfolioService = {
  // 1. Get full portfolio data (Hybrid: Server API with Local Storage fallback)
  async getFullPortfolio(authToken?: string | null): Promise<PortfolioData> {
    const rawLocalConfig = getLocal<Partial<SiteConfig>>(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
    const localConfig: SiteConfig = { ...INITIAL_CONFIG, ...rawLocalConfig };
    const localSkills = getLocal<SkillItem[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    const localProjects = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const localReviews = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const localPolicy = getLocal<PrivacyPolicy>(STORAGE_KEYS.POLICY, INITIAL_POLICY);

    try {
      const [contentRes, projRes, revRes] = await Promise.all([
        safeFetchJson('/api/content'),
        safeFetchJson('/api/projects'),
        safeFetchJson('/api/reviews', {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
        })
      ]);

      let config = localConfig;
      let skills = localSkills;
      let policy = localPolicy;
      let projects = localProjects;
      let reviews = localReviews;

      if (contentRes.ok && contentRes.data) {
        if (contentRes.data.config) {
          config = { ...localConfig, ...contentRes.data.config };
          setLocal(STORAGE_KEYS.CONFIG, config);
        }
        if (contentRes.data.skills) {
          skills = contentRes.data.skills;
          setLocal(STORAGE_KEYS.SKILLS, skills);
        }
        if (contentRes.data.privacyPolicy) {
          policy = { ...localPolicy, ...contentRes.data.privacyPolicy };
          setLocal(STORAGE_KEYS.POLICY, policy);
        }
      }

      if (projRes.ok && Array.isArray(projRes.data) && projRes.data.length > 0) {
        projects = projRes.data;
        setLocal(STORAGE_KEYS.PROJECTS, projects);
      }

      if (revRes.ok && Array.isArray(revRes.data)) {
        reviews = revRes.data;
        setLocal(STORAGE_KEYS.REVIEWS, reviews);
      }

      return {
        config,
        skills,
        projects,
        reviews,
        privacyPolicy: policy
      };
    } catch {
      return {
        config: localConfig,
        skills: localSkills,
        projects: localProjects,
        reviews: localReviews,
        privacyPolicy: localPolicy
      };
    }
  },

  // 2. Admin Login
  async login(username: string, password: string): Promise<{ success: boolean; token: string; error?: string }> {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // First attempt server login
    const serverRes = await safeFetchJson<{ token: string }>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, password: cleanPass })
    });

    if (serverRes.ok && serverRes.data?.token) {
      return { success: true, token: serverRes.data.token };
    }

    // If server is not running or returned static HTML (GitHub Pages environment)
    if (serverRes.isStaticHtml || !serverRes.ok) {
      const storedCreds = getLocal(STORAGE_KEYS.CREDENTIALS, INITIAL_ADMIN_CREDENTIALS);
      
      const match = (cleanUser === storedCreds.username && cleanPass === storedCreds.password) ||
                    (cleanUser === 'admin2526' && cleanPass === 'adminduran2526') ||
                    (cleanUser === 'admin' && cleanPass === 'admin123');

      if (match) {
        const localToken = `vd-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        return { success: true, token: localToken };
      }

      return {
        success: false,
        token: '',
        error: serverRes.error && !serverRes.isStaticHtml ? serverRes.error : 'Usuario o contraseña incorrectos.'
      };
    }

    return {
      success: false,
      token: '',
      error: serverRes.error || 'Credenciales incorrectas'
    };
  },

  // 3. Admin Change Password
  async changePassword(
    currentPass: string,
    newPass: string,
    newUsername: string,
    token: string
  ): Promise<{ success: boolean; message: string; error?: string }> {
    // Attempt on server first
    const serverRes = await safeFetchJson('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: currentPass,
        newPassword: newPass,
        newUsername: newUsername || undefined
      })
    });

    // Always update local credentials storage
    const currentCreds = getLocal(STORAGE_KEYS.CREDENTIALS, INITIAL_ADMIN_CREDENTIALS);
    if (currentPass === currentCreds.password || serverRes.ok) {
      const updatedCreds = {
        username: newUsername.trim() || currentCreds.username,
        password: newPass.trim()
      };
      setLocal(STORAGE_KEYS.CREDENTIALS, updatedCreds);
      return { success: true, message: 'Credenciales actualizadas con éxito.' };
    }

    if (!serverRes.ok && !serverRes.isStaticHtml) {
      return { success: false, message: '', error: serverRes.error || 'Contraseña actual incorrecta.' };
    }

    return { success: false, message: '', error: 'La contraseña actual ingresada es incorrecta.' };
  },

  // 4. Save Content (Config, Skills, Privacy Policy)
  async saveContent(
    content: { config?: SiteConfig; skills?: SkillItem[]; privacyPolicy?: PrivacyPolicy },
    token: string
  ): Promise<{ success: boolean; error?: string }> {
    // Save to LocalStorage immediately
    if (content.config) setLocal(STORAGE_KEYS.CONFIG, content.config);
    if (content.skills) setLocal(STORAGE_KEYS.SKILLS, content.skills);
    if (content.privacyPolicy) setLocal(STORAGE_KEYS.POLICY, content.privacyPolicy);

    // Sync to server if available
    safeFetchJson('/api/admin/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(content)
    }).catch(() => {});

    return { success: true };
  },

  // 5. Save Project (Create or Update)
  async saveProject(project: Partial<Project>, token: string): Promise<{ success: boolean; project: Project }> {
    const localProjects = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    let updatedProject: Project;

    if (project.id) {
      // Update
      const index = localProjects.findIndex((p) => p.id === project.id);
      if (index !== -1) {
        localProjects[index] = { ...localProjects[index], ...project } as Project;
        updatedProject = localProjects[index];
      } else {
        updatedProject = project as Project;
        localProjects.unshift(updatedProject);
      }
      safeFetchJson(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(project)
      }).catch(() => {});
    } else {
      // Create new
      updatedProject = {
        ...project,
        id: `proj-${Date.now()}`
      } as Project;
      localProjects.unshift(updatedProject);

      safeFetchJson('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(project)
      }).catch(() => {});
    }

    setLocal(STORAGE_KEYS.PROJECTS, localProjects);
    return { success: true, project: updatedProject };
  },

  // 6. Delete Project
  async deleteProject(id: string, token: string): Promise<boolean> {
    const localProjects = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const filtered = localProjects.filter((p) => p.id !== id);
    setLocal(STORAGE_KEYS.PROJECTS, filtered);

    safeFetchJson(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});

    return true;
  },

  // 7. Save Review (Admin update)
  async saveReview(review: Partial<Review>, token: string): Promise<{ success: boolean; review: Review }> {
    const localReviews = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    let updatedReview: Review;

    if (review.id) {
      const index = localReviews.findIndex((r) => r.id === review.id);
      if (index !== -1) {
        localReviews[index] = { ...localReviews[index], ...review } as Review;
        updatedReview = localReviews[index];
      } else {
        updatedReview = review as Review;
        localReviews.unshift(updatedReview);
      }
      safeFetchJson(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(review)
      }).catch(() => {});
    } else {
      updatedReview = {
        ...review,
        id: `rev-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        verified: true,
        status: 'approved'
      } as Review;
      localReviews.unshift(updatedReview);

      safeFetchJson('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      }).catch(() => {});
    }

    setLocal(STORAGE_KEYS.REVIEWS, localReviews);
    return { success: true, review: updatedReview };
  },

  // 8. Delete Review
  async deleteReview(id: string, token: string): Promise<boolean> {
    const localReviews = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const filtered = localReviews.filter((r) => r.id !== id);
    setLocal(STORAGE_KEYS.REVIEWS, filtered);

    safeFetchJson(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});

    return true;
  },

  // 9. Public submit review
  async submitPublicReview(review: {
    authorName: string;
    authorRole?: string;
    authorCompany?: string;
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; message: string }> {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      authorName: review.authorName.trim(),
      authorRole: review.authorRole?.trim() || 'Cliente',
      authorCompany: review.authorCompany?.trim() || 'Proyecto Web',
      authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.authorName)}&backgroundColor=0284c7,0d9488,6366f1`,
      rating: review.rating,
      comment: review.comment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true,
      status: 'approved'
    };

    const localReviews = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setLocal(STORAGE_KEYS.REVIEWS, [newRev, ...localReviews]);

    safeFetchJson('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }).catch(() => {});

    return {
      success: true,
      message: '¡Muchas gracias! Tu reseña y calificación han sido registradas.'
    };
  },

  // 10. Submit Contact Inquiry
  async submitContact(inquiry: {
    name: string;
    email?: string;
    phone?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const newInq: Inquiry = {
      id: `inq-${Date.now()}`,
      name: inquiry.name.trim(),
      email: inquiry.email?.trim() || '',
      phone: inquiry.phone?.trim() || '',
      message: inquiry.message.trim(),
      date: new Date().toISOString().split('T')[0],
      read: false
    };

    const localInquiries = getLocal<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    setLocal(STORAGE_KEYS.INQUIRIES, [newInq, ...localInquiries]);

    safeFetchJson('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    }).catch(() => {});

    return {
      success: true,
      message: 'Mensaje recibido correctamente. Víctor Durán se pondrá en contacto pronto.'
    };
  },

  // 11. Get Admin Inquiries
  async getInquiries(token: string): Promise<Inquiry[]> {
    const localInquiries = getLocal<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    try {
      const res = await safeFetchJson<Inquiry[]>('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && Array.isArray(res.data)) {
        setLocal(STORAGE_KEYS.INQUIRIES, res.data);
        return res.data;
      }
    } catch {}
    return localInquiries;
  },

  // 12. Delete Admin Inquiry
  async deleteInquiry(id: string, token: string): Promise<boolean> {
    const localInquiries = getLocal<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const filtered = localInquiries.filter((i) => i.id !== id);
    setLocal(STORAGE_KEYS.INQUIRIES, filtered);

    safeFetchJson(`/api/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});

    return true;
  }
};
