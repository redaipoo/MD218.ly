"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowLeft, Users, ShieldCheck, Zap, Headphones, Tag } from "lucide-react";
import { assetPath } from "@/lib/utils";

const slides = [
  {
    id: 1,
    headline: "انضم إلى أكبر مجموعة",
    subheadline: "مهتمة بعالم Xbox في ليبيا 🇱🇾",
    badge: "مجتمع ضخم وموثوق",
    stats: "10,000+",
    statsLabel: "عضو حقيقي",
    ctaText: "اضغط هنا للانضمام إلى المجموعة",
    bgImage: "/images/xbox-hero-banner.jpg",
    linkUrl: "https://www.facebook.com/groups/1529268571110105/?ref=share_group_link&rdid=NWaxup8I4sRQJkJF&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F1CNEkTVVC3%2F#",
    isExternal: true,
    hideOverlay: true, // Don't darken the ad too much
  },
  {
    id: 2,
    headline: "حسابات ألعاب مشتركة",
    subheadline: "العب أحدث الألعاب بأقل تكلفة ممكنة",
    badge: "توفير يصل إلى 80%",
    stats: "24/7",
    statsLabel: "تفعيل فوري",
    ctaText: "استكشف الألعاب",
    bgImage: "/images/xbox-hero-banner.jpg",
  },
  {
    id: 3,
    headline: "بطاقات الهدايا",
    subheadline: "رصيد لجميع المنصات العالمية",
    badge: "PlayStation • Steam • Netflix",
    stats: "100%",
    statsLabel: "أصلية ومضمونة",
    ctaText: "تسوق البطاقات",
    bgImage: "/images/xbox-hero-banner.jpg",
  }
];

