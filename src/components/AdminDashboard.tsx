"use client";

import { useState } from "react";
import type { Category, SubCategory, Denomination } from "@/lib/products";
import { Lock, Save, Plus, Trash2, Edit3, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, LogOut, ArrowUp, ArrowDown } from "lucide-react";
import AdminSharedAccounts from "./AdminSharedAccounts";
import AdminXboxGames from "./AdminXboxGames";
import AdminNewCategory from "./AdminNewCategory";
import { uploadImageToGitHub } from "@/lib/github-upload";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [data, setData] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    const token = password.trim();
    if (!token.startsWith("ghp_") && !token.startsWith("github_pat_")) {
      setLoginError("رمز قيت هب (Token) غير صالح. يجب أن يبدأ بـ ghp_ أو github_pat_");
      setIsLoading(false);
      return;
    }

    try {
      const owner = "redaipoo";
      const repo = "MD218.ly";
      const filePath = "src/data/categories.json";
      const branch = "main";

      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3.raw" 
        },
        cache: "no-store"
      });

      if (res.ok) {
        const freshData = await res.json();
        setData(freshData);
        setIsLoggedIn(true);
      } else {
        const errText = await res.text();
        console.error("Login fetch error:", errText);
        setLoginError("فشل تسجيل الدخول. تأكد من صحة الرمز (Token) وصلاحياته للقراءة والكتابة في مستودع redaipoo/MD218.ly");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(`حدث خطأ في الاتصال: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const owner = "redaipoo";
      const repo = "MD218.ly";
      const filePath = "src/data/categories.json";
      const branch = "main";
      const githubToken = password.trim();

      if (!githubToken) {
        setMessage({ text: "Please fill all fields!", type: "error" });
        setIsSaving(false);
        return;
      }

      const getResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        cache: 'no-store'
      });

      if (!getResponse.ok) {
        throw new Error(`Failed to fetch file: ${getResponse.status}`);
      }

      const fileData = await getResponse.json();
      const currentSha = fileData.sha;

      const newContent = JSON.stringify(data, null, 2);
      const updatedContent = btoa(unescape(encodeURIComponent(newContent)));

      const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: "Update price via Admin page",
          content: updatedContent,
          sha: currentSha,
          branch: branch
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update file: ${updateResponse.status}`);
      }

      setMessage({ text: "✅ تم تحديث الأسعار بنجاح!", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: `❌ خطأ: ${error instanceof Error ? error.message : String(error)}`, type: "error" });
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

  const updateCategoryField = (catId: string, field: keyof Category, value: string) => {
    if (!data) return;
    const newData = data.map(c => {
      if (c.id !== catId) return c;
      return { ...c, [field]: value };
    });
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

  // Move category up/down
  const moveCategory = (catId: string, direction: "up" | "down") => {
    if (!data) return;
    const idx = data.findIndex(c => c.id === catId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === data.length - 1) return;
    const newData = [...data];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newData[idx], newData[swapIdx]] = [newData[swapIdx], newData[idx]];
    setData(newData);
  };

  // Delete entire category
  const deleteCategory = (catId: string) => {
    if (!data) return;
    if (!confirm("هل أنت متأكد من حذف هذا القسم بالكامل؟")) return;
    setData(data.filter(c => c.id !== catId));
  };

  // Delete sub-category
  const deleteSubCategory = (catId: string, subId: string) => {
    if (!data) return;
    if (!confirm("هل أنت متأكد من حذف هذا الريجن؟")) return;
    setData(data.map(c => c.id === catId ? { ...c, subCategories: c.subCategories.filter(s => s.id !== subId) } : c));
  };

  // Add new sub-category (region)
  const addSubCategory = (catId: string, region: string, currency: string) => {
    if (!data || !region.trim()) return;
    const newData = data.map(c => {
      if (c.id !== catId) return c;
      const subId = `${catId}-${currency.toLowerCase() || "sub"}-${Date.now()}`;
      return { ...c, subCategories: [...c.subCategories, { id: subId, region, currency, denominations: [] }] };
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
          
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start gap-2 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxx..."
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all text-center tracking-widest text-sm"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-crimson hover:bg-crimson-dark disabled:bg-crimson/50 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-crimson/30 flex items-center justify-center gap-2"
            >
              {isLoading ? "جاري التحقق..." : "دخول"}
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
              {isSaving ? "جاري الحفظ..." : "حفظ البطاقات"}
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

        {/* ===== Shared Accounts Section ===== */}
        <div className="mb-6">
          <h2 className="text-white/30 text-xs font-bold mb-3 tracking-widest">🎮 إدارة الحسابات المشتركة</h2>
          <AdminSharedAccounts token={password.trim()} />
        </div>

        {/* ===== Xbox Games Section ===== */}
        <div className="mb-6">
          <h2 className="text-white/30 text-xs font-bold mb-3 tracking-widest">🕹️ إدارة ألعاب Xbox (شراء في حسابك + حسابات كاملة)</h2>
          <AdminXboxGames token={password.trim()} />
        </div>

        {/* ===== Cards Section ===== */}
        <div className="mb-6">
          <h2 className="text-white/30 text-xs font-bold mb-3 tracking-widest">💳 إدارة البطاقات والأسعار</h2>
          <div className="grid grid-cols-1 gap-4">
            {data.map((cat, catIdx) => (
              <div key={cat.id} className="bg-navy-dark border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                {/* Category Header */}
                <div className="p-4 md:p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                    <div className="text-3xl">{cat.icon}</div>
                    <div>
                      <h2 className="text-white font-bold text-lg">{cat.name}</h2>
                      <span className="text-white/40 text-xs">{cat.subCategories.length} أقسام فرعية</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveCategory(cat.id, 'up')} disabled={catIdx === 0} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 flex items-center justify-center text-white/60 transition-all" title="تحريك لأعلى"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveCategory(cat.id, 'down')} disabled={catIdx === data.length - 1} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 flex items-center justify-center text-white/60 transition-all" title="تحريك لأسفل"><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteCategory(cat.id)} className="w-8 h-8 rounded bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 transition-all" title="حذف القسم"><Trash2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 transition-all">
                      {expandedCat === cat.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Category Content */}
                {expandedCat === cat.id && (
                  <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
                    {/* Category Details & Image Uploads */}
                    <div className="bg-navy p-4 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-white/60 text-xs font-bold mb-2">⚙️ إعدادات القسم والصور</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-white/50 mb-1">الاسم بالعربي</label>
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => updateCategoryField(cat.id, 'name', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-white/50 mb-1">الاسم بالإنجليزي</label>
                          <input
                            type="text"
                            value={cat.nameEn || ""}
                            onChange={(e) => updateCategoryField(cat.id, 'nameEn', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {/* Logo Upload */}
                        <div className="bg-black/10 p-3 rounded-lg border border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white/50">شعار القسم (الدائري)</span>
                            {cat.logoUrl && <img src={cat.logoUrl} className="w-8 h-8 rounded-full object-cover border border-white/10" alt="" />}
                          </div>
                          <input
                            type="text"
                            value={cat.logoUrl || ""}
                            onChange={(e) => updateCategoryField(cat.id, 'logoUrl', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white/70 focus:border-crimson text-left"
                            dir="ltr"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setMessage({ text: "جاري رفع الشعار إلى GitHub...", type: "success" });
                                const ext = file.name.split(".").pop() || "png";
                                const dest = `public/images/products/${cat.id}.${ext}`;
                                const url = await uploadImageToGitHub(file, dest, password.trim(), `Update logo for ${cat.id}`);
                                updateCategoryField(cat.id, 'logoUrl', url);
                                setMessage({ text: "✅ تم رفع الشعار وتحديث الرابط بنجاح! لا تنسى النقر على 'حفظ البطاقات' لحفظ التغييرات في المستودع.", type: "success" });
                              } catch (err) {
                                setMessage({ text: `❌ خطأ في رفع الشعار: ${err instanceof Error ? err.message : String(err)}`, type: "error" });
                              }
                            }}
                            className="text-[10px] text-white/50 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-crimson/20 file:text-crimson hover:file:bg-crimson/30 cursor-pointer"
                          />
                        </div>

                        {/* Product Image Upload */}
                        <div className="bg-black/10 p-3 rounded-lg border border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white/50">صورة الواجهة (البطاقة)</span>
                            {cat.productImageUrl && <img src={cat.productImageUrl} className="w-8 h-8 rounded object-cover border border-white/10" alt="" />}
                          </div>
                          <input
                            type="text"
                            value={cat.productImageUrl || ""}
                            onChange={(e) => updateCategoryField(cat.id, 'productImageUrl', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white/70 focus:border-crimson text-left"
                            dir="ltr"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setMessage({ text: "جاري رفع الصورة إلى GitHub...", type: "success" });
                                const ext = file.name.split(".").pop() || "jpg";
                                const dest = `public/images/products/${cat.id}-product.${ext}`;
                                const url = await uploadImageToGitHub(file, dest, password.trim(), `Update product image for ${cat.id}`);
                                updateCategoryField(cat.id, 'productImageUrl', url);
                                setMessage({ text: "✅ تم رفع صورة الواجهة وتحديث الرابط بنجاح! لا تنسى النقر على 'حفظ البطاقات' لحفظ التغييرات في المستودع.", type: "success" });
                              } catch (err) {
                                setMessage({ text: `❌ خطأ في رفع الصورة: ${err instanceof Error ? err.message : String(err)}`, type: "error" });
                              }
                            }}
                            className="text-[10px] text-white/50 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-crimson/20 file:text-crimson hover:file:bg-crimson/30 cursor-pointer"
                          />
                        </div>

                        {/* Background Cover Image Upload */}
                        <div className="bg-black/10 p-3 rounded-lg border border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white/50">صورة الغلاف (الخلفية)</span>
                            {cat.bgUrl && <img src={cat.bgUrl} className="w-8 h-8 rounded object-cover border border-white/10" alt="" />}
                          </div>
                          <input
                            type="text"
                            value={cat.bgUrl || ""}
                            onChange={(e) => updateCategoryField(cat.id, 'bgUrl', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white/70 focus:border-crimson text-left"
                            dir="ltr"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setMessage({ text: "جاري رفع صورة الغلاف إلى GitHub...", type: "success" });
                                const ext = file.name.split(".").pop() || "jpg";
                                const dest = `public/images/products/${cat.id}-bg.${ext}`;
                                const url = await uploadImageToGitHub(file, dest, password.trim(), `Update bg image for ${cat.id}`);
                                updateCategoryField(cat.id, 'bgUrl', url);
                                setMessage({ text: "✅ تم رفع صورة الغلاف وتحديث الرابط بنجاح! لا تنسى النقر على 'حفظ البطاقات' لحفظ التغييرات في المستودع.", type: "success" });
                              } catch (err) {
                                setMessage({ text: `❌ خطأ في رفع صورة الغلاف: ${err instanceof Error ? err.message : String(err)}`, type: "error" });
                              }
                            }}
                            className="text-[10px] text-white/50 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-crimson/20 file:text-crimson hover:file:bg-crimson/30 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {cat.subCategories.map((sub) => (
                        <div key={sub.id} className="bg-navy border border-white/5 rounded-xl overflow-hidden">
                          
                          {/* Subcategory Header */}
                          <div className="p-4 flex items-center justify-between hover:bg-white/5">
                            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)}>
                              <span className="px-3 py-1 bg-white/10 rounded-md text-white/80 text-sm font-bold">{sub.region}</span>
                              <span className="text-white/50 text-xs">{sub.denominations.length} عناصر</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => deleteSubCategory(cat.id, sub.id)} className="w-7 h-7 rounded bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 transition-all" title="حذف الريجن"><Trash2 className="w-3 h-3" /></button>
                              <button onClick={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)} className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-white/40">
                                {expandedSub === sub.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Denominations List */}
                          {expandedSub === sub.id && (
                            <div className="p-4 border-t border-white/5 space-y-3">
                              {sub.denominations.map((den, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-3 items-end bg-navy-dark p-3 rounded-lg border border-white/5">
                                  <div className="w-full md:w-1/3">
                                    <label className="block text-xs font-bold text-white/50 mb-1">اسم المنتج</label>
                                    <input
                                      type="text"
                                      value={den.label}
                                      onChange={(e) => updateDenomination(cat.id, sub.id, idx, 'label', e.target.value)}
                                      className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson"
                                      placeholder="مثال: 50 TRY"
                                    />
                                  </div>
                                  <div className="flex w-full md:w-2/3 gap-2 items-end">
                                    <div className="flex-1">
                                      <label className="block text-xs font-bold text-green-400/80 mb-1">سعر الدينار الليبي (د.ل)</label>
                                      <input
                                        type="number"
                                        value={den.priceLYD || 0}
                                        onChange={(e) => updateDenomination(cat.id, sub.id, idx, 'priceLYD', e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-green-400 font-bold focus:border-crimson text-left"
                                        placeholder="0"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="block text-xs font-bold text-blue-400/80 mb-1">سعر ليبيانا (د.ل)</label>
                                      <input
                                        type="number"
                                        value={den.priceLibyana || 0}
                                        onChange={(e) => updateDenomination(cat.id, sub.id, idx, 'priceLibyana', e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-blue-400 font-bold focus:border-crimson text-left"
                                        placeholder="0"
                                      />
                                    </div>
                                    <button
                                      onClick={() => deleteDenomination(cat.id, sub.id, idx)}
                                      className="w-10 h-[38px] flex-shrink-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md flex items-center justify-center transition-colors mb-[1px]"
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

                      {/* Add new region */}
                      <AddRegionForm catId={cat.id} onAdd={addSubCategory} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== Add New Category Section ===== */}
        <div className="mb-6">
          <h2 className="text-white/30 text-xs font-bold mb-3 tracking-widest">🆕 إضافة منتجات جديدة</h2>
          <AdminNewCategory token={password.trim()} categories={data} setCategories={setData as (cats: Category[]) => void} />
        </div>
      </div>
    </div>
  );
}

/* Small inline form for adding a region to a category */
function AddRegionForm({ catId, onAdd }: { catId: string; onAdd: (catId: string, region: string, currency: string) => void }) {
  const [show, setShow] = useState(false);
  const [region, setRegion] = useState("");
  const [currency, setCurrency] = useState("");

  if (!show) {
    return (
      <button onClick={() => setShow(true)}
        className="w-full py-2.5 border border-dashed border-white/15 hover:border-crimson/40 rounded-lg text-white/40 hover:text-crimson transition-colors flex items-center justify-center gap-2 text-xs font-bold mt-2">
        <Plus className="w-3.5 h-3.5" /> إضافة ريجن جديد
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-end mt-2 bg-navy-dark p-3 rounded-lg border border-crimson/20">
      <div className="flex-1">
        <label className="block text-[10px] font-bold text-white/50 mb-1">اسم الريجن</label>
        <input type="text" value={region} onChange={e => setRegion(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson" placeholder="مثال: تركي" />
      </div>
      <div className="w-24">
        <label className="block text-[10px] font-bold text-white/50 mb-1">العملة</label>
        <input type="text" value={currency} onChange={e => setCurrency(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-crimson" placeholder="TRY" />
      </div>
      <button onClick={() => { onAdd(catId, region, currency); setRegion(""); setCurrency(""); setShow(false); }}
        className="px-4 py-2 bg-crimson hover:bg-crimson-dark text-white rounded-md text-xs font-bold transition-colors">إضافة</button>
      <button onClick={() => setShow(false)} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/50 rounded-md text-xs transition-colors">إلغاء</button>
    </div>
  );
}
