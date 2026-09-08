import React, { useState, useEffect } from 'react';
import { Review, GoogleUser } from '../types';
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle, 
  Quote, 
  X, 
  Send, 
  LogIn, 
  LogOut, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import { PortfolioService } from '../services/portfolioService';
import { GoogleAuthModal } from './GoogleAuthModal';

interface ReviewsSectionProps {
  reviews: Review[];
  onReviewSubmitted: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onReviewSubmitted }) => {
  // Google User Session State - loads only this device's/user's registered Google account
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('vd_google_user');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmReview, setDeleteConfirmReview] = useState<Review | null>(null);

  // Form states for creating a review
  const [authorRole, setAuthorRole] = useState('');
  const [authorCompany, setAuthorCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // Form states for editing an existing review
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editCompany, setEditCompany] = useState('');

  // Status messages
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync Google user with localStorage
  useEffect(() => {
    if (googleUser) {
      try {
        localStorage.setItem('vd_google_user', JSON.stringify(googleUser));
      } catch (_) {}
    }
  }, [googleUser]);

  // Check if the currently logged in Google account already owns a review (1 review limit per account)
  const userExistingReview = reviews.find((r) => {
    if (!googleUser) return false;
    if (r.googleUserId && r.googleUserId === googleUser.id) return true;
    if (r.googleEmail && r.googleEmail.toLowerCase() === googleUser.email.toLowerCase()) return true;
    return false;
  });

  const handleSignOut = () => {
    try {
      localStorage.removeItem('vd_google_user');
    } catch (_) {}
    setGoogleUser(null);
    setCreateModalOpen(false);
    setEditModalOpen(false);
  };

  const handleOpenCreateModal = () => {
    if (!googleUser) {
      setAuthModalOpen(true);
      return;
    }

    // Strictly limit: 1 review per Google account
    if (userExistingReview) {
      handleStartEdit(userExistingReview);
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setCreateModalOpen(true);
  };

  const handleSignInSuccess = (user: GoogleUser) => {
    setGoogleUser(user);
    setAuthModalOpen(false);

    // If this Google user already posted a review, prompt them to edit rather than create a second one
    const existing = reviews.find((r) => 
      (r.googleUserId && r.googleUserId === user.id) ||
      (r.googleEmail && r.googleEmail.toLowerCase() === user.email.toLowerCase())
    );

    if (existing) {
      handleStartEdit(existing);
    } else {
      setCreateModalOpen(true);
    }
  };

  // Submit New Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) {
      setAuthModalOpen(true);
      return;
    }

    // Safety check: Cannot post more than 1 review
    if (userExistingReview) {
      setErrorMessage('Ya has publicado una reseña con esta cuenta de Google. Solo se permite 1 reseña por cuenta.');
      return;
    }

    if (!comment.trim()) {
      setErrorMessage('Por favor ingresa tu comentario o testimonio.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const result = await PortfolioService.submitPublicReview({
        authorName: googleUser.name,
        authorAvatar: googleUser.picture,
        googleUserId: googleUser.id,
        googleEmail: googleUser.email,
        authorRole: authorRole.trim() || 'Cliente Verificado',
        authorCompany: authorCompany.trim() || 'Proyecto Particular',
        rating,
        comment: comment.trim()
      });

      if (!result.success) {
        throw new Error(result.message || 'No se pudo guardar la reseña.');
      }

      setSuccessMessage('¡Muchas gracias! Tu reseña ha sido publicada con éxito.');
      onReviewSubmitted();

      // Reset form
      setAuthorRole('');
      setAuthorCompany('');
      setRating(5);
      setComment('');

      setTimeout(() => {
        setSuccessMessage('');
        setCreateModalOpen(false);
      }, 1800);

    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión con el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Review Modal
  const handleStartEdit = (rev: Review) => {
    setEditingReview(rev);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
    setEditRole(rev.authorRole || '');
    setEditCompany(rev.authorCompany || '');
    setErrorMessage('');
    setSuccessMessage('');
    setEditModalOpen(true);
  };

  // Submit Edit Review
  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !googleUser) return;

    if (!editComment.trim()) {
      setErrorMessage('El comentario no puede estar vacío.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const result = await PortfolioService.updateGoogleReview(
        editingReview.id,
        {
          rating: editRating,
          comment: editComment.trim(),
          authorRole: editRole.trim(),
          authorCompany: editCompany.trim()
        },
        googleUser.id
      );

      if (!result.success) {
        throw new Error('Error al actualizar la reseña.');
      }

      setSuccessMessage('Tu reseña ha sido actualizada con éxito.');
      onReviewSubmitted();

      setTimeout(() => {
        setSuccessMessage('');
        setEditModalOpen(false);
        setEditingReview(null);
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message || 'Error al actualizar la reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm and Execute Delete Review
  const handleExecuteDelete = async () => {
    if (!deleteConfirmReview || !googleUser) return;

    setSubmitting(true);
    try {
      await PortfolioService.deleteGoogleReview(deleteConfirmReview.id, googleUser.id);
      setDeleteConfirmReview(null);
      onReviewSubmitted();
    } catch (err: any) {
      alert('No se pudo eliminar la reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="resenas" className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1 rounded-full">
            Testimonios & Reseñas Verificadas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Opiniones de Clientes con Cuentas Verificadas
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Transparencia y reputación garantizada. Regístrate rápidamente con tu cuenta de Google para compartir tu experiencia con tu foto oficial. Cada cuenta puede publicar una sola reseña y gestionarla cuando lo desee.
          </p>
        </div>

        {/* Google User Session Bar */}
        <div className="mt-8 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          {googleUser ? (
            <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
              <div className="relative">
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow-xs bg-white"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white" title="Cuenta verificada con Google">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {googleUser.name}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    Google Conectado
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-[220px] sm:max-w-xs">
                  {googleUser.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Identificación con Cuenta de Google
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Inicia sesión con Google para verificar tu opinión. Solo se permite 1 reseña por cuenta.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons in User Bar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {googleUser && (
              <button
                id="btn-signout-google"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
                title="Cerrar sesión de Google"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            )}

            {!googleUser ? (
              <button
                id="btn-signin-google-bar"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Registrarme con Google</span>
              </button>
            ) : userExistingReview ? (
              // When user already has 1 review, show edit option instead of create
              <button
                id="btn-edit-existing-review-bar"
                onClick={() => handleStartEdit(userExistingReview)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar mi Reseña</span>
              </button>
            ) : (
              // When user has no review yet, allow creating their single review
              <button
                id="btn-open-review-modal"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Escribir mi Reseña</span>
              </button>
            )}
          </div>
        </div>

        {/* Existing Review Notice banner if user already submitted */}
        {googleUser && userExistingReview && (
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                Ya publicaste tu reseña con esta cuenta de Google (<strong>límite: 1 por cuenta</strong>). Puedes modificarla o eliminarla cuando lo desees.
              </span>
            </div>
            <button
              onClick={() => handleStartEdit(userExistingReview)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer"
            >
              Modificar reseña &rarr;
            </button>
          </div>
        )}

        {/* Rating Summary Bar */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-amber-500 dark:text-amber-400 font-mono">
                {averageRating}
              </span>
              <div className="space-y-1">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Basado en {reviews.length} testimonios registrados
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white block">100% Clientes Satisfechos</span>
              <span className="text-slate-500 dark:text-slate-400">Diseño semántico, velocidad y adaptabilidad móvil probadas</span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>1 Reseña por Cuenta de Google</span>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => {
            const isOwner = Boolean(
              googleUser && (
                (rev.googleUserId && rev.googleUserId === googleUser.id) ||
                (rev.googleEmail && rev.googleEmail.toLowerCase() === googleUser.email.toLowerCase())
              )
            );

            return (
              <article
                key={rev.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all group ${
                  isOwner
                    ? 'border-indigo-400 dark:border-indigo-500/60 shadow-md ring-2 ring-indigo-500/15'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Top: Rating + Owner Badge + Quote */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400 gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      {isOwner && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                          Tu Reseña
                        </span>
                      )}
                    </div>
                    <Quote className="w-7 h-7 text-slate-200 dark:text-slate-800 group-hover:text-emerald-500/20 transition-colors" />
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {rev.updatedAt && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      (Modificado el {rev.updatedAt})
                    </p>
                  )}
                </div>

                {/* Author Details + Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={(rev.authorAvatar && rev.authorAvatar.trim()) ? rev.authorAvatar.trim() : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.authorName || 'Cliente')}&backgroundColor=0284c7,0d9488,6366f1`}
                        alt={rev.authorName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 bg-white"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.authorName || 'Cliente')}&backgroundColor=0284c7,0d9488,6366f1`;
                        }}
                      />
                      {(rev.googleUserId || rev.verified) && (
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xs"
                          title="Perfil verificado con Google"
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {rev.authorName}
                        {rev.googleUserId && (
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60">
                            Google
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rev.authorRole} • <span className="text-slate-700 dark:text-slate-300">{rev.authorCompany}</span>
                      </p>
                    </div>
                  </div>

                  {/* Owner Controls (Edit & Delete) or Date */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isOwner ? (
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => handleStartEdit(rev)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Editar mi reseña"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmReview(rev)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Eliminar mi reseña"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    ) : (
                      rev.date && (
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                          {rev.date}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Google Quick Sign-in Modal (No recommendations, clean personal registration) */}
      <GoogleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={handleSignInSuccess}
        currentUser={googleUser}
      />

      {/* Modal: Create New Review with Google (Only if user has not yet published 1 review) */}
      {createModalOpen && googleUser && !userExistingReview && (
        <div id="modal-review-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div 
            id="modal-review-content"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white relative animate-in fade-in zoom-in duration-150"
          >
            {/* Close button */}
            <button
              id="close-review-modal-btn"
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Tu Opinión Verificada con Google</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tu reseña se publicará directamente vinculada a tu cuenta de Google. Podrás editarla o borrarla cuando quieras (máximo 1 reseña por cuenta).
              </p>
            </div>

            {/* Active Google User Profile Card */}
            <div className="mb-5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-xs bg-white"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    {googleUser.name}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {googleUser.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreateModalOpen(false);
                  setAuthModalOpen(true);
                }}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Cambiar datos
              </button>
            </div>

            {successMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm text-center py-8 space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 dark:text-emerald-400 mx-auto" />
                <p className="font-semibold">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Calificación general
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-400 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-amber-500 dark:text-amber-400 ml-2 font-mono">
                      {hoverRating || rating} / 5
                    </span>
                  </div>
                </div>

                {/* Role & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tu Cargo / Profesión
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Ej. Propietario / Gerente"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Empresa o Proyecto
                    </label>
                    <input
                      type="text"
                      value={authorCompany}
                      onChange={(e) => setAuthorCompany(e.target.value)}
                      placeholder="Ej. MiNegocio"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tu Reseña / Experiencia *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe los resultados obtenidos, tiempos de entrega y calidad del trabajo de Víctor Durán..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-md shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Guardando...' : 'Publicar Reseña Verificada'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Review */}
      {editModalOpen && editingReview && (
        <div id="modal-edit-review-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div 
            id="modal-edit-review-content"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white relative animate-in fade-in zoom-in duration-150"
          >
            <button
              onClick={() => {
                setEditModalOpen(false);
                setEditingReview(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-indigo-500" />
                <span>Modificar Tu Reseña</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Puedes actualizar tu calificación en estrellas, tu comentario o los datos de tu empresa.
              </p>
            </div>

            {successMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm text-center py-6 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
                <p className="font-semibold">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateReview} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Calificación
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setEditRating(star)}
                        onMouseEnter={() => setEditHoverRating(star)}
                        onMouseLeave={() => setEditHoverRating(0)}
                        className="p-1 text-amber-400 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (editHoverRating || editRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-amber-500 dark:text-amber-400 ml-2 font-mono">
                      {editHoverRating || editRating} / 5
                    </span>
                  </div>
                </div>

                {/* Role & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cargo / Profesión
                    </label>
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Comentario *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Review */}
      {deleteConfirmReview && (
        <div id="modal-delete-confirm-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                ¿Eliminar tu reseña?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Esta acción eliminará definitivamente tu reseña. Una vez eliminada, podrás volver a publicar una nueva si lo deseas.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmReview(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
