"use client";

import { useState, useEffect } from "react";
import type { Category, SubCategory, Denomination } from "@/lib/products";
import { Lock, Save, Plus, Trash2, Edit3, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [data, setData] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  useEffect(() => {
    // We fetch initial data directly from the frontend using the static import for default, 
    // but to get fresh data we can fetch from the local categories.json API or just import it 
    // since it's built statically. Wait, the admin needs the latest data. 
    // We will create a GET route or just import it statically for now since it rebuilds anyway.
    import("@/data/categories.json")
      .then((mod) => {
        setData(mod.default as Category[]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
        setIsLoading(false);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Very simple client side check, real check is on the server when saving
    if (password.length > 3) {
      setIsLoggedIn(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      // Since the site is a Static Export, we communicate with GitHub directly from the browser!
      const owner = "redaipoo";
      const repo = "MD.LY";
      const filePath = "src/data/categories.json";
      const branch = "main";
      const token = password.trim();

      if (!token.startsWith("ghp_") && !token.startsWith("github_pat_")) {
        setMessage({ text: "رمز قيت هب (Token) غير صالح. يجب أن يبدأ بـ ghp_", type: "error" });
        setIsSaving(false);
        return;
      }

      // 1. Get the current file's SHA
      const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json"
        }
      });

      let sha = undefined;
      if (getRes.ok) {
        const getJson = await getRes.json();
        sha = getJson.sha;
      }

      // Encode the content using browser's btoa (handling unicode properly)
      const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

      // 2. Update the file
      const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Admin Panel: Update categories and prices",
          content: encodedContent,
          sha: sha,
          branch: branch
        })
      });

      if (updateRes.ok) {
        setMessage({ text: "تم الحفظ بنجاح! سيتم تحديث الموقع خلال دقيقة.", type: "success" });
      } else {
        const errText = await updateRes.text();
        console.error("GitHub API Error:", errText);
        setMessage({ text: "حدث خطأ أثناء الاتصال بقيت هب. تأكد من صلاحيات الرمز (Token).", type: "error" });
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage({ text: `حدث خطأ في الاتصال: ${error instanceof Error ? error.message : String(error)}`, type: "error" });
    }
    setIsSaving(false);
  };

  const updateDenomination = (
    catId: string, 
    subId: string, 
    denIdx: number, 
    field: keyof Denomination, 
    value: string | number
  ) => {
    if (!data) return;
    const newData = [...data];
    const cat = newData.find(c => c.id === catId);
    if (!cat) return;
    const sub = cat.subCategories.find(s => s.id === subId);
    if (!sub) return;
    
    sub.denominations[denIdx] = {
      ...sub.denominations[denIdx],
      [field]: field.includes('price') ? Number(value) : value
    };
    
    setData(newData);
  };

  const deleteDenomination = (catId: string, subId: string, denIdx: number) => {
    if (!data) return;
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
    
    const newData = [...data];
    const cat = newData.find(c => c.id === catId);
    if (!cat) return;
    const sub = cat.subCategories.find(s => s.id === subId);
    if (!sub) return;
    
    sub.denominations.splice(denIdx, 1);
    setData(newData);
  };

  const addDenomination = (catId: string, subId: string) => {
    if (!data) return;
    const newData = [...data];
    const cat = newData.find(c => c.id === catId);
    if (!cat) return;
    const sub = cat.subCategories.find(s => s.id === subId);
    if (!sub) return;
    
    sub.denominations.push({
      label: "عنصر جديد",
      value: "new",
      priceLYD: 0,
      priceLibyana: 0
    });
    
    setData(newData);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="bg-navy-dark border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-crimson/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-crimson" />
          </div>
          <h1 className="text-2xl font-black text-white text-center mb-2">لوحة التحكم</h1>
          <p className="text-white/50 text-center text-sm mb-8">للحماية، يرجى إدخال <b>رمز قيت هب (GitHub Token)</b> الخاص بك للوصول وإجراء التعديلات</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxx..."
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all text-center tracking-widest text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-crimson hover:bg-crimson-dark text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-crimson/30"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className="min-h-screen bg-navy flex items-center justify-center text-white">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-navy pb-24 font-sans" dir="rtl">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-navy-dark/95 backdrop-blur-xl border-b border-white/10 px-4 py-4 shadow-xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crimson rounded-lg flex items-center justify-center shadow-lg shadow-crimson/30">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg">إدارة المتجر</h1>
              <p className="text-white/50 text-[10px]">MD218.LY Admin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg ${
                isSaving ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 text-white shadow-green-600/30"
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        
        {/* Messages */}
        {message && (
          <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold text-sm">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {data.map((cat) => (
            <div key={cat.id} className="bg-navy-dark border border-white/5 rounded-2xl overflow-hidden shadow-lg">
              {/* Category Header */}
              <div 
                className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{cat.icon}</div>
                  <div>
                    <h2 className="text-white font-bold text-lg">{cat.name}</h2>
                    <span className="text-white/40 text-xs">{cat.subCategories.length} أقسام فرعية</span>
                  </div>
                </div>
                {expandedCat === cat.id ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
              </div>

              {/* Category Content */}
              {expandedCat === cat.id && (
                <div className="p-4 border-t border-white/5 bg-black/20">
                  <div className="space-y-4">
                    {cat.subCategories.map((sub) => (
                      <div key={sub.id} className="bg-navy border border-white/5 rounded-xl overflow-hidden">
                        
                        {/* Subcategory Header */}
                        <div 
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
                          onClick={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-white/10 rounded-md text-white/80 text-sm font-bold">{sub.region}</span>
                            <span className="text-white/50 text-xs">{sub.denominations.length} عناصر</span>
                          </div>
                          {expandedSub === sub.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                        </div>

                        {/* Denominations List */}
                        {expandedSub === sub.id && (
                          <div className="p-4 border-t border-white/5 space-y-3">
                            {sub.denominations.map((den, idx) => (
                              <div key={idx} className="flex flex-col md:flex-row gap-3 items-center bg-navy-dark p-3 rounded-lg border border-white/5">
                                <input
                                  type="text"
                                  value={den.label}
                                  onChange={(e) => updateDenomination(cat.id, sub.id, idx, 'label', e.target.value)}
                                  className="w-full md:w-1/3 bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson"
                                  placeholder="اسم المنتج (مثال: 50 TRY)"
                                />
                                <div className="flex w-full md:w-2/3 gap-2 items-center">
                                  <div className="flex-1 relative">
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">د.ل</span>
                                    <input
                                      type="number"
                                      value={den.priceLYD || 0}
                                      onChange={(e) => updateDenomination(cat.id, sub.id, idx, 'priceLYD', e.target.value)}
                                      className="w-full bg-black/50 border border-white/10 rounded-md pr-10 pl-3 py-2 text-sm text-green-400 font-bold focus:border-crimson text-left"
                                      placeholder="سعر المدار"
                                    />
                                  </div>
                                  <div className="flex-1 relative">
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">د.ل</span>
                                    <input
                                      type="number"
                                      value={den.priceLibyana || 0}
                                      onChange={(e) => updateDenomination(cat.id, sub.id, idx, 'priceLibyana', e.target.value)}
                                      className="w-full bg-black/50 border border-white/10 rounded-md pr-10 pl-3 py-2 text-sm text-blue-400 font-bold focus:border-crimson text-left"
                                      placeholder="سعر ليبيانا"
                                    />
                                  </div>
                                  <button
                                    onClick={() => deleteDenomination(cat.id, sub.id, idx)}
                                    className="w-10 h-10 flex-shrink-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md flex items-center justify-center transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            
                            <button
                              onClick={() => addDenomination(cat.id, sub.id)}
                              className="w-full py-3 border border-dashed border-white/20 hover:border-crimson/50 rounded-lg text-white/50 hover:text-crimson transition-colors flex items-center justify-center gap-2 text-sm font-bold"
                            >
                              <Plus className="w-4 h-4" />
                              إضافة بطاقة جديدة
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
