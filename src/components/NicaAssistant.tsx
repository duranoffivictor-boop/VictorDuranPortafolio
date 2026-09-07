import React, { useState, useEffect, useRef } from "react";
import { MessageSquareText, Send, X, HelpCircle, Sparkles, ChefHat } from "lucide-react";

interface NicaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface Message {
  role: "user" | "model";
  text: string;
}

const PRESETS = [
  "¿Qué me recomendás almorzar hoy?",
  "¿Cuáles son los ingredientes de un Nacatamal?",
  "¿Qué lleva el Vigorón Granadino?",
  "¿A qué zonas de Managua hacen delivery?",
  "Contame del Indio Viejo pues"
];

export default function NicaAssistant({ isOpen, onClose, isDarkMode }: NicaAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "¡Hola, mi amor! Te saluda Doña María, la cocinera mayor. Ideay, contame, ¿qué se te antoja comer hoy de nuestro menú tradicional nicaragüense? ¿Querés que te recomiende un buen Gallo Pinto con Quesito frito o un Vigorón crujiente?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      if (!response.ok) {
        throw new Error("No se pudo conectar con Doña María.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "¡Ay, disculpá mi amor! Se me fue el internet en la cocina un ratito. Pero mirá, ¡nuestra comida sigue calientita! ¿Me volvés a preguntar por favor?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Click close on outside */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Chat Drawer container */}
      <div
        id="assistant-chat-panel"
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-neutral-950 text-white border-l border-neutral-800" : "bg-white text-neutral-900 border-l border-neutral-200"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-emerald-600 text-white">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-400 rounded-lg text-neutral-950">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-base flex items-center space-x-1">
                <span>Platica con Doña María</span>
              </h2>
              <p className="text-[10px] text-emerald-100 uppercase tracking-widest font-mono font-bold leading-none">Asistente de Cocina IA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-700 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log area (Scrollable) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : isDarkMode
                      ? "bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-bl-none"
                      : "bg-neutral-100 text-neutral-800 border border-neutral-200/50 rounded-bl-none"
                }`}
              >
                {/* Assistant Name Label */}
                {m.role === "model" && (
                  <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider font-mono mb-1 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    <span>Doña María</span>
                  </p>
                )}
                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-2xl text-xs sm:text-sm max-w-[80%] rounded-bl-none flex items-center space-x-2 ${
                isDarkMode ? "bg-neutral-900 border border-neutral-800" : "bg-neutral-100 border border-neutral-200"
              }`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-neutral-400 font-mono">Doña María está escribiendo...</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset suggestion list */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 overflow-x-auto whitespace-nowrap scrollbar-thin flex items-center space-x-1.5 shrink-0 bg-neutral-50/50 dark:bg-neutral-950/50">
          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-btn-${idx}`}
              onClick={() => handleSendMessage(preset)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all truncate max-w-[150px] ${
                isDarkMode
                  ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300"
                  : "bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-600"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Text Input area footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2 shrink-0 bg-neutral-50/80 dark:bg-neutral-900/10"
        >
          <input
            id="assistant-chat-input"
            type="text"
            placeholder="Pregúntame del menú o comida nicaragüense..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              isDarkMode 
                ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
            }`}
          />
          <button
            type="submit"
            id="send-message-btn"
            disabled={!inputValue.trim() || loading}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 disabled:text-neutral-500 text-white rounded-xl transition-colors shadow-md shadow-emerald-600/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
