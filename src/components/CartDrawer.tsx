"use client";

import { X, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MESSENGER_PAGE_ID = "61574215798589";

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, paymentMethod, removeItem, updateQuantity, clearCart } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const currencyLabel = paymentMethod === 'lyd' ? 'د.ل' : 'رصيد ليبيانا';
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = paymentMethod === 'lyd' ? item.priceLYD : item.priceLibyana;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const sendToMessenger = () => {
    if (items.length === 0) return;

    // Build the invoice message
    let message = `🧾 فاتورة طلب جديد\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;

    items.forEach((item, index) => {
      const itemPrice = paymentMethod === 'lyd' ? item.priceLYD : item.priceLibyana;
      message += `${index + 1}. ${item.name}`;
      if (item.region) message += ` (${item.region})`;
      message += `\n`;
      message += `   📦 الفئة: ${item.value}\n`;
      message += `   🔢 الكمية: ${item.quantity}\n`;
      message += `   💰 السعر: ${itemPrice * item.quantity} ${currencyLabel}\n`;
      if (index < items.length - 1) message += `───────────────────\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `💵 الإجمالي: ${totalPrice} ${currencyLabel}\n`;
    message += `💳 طريقة الدفع: ${paymentMethod === 'lyd' ? 'دينار ليبي' : 'رصيد ليبيانا'}\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `📱 MD 218 LY`;

    const encodedMessage = encodeURIComponent(message);
    const messengerUrl = `https://m.me/${MESSENGER_PAGE_ID}?text=${encodedMessage}`;
    window.open(messengerUrl, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-navy-dark/95 backdrop-blur-xl border-r border-white/[0.06] z-[70] transform transition-transform duration-[400ms] ease-premium flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300 ease-premium"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-white font-black text-lg tracking-wide">
            🛒 السلة ({totalItems})
          </h2>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-5 opacity-80">🛒</div>
              <p className="text-white/50 text-lg font-bold">السلة فارغة</p>
              <p className="text-white/30 text-sm mt-1.5">أضف بعض المنتجات للبدء</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.value}`}
                className="bg-navy-light/60 rounded-xl border border-white/[0.05] p-4 animate-fade-in-up shadow-premium"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">{item.name}</h3>
                    {item.region && (
                      <p className="text-white/40 text-xs mt-0.5">{item.region}</p>
                    )}
                    <p className="text-crimson-light font-bold text-sm mt-1.5">{item.value}</p>
                    <p className="text-gold-light font-black text-xs mt-1">
                      السعر: {paymentMethod === 'lyd' ? item.priceLYD : item.priceLibyana} {currencyLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.value)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ease-premium flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3.5">
                  <div className="flex items-center gap-0 bg-navy/80 rounded-xl border border-white/[0.06] overflow-hidden shadow-inner-glow">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.value, Math.max(1, item.quantity - 1))
                      }
                      className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200 ease-premium"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-white text-sm font-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.value, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200 ease-premium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/[0.06] space-y-3 bg-navy-dark/80 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-white/60 font-bold text-sm">الإجمالي:</span>
              <span className="text-gold-light font-black text-xl">{totalPrice} {currencyLabel}</span>
            </div>
            <button
              onClick={clearCart}
              className="w-full py-2.5 text-sm text-red-400/60 hover:text-red-400 transition-colors duration-200"
            >
              مسح السلة
            </button>
            <button
              onClick={sendToMessenger}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 ease-premium shadow-[0_4px_20px_rgba(59,130,246,0.2)] hover:shadow-[0_6px_28px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.17 7.21V22l2.93-1.63c.84.23 1.72.36 2.63.36.2 0 .4 0 .6-.02-.13-.5-.2-1.02-.2-1.56 0-4.82 4.17-8.73 9.31-8.73.32 0 .63.02.94.05C20.94 5.94 16.89 2 12 2zm1.07 6.81L10.93 11.5 6.5 8.81l4.87 5.19 2.07-2.63 4.43 2.63-4.8-5.19z"/></svg>
              أطلب عبر ماسنجر
            </button>
          </div>
        )}
      </div>
    </>
  );
}
