"use client";

import { X, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "218920397465";

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const sendToWhatsApp = () => {
    if (items.length === 0) return;

    let message = "🛒 *طلب جديد من MD.LY*\n";
    message += "━━━━━━━━━━━━━━━━━━\n\n";

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*`;
      if (item.region) message += ` - ${item.region}`;
      message += `\n   💰 القيمة: ${item.value}`;
      message += `\n   📦 الكمية: ${item.quantity}\n\n`;
    });

    message += "━━━━━━━━━━━━━━━━━━\n";
    message += `📊 إجمالي العناصر: ${totalItems}\n`;
    message += "\nشكراً لاختياركم MD.LY! ✨";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-navy-dark border-r border-border z-[70] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-white font-bold text-lg">
            🛒 السلة ({totalItems})
          </h2>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-white/60 text-lg font-medium">السلة فارغة</p>
              <p className="text-white/40 text-sm mt-1">أضف بعض المنتجات للبدء</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.value}`}
                className="bg-navy-light rounded-xl border border-border/50 p-4 animate-slide-up"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">{item.name}</h3>
                    {item.region && (
                      <p className="text-white/50 text-xs mt-0.5">{item.region}</p>
                    )}
                    <p className="text-crimson-light font-bold text-sm mt-1">{item.value}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.value)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-0 bg-navy rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.value, Math.max(1, item.quantity - 1))
                      }
                      className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-white text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.value, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
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
          <div className="p-4 border-t border-border/50 space-y-3">
            <button
              onClick={clearCart}
              className="w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              مسح السلة
            </button>
            <button
              onClick={sendToWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-green-600/30 hover:shadow-green-500/40 text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              أطلب عبر واتساب
            </button>
          </div>
        )}
      </div>
    </>
  );
}
