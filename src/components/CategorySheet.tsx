"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2, Gift, CreditCard, Play, Film, MonitorPlay, MousePointer2, Smartphone } from "lucide-react";
import type { Category } from "@/lib/products";

// Map category IDs to specific icons
const getCategoryIcon = (id: string, defaultIcon: string) => {
  switch (id) {
    case "xbox": return <Gamepad2 className="w-11 h-11 text-white" />;
    case "playstation": return <Play className="w-11 h-11 text-white" />;
    case "steam": return <MousePointer2 className="w-11 h-11 text-white" />;
    case "pubg": return <Gamepad2 className="w-11 h-11 text-white" />;
    case "apple": return <Smartphone className="w-11 h-11 text-white" />;
    case "gamepass": return <Gamepad2 className="w-11 h-11 text-white" />;
    case "netflix": return <Film className="w-11 h-11 text-white" />;
    case "shahid": return <MonitorPlay className="w-11 h-11 text-white" />;
    case "shein": return <Gift className="w-11 h-11 text-white" />;
    case "razer": return <CreditCard className="w-11 h-11 text-white" />;
    default: return <span className="text-4xl">{defaultIcon}</span>;
  }
};

export default function CategorySheet({ categories = [] }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Listen for open-categories custom event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsClosing(false);
      // Optional: Prevent body scrolling when open
      document.body.style.overflow = "hidden";
    };
    window.addEventListener("open-categories", handleOpen);
    return () => window.removeEventListener("open-categories", handleOpen);
  }, []);

  const closeSheet = () => {
    setIsClosing(true);
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      document.body.style.overflow = "";
    }, 350); // Matches animation duration
  };

  const handleCategoryClick = (categoryId: string) => {
    // Vibrate if supported
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    closeSheet();
    
    // Slight delay to allow sheet to start closing before navigating
    setTimeout(() => {
      router.push(`/category/${categoryId}`);
    }, 150);
  };

  // Drag down to close functionality
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const y = e.touches[0].clientY;
    if (y > startY) {
      setCurrentY(y - startY);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      closeSheet();
    }
    setCurrentY(0);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-auto">
      {/* Dark Overlay */}
      <div 
        className={`absolute inset-0 bg-black/55 backdrop-blur-[8px] transition-opacity duration-350 ${
          isClosing ? "opacity-0" : "animate-sheet-overlay"
        }`}
        onClick={closeSheet}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`relative w-full max-h-[85vh] flex flex-col transition-transform duration-350 ${
          isClosing ? "translate-y-full" : "animate-sheet-slide-up"
        }`}
        style={{
          background: "linear-gradient(180deg, #120000, #1b0000, #090000)",
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -10px 40px rgba(255, 0, 0, 0.15)",
          transform: currentY > 0 ? `translateY(${currentY}px)` : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-4 pb-2 w-full cursor-grab active:cursor-grabbing">
          <div className="w-[60px] h-[6px] rounded-full bg-white/25" />
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto px-4 pb-8 safe-area-bottom custom-scrollbar">
          <div className="mb-6 mt-2">
            <h2 className="text-white text-2xl font-black mb-1">تصفح الأقسام</h2>
            <p className="text-white/50 text-sm">اختر بطاقتك المفضلة بأسعار منافسة</p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative flex flex-col items-center justify-center text-center w-full animate-category-card"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(0, 255, 0, 0.15)",
                  boxShadow: "0 0 25px rgba(0, 255, 0, 0.08)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "24px",
                  padding: "22px",
                  transition: "all 0.3s ease",
                  animationDelay: `${index * 50}ms`, // Staggered entrance
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 0 35px rgba(0, 255, 0, 0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 255, 0, 0.08)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(2px) scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                }}
              >
                {/* Icon Wrapper */}
                <div className="mb-3 relative">
                  <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
                  {getCategoryIcon(category.id, category.icon)}
                </div>
                
                <h3 className="text-white text-[22px] font-[800] leading-tight mb-1">
                  {category.name}
                </h3>
                <span className="text-white opacity-75 text-[11px] uppercase tracking-widest font-bold">
                  {category.nameEn}
                </span>
              </button>
            ))}
          </div>
          
          {/* Spacer to ensure nothing overlaps with mobile nav if open */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
}
