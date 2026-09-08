import React, { useState } from 'react';
import { GoogleUser } from '../types';
import { X, LogIn, User, Mail, Image, ShieldCheck } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: GoogleUser) => void;
  currentUser?: GoogleUser | null;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  currentUser
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser?.picture || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Generate a clean Google-style avatar from the user's initial if no custom URL is given
  const getDerivedAvatar = (userName: string, customUrl: string) => {
    if (customUrl.trim()) return customUrl.trim();
    const cleanName = userName.trim() || 'Google User';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1a73e8,ea4335,fbbc05,34a853&fontSize=42&fontWeight=600`;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Por favor ingresa tu nombre completo de Google.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Por favor ingresa un correo de Google válido (ejemplo: tu-usuario@gmail.com).');
      return;
    }

    const selectedPicture = getDerivedAvatar(trimmedName, photoUrl);
    const googleId = currentUser?.id || `google-${trimmedEmail.replace(/[^a-z0-9]/g, '-')}`;

    const user: GoogleUser = {
      id: googleId,
      name: trimmedName,
      email: trimmedEmail,
      picture: selectedPicture
    };

    try {
      localStorage.setItem('vd_google_user', JSON.stringify(user));
    } catch (_) {}

    onSignIn(user);
    onClose();
  };

  const previewAvatar = getDerivedAvatar(name, photoUrl);

  return (
    <div
      id="google-auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="google-auth-modal-card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white relative animate-in fade-in zoom-in duration-150"
      >
        {/* Close Button */}
        <button
          id="close-google-auth-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xs">
            <LogIn className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Registro rápido con tu Cuenta de Google
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ingresa los datos de tu cuenta de Google para identificarte y publicar tu reseña verificada (máximo 1 reseña por cuenta).
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Avatar live preview */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <img
              src={previewAvatar}
              alt="Avatar preliminar"
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shrink-0 bg-white"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {name.trim() || 'Tu Nombre de Google'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate max-w-[230px]">
                {email.trim() || 'tu-correo@gmail.com'}
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre de tu Cuenta de Google *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre completo"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Correo de Google (@gmail.com) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Profile Photo URL (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Foto de Perfil (Opcional - URL)
            </label>
            <div className="relative">
              <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Pega el enlace de tu foto (o deja vacío para avatar oficial)"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Si lo dejas vacío, se generará tu foto con la inicial de tu cuenta al estilo Google.
            </span>
          </div>

          {/* Verification & Single review policy */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              Cada cuenta de Google registrada puede publicar <strong>1 sola reseña</strong>. Podrás editarla o eliminarla cuando regreses.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Registrarme con Google y Continuar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