const bottomIcons = [
  { icon: Headphones, label: "دعم فني متواصل" },
  { icon: Zap, label: "تفعيل فوري وآمن" },
  { icon: ShieldCheck, label: "ضمان كامل" },
  { icon: Tag, label: "أفضل الأسعار" },
  { icon: Users, label: "مجتمع ضخم وموثوق" },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: "rtl" }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollToSection = () => {
    const el = document.getElementById("xbox-section") || document.querySelector(".stagger-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full pt-4 pb-6 md:pt-8 md:pb-10 overflow-hidden">
      <div className="container mx-auto px-2 md:px-4">
        
        {/* Main Slider Container */}
        <div className="relative overflow-hidden rounded-[20px] md:rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(139,26,26,0.15)] bg-navy-dark h-[240px] md:h-[480px]">
          
          {/* Viewport for Embla */}
          <div className="overflow-hidden h-full w-full" ref={emblaRef} dir="rtl">
            <div className="flex h-full w-full touch-pan-y">
              
              {/* Slides */}
              {slides.map((slide, index) => {
                const isActive = index === selectedIndex;
                
                return (
                  <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                    
                    {/* Background Image with Parallax & Blur */}
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={assetPath(slide.bgImage)} 
                        alt="Hero Background" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        style={{
                          transform: isActive ? "scale(1.05)" : "scale(1.1)",
                          transition: "transform 6s cubic-bezier(0.25, 1, 0.5, 1)",
                        }}
                      />
                      {/* Cinematic Gradient Overlays to hide original text and create depth */}
                      {!slide.hideOverlay && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40" />
                        </>
                      )}
                      {slide.hideOverlay && (
                        <div className="absolute inset-0 bg-black/40 md:bg-black/20" />
                      )}
                      
                      {/* Ambient Grid/Noise Overlay */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
                      
                      {/* Red Neon Glows */}
                      <div className="absolute -top-20 -right-20 w-96 h-96 bg-crimson/30 rounded-full blur-[100px] pointer-events-none" />
                      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-900/40 rounded-full blur-[80px] pointer-events-none" />
                    </div>

                    {/* Content Overlay */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
                          <div className="max-w-2xl flex flex-col items-start gap-4 md:gap-6 relative z-10">
                            
                            {/* Top Badge */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                              className="inline-flex items-center gap-2 px-4 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-premium"
                            >
                              <span className="w-2 h-2 rounded-full bg-crimson shadow-[0_0_10px_rgba(139,26,26,0.8)] animate-pulse" />
                              <span className="text-white/80 text-xs md:text-sm font-bold tracking-wide">{slide.badge}</span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                              initial={{ opacity: 0, scale: 0.95, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                              className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                            >
                              {slide.headline}
                            </motion.h1>

                            {/* Subheadline with Accent Line */}
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                              className="flex items-center gap-4"
                            >
                              <div className="w-8 md:w-12 h-[2px] bg-crimson shadow-[0_0_10px_rgba(139,26,26,0.6)]" />
                              <p className="text-white/70 text-sm md:text-xl font-bold max-w-md leading-relaxed">
                                {slide.subheadline}
                              </p>
                            </motion.div>

                            {/* Glassmorphism Stats Panel */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                              className="mt-2 flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-premium relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                              <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gold-light via-white to-gold-dark drop-shadow-md">
                                  {slide.stats}
                                </span>
                                <span className="text-white/50 text-[10px] md:text-xs font-bold tracking-wider">{slide.statsLabel}</span>
                              </div>
                            </motion.div>

                            {/* Premium CTA Button */}
                            {slide.isExternal ? (
                              <motion.a
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                                href={slide.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 md:mt-6 relative group overflow-hidden bg-[#1877F2] text-white px-6 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-base flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(24,119,242,0.4)] hover:shadow-[0_0_40px_rgba(24,119,242,0.6)]"
                              >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                                <span className="relative z-10">{slide.ctaText}</span>
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                              </motion.a>
                            ) : (
                              <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                                onClick={scrollToSection}
                                className="mt-2 md:mt-6 relative group overflow-hidden bg-crimson text-white px-6 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-base flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(139,26,26,0.4)] hover:shadow-[0_0_40px_rgba(139,26,26,0.6)]"
                              >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                                <span className="relative z-10">{slide.ctaText}</span>
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                              </motion.button>
                            )}

                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating Navigation Arrows - Circular Glass Style */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 md:left-6 md:right-6 flex justify-between pointer-events-none z-20">
            <button
              onClick={scrollPrev}
              className="pointer-events-auto w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-crimson/50 hover:bg-crimson/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(139,26,26,0.4)] active:scale-95"
              aria-label="السابق"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="pointer-events-auto w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-crimson/50 hover:bg-crimson/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(139,26,26,0.4)] active:scale-95"
              aria-label="التالي"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Capsule Pagination (Xbox A,B,X,Y colors logic or premium red glow) */}
          <div className="absolute bottom-[40px] md:bottom-[90px] left-0 right-0 flex justify-center z-20">
            <div className="flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-premium">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full h-1.5 md:h-2.5 ${
                    selectedIndex === index 
                      ? "w-6 md:w-10 bg-crimson shadow-[0_0_12px_rgba(139,26,26,0.8)]" 
                      : "w-1.5 md:w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`الذهاب للشريحة ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Very Bottom Bar: 5 Feature Icons (Glassmorphism) */}
          <div className="absolute bottom-0 left-0 right-0 hidden md:block h-20 bg-black/60 backdrop-blur-2xl border-t border-white/10 z-20 overflow-x-auto custom-scrollbar">
            <div className="flex items-center justify-around min-w-[600px] h-full px-4">
              {bottomIcons.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-3 group cursor-default px-2">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-crimson group-hover:bg-crimson group-hover:text-white transition-all duration-300 shadow-inner-glow group-hover:shadow-[0_0_15px_rgba(139,26,26,0.5)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-white/60 text-xs font-bold group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Subtle red glow dot separator (skip after last item) */}
                  {idx < bottomIcons.length - 1 && (
                    <div className="w-1 h-1 rounded-full bg-crimson/50 shadow-[0_0_5px_rgba(139,26,26,0.8)]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sleek Progress Bar at very bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 z-30">
            <motion.div
              key={selectedIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-crimson shadow-[0_0_10px_rgba(139,26,26,1)]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
