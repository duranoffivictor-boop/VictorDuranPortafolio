import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Gift } from "lucide-react";

interface Promo {
  id: string;
  title: string;
  badge: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
  code: string;
}

const PROMOS: Promo[] = [
  {
    id: "promo-1",
    title: "Combo Sábado de Nacatamales",
    badge: "Especial de Fin de Semana",
    description: "Llévate nuestro Nacatamal de Cerdo Especial + un vaso grande de Cacao con Leche Frío con abundante hielo por un precio de promoción.",
    price: "C$ 160",
    originalPrice: "C$ 180",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=500&q=80",
    code: "FINDE"
  },
  {
    id: "promo-2",
    title: "Doble Vigorón Masaya",
    badge: "Miércoles de Vigorón",
    description: "¡Dos porciones de nuestro crujiente Vigorón Granadino con yuca suavecita y ensalada de mimbre para compartir con quien querás!",
    price: "C$ 195",
    originalPrice: "C$ 220",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80",
    code: "VIGORON2"
  },
  {
    id: "promo-3",
    title: "Sazón Lunes del Gallo Pinto",
    badge: "Lunes de Energía",
    description: "Ordena tu Gallo Pinto Clásico con Todo y te regalamos un delicioso y refrescante Pinolillo Helado. ¡Para empezar la semana con fuerza!",
    price: "C$ 90",
    originalPrice: "C$ 135",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=500&q=80",
    code: "GALLOPINTO"
  }
];

interface PromoSliderProps {
  onOrderPromo: (promoCode: string) => void;
  isDarkMode: boolean;
}

export default function PromoSlider({ onOrderPromo, isDarkMode }: PromoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROMOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PROMOS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PROMOS.length) % PROMOS.length);
  };

  return (
    <div id="promo-slider" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex items-center space-x-2 mb-6 justify-center lg:justify-start">
        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        <h2 className="font-sans font-bold text-2xl tracking-tight">Promociones Imperdibles de Hoy</h2>
      </div>

      <div className={`relative rounded-3xl overflow-hidden shadow-xl transition-all duration-300 ${
        isDarkMode ? "bg-neutral-900 border border-neutral-800" : "bg-gradient-to-r from-emerald-50 to-white border border-emerald-100"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Promo Text */}
          <div className="p-8 md:p-12 md:col-span-7 space-y-4">
            <span className="inline-block px-3 py-1 bg-amber-400 text-neutral-950 font-mono font-bold text-[10px] uppercase rounded-full tracking-wider">
              {PROMOS[activeIndex].badge}
            </span>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight">
              {PROMOS[activeIndex].title}
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-neutral-300" : "text-neutral-600"}`}>
              {PROMOS[activeIndex].description}
            </p>
            
            <div className="flex items-center space-x-4 py-2">
              <span className="text-3xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {PROMOS[activeIndex].price}
              </span>
              <span className="text-sm line-through text-neutral-400 font-mono font-medium">
                {PROMOS[activeIndex].originalPrice}
              </span>
              <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold rounded">
                Ahorra C$ {parseInt(PROMOS[activeIndex].originalPrice.split(" ")[1]) - parseInt(PROMOS[activeIndex].price.split(" ")[1])}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id={`apply-promo-btn-${PROMOS[activeIndex].id}`}
                onClick={() => onOrderPromo(PROMOS[activeIndex].code)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/10 transition-colors flex items-center space-x-2"
              >
                <Gift className="w-4 h-4" />
                <span>Aplicar Cupón: {PROMOS[activeIndex].code}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Promo Image */}
          <div className="relative md:col-span-5 h-64 md:h-full min-h-[250px] overflow-hidden">
            <img
              src={PROMOS[activeIndex].image}
              alt={PROMOS[activeIndex].title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 md:from-transparent to-transparent"></div>
          </div>

        </div>

        {/* Carousel arrows */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-10">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/85 dark:bg-neutral-800/85 hover:bg-white dark:hover:bg-neutral-700 text-neutral-800 dark:text-white shadow-md transition-all border border-neutral-200 dark:border-neutral-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white/85 dark:bg-neutral-800/85 hover:bg-white dark:hover:bg-neutral-700 text-neutral-800 dark:text-white shadow-md transition-all border border-neutral-200 dark:border-neutral-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
