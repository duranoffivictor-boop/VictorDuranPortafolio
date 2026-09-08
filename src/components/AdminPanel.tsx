import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Lock, ShieldCheck, Save, Trash2, Plus, Edit2, CheckCircle2, Check,
  MessageCircle, Star, Inbox, FileText, Image as ImageIcon, Phone, User, AlertCircle,
  KeyRound, RefreshCw, Eye, EyeOff, UploadCloud, Upload, Link as LinkIcon, Camera, Loader2, FolderOpen
} from 'lucide-react';
import { PortfolioData, Project, Review, Inquiry, SiteConfig } from '../types';
import { PortfolioService } from '../services/portfolioService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onDataUpdated: () => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  data,
  onDataUpdated,
  authToken,
  setAuthToken
}) => {
  // Tabs: 'content' | 'projects' | 'reviews' | 'inquiries' | 'security' | 'privacy'
  const [activeTab, setActiveTab] = useState<'content' | 'projects' | 'reviews' | 'inquiries' | 'security' | 'privacy'>('content');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Security / Password change state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUsername: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  // Content editing state (SiteConfig)
  const [configForm, setConfigForm] = useState<SiteConfig>(data.config);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'url'>('upload');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFileName, setAvatarFileName] = useState('');
  const [avatarFileError, setAvatarFileError] = useState('');
  const [dragOverAvatar, setDragOverAvatar] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Inquiries list for admin
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Project editing state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'javascript',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
    features: ['Diseño responsive', 'Carga rápida', 'Código limpio']
  });

  // Review editing state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState<Partial<Review>>({
    authorName: '',
    authorRole: 'Director de Operaciones',
    authorCompany: 'Empresa Líder',
    rating: 5,
    comment: '',
    verified: true,
    status: 'approved'
  });

  // Status feedback toast
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Keep config form in sync when data updates
  useEffect(() => {
    if (data.config) {
      setConfigForm(data.config);
    }
  }, [data.config]);

  // Load inquiries when authenticated
  useEffect(() => {
    if (authToken && isOpen) {
      fetchInquiries();
    }
  }, [authToken, isOpen]);

  const showToast = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleAvatarFileSelected = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarFileError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setAvatarFileError('La imagen seleccionada supera los 20 MB. Selecciona una más ligera.');
      return;
    }

    setAvatarFileError('');
    setUploadingAvatar(true);
    setAvatarFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        if (!base64Data) {
          setUploadingAvatar(false);
          setAvatarFileError('No se pudo procesar la imagen seleccionada.');
          return;
        }

        // Upload to server if token available
        if (authToken) {
          try {
            const res = await fetch('/api/admin/upload-avatar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },
              body: JSON.stringify({
                imageBase64: base64Data,
                filename: file.name
              })
            });

            if (res.headers.get('content-type')?.includes('application/json')) {
              const json = await res.json();
              if (res.ok && json.avatarUrl) {
                setConfigForm((prev) => ({ ...prev, avatarUrl: json.avatarUrl }));
                showToast('¡Foto de perfil actualizada y guardada con éxito!');
                onDataUpdated();
                setUploadingAvatar(false);
                return;
              }
            }
          } catch (uploadErr) {
            console.warn('Fallback a almacenamiento Base64:', uploadErr);
          }
        }

        // Fallback: update state directly with base64 DataURL
        setConfigForm((prev) => ({ ...prev, avatarUrl: base64Data }));
        showToast('Foto cargada. Recuerda hacer clic en "Guardar Todos los Cambios".');
        setUploadingAvatar(false);
      };

      reader.onerror = () => {
        setAvatarFileError('Error al leer el archivo en tu dispositivo.');
        setUploadingAvatar(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setAvatarFileError(err?.message || 'Error al procesar la foto.');
      setUploadingAvatar(false);
    }
  };

  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverAvatar(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAvatarFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleResetAvatar = () => {
    setConfigForm((prev) => ({
      ...prev,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }));
    setAvatarFileName('');
    setAvatarFileError('');
    showToast('Foto restaurada al valor predeterminado.');
  };

  const fetchInquiries = async () => {
    if (!authToken) return;
    setLoadingInquiries(true);
    try {
      const list = await PortfolioService.getInquiries(authToken);
      setInquiries(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const result = await PortfolioService.login(loginUsername, loginPassword);
      if (!result.success || !result.token) {
        throw new Error(result.error || 'Credenciales incorrectas');
      }

      setAuthToken(result.token);
      setLoginPassword('');
      setLoginError('');
      showToast('¡Sesión iniciada correctamente como Administrador!');
    } catch (err: any) {
      setLoginError(err.message || 'Error de autenticación');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setLoginPassword('');
    showToast('Has cerrado sesión de administrador');
  };

  const handleClose = () => {
    handleLogout();
    setLoginPassword('');
    setLoginError('');
    onClose();
  };

  // Save General Content (SiteConfig)
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    try {
      await PortfolioService.saveContent({ config: configForm }, authToken);
      showToast('Textos y configuración guardados exitosamente');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Error al actualizar', true);
    }
  };

  // Save or Update Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    try {
      const isEditing = Boolean(editingProject);
      await PortfolioService.saveProject(
        isEditing && editingProject ? { ...projectForm, id: editingProject.id } : projectForm,
        authToken
      );

      showToast(isEditing ? 'Proyecto actualizado con éxito' : 'Proyecto agregado con éxito');
      setIsAddingProject(false);
      setEditingProject(null);
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Error al guardar proyecto', true);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!authToken || !confirm('¿Estás seguro de eliminar este proyecto del portafolio?')) return;

    try {
      await PortfolioService.deleteProject(id, authToken);
      showToast('Proyecto eliminado');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', true);
    }
  };

  // Save or Update Review
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    try {
      if (editingReview) {
        await PortfolioService.saveReview({ ...reviewForm, id: editingReview.id }, authToken);
        showToast('Reseña actualizada con éxito');
      } else {
        await PortfolioService.saveReview(reviewForm, authToken);
        showToast('Nueva reseña añadida con éxito');
      }

      setIsAddingReview(false);
      setEditingReview(null);
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Error al procesar reseña', true);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!authToken || !confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      await PortfolioService.deleteReview(id, authToken);
      showToast('Reseña eliminada');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', true);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!authToken) return;
    try {
      await PortfolioService.deleteInquiry(id, authToken);
      fetchInquiries();
      showToast('Mensaje eliminado');
    } catch (e) {
      console.error(e);
    }
  };

  // Change Admin Password / Username
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast('La nueva contraseña y su confirmación no coinciden', true);
      return;
    }

    if (securityForm.newPassword.length < 4) {
      showToast('La nueva contraseña debe tener al menos 4 caracteres', true);
      return;
    }

    setSecurityLoading(true);
    try {
      const res = await PortfolioService.changePassword(
        securityForm.currentPassword,
        securityForm.newPassword,
        securityForm.newUsername,
        authToken
      );

      if (!res.success) {
        throw new Error(res.error || 'Error al actualizar contraseña');
      }

      showToast('¡Credenciales de acceso actualizadas con éxito!');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newUsername: ''
      });
    } catch (err: any) {
      showToast(err.message || 'Error al cambiar contraseña', true);
    } finally {
      setSecurityLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="admin-panel-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div 
        id="admin-panel-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-white relative animate-in fade-in duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Panel de Administración de la Landing Page
                {authToken && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    Conectado
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Edita textos, WhatsApp, imágenes, proyectos y modera reseñas con persistencia en el servidor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authToken && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                Cerrar Sesión
              </button>
            )}
            <button
              id="close-admin-panel-btn"
              onClick={handleClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {statusMessage && (
          <div className={`p-3 text-xs font-semibold text-center shrink-0 flex items-center justify-center gap-2 ${
            statusMessage.isError ? 'bg-rose-500/20 text-rose-300 border-b border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
          }`}>
            {statusMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Area */}
        {!authToken ? (
          /* Login Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="p-4 rounded-full bg-slate-800/80 border border-slate-700 text-emerald-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Acceso Administrativo</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingresa las credenciales configuradas para administrar la web de Víctor Durán.
              </p>
            </div>

            {loginError && (
              <div className="w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4 text-left" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    title={showLoginPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {loginLoading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard with Tabs */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs Header */}
            <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 bg-slate-950/40">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2.5 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'content'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                <span>Textos & WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2.5 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'projects'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Proyectos ({data.projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2.5 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Reseñas ({data.reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2.5 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'inquiries'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Mensajes ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2.5 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'security'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Seguridad & Contraseña</span>
              </button>
            </div>

            {/* Tab 1: Textos & Configuración */}
            {activeTab === 'content' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <form onSubmit={handleSaveContent} className="space-y-6 max-w-3xl">
                  
                  {/* Basic Info */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <User className="w-4 h-4 text-emerald-400" />
                      Datos Personales & WhatsApp
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          value={configForm.name}
                          onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Título Profesional
                        </label>
                        <input
                          type="text"
                          value={configForm.title}
                          onChange={(e) => setConfigForm({ ...configForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          Número de WhatsApp (con código de país)
                        </label>
                        <input
                          type="text"
                          value={configForm.whatsappNumber}
                          onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                          placeholder="+50585929205"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          value={configForm.email}
                          onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mensaje Predeterminado de WhatsApp
                      </label>
                      <input
                        type="text"
                        value={configForm.whatsappMessage}
                        onChange={(e) => setConfigForm({ ...configForm, whatsappMessage: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={configForm.location}
                        onChange={(e) => setConfigForm({ ...configForm, location: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Avatar / Profile Photo Section (Local File Upload or Direct URL) */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <label className="block text-xs font-bold text-white uppercase tracking-wider">
                            Foto / Avatar de Perfil
                          </label>
                          <p className="text-[11px] text-slate-400">
                            Modifica la imagen principal de presentación en la portada mediante un archivo local de tu equipo o ingresando una URL web.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                        {/* Selector de modo: Archivo Local vs URL Web */}
                        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 max-w-sm">
                          <button
                            type="button"
                            onClick={() => setAvatarTab('upload')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                              avatarTab === 'upload'
                                ? 'bg-emerald-500 text-white font-semibold shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Foto Local (Archivo)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAvatarTab('url')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                              avatarTab === 'url'
                                ? 'bg-emerald-500 text-white font-semibold shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Enlace / URL Web</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                          {/* Previsualización del Avatar */}
                          <div className="md:col-span-4 flex flex-col items-center text-center p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                            <div className="relative group">
                              {configForm.avatarUrl && configForm.avatarUrl.trim() ? (
                                <img
                                  src={configForm.avatarUrl.trim()}
                                  alt="Previsualización de perfil"
                                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-emerald-500 shadow-xl bg-slate-800"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                              ) : (
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500">
                                  <Camera className="w-8 h-8" />
                                </div>
                              )}

                              {uploadingAvatar && (
                                <div className="absolute inset-0 rounded-2xl bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-emerald-400 gap-1.5 z-10">
                                  <Loader2 className="w-7 h-7 animate-spin" />
                                  <span className="text-[10px] font-mono font-medium text-white">Subiendo...</span>
                                </div>
                              )}

                              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-xs text-white shadow">
                                ✓
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-white mt-3">
                              Vista Previa
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Así lucirá tu foto en el Hero y tarjeta de perfil
                            </p>

                            <button
                              type="button"
                              onClick={handleResetAvatar}
                              className="mt-3 text-[11px] text-slate-400 hover:text-rose-400 underline underline-offset-2 transition-colors"
                            >
                              Restaurar foto por defecto
                            </button>
                          </div>

                          {/* Opciones de carga según el modo seleccionado */}
                          <div className="md:col-span-8 space-y-3">
                            {avatarTab === 'upload' ? (
                              <div className="space-y-3">
                                {/* Zona Drag & Drop para foto local */}
                                <div
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragOverAvatar(true);
                                  }}
                                  onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragOverAvatar(false);
                                  }}
                                  onDrop={handleAvatarDrop}
                                  onClick={() => avatarFileInputRef.current?.click()}
                                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                                    dragOverAvatar
                                      ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                                      : 'border-slate-700 hover:border-emerald-500/60 bg-slate-950/60 hover:bg-slate-950'
                                  }`}
                                >
                                  <input
                                    ref={avatarFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleAvatarFileSelected(e.target.files[0]);
                                      }
                                    }}
                                  />

                                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                    {uploadingAvatar ? (
                                      <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                      <UploadCloud className="w-6 h-6" />
                                    )}
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {uploadingAvatar
                                        ? 'Procesando y guardando imagen...'
                                        : 'Arrastra tu foto aquí o haz clic para examinar'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                      Soporta formatos JPG, PNG, WebP, GIF o SVG desde tu computadora o teléfono.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    disabled={uploadingAvatar}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      avatarFileInputRef.current?.click();
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all active:scale-95 shadow-sm"
                                  >
                                    <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Elegir Foto Local</span>
                                  </button>
                                </div>

                                {avatarFileName && (
                                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                                    <span className="flex items-center gap-2 truncate">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                      <span className="truncate">Archivo cargado: <strong className="text-white">{avatarFileName}</strong></span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => avatarFileInputRef.current?.click()}
                                      className="text-[11px] text-emerald-400 hover:text-white underline ml-2 shrink-0"
                                    >
                                      Cambiar
                                    </button>
                                  </div>
                                )}

                                {avatarFileError && (
                                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                                    <span>{avatarFileError}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    URL Directa de la Imagen
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="url"
                                      value={configForm.avatarUrl}
                                      onChange={(e) => setConfigForm({ ...configForm, avatarUrl: e.target.value })}
                                      placeholder="https://ejemplo.com/mi-foto.jpg"
                                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-1">
                                    Pega cualquier enlace público HTTPS directo a tu imagen (Unsplash, Imgur, Cloudinary, GitHub, etc.).
                                  </p>
                                </div>

                                <div className="pt-2">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
                                    Fotos de muestra / Sugerencias rápidas:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setConfigForm({ ...configForm, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' })}
                                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors active:scale-95"
                                    >
                                      Hombre Ejecutivo
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfigForm({ ...configForm, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' })}
                                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors active:scale-95"
                                    >
                                      Desarrollador Casual
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfigForm({ ...configForm, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' })}
                                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors active:scale-95"
                                    >
                                      Estilo Original
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfigForm({ ...configForm, avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' })}
                                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors active:scale-95"
                                    >
                                      Consultor Tech
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Alerta de sincronización */}
                            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              Al cambiar la foto, los cambios se reflejan inmediatamente en la web y se guardan en la base de datos del servidor.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Headline and Copy */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                      Titulares & Presentación
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Subtítulo / Bajada del Hero
                      </label>
                      <textarea
                        rows={3}
                        value={configForm.subheadline}
                        onChange={(e) => setConfigForm({ ...configForm, subheadline: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Biografía / Acerca de mí
                      </label>
                      <textarea
                        rows={5}
                        value={configForm.aboutBio}
                        onChange={(e) => setConfigForm({ ...configForm, aboutBio: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Años Exp.
                        </label>
                        <input
                          type="text"
                          value={configForm.yearsOfExperience}
                          onChange={(e) => setConfigForm({ ...configForm, yearsOfExperience: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Proyectos
                        </label>
                        <input
                          type="text"
                          value={configForm.completedProjects}
                          onChange={(e) => setConfigForm({ ...configForm, completedProjects: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Satisfacción
                        </label>
                        <input
                          type="text"
                          value={configForm.satisfiedClients}
                          onChange={(e) => setConfigForm({ ...configForm, satisfiedClients: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios en el Servidor</span>
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Proyectos */}
            {activeTab === 'projects' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    Gestión de Proyectos del Portafolio
                  </h3>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        title: '',
                        description: '',
                        category: 'javascript',
                        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                        tags: ['HTML5', 'CSS3', 'JavaScript'],
                        demoUrl: '#',
                        githubUrl: '#',
                        featured: false,
                        features: ['Responsive', 'Rápido']
                      });
                      setIsAddingProject(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Proyecto</span>
                  </button>
                </div>

                {/* Project Form Modal/Inline */}
                {isAddingProject && (
                  <form onSubmit={handleSaveProject} className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-white text-sm">
                        {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingProject(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Título</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                        >
                          <option value="landing-page">Landing Page</option>
                          <option value="javascript">JavaScript App</option>
                          <option value="html-css">HTML & CSS Puro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                      <textarea
                        rows={3}
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Imagen</label>
                        <input
                          type="url"
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Etiquetas (separadas por coma)</label>
                        <input
                          type="text"
                          value={projectForm.tags?.join(', ')}
                          onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingProject(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                      >
                        Guardar en Servidor
                      </button>
                    </div>
                  </form>
                )}

                {/* Projects List */}
                <div className="grid grid-cols-1 gap-4">
                  {data.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {proj.image && proj.image.trim() ? (
                          <img
                            src={proj.image.trim()}
                            alt={proj.title}
                            className="w-16 h-12 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-900"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg border border-slate-800 bg-slate-900 shrink-0 flex items-center justify-center text-slate-600">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                          <span className="text-[11px] font-mono text-emerald-400 uppercase mt-0.5 inline-block">
                            {proj.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setProjectForm(proj);
                            setIsAddingProject(true);
                          }}
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Reseñas */}
            {activeTab === 'reviews' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Moderación de Reseñas y Testimonios
                    </h3>
                    <p className="text-xs text-slate-400">
                      Todas las reseñas están guardadas en el archivo de base de datos del servidor.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingReview(null);
                      setReviewForm({
                        authorName: '',
                        authorRole: 'CEO / Fundador',
                        authorCompany: 'Empresa',
                        rating: 5,
                        comment: '',
                        verified: true,
                        status: 'approved'
                      });
                      setIsAddingReview(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Reseña</span>
                  </button>
                </div>

                {/* Review Form */}
                {isAddingReview && (
                  <form onSubmit={handleSaveReview} className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-white text-sm">
                        {editingReview ? 'Editar Reseña' : 'Crear Reseña con Altos Estándares'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingReview(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                        <input
                          type="text"
                          required
                          value={reviewForm.authorName}
                          onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo</label>
                        <input
                          type="text"
                          value={reviewForm.authorRole}
                          onChange={(e) => setReviewForm({ ...reviewForm, authorRole: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Empresa</label>
                        <input
                          type="text"
                          value={reviewForm.authorCompany}
                          onChange={(e) => setReviewForm({ ...reviewForm, authorCompany: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Calificación (1 a 5 estrellas)</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 Estrellas - Excelente)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 Estrellas - Muy Bueno)</option>
                        <option value={3}>⭐⭐⭐ (3 Estrellas - Bueno)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Testimonio</label>
                      <textarea
                        rows={3}
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingReview(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                      >
                        Guardar Reseña
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="grid grid-cols-1 gap-4">
                  {data.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{rev.authorName}</span>
                          <span className="text-xs text-slate-400">({rev.authorRole} • {rev.authorCompany})</span>
                          <span className="text-amber-400 text-xs">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 pt-1">
                          <span>Fecha: {rev.date}</span>
                          <span className="text-emerald-400">● Estado: {rev.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingReview(rev);
                            setReviewForm(rev);
                            setIsAddingReview(true);
                          }}
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Mensajes de Contacto */}
            {activeTab === 'inquiries' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    Consultas y Mensajes Recibidos en la Web
                  </h3>
                  <button
                    onClick={fetchInquiries}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Actualizar mensajes
                  </button>
                </div>

                {loadingInquiries ? (
                  <p className="text-xs text-slate-400 text-center py-8">Cargando consultas...</p>
                ) : inquiries.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800">
                    No hay mensajes nuevos registrados aún.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{inq.name}</span>
                            {inq.phone && (
                              <a
                                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                {inq.phone}
                              </a>
                            )}
                            {inq.email && (
                              <span className="text-xs text-slate-400">({inq.email})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-slate-500">{inq.date}</span>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Eliminar mensaje"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                          {inq.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Seguridad & Cambiar Contraseña */}
            {activeTab === 'security' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="max-w-2xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Seguridad y Credenciales de Acceso
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Modifica la contraseña y nombre de usuario para el inicio de sesión del panel de administración.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nuevo Nombre de Usuario (Opcional)
                      </label>
                      <input
                        type="text"
                        value={securityForm.newUsername}
                        onChange={(e) => setSecurityForm({ ...securityForm, newUsername: e.target.value })}
                        placeholder="Dejar en blanco para mantener el actual"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          required
                          value={securityForm.currentPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                          placeholder="Ingresa tu contraseña actual"
                          className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nueva Contraseña
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                            placeholder="Mínimo 4 caracteres"
                            className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          placeholder="Repite la nueva contraseña"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={securityLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                      >
                        <KeyRound className="w-4 h-4" />
                        {securityLoading ? 'Actualizando...' : 'Guardar Nueva Contraseña en Servidor'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
