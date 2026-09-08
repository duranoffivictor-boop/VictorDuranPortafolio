import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { SiteConfig } from '../types';
import { PortfolioService } from '../services/portfolioService';

interface ContactSectionProps {
  config: SiteConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappDirectUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(config.whatsappMessage)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMessage('Por favor completa al menos tu nombre y mensaje.');
      return;
    }

    setSending(true);
    setErrorMessage('');

    try {
      const res = await PortfolioService.submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim()
      });

      if (!res.success) throw new Error('Error al enviar el mensaje');

      setSentSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar con el servidor.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Banner & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            Inicia tu Proyecto Hoy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¿Listo para Construir tu Próxima Web?
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Hablemos directamente por WhatsApp o envíame los detalles de tu requerimiento. Respuesta rápida en menos de 2 horas.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct WhatsApp Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Highlight Box */}
            <div className="bg-gradient-to-br from-emerald-900/40 via-slate-950 to-slate-950 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-7 h-7 fill-emerald-400/20" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Contacto Directo por WhatsApp
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  La forma más ágil y cómoda de conversar sobre presupuesto, fechas de entrega y especificaciones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase">Número telefónico</span>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  {config.whatsappNumber}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Atención activa de Lunes a Sábado</span>
                </div>
              </div>

              <a
                id="contact-whatsapp-direct-btn"
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-xl shadow-emerald-500/30 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Abrir Chat en WhatsApp Ahora</span>
              </a>
            </div>

            {/* Other contact info */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Correo Electrónico</span>
                  <a href={`mailto:${config.email}`} className="text-white hover:text-emerald-400 font-medium">
                    {config.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Ubicación & Disponibilidad</span>
                  <span className="text-white font-medium">{config.location}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Web Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">
              Envía un Mensaje o Consulta de Proyecto
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Completa los datos a continuación y recibirás una propuesta detallada adaptada a tu presupuesto.
            </p>

            {sentSuccess ? (
              <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Víctor Durán ha recibido tu consulta y se comunicará contigo a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@empresa.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teléfono o WhatsApp (opcional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+505 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descripción del Proyecto o Necesidad *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntame sobre tu sitio web: tipo de proyecto (landing page, tienda, portafolio), funcionalidades deseadas y fecha estimada..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>{sending ? 'Enviando...' : 'Enviar Consulta'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
