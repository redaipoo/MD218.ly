"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Gamepad2, CreditCard, Gift } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  Icon: typeof Gamepad2;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "بطاقات الألعاب",
    subtitle: "Xbox • PlayStation • Steam وأكثر بأسعار منافسة",
    gradient: "from-crimson via-red-700 to-red-900",
    Icon: Gamepad2,
  },
  {
    id: 2,
    title: "بطاقات الهدايا",
    subtitle: "Apple • Netflix • SHEIN • Razer Gold وأكثر",
    gradient: "from-red-800 via-crimson to-rose-700",
    Icon: Gift,
  },
  {
    id: 3,
    title: "اطلب عبر واتساب",
    subtitle: "اختر منتجاتك وأرسل طلبك مباشرة - سهل وسريع",
    gradient: "from-rose-900 via-red-800 to-crimson-dark",
    Icon: CreditCard,
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative w-full py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-crimson/30 bg-navy-light">
          {/* Slides */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`min-w-full aspect-[16/6] relative bg-gradient-to-br ${slide.gradient}`}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                </div>

                {/* Logo watermark */}
                <div className="absolute top-4 right-4 w-16 h-16 opacity-20 rounded-xl overflow-hidden">
                  <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <slide.Icon className="w-16 h-16 md:w-20 md:h-20 text-white/90 mb-4" />
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-white/70 text-sm md:text-lg max-w-2xl">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/60 to-transparent" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy/80 border border-white/20 flex items-center justify-center text-white hover:bg-crimson hover:border-crimson transition-all"
            aria-label="Previous slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy/80 border border-white/20 flex items-center justify-center text-white hover:bg-crimson hover:border-crimson transition-all"
            aria-label="Next slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-crimson w-8 shadow-lg shadow-crimson/40"
                  : "bg-white/20 hover:bg-white/40 w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
