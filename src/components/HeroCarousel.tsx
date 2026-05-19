"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Users,
  ShieldCheck,
  Zap,
  Headset,
  Gamepad2,
  CreditCard,
  Gift,
} from "lucide-react";
import { assetPath } from "@/lib/utils";

/* ═══════════════════════════════════════════
   SLIDE DATA — each slide is unique
   ═══════════════════════════════════════════ */

interface SlideData {
  id: number;
  type: "community" | "features" | "products";
  bgImage: string;
  bgColor: string; // fallback gradient
}

const slides: SlideData[] = [
  {
    id: 1,
    type: "community",
    bgImage: "/images/xbox-hero-banner.jpg",
    bgColor: "from-[#0a0a0a] to-[#1a0808]",
  },
  {
    id: 2,
    type: "features",
    bgImage: "/images/products/xbox-bg.jpg",
    bgColor: "from-[#0a0f0a] to-[#0a1a0a]",
  },
  {
    id: 3,
    type: "products",
    bgImage: "/images/products/gamepass-bg.jpg",
    bgColor: "from-[#0a0a12] to-[#0f0818]",
  },
];

const FB_GROUP_URL =
  "https://www.facebook.com/groups/1529268571110105/?ref=share_group_link";

/* ═══════════════════════════════════════════
   SLIDE CONTENT COMPONENTS
   ═══════════════════════════════════════════ */

