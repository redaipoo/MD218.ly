"use client";
import { useState } from "react";
import type { Category } from "@/lib/products";
import { Save, Plus, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";

interface Props {
  token: string;
  categories: Category[];
  setCategories: (cats: Category[]) => void;
}

export default function AdminNewCategory({ token, categories, setCategories }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState({
    name: "", nameEn: "", icon: "💳", gradient: "from-purple-600 via-purple-500 to-purple-400"
  });
  const [newRegion, setNewRegion] = useState({ region: "", currency: "" });
  const [newDenom, setNewDenom] = useState({ label: "", value: "", priceLYD: 0, priceLibyana: 0 });

  const owner = "redaipoo", repo = "MD218.ly", branch = "main";
  const filePath = "src/data/categories.json";

  const saveCategories = async (data: Category[]) => {
    setSaving(true); setMsg(null);
    try {
      const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }, cache: "no-store"
      });
      if (!getRes.ok) throw new Error("Failed to fetch");
      const { sha } = await getRes.json();
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Add new category via Admin", content, sha, branch })
      });
      if (!putRes.ok) throw new Error("Failed to save");
      setMsg({ text: "✅ تم حفظ المنتجات بنجاح!", type: "success" });
    } catch (e) {
      setMsg({ text: `❌ خطأ: ${e instanceof Error ? e.message : String(e)}`, type: "error" });
    }
    setSaving(false);
  };

  const addCategory = () => {
    if (!newCat.name.trim() || !newCat.nameEn.trim()) return;
    const id = newCat.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const cat: Category = {
      id, name: newCat.name, nameEn: newCat.nameEn, gradient: newCat.gradient,
      icon: newCat.icon, logoUrl: `/images/products/${id}.png`,
      productImageUrl: `/images/products/${id}-product.jpg`, bgUrl: `/images/products/${id}-bg.jpg`,
      subCategories: []
    };
    const updated = [...categories, cat];
    setCategories(updated);
    setNewCat({ name: "", nameEn: "", icon: "💳", gradient: "from-purple-600 via-purple-500 to-purple-400" });
    setShowForm(false);
  };

  const addSubCategory = (catId: string) => {
    if (!newRegion.region.trim()) return;
    const updated = categories.map(c => {
      if (c.id !== catId) return c;
      const subId = `${catId}-${newRegion.currency.toLowerCase() || "sub"}`;
      return { ...c, subCategories: [...c.subCategories, { id: subId, region: newRegion.region, currency: newRegion.currency, denominations: [] }] };
    });
    setCategories(updated);
    setNewRegion({ region: "", currency: "" });
  };

  const addDenomination = (catId: string, subId: string) => {
    if (!newDenom.label.trim()) return;
    const updated = categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c, subCategories: c.subCategories.map(s => {
          if (s.id !== subId) return s;
          return { ...s, denominations: [...s.denominations, { ...newDenom }] };
        })
      };
    });
    setCategories(updated);
    setNewDenom({ label: "", value: "", priceLYD: 0, priceLibyana: 0 });
  };

  const deleteCategory = (catId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setCategories(categories.filter(c => c.id !== catId));
  };

  return (
    <div className="bg-navy-dark border border-white/5 rounded-2xl overflow-hidden shadow-lg mt-4">
      <div className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className="text-3xl">➕</div>
          <div>
            <h2 className="text-white font-bold text-lg">إضافة منتج بطاقة جديد</h2>
            <span className="text-white/40 text-xs">إضافة نوع بطاقة جديد مثل أمازون</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </div>

      {expanded && (
        <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
          {msg && (
            <div className={`p-3 rounded-xl text-sm font-bold ${msg.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
              {msg.text}
            </div>
          )}

          {/* Add New Category Form */}
          {showForm ? (
            <div className="bg-navy border border-crimson/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-crimson font-bold text-sm">➕ إضافة نوع بطاقة جديد</h3>
                <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-white/50 mb-1">الاسم بالعربي *</label>
                  <input type="text" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson" placeholder="بطاقات أمازون" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-white/50 mb-1">الاسم بالإنجليزي *</label>
                  <input type="text" value={newCat.nameEn} onChange={e => setNewCat({ ...newCat, nameEn: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson" placeholder="AMAZON" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-20">
                  <label className="block text-[10px] font-bold text-white/50 mb-1">أيقونة</label>
                  <input type="text" value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white text-center focus:border-crimson" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-white/50 mb-1">التدرج اللوني</label>
                  <select value={newCat.gradient} onChange={e => setNewCat({ ...newCat, gradient: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson">
                    <option value="from-purple-600 via-purple-500 to-purple-400">بنفسجي</option>
                    <option value="from-orange-600 via-orange-500 to-yellow-500">برتقالي</option>
                    <option value="from-blue-600 via-blue-500 to-blue-400">أزرق</option>
                    <option value="from-red-600 via-red-500 to-red-400">أحمر</option>
                    <option value="from-green-600 via-green-500 to-green-400">أخضر</option>
                    <option value="from-gray-600 via-gray-500 to-gray-400">رمادي</option>
                  </select>
                </div>
              </div>
              <button onClick={addCategory} className="w-full py-2.5 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-lg transition-colors text-sm">
                إضافة المنتج
              </button>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)}
              className="w-full py-3 border border-dashed border-crimson/40 hover:border-crimson rounded-lg text-crimson/70 hover:text-crimson transition-colors flex items-center justify-center gap-2 text-sm font-bold">
              <Plus className="w-4 h-4" /> إضافة نوع بطاقة جديد (مثل أمازون)
            </button>
          )}

          {/* Save */}
          <button onClick={() => saveCategories(categories)} disabled={saving}
            className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${saving ? "bg-white/10 text-white/50" : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30"}`}>
            <Save className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ جميع المنتجات"}
          </button>
        </div>
      )}
    </div>
  );
}
