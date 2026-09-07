import React from 'react';
import { X, ShieldCheck, Lock, FileText } from 'lucide-react';
import { PrivacyPolicy } from '../types';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: PrivacyPolicy;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, policy }) => {
  if (!isOpen) return null;

  return (
    <div id="privacy-policy-modal-backdrop" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="privacy-policy-modal-content"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl text-white relative animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {policy.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Última actualización: {policy.lastUpdated}
              </p>
            </div>
          </div>

          <button
            id="btn-close-privacy-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
            {policy.introduction}
          </div>

          <div className="space-y-4">
            {policy.sections.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  {section.title}
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm pl-4 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-3 text-xs text-emerald-300">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Tus datos nunca son compartidos con terceros sin tu consentimiento expreso. Todas las consultas o reseñas se procesan con altos estándares de seguridad y confidencialidad.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