/* --- Slide 1: Community --- */
function CommunitySlide() {
  return (
    <div className="relative z-10 flex flex-col justify-center h-full px-5 md:px-12 lg:px-20 py-6 md:py-10">
      <div className="max-w-lg flex flex-col gap-2 md:gap-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/8 border border-white/10 backdrop-blur-sm"
        >
          <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-crimson" />
          <span className="text-white/70 text-[10px] md:text-xs font-semibold">
            مجتمع ضخم وموثوق
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-[clamp(1.1rem,4vw,2.5rem)] font-black text-white leading-[1.2]"
        >
          انضم إلى أكبر مجتمع
          <br />
          <span className="text-crimson">Xbox</span> في ليبيا 🇱🇾
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-white/50 text-[clamp(0.65rem,2.2vw,0.95rem)] font-medium leading-relaxed max-w-sm"
        >
          +10,000 عضو حقيقي وتفاعل يومي
        </motion.p>

        {/* CTA */}
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          href={FB_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start mt-1 md:mt-2 inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1565d8] text-white px-5 py-2 md:px-7 md:py-3 rounded-xl font-bold text-[clamp(0.65rem,2vw,0.9rem)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-blue-500/20"
        >
          <span>الدخول إلى المجموعة</span>
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </motion.a>
      </div>

      {/* Floating stats card — bottom right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 md:px-5 md:py-3 flex items-center gap-2 md:gap-3"
      >
        <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-crimson/20 flex items-center justify-center">
          <Users className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-crimson" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black text-sm md:text-lg leading-none">
            +10,000
          </span>
          <span className="text-white/40 text-[8px] md:text-[10px] font-semibold">
            عضو حقيقي
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* --- Slide 2: Store Features --- */
function FeaturesSlide() {
  const features = [
    { icon: Zap, label: "تفعيل فوري", desc: "خلال دقائق" },
    { icon: CreditCard, label: "أسعار تنافسية", desc: "أفضل سعر في ليبيا" },
    { icon: ShieldCheck, label: "منتجات أصلية", desc: "ضمان كامل" },
    { icon: Headset, label: "دعم فني سريع", desc: "على مدار الساعة" },
  ];

  return (
    <div className="relative z-10 flex flex-col justify-center h-full px-5 md:px-12 lg:px-20 py-6 md:py-10">
      <div className="flex flex-col gap-3 md:gap-5 max-w-2xl">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-[clamp(1rem,3.5vw,2rem)] font-black text-white leading-tight"
        >
          لماذا <span className="text-crimson">MD218.LY</span>؟
        </motion.h2>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.15 + i * 0.08,
              }}
              className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/8 rounded-xl px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm"
            >
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-crimson/15 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-crimson" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold text-[clamp(0.6rem,1.8vw,0.85rem)] leading-tight">
                  {f.label}
                </span>
                <span className="text-white/35 text-[clamp(0.5rem,1.5vw,0.7rem)] font-medium hidden md:block">
                  {f.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          onClick={() => {
            const el =
              document.getElementById("xbox-section") ||
              document.querySelector(".stagger-grid");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="self-start mt-1 inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-white px-5 py-2 md:px-7 md:py-3 rounded-xl font-bold text-[clamp(0.65rem,2vw,0.9rem)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-crimson/20"
        >
          <span>تصفح المتجر الآن</span>
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </motion.button>
      </div>
    </div>
  );
}

/* --- Slide 3: Products Showcase --- */
function ProductsSlide() {
  const products = [
    {
      name: "Xbox Game Pass",
      img: "/images/products/gamepass-product.jpg",
      tag: "الأكثر طلباً",
    },
    {
      name: "PlayStation",
      img: "/images/products/playstation-product.jpg",
      tag: "بطاقات",
    },
    {
      name: "Steam",
      img: "/images/products/steam-product.jpg",
      tag: "رصيد",
    },
  ];

  return (
    <div className="relative z-10 flex flex-col justify-center h-full px-5 md:px-12 lg:px-20 py-6 md:py-10">
      <div className="flex flex-col gap-3 md:gap-5 max-w-3xl">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-[clamp(1rem,3.5vw,2rem)] font-black text-white leading-tight"
        >
          منتجاتنا <span className="text-crimson">المميزة</span>
        </motion.h2>

        {/* Products Row */}
        <div className="flex gap-2 md:gap-4 overflow-hidden">
          {products.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.15 + i * 0.1,
              }}
              className="flex-1 min-w-0 bg-white/5 border border-white/8 rounded-xl overflow-hidden backdrop-blur-sm group"
            >
              <div className="relative aspect-[4/3] md:aspect-video overflow-hidden">
                <img
                  src={assetPath(p.img)}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-crimson/90 rounded-md">
                  <span className="text-white text-[7px] md:text-[10px] font-bold">
                    {p.tag}
                  </span>
                </div>
                <div className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2">
                  <span className="text-white font-bold text-[clamp(0.55rem,1.6vw,0.8rem)]">
                    {p.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          onClick={() => {
            const el =
              document.getElementById("xbox-section") ||
              document.querySelector(".stagger-grid");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="self-start mt-1 inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-white px-5 py-2 md:px-7 md:py-3 rounded-xl font-bold text-[clamp(0.65rem,2vw,0.9rem)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-crimson/20"
        >
          <span>عرض جميع المنتجات</span>
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </motion.button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN CAROUSEL COMPONENT
   ═══════════════════════════════════════════ */

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: "rtl" },
    [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full pt-3 pb-4 md:pt-6 md:pb-8">
      <div className="container mx-auto px-3 md:px-4">
        {/* Slider Container */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-navy-dark h-[220px] md:h-[400px] lg:h-[440px]">
          {/* Embla Viewport */}
          <div className="overflow-hidden h-full w-full" ref={emblaRef} dir="rtl">
            <div className="flex h-full w-full touch-pan-y">
              {slides.map((slide, index) => {
                const isActive = index === selectedIndex;

                return (
                  <div
                    key={slide.id}
                    className="relative flex-[0_0_100%] min-w-0 h-full"
                  >
                    {/* Background */}
                    <div className="absolute inset-0">
                      <img
                        src={assetPath(slide.bgImage)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          transform: isActive ? "scale(1.02)" : "scale(1.06)",
                          transition:
                            "transform 5s cubic-bezier(0.25, 1, 0.5, 1)",
                        }}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      {/* Dark overlay for readability */}
                      <div
                        className={`absolute inset-0 ${
                          slide.type === "community"
                            ? "bg-gradient-to-l from-transparent via-black/50 to-black/80"
                            : "bg-gradient-to-l from-black/30 via-black/60 to-black/85"
                        }`}
                      />
                      {/* Bottom fade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Content — unique per slide type */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <React.Fragment key={`slide-content-${slide.id}`}>
                          {slide.type === "community" && <CommunitySlide />}
                          {slide.type === "features" && <FeaturesSlide />}
                          {slide.type === "products" && <ProductsSlide />}
                        </React.Fragment>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows — small, inside edges */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1.5 right-1.5 md:left-4 md:right-4 flex justify-between pointer-events-none z-20">
            <button
              onClick={scrollPrev}
              className="pointer-events-auto w-7 h-7 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-90"
              aria-label="السابق"
            >
              <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="pointer-events-auto w-7 h-7 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-90"
              aria-label="التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Pill Pagination — bottom center */}
          <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center z-20">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all duration-400 ease-out rounded-full ${
                    selectedIndex === index
                      ? "w-5 md:w-7 h-1.5 md:h-2 bg-crimson"
                      : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`شريحة ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
            <motion.div
              key={selectedIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-crimson/80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
