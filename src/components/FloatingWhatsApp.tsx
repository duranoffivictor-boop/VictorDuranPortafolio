import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber: string;
  defaultMessage: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  defaultMessage
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  // Clean phone number for wa.me link (keep only numbers)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Tooltip Card */}
      {showTooltip && (
        <div 
          id="whatsapp-tooltip-balloon"
          className="relative bg-slate-900 text-white text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-2xl border border-slate-700/80 max-w-[240px] md:max-w-xs flex items-start gap-2"
        >
          <div className="flex-1">
            <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              ¿Tienes un proyecto en mente?
            </p>
            <p className="text-slate-300 mt-0.5 text-xs">
              Escríbeme directo a WhatsApp: <span className="text-white font-medium">{phoneNumber}</span>
            </p>
          </div>
          <button
            id="close-whatsapp-tooltip"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5 transition-colors"
            title="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button (clean, steady, tactile on click without blinking) */}
      <a
        id="btn-whatsapp-floating"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Contactar a Víctor Durán por WhatsApp al ${phoneNumber}`}
        className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-400/40 text-white rounded-full shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-100 ease-out active:translate-y-1 active:scale-95 active:shadow-inner select-none cursor-pointer group"
      >
        <span className="relative z-10">
          <MessageCircle className="w-8 h-8 fill-white/20 group-hover:scale-105 transition-transform" />
        </span>
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-slate-950"></span>
        </span>
      </a>
    </div>
  );
};
