import React, { useState } from 'react';
import { Review } from '../types';
import { Star, MessageSquarePlus, CheckCircle, Quote, X, Send, Sparkles } from 'lucide-react';
import { PortfolioService } from '../services/portfolioService';

interface ReviewsSectionProps {
  reviews: Review[];
  onReviewSubmitted: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onReviewSubmitted }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorCompany, setAuthorCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setErrorMessage('Por favor ingresa tu nombre y tu comentario.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const result = await PortfolioService.submitPublicReview({
        authorName: authorName.trim(),
        authorRole: authorRole.trim() || 'Cliente',
        authorCompany: authorCompany.trim() || 'Proyecto Web',
        rating,
        comment: comment.trim()
      });

      if (!result.success) {
        throw new Error('Error al registrar la reseña.');
      }

      setSuccessMessage('¡Muchas gracias! Tu reseña y calificación han sido registradas.');
      onReviewSubmitted();
      
      // Reset form
      setAuthorName('');
      setAuthorRole('');
      setAuthorCompany('');
      setRating(5);
      setComment('');

      setTimeout(() => {
        setSuccessMessage('');
        setModalOpen(false);
      }, 2500);

    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión con el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="resenas" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            Testimonios & Calificaciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Opiniones y Reseñas de Clientes con Altos Estándares
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            La reputación se construye con entregas impecables, código limpio y cumplimiento en cada proyecto. Consulta las valoraciones reales o deja tu propia reseña.
          </p>
        </div>

        {/* Rating Summary Bar */}
        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">
                {averageRating}
              </span>
              <div className="space-y-1">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  Basado en {reviews.length} reseñas verificadas
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <div className="text-xs sm:text-sm text-slate-300">
              <span className="font-semibold text-white block">100% Recomendación</span>
              <span className="text-slate-400">Satisfacción en diseño responsive, velocidad y soporte</span>
            </div>
          </div>

          {/* Button to open Leave Review Modal */}
          <button
            id="btn-open-review-modal"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Dejar mi Reseña & Calificación</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-4">
                {/* Rating stars and quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-800 group-hover:text-emerald-500/20 transition-colors" />
                </div>

                {/* Comment */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Details with High Standards badge */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={(rev.authorAvatar && rev.authorAvatar.trim()) ? rev.authorAvatar.trim() : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.authorName || 'Cliente')}&backgroundColor=0284c7,0d9488,6366f1`}
                    alt={rev.authorName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700 bg-slate-800"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.authorName || 'Cliente')}&backgroundColor=0284c7,0d9488,6366f1`;
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {rev.authorName}
                      {rev.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" title="Cliente Verificado" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {rev.authorRole} • <span className="text-slate-300">{rev.authorCompany}</span>
                    </p>
                  </div>
                </div>

                {rev.date && (
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {rev.date}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Leave Review Modal */}
      {modalOpen && (
        <div id="modal-review-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div 
            id="modal-review-content"
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-white relative animate-in fade-in zoom-in duration-200"
          >
            {/* Close button */}
            <button
              id="close-review-modal-btn"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>Tu Opinión es Muy Importante</span>
              </h3>
              <p className="text-xs text-slate-400">
                Deja tu calificación y testimonio sobre el trabajo de desarrollo web de Víctor Durán. Se guardará directamente en el servidor.
              </p>
            </div>

            {successMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm text-center py-8 space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="font-semibold">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
                        className="p-1 text-amber-400 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-amber-400 ml-2 font-mono">
                      {hoverRating || rating} / 5
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej. Ing. Roberto Mendoza"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Role & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tu Cargo / Profesión
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Ej. CEO / Fundador"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Empresa o Proyecto
                    </label>
                    <input
                      type="text"
                      value={authorCompany}
                      onChange={(e) => setAuthorCompany(e.target.value)}
                      placeholder="Ej. MiNegocio S.A."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tu Reseña / Experiencia *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe los resultados obtenidos, velocidad de entrega, calidad del código y atención recibida..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Guardando en servidor...' : 'Publicar Reseña'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
