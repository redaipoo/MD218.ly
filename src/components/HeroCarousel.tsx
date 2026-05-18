"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Gamepad2, CreditCard, Gift } from "lucide-react";
import { assetPath } from "@/lib/utils";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  Icon: typeof Gamepad2;
  isXbox?: boolean;
  ctaText?: string;
}

const slides: Slide[] = [
  {
    id: 0,
    title: "ألعاب Xbox + حسابات مشتركة 🎮",
    subtitle: "أفضل الأسعار في ليبيا - تفعيل فوري",
    gradient: "xbox-custom",
    Icon: Gamepad2,
    isXbox: true,
    ctaText: "تسوق الآن ←",
  },
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

  const scrollToXbox = () => {
    const el = document.getElementById("xbox-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full pt-6 pb-8 md:pt-8 md:pb-10">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-crimson/20 bg-navy-light shadow-premium-lg">
          {/* Slides */}
          <div
            className="flex transition-transform duration-[600ms] ease-premium"
            style={{ transform: `translateX(${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`min-w-full aspect-[16/6] lg:aspect-[16/5.5] relative ${
                  slide.isXbox ? "" : `bg-gradient-to-br ${slide.gradient}`
                }`}
                style={
                  slide.isXbox
                    ? { background: "linear-gradient(135deg, #107C10 0%, #0a3a0a 50%, #061f06 100%)" }
                    : undefined
                }
              >
                {/* Animated decorative elements */}
                <div className="absolute inset-0 opacity-20 overflow-hidden">
                  <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-float" />
                  <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />
                </div>

                {/* Vignette edges */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]" />

                {/* Xbox watermark for Xbox slide */}
                {slide.isXbox ? (
                  <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 opacity-[0.1]">
                    <Gamepad2 className="w-36 h-36 md:w-56 md:h-56 text-white" />
                  </div>
                ) : (
                  <div className="absolute top-5 right-5 w-14 h-14 opacity-15 rounded-xl overflow-hidden">
                    <img src={assetPath("/logo.png")} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-10">
                  <div className="p-3 md:p-4 rounded-2xl bg-white/[0.06] backdrop-blur-sm mb-4 md:mb-5">
                    <slide.Icon className="w-12 h-12 md:w-16 md:h-16 text-white/90" />
                  </div>
                  <h2
                    className={`text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 drop-shadow-lg leading-tight ${
                      slide.isXbox ? "text-[24px] md:text-4xl" : ""
                    }`}
                  >
                    {slide.title}
                  </h2>
                  <p className="text-white/60 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button for Xbox slide */}
                  {slide.isXbox && slide.ctaText && (
                    <button
                      onClick={scrollToXbox}
                      className="mt-6 md:mt-7 px-8 py-3 bg-white font-black rounded-full text-sm md:text-base transition-all duration-300 ease-premium hover:scale-105 hover:shadow-[0_4px_24px_rgba(16,124,16,0.35)] active:scale-[0.98]"
                      style={{ color: "#107C10" }}
                    >
                      {slide.ctaText}
                    </button>
                  )}
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/50 to-transparent" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows — premium glass style */}
          <button
            onClick={prevSlide}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-crimson/80 hover:border-crimson/50 transition-all duration-300 ease-premium hover:shadow-glow-crimson"
            aria-label="Previous slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-crimson/80 hover:border-crimson/50 transition-all duration-300 ease-premium hover:shadow-glow-crimson"
            aria-label="Next slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Indicator — premium pill style */}
        <div className="flex justify-center gap-2.5 mt-5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-[400ms] ease-premium ${
                currentSlide === index
                  ? index === 0
                    ? "bg-[#107C10] w-9 shadow-[0_0_12px_rgba(16,124,16,0.5)]"
                    : "bg-crimson w-9 shadow-[0_0_12px_rgba(139,26,26,0.5)]"
                  : "bg-white/15 hover:bg-white/30 w-2.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
