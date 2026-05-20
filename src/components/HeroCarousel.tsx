"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
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
  CreditCard,
} from "lucide-react";
import { assetPath } from "@/lib/utils";

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const AUTOPLAY_DELAY = 5000;

const FB_GROUP_URL =
  "https://www.facebook.com/groups/1529268571110105/?ref=share_group_link";

/* ═══════════════════════════════════════════
   ANIMATION PRESETS — subtle & premium
   ═══════════════════════════════════════════ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] as const, delay },
});

/* ═══════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════ */

interface SlideData {
  id: number;
  type: "community" | "features" | "products";
  bgImage: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    type: "community",
    bgImage: "/images/xbox-community-banner.png",
  },
  {
    id: 2,
    type: "features",
    bgImage: "/images/products/xbox-bg.jpg",
  },
  {
    id: 3,
    type: "products",
    bgImage: "/images/products/gamepass-bg.jpg",
  },
];

/* ═══════════════════════════════════════════
   SLIDE 1 — COMMUNITY (Facebook Group)
   ═══════════════════════════════════════════ */

function CommunitySlide() {
  return (
    <div className="hero-safe-area">
      {/* Top section: badge + title + subtitle */}
      <div className="flex flex-col gap-1.5 md:gap-3 flex-1 min-w-0">
        <motion.div
          {...fadeUp(0)}
          className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-white/8 border border-white/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
          <span className="text-white/60 text-[10px] md:text-xs font-semibold">
            مجتمع ضخم وموثوق
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(0.04)}
          className="text-[clamp(1.05rem,3.8vw,2.2rem)] font-black text-white leading-[1.25]"
        >
          انضم إلى أكبر مجتمع
          <br />
          <span className="text-crimson">Xbox</span> في ليبيا
        </motion.h2>

        <motion.p
          {...fadeUp(0.08)}
          className="text-white/40 text-[clamp(0.6rem,2vw,0.85rem)] font-medium"
        >
          +10,000 عضو حقيقي وتفاعل يومي
        </motion.p>
      </div>

      {/* Bottom row: CTA left, stats right */}
      <motion.div
        {...fadeUp(0.1)}
        className="flex items-end justify-between gap-3 mt-auto"
      >
        {/* CTA Button */}
        <a
          href={FB_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2.5 md:px-6 md:py-3 rounded-2xl font-bold text-[clamp(0.62rem,1.8vw,0.85rem)] transition-all duration-300 hover:brightness-110 active:scale-[0.97] shadow-lg shadow-blue-600/25 min-h-[40px] md:min-h-[48px] whitespace-nowrap"
        >
          <span>الدخول إلى المجموعة</span>
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
        </a>

        {/* Stats Card */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 md:px-4 md:py-2.5 flex-shrink-0">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-crimson/20 flex items-center justify-center flex-shrink-0">
            <Users className="w-3 h-3 md:w-4 md:h-4 text-crimson" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-black text-xs md:text-base">
              +10,000
            </span>
            <span className="text-white/35 text-[7px] md:text-[10px] font-medium">
              عضو حقيقي
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 2 — STORE FEATURES
   ═══════════════════════════════════════════ */

function FeaturesSlide() {
  const features = [
    { icon: Zap, label: "تفعيل فوري" },
    { icon: CreditCard, label: "أسعار تنافسية" },
    { icon: ShieldCheck, label: "منتجات أصلية" },
    { icon: Headset, label: "دعم فني سريع" },
  ];

  return (
    <div className="hero-safe-area">
      {/* Title */}
      <div className="flex flex-col gap-1.5 md:gap-3">
        <motion.h2
          {...fadeUp(0)}
          className="text-[clamp(1rem,3.5vw,2rem)] font-black text-white leading-tight"
        >
          لماذا <span className="text-crimson">MD218.LY</span>؟
        </motion.h2>

        <motion.p
          {...fadeUp(0.03)}
          className="text-white/40 text-[clamp(0.6rem,1.8vw,0.8rem)] font-medium"
        >
          متجرك الموثوق لمنتجات Xbox والبطاقات الرقمية
        </motion.p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-1.5 md:gap-3 flex-1">
        {features.map((f, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.04 + i * 0.03)}
            className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-2.5 py-2 md:px-4 md:py-3"
          >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-crimson/15 flex items-center justify-center flex-shrink-0">
              <f.icon className="w-3 h-3 md:w-4 md:h-4 text-crimson" />
            </div>
            <span className="text-white/80 font-bold text-[clamp(0.55rem,1.6vw,0.8rem)] leading-tight">
              {f.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div {...fadeUp(0.15)}>
        <button
          onClick={() => {
            const el =
              document.getElementById("xbox-section") ||
              document.querySelector(".stagger-grid");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 bg-crimson text-white px-4 py-2.5 md:px-6 md:py-3 rounded-2xl font-bold text-[clamp(0.62rem,1.8vw,0.85rem)] transition-all duration-300 hover:brightness-110 active:scale-[0.97] shadow-lg shadow-crimson/20 min-h-[40px] md:min-h-[48px]"
        >
          <span>تصفح المتجر الآن</span>
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 3 — FEATURED PRODUCTS
   ═══════════════════════════════════════════ */

function ProductsSlide() {
  const products = [
    { name: "Game Pass", img: "/images/products/gamepass-product.jpg", tag: "الأكثر طلباً" },
    { name: "PlayStation", img: "/images/products/playstation-product.jpg", tag: "بطاقات" },
    { name: "Steam", img: "/images/products/steam-product.jpg", tag: "رصيد" },
  ];

  return (
    <div className="hero-safe-area">
      {/* Title */}
      <motion.h2
        {...fadeUp(0)}
        className="text-[clamp(1rem,3.5vw,2rem)] font-black text-white leading-tight"
      >
        منتجاتنا <span className="text-crimson">المميزة</span>
      </motion.h2>

      {/* Products Row */}
      <div className="flex gap-2 md:gap-3 flex-1 min-h-0">
        {products.map((p, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.04 + i * 0.03)}
            className="flex-1 min-w-0 bg-white/5 border border-white/8 rounded-xl overflow-hidden"
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={assetPath(p.img)}
                alt={p.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute top-1 right-1 md:top-2 md:right-2 px-1.5 py-0.5 bg-crimson/90 rounded text-white text-[6px] md:text-[9px] font-bold">
                {p.tag}
              </span>
              <span className="absolute bottom-1 right-1 md:bottom-2 md:right-2 text-white font-bold text-[clamp(0.5rem,1.4vw,0.75rem)]">
                {p.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div {...fadeUp(0.12)}>
        <button
          onClick={() => {
            const el =
              document.getElementById("xbox-section") ||
              document.querySelector(".stagger-grid");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 bg-crimson text-white px-4 py-2.5 md:px-6 md:py-3 rounded-2xl font-bold text-[clamp(0.62rem,1.8vw,0.85rem)] transition-all duration-300 hover:brightness-110 active:scale-[0.97] shadow-lg shadow-crimson/20 min-h-[40px] md:min-h-[48px]"
        >
          <span>عرض جميع المنتجات</span>
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE RENDERER — maps type to component
   ═══════════════════════════════════════════ */

const slideComponents: Record<string, React.FC> = {
  community: CommunitySlide,
  features: FeaturesSlide,
  products: ProductsSlide,
};

/* ═══════════════════════════════════════════
   MAIN CAROUSEL
   ═══════════════════════════════════════════ */

export default function HeroCarousel() {
  const autoplayRef = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: "rtl",
      align: "start",
      containScroll: false,
      dragFree: false,
    },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  /* --- Track selected slide --- */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgress(0);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  /* --- Progress bar timer synced with autoplay --- */
  useEffect(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);

    const step = 50; // ms
    const totalSteps = AUTOPLAY_DELAY / step;
    let current = 0;

    progressTimer.current = setInterval(() => {
      current++;
      setProgress((current / totalSteps) * 100);
      if (current >= totalSteps) {
        current = 0;
        setProgress(0);
      }
    }, step);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [selectedIndex]);

  return (
    <section className="relative w-full pt-3 pb-3 md:pt-5 md:pb-6">
      <div className="container mx-auto px-3 md:px-4">
        {/* ── Slider Container ── */}
        <div
          className="relative rounded-2xl md:rounded-3xl border border-white/8 bg-navy-dark shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          style={{ isolation: "isolate", overflow: "hidden" }}
        >
          {/* Embla Viewport — strict clipping */}
          <div
            ref={emblaRef}
            dir="rtl"
            style={{ overflow: "hidden", width: "100%", position: "relative" }}
          >
            <div
              className="touch-pan-y"
              style={{ display: "flex", backfaceVisibility: "hidden", willChange: "transform" }}
            >
              {slides.map((slide, index) => {
                const isActive = index === selectedIndex;
                const SlideContent = slideComponents[slide.type];

                return (
                  <div
                    key={slide.id}
                    className="relative h-[220px] md:h-[380px] lg:h-[420px]"
                    style={{ flex: "0 0 100%", minWidth: 0, maxWidth: "100%", overflow: "hidden" }}
                  >
                    {/* ── Background Image ── */}
                    <img
                      src={assetPath(slide.bgImage)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform: isActive ? "scale(1.04)" : "scale(1.0)",
                        transition: "transform 6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      loading={index === 0 ? "eager" : "lazy"}
                      draggable={false}
                    />

                    {/* ── Dark Overlay ── */}
                    <div
                      className={`absolute inset-0 ${
                        slide.type === "community"
                          ? "bg-gradient-to-l from-transparent via-black/40 to-black/75"
                          : "bg-gradient-to-l from-black/20 via-black/55 to-black/80"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                    {/* ── Content ── */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          key={`content-${slide.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0"
                        >
                          <SlideContent />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Navigation Arrows ── */}
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 -translate-y-1/2 left-1.5 md:left-3 z-20 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
            aria-label="السابق"
          >
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 -translate-y-1/2 right-1.5 md:right-3 z-20 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
            aria-label="التالي"
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          {/* ── Pagination Dots ── */}
          <div className="absolute bottom-2.5 md:bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.04] shadow-premium">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`rounded-full transition-all duration-500 ease-premium ${
                  selectedIndex === i
                    ? "w-6 md:w-8 h-1.5 bg-crimson shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`شريحة ${i + 1}`}
              />
            ))}
          </div>

          {/* ── Progress Bar ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
            <div
              className="h-full bg-crimson/70 transition-[width] duration-[50ms] linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
