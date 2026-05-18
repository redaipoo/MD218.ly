"use client";

import Link from "next/link";
import { assetPath } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-navy-dark overflow-hidden mt-16">
      {/* Decorative top gradient border */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Ambient decorative elements */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-crimson/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[10%] w-56 h-56 bg-crimson/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-14 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Logo & Description */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow-crimson ring-2 ring-crimson/15">
                <img src={assetPath("/logo.png")} alt="MD218.LY" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-2xl leading-tight tracking-wider">
                  MD<span className="text-crimson">218</span>
                </span>
                <span className="text-crimson-light text-xs font-bold -mt-0.5 tracking-[0.3em]">.LY</span>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-[1.8] max-w-xs mx-auto md:mx-0">
              MD218.LY متجرك الأول لبطاقات الألعاب والهدايا الرقمية.
              اختر منتجك وأرسل طلبك مباشرة عبر واتساب.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-5">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-crimson/15 border-2 border-crimson/30" />
                <div className="w-8 h-8 rounded-full bg-crimson/15 border-2 border-crimson/30" />
                <div className="w-8 h-8 rounded-full bg-crimson/15 border-2 border-crimson/30" />
              </div>
              <span className="text-white/40 text-sm font-medium">+10,000 عميل سعيد</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-black text-base mb-5 pb-2.5 border-b border-crimson/20 inline-block">
              روابط سريعة
            </h4>
            <ul className="space-y-3.5">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/category/xbox", label: "اكس بوكس" },
                { href: "/category/playstation", label: "بلايستيشن" },
                { href: "/category/steam", label: "ستيم" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-all duration-300 ease-premium text-sm"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-crimson/60 transition-all duration-300 ease-premium" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-black text-base mb-5 pb-2.5 border-b border-crimson/20 inline-block">
              تواصل معنا
            </h4>
            <a
              href="https://wa.me/218920397465"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600/10 border border-green-500/15 text-green-400/90 hover:bg-green-600/20 hover:text-green-300 hover:border-green-500/25 px-5 py-3.5 rounded-xl transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(34,197,94,0.1)]"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold text-sm">واتساب: +218 92-0397465</span>
            </a>

            {/* Social Links */}
            <div className="mt-7">
              <h5 className="text-white/35 text-xs font-bold mb-3.5 tracking-wide">تابعنا</h5>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <a
                  href="https://www.facebook.com/p/LY-MD-218-61574215798589/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-crimson/30 hover:bg-crimson/10 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,26,26,0.15)]"
                >
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-crimson/30 hover:bg-crimson/10 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,26,26,0.15)]"
                >
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a
                  href="https://wa.me/218920397465"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-crimson/30 hover:bg-crimson/10 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,26,26,0.15)]"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright — premium separator */}
        <div className="mt-12 pt-8 border-t border-white/[0.04] text-center">
          <p className="text-white/25 text-sm font-medium tracking-wide">
            © 2026 MD218.LY - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
