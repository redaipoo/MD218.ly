"use client";
import { useState } from "react";
import { Save, Plus, Trash2, Edit3, ChevronDown, ChevronUp, X, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { assetPath } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

interface XboxGame {
  id: string;
  title: string;
  titleAr: string;
  image: string;
  priceLYD: number;
  priceLibyana: number;
  originalPriceLYD?: number;
  originalPriceLibyana?: number;
  discountPercent?: number;
  platforms?: string;
  rating?: number;
  durationText?: string;
}

interface FullAccount {
  id: string;
  title: string;
  titleAr: string;
  image: string;
  games: string[];
  gameImages?: string[];
  priceLYD: number;
  priceLibyana: number;
}

interface XboxGamesData {
  buyOnAccount: XboxGame[];
  fullAccounts: FullAccount[];
}

interface Props {
  token: string;
}

export default function AdminXboxGames({ token }: Props) {
  const [data, setData] = useState<XboxGamesData>({ buyOnAccount: [], fullAccounts: [] });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<"buyOnAccount" | "fullAccounts">("buyOnAccount");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  
  // Form state for buyOnAccount
  const [newBuyGame, setNewBuyGame] = useState({
    title: "",
    priceLYD: 15,
    priceLibyana: 20,
    imageUrl: "",
    originalPriceLYD: "",
    originalPriceLibyana: "",
    discountPercent: "",
    platforms: "Series X|S | One",
    rating: "4.5",
    durationText: "تفعيل فوري"
  });
  // Form state for fullAccounts
  const [newFullAccount, setNewFullAccount] = useState({ title: "", games: [""], priceLYD: 30, priceLibyana: 40, imageUrl: "" });

  const owner = "redaipoo", repo = "MD218.ly", branch = "main";
  const filePath = "src/data/xbox-games.json";

  const syncFromGitHub = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3.raw" },
        cache: "no-store"
      });
      if (res.ok) {
        const remoteData = await res.json();
        // Ensure fullAccounts have games array
        if (remoteData.fullAccounts) {
          remoteData.fullAccounts = remoteData.fullAccounts.map((a: FullAccount) => ({
            ...a,
            games: a.games || [a.title]
          }));
        }
        setData(remoteData);
        setMsg({ text: "✅ تم مزامنة البيانات من GitHub", type: "success" });
      } else {
        setMsg({ text: "📝 لا يوجد ملف على GitHub بعد. أضف ألعاب واحفظ لإنشائه.", type: "success" });
      }
    } catch {
      setMsg({ text: "📝 لا يوجد ملف على GitHub بعد. أضف ألعاب واحفظ لإنشائه.", type: "success" });
    }
    setSyncing(false);
  };

  const handleExpand = () => {
    if (!expanded && !loaded) {
      setLoaded(true);
      syncFromGitHub();
    }
    setExpanded(!expanded);
  };

  const saveData = async () => {
    setSaving(true); setMsg(null);
    try {
      const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" }, cache: "no-store"
      });
      
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
      const body: Record<string, string> = { message: "Update xbox games via Admin", content, branch };
      
      if (getRes.ok) {
        const { sha } = await getRes.json();
        body.sha = sha;
      }
      
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!putRes.ok) {
        let detail = "";
        try { const j = await putRes.json(); detail = j.message || ""; } catch {}
        throw new Error(`Failed to save: ${putRes.status} ${detail}`);
      }
      setMsg({ text: "✅ تم حفظ ألعاب Xbox بنجاح!", type: "success" });
    } catch (e) {
      setMsg({ text: `❌ خطأ: ${e instanceof Error ? e.message : String(e)}`, type: "error" });
    }
    setSaving(false);
  };

  // ===== Buy On Account Functions =====
  const updateBuyGame = (id: string, field: keyof XboxGame, value: string) => {
    setData(prev => ({
      ...prev,
      buyOnAccount: prev.buyOnAccount.map(a => {
        if (a.id !== id) return a;
        let finalVal: string | number = value;
        if (["priceLYD", "priceLibyana", "originalPriceLYD", "originalPriceLibyana", "discountPercent", "rating"].includes(field)) {
          if (value === "" || value === undefined || value === null) {
            const updated = { ...a };
            delete updated[field];
            return updated;
          }
          finalVal = Number(value);
        }
        return { ...a, [field]: finalVal };
      })
    }));
  };

  const deleteBuyGame = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه اللعبة؟")) return;
    setData(prev => ({ ...prev, buyOnAccount: prev.buyOnAccount.filter(a => a.id !== id) }));
  };

  const moveBuyGame = (index: number, direction: "up" | "down") => {
    setData(prev => {
      const list = [...prev.buyOnAccount];
      if (direction === "up" && index > 0) {
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
      } else if (direction === "down" && index < list.length - 1) {
        const temp = list[index];
        list[index] = list[index + 1];
        list[index + 1] = temp;
      }
      return { ...prev, buyOnAccount: list };
    });
  };

  const moveFullAccount = (index: number, direction: "up" | "down") => {
    setData(prev => {
      const list = [...prev.fullAccounts];
      if (direction === "up" && index > 0) {
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
      } else if (direction === "down" && index < list.length - 1) {
        const temp = list[index];
        list[index] = list[index + 1];
        list[index + 1] = temp;
      }
      return { ...prev, fullAccounts: list };
    });
  };

  const addBuyGame = () => {
    if (!newBuyGame.title.trim()) return;
    const allIds = [...data.buyOnAccount, ...data.fullAccounts].map(a => parseInt(a.id.split("-")[1]) || 0);
    const nextId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
    
    const gameToAdd: XboxGame = {
      id: `buy-${nextId}`,
      title: newBuyGame.title,
      titleAr: "شراء في حسابك",
      image: newBuyGame.imageUrl || `/images/xbox-games/buy-${nextId}.jpg`,
      priceLYD: Number(newBuyGame.priceLYD),
      priceLibyana: Number(newBuyGame.priceLibyana)
    };

    if (newBuyGame.originalPriceLYD) gameToAdd.originalPriceLYD = Number(newBuyGame.originalPriceLYD);
    if (newBuyGame.originalPriceLibyana) gameToAdd.originalPriceLibyana = Number(newBuyGame.originalPriceLibyana);
    if (newBuyGame.discountPercent) gameToAdd.discountPercent = Number(newBuyGame.discountPercent);
    if (newBuyGame.platforms.trim()) gameToAdd.platforms = newBuyGame.platforms.trim();
    if (newBuyGame.rating) gameToAdd.rating = Number(newBuyGame.rating);
    if (newBuyGame.durationText.trim()) gameToAdd.durationText = newBuyGame.durationText.trim();

    setData(prev => ({
      ...prev,
      buyOnAccount: [...prev.buyOnAccount, gameToAdd]
    }));
    setNewBuyGame({
      title: "",
      priceLYD: 15,
      priceLibyana: 20,
      imageUrl: "",
      originalPriceLYD: "",
      originalPriceLibyana: "",
      discountPercent: "",
      platforms: "Series X|S | One",
      rating: "4.5",
      durationText: "تفعيل فوري"
    });
    setShowAdd(false);
    setMsg({ text: `✅ تم إضافة "${newBuyGame.title}"! لا تنسى الحفظ.`, type: "success" });
  };

  // ===== Full Account Functions =====
  const updateFullAccount = (id: string, field: string, value: string | number | string[]) => {
    setData(prev => ({
      ...prev,
      fullAccounts: prev.fullAccounts.map(a => a.id === id ? { ...a, [field]: field.includes("price") ? Number(value) : value } : a)
    }));
  };

  const updateFullAccountGame = (accountId: string, gameIndex: number, value: string) => {
    setData(prev => ({
      ...prev,
      fullAccounts: prev.fullAccounts.map(a => {
        if (a.id !== accountId) return a;
        const newGames = [...a.games];
        newGames[gameIndex] = value;
        return { ...a, games: newGames };
      })
    }));
  };

  const addGameToAccount = (accountId: string) => {
    setData(prev => ({
      ...prev,
      fullAccounts: prev.fullAccounts.map(a => a.id === accountId ? { ...a, games: [...a.games, ""] } : a)
    }));
  };

  const removeGameFromAccount = (accountId: string, gameIndex: number) => {
    setData(prev => ({
      ...prev,
      fullAccounts: prev.fullAccounts.map(a => {
        if (a.id !== accountId) return a;
        if (a.games.length <= 1) return a; // keep at least 1
        const newGames = a.games.filter((_, i) => i !== gameIndex);
        return { ...a, games: newGames };
      })
    }));
  };

  const deleteFullAccount = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحساب؟")) return;
    setData(prev => ({ ...prev, fullAccounts: prev.fullAccounts.filter(a => a.id !== id) }));
  };

  const addFullAccount = () => {
    if (!newFullAccount.title.trim()) return;
    const validGames = newFullAccount.games.filter(g => g.trim());
    if (validGames.length === 0) return;
    
    const allIds = [...data.buyOnAccount, ...data.fullAccounts].map(a => parseInt(a.id.split("-")[1]) || 0);
    const nextId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
    
    setData(prev => ({
      ...prev,
      fullAccounts: [...prev.fullAccounts, {
        id: `full-${nextId}`,
        title: newFullAccount.title,
        titleAr: "حساب كامل",
        image: newFullAccount.imageUrl || `/images/xbox-games/full-${nextId}.jpg`,
        games: validGames,
        priceLYD: newFullAccount.priceLYD,
        priceLibyana: newFullAccount.priceLibyana
      }]
    }));
    setNewFullAccount({ title: "", games: [""], priceLYD: 30, priceLibyana: 40, imageUrl: "" });
    setShowAdd(false);
    setMsg({ text: `✅ تم إضافة الحساب "${newFullAccount.title}" (${validGames.length} ألعاب)! لا تنسى الحفظ.`, type: "success" });
  };

  return (
    <div className="bg-navy-dark border border-white/5 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors" onClick={handleExpand}>
        <div className="flex items-center gap-4">
          <div className="text-3xl">🕹️</div>
          <div>
            <h2 className="text-white font-bold text-lg">ألعاب Xbox (شراء في حسابك + حسابات كاملة)</h2>
            <span className="text-white/40 text-xs">
              {loaded ? `${data.buyOnAccount.length} شراء في حسابك • ${data.fullAccounts.length} حسابات كاملة` : "اضغط لفتح الإدارة"}
            </span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </div>

      {/* Content */}
      {expanded && loaded && (
        <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
          {msg && (
            <div className={`p-3 rounded-xl text-sm font-bold ${msg.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
              {msg.text}
            </div>
          )}

          <button onClick={syncFromGitHub} disabled={syncing}
            className="w-full py-2 border border-white/10 hover:border-white/20 rounded-lg text-white/50 hover:text-white/80 transition-colors flex items-center justify-center gap-2 text-xs font-bold">
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "جاري المزامنة..." : "مزامنة من GitHub"}
          </button>

          {/* Section Tabs */}
          <div className="bg-navy rounded-xl border border-white/5 p-1.5">
            <div className="flex gap-2">
              {(["buyOnAccount", "fullAccounts"] as const).map((section) => (
                <button key={section}
                  onClick={() => { setActiveSection(section); setShowAdd(false); setEditingId(null); }}
                  className={`flex-1 py-3 px-3 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                    activeSection === section ? "bg-[#107C10] text-white shadow-lg shadow-[#107C10]/30" : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}>
                  <span className="text-base">{section === "buyOnAccount" ? "🎮 شراء في حسابك" : "👤 حسابات كاملة"}</span>
                  <span className={`text-[10px] ${activeSection === section ? "text-white/70" : "text-white/30"}`}>
                    {data[section].length} {section === "buyOnAccount" ? "لعبة" : "حساب"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Description */}
          <div className={`p-3 rounded-lg border text-xs font-bold text-center ${
            activeSection === "buyOnAccount" ? "bg-purple-500/5 border-purple-500/15 text-purple-400" : "bg-orange-500/5 border-orange-500/15 text-orange-400"
          }`}>
            {activeSection === "buyOnAccount" 
              ? "🎮 ألعاب يتم تنزيلها مباشرة في حساب العميل — سعر لكل لعبة" 
              : "👤 حسابات كاملة فيها عدة ألعاب — السعر للحساب الكامل"}
          </div>

          {/* ===== BUY ON ACCOUNT SECTION ===== */}
          {activeSection === "buyOnAccount" && (
            <>
              {data.buyOnAccount.length === 0 && !showAdd && (
                <div className="text-center py-8 text-white/30">
                  <div className="text-4xl mb-3">🎮</div>
                  <p className="font-bold mb-1">لا توجد ألعاب بعد</p>
                  <p className="text-xs">اضغط لإضافة أول لعبة شراء في حسابك</p>
                </div>
              )}

              {data.buyOnAccount.map((game, index) => (
                <div key={game.id} className="bg-navy border border-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    {/* Reordering Buttons */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => moveBuyGame(index, "up")}
                        disabled={index === 0}
                        className={`w-7 h-7 rounded bg-white/5 flex items-center justify-center transition-colors ${index === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 hover:text-white text-white/50"}`}
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveBuyGame(index, "down")}
                        disabled={index === data.buyOnAccount.length - 1}
                        className={`w-7 h-7 rounded bg-white/5 flex items-center justify-center transition-colors ${index === data.buyOnAccount.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 hover:text-white text-white/50"}`}
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <img src={assetPath(game.image)} alt={game.title} className="w-12 h-16 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {editingId === game.id ? (
                        <div className="space-y-3 bg-black/30 p-3 rounded-lg border border-purple-500/10">
                          {/* Basic Info */}
                          <div>
                            <label className="block text-[10px] font-bold text-white/50 mb-1">اسم اللعبة</label>
                            <input type="text" value={game.title} onChange={e => updateBuyGame(game.id, "title", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:border-crimson outline-none" />
                          </div>

                          {/* Platforms & Quick Details */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-white/50 mb-1">المنصات</label>
                              <input type="text" value={game.platforms || ""} onChange={e => updateBuyGame(game.id, "platforms", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:border-crimson outline-none" placeholder="Series X|S | One" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-white/50 mb-1">مدة التسليم / النص المساعد</label>
                              <input type="text" value={game.durationText || ""} onChange={e => updateBuyGame(game.id, "durationText", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:border-crimson outline-none" placeholder="تفعيل فوري" />
                            </div>
                          </div>

                          {/* Rating & Discount */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-white/50 mb-1">التقييم (0-5)</label>
                              <input type="number" step="0.1" min="0" max="5" value={game.rating || ""} onChange={e => updateBuyGame(game.id, "rating", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:border-crimson outline-none" placeholder="4.5" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-white/50 mb-1">نسبة الخصم % (مثال: 50)</label>
                              <input type="number" value={game.discountPercent || ""} onChange={e => updateBuyGame(game.id, "discountPercent", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:border-crimson outline-none" placeholder="بدون خصم" />
                            </div>
                          </div>

                          {/* LYD Price Stack */}
                          <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                            <div>
                              <label className="block text-[10px] font-bold text-green-400 mb-1">السعر الحالي د.ل</label>
                              <input type="number" value={game.priceLYD} onChange={e => updateBuyGame(game.id, "priceLYD", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-green-400 font-bold focus:border-crimson text-left outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-green-400/50 mb-1">السعر الأصلي د.ل (اختياري)</label>
                              <input type="number" value={game.originalPriceLYD || ""} onChange={e => updateBuyGame(game.id, "originalPriceLYD", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white/50 focus:border-crimson text-left outline-none" placeholder="قبل الخصم" />
                            </div>
                          </div>

                          {/* Libyana Price Stack */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-blue-400 mb-1">السعر الحالي ليبيانا</label>
                              <input type="number" value={game.priceLibyana} onChange={e => updateBuyGame(game.id, "priceLibyana", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-blue-400 font-bold focus:border-crimson text-left outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-blue-400/50 mb-1">السعر الأصلي ليبيانا (اختياري)</label>
                              <input type="number" value={game.originalPriceLibyana || ""} onChange={e => updateBuyGame(game.id, "originalPriceLibyana", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white/50 focus:border-crimson text-left outline-none" placeholder="قبل الخصم" />
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-2">
                            <ImageUploader
                              token={token}
                              currentImage={assetPath(game.image)}
                              uploadPath="public/images/xbox-games"
                              fileName={game.id}
                              onUpload={(path) => updateBuyGame(game.id, "image", path)}
                              label="صورة اللعبة"
                              accentColor="purple-500"
                              small
                            />
                          </div>

                          <button onClick={() => setEditingId(null)} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-bold transition-colors">✓ حفظ التعديل المؤقت</button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-white font-bold text-sm truncate" dir="ltr">{game.title}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-white/40">
                            <span>المنصات: {game.platforms || "Series X|S | One"}</span>
                            <span>التقييم: {game.rating || "4.5"}</span>
                          </div>
                          <div className="flex gap-3 text-xs mt-1">
                            <span className="text-green-400 font-bold">{game.priceLYD} د.ل {game.originalPriceLYD ? <span className="line-through text-white/30 text-[10px] ml-1">{game.originalPriceLYD}</span> : null}</span>
                            <span className="text-blue-400 font-bold">{game.priceLibyana} رصيد {game.originalPriceLibyana ? <span className="line-through text-white/30 text-[10px] ml-1">{game.originalPriceLibyana}</span> : null}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setEditingId(editingId === game.id ? null : game.id)}
                        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${editingId === game.id ? "bg-crimson/20 text-crimson" : "bg-white/5 hover:bg-white/10 text-white/50"}`}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteBuyGame(game.id)}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Buy Game Form */}
              {showAdd ? (
                <div className="rounded-xl p-4 space-y-3 border bg-purple-500/5 border-purple-500/20 animate-fade-in-scale">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-purple-400 font-bold text-sm">➕ إضافة لعبة - شراء في حسابك</h3>
                    <button onClick={() => setShowAdd(false)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 mb-1">اسم اللعبة *</label>
                    <input type="text" value={newBuyGame.title} onChange={e => setNewBuyGame({ ...newBuyGame, title: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white focus:border-[#107C10] outline-none" placeholder="مثال: GTA V" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 mb-1">المنصات</label>
                      <input type="text" value={newBuyGame.platforms} onChange={e => setNewBuyGame({ ...newBuyGame, platforms: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:border-[#107C10] outline-none" placeholder="Series X|S | One" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 mb-1">مدة التسليم / النص المساعد</label>
                      <input type="text" value={newBuyGame.durationText} onChange={e => setNewBuyGame({ ...newBuyGame, durationText: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:border-[#107C10] outline-none" placeholder="تفعيل فوري" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 mb-1">التقييم (0-5)</label>
                      <input type="number" step="0.1" min="0" max="5" value={newBuyGame.rating} onChange={e => setNewBuyGame({ ...newBuyGame, rating: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:border-[#107C10] outline-none" placeholder="4.5" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 mb-1">نسبة الخصم % (مثال: 50)</label>
                      <input type="number" value={newBuyGame.discountPercent} onChange={e => setNewBuyGame({ ...newBuyGame, discountPercent: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:border-[#107C10] outline-none" placeholder="بدون خصم" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-green-400 mb-1">السعر د.ل *</label>
                      <input type="number" value={newBuyGame.priceLYD} onChange={e => setNewBuyGame({ ...newBuyGame, priceLYD: Number(e.target.value) })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-green-400 font-bold focus:border-[#107C10] text-left outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-green-400/50 mb-1">السعر الأصلي د.ل (اختياري)</label>
                      <input type="number" value={newBuyGame.originalPriceLYD} onChange={e => setNewBuyGame({ ...newBuyGame, originalPriceLYD: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-white/50 focus:border-[#107C10] text-left outline-none" placeholder="قبل الخصم" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-blue-400 mb-1">السعر ليبيانا *</label>
                      <input type="number" value={newBuyGame.priceLibyana} onChange={e => setNewBuyGame({ ...newBuyGame, priceLibyana: Number(e.target.value) })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-blue-400 font-bold focus:border-[#107C10] text-left outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blue-400/50 mb-1">السعر الأصلي ليبيانا (اختياري)</label>
                      <input type="number" value={newBuyGame.originalPriceLibyana} onChange={e => setNewBuyGame({ ...newBuyGame, originalPriceLibyana: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-white/50 focus:border-[#107C10] text-left outline-none" placeholder="قبل الخصم" />
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-2">
                    <ImageUploader
                      token={token}
                      currentImage={newBuyGame.imageUrl ? assetPath(newBuyGame.imageUrl) : undefined}
                      uploadPath="public/images/xbox-games"
                      fileName={`buy-new-${Date.now()}`}
                      onUpload={(path) => setNewBuyGame({ ...newBuyGame, imageUrl: path })}
                      label="📷 صورة اللعبة (اختياري)"
                      accentColor="[#107C10]"
                    />
                  </div>

                  <button onClick={addBuyGame} disabled={!newBuyGame.title.trim()}
                    className={`w-full py-3 font-bold rounded-lg text-sm transition-colors ${newBuyGame.title.trim() ? "bg-[#107C10] hover:bg-[#0e6b0e] text-white shadow-md shadow-[#107C10]/20" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
                    ✅ إضافة اللعبة
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAdd(true)}
                  className="w-full py-3.5 border border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-xl text-purple-400/70 hover:text-purple-400 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
                  <Plus className="w-4 h-4" /> إضافة لعبة شراء في حسابك
                </button>
              )}
            </>
          )}

          {/* ===== FULL ACCOUNTS SECTION ===== */}
          {activeSection === "fullAccounts" && (
            <>
              {data.fullAccounts.length === 0 && !showAdd && (
                <div className="text-center py-8 text-white/30">
                  <div className="text-4xl mb-3">👤</div>
                  <p className="font-bold mb-1">لا توجد حسابات بعد</p>
                  <p className="text-xs">اضغط لإضافة أول حساب كامل (فيه عدة ألعاب)</p>
                </div>
              )}

              {data.fullAccounts.map((account, index) => (
                <div key={account.id} className="bg-navy border border-orange-500/10 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    {/* Reordering Buttons */}
                    <div className="flex flex-col gap-1 flex-shrink-0 mt-1">
                      <button
                        onClick={() => moveFullAccount(index, "up")}
                        disabled={index === 0}
                        className={`w-7 h-7 rounded bg-white/5 flex items-center justify-center transition-colors ${index === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 hover:text-white text-white/50"}`}
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveFullAccount(index, "down")}
                        disabled={index === data.fullAccounts.length - 1}
                        className={`w-7 h-7 rounded bg-white/5 flex items-center justify-center transition-colors ${index === data.fullAccounts.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 hover:text-white text-white/50"}`}
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <img src={assetPath(account.image)} alt={account.title} className="w-12 h-16 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {editingId === account.id ? (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-white/50 mb-1">اسم الحساب</label>
                            <input type="text" value={account.title} onChange={e => updateFullAccount(account.id, "title", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:border-orange-500 outline-none" />
                          </div>
                          <ImageUploader
                            token={token}
                            currentImage={assetPath(account.image)}
                            uploadPath="public/images/xbox-games"
                            fileName={account.id}
                            onUpload={(path) => updateFullAccount(account.id, "image", path)}
                            label="صورة الحساب"
                            accentColor="orange-500"
                            small
                          />
                          {/* Games List with Images */}
                          <div>
                            <label className="block text-[10px] font-bold text-orange-400/80 mb-1.5">🎮 الألعاب في الحساب (مع الصور)</label>
                            {account.games.map((game, gi) => (
                              <div key={gi} className="bg-black/30 rounded-lg p-2 mb-2 border border-orange-500/10">
                                <div className="flex gap-2 items-center mb-1.5">
                                  <span className="text-orange-400/50 text-[10px] font-bold w-5 text-center">#{gi + 1}</span>
                                  <input type="text" value={game} onChange={e => updateFullAccountGame(account.id, gi, e.target.value)}
                                    className="flex-1 bg-black/50 border border-orange-500/15 rounded-md px-3 py-1.5 text-sm text-orange-300 focus:border-orange-500 outline-none"
                                    placeholder={`اسم اللعبة ${gi + 1}`} />
                                  {account.games.length > 1 && (
                                    <button onClick={() => removeGameFromAccount(account.id, gi)}
                                      className="w-8 h-8 bg-red-500/10 text-red-500 rounded-md flex items-center justify-center text-xs hover:bg-red-500/20 transition-colors">✕</button>
                                  )}
                                </div>
                                <ImageUploader
                                  token={token}
                                  currentImage={account.gameImages?.[gi] ? assetPath(account.gameImages[gi]) : undefined}
                                  uploadPath="public/images/xbox-games/game-covers"
                                  fileName={`${account.id}-game-${gi}`}
                                  onUpload={(path) => {
                                    const newGameImages = [...(account.gameImages || account.games.map(() => ""))];
                                    while (newGameImages.length <= gi) newGameImages.push("");
                                    newGameImages[gi] = path;
                                    updateFullAccount(account.id, "gameImages", newGameImages);
                                  }}
                                  label={`صورة ${game || `اللعبة ${gi + 1}`}`}
                                  accentColor="orange-500"
                                  small
                                />
                              </div>
                            ))}
                            <button onClick={() => addGameToAccount(account.id)}
                              className="w-full py-2 border border-dashed border-orange-500/20 hover:border-orange-500/40 rounded-lg text-orange-400/50 hover:text-orange-400 text-xs font-bold mt-1 transition-colors">
                              + إضافة لعبة للحساب
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-green-400/80 mb-1">سعر الحساب (د.ل)</label>
                              <input type="number" value={account.priceLYD} onChange={e => updateFullAccount(account.id, "priceLYD", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-green-400 font-bold focus:border-orange-500 text-left outline-none" />
                            </div>
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-blue-400/80 mb-1">سعر الحساب (رصيد)</label>
                              <input type="number" value={account.priceLibyana} onChange={e => updateFullAccount(account.id, "priceLibyana", e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-blue-400 font-bold focus:border-orange-500 text-left outline-none" />
                            </div>
                          </div>
                          <button onClick={() => setEditingId(null)} className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-md text-xs font-bold transition-colors">✓ تم</button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-white font-bold text-sm" dir="ltr">{account.title}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {account.games.map((game, gi) => (
                              <span key={gi} className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/15" dir="ltr">
                                {game}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-3 text-xs mt-1.5">
                            <span className="text-green-400 font-bold">{account.priceLYD} د.ل للحساب</span>
                            <span className="text-blue-400 font-bold">{account.priceLibyana} رصيد للحساب</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setEditingId(editingId === account.id ? null : account.id)}
                        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${editingId === account.id ? "bg-orange-500/20 text-orange-400" : "bg-white/5 hover:bg-white/10 text-white/50"}`}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteFullAccount(account.id)}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Full Account Form */}
              {showAdd ? (
                <div className="rounded-xl p-4 space-y-3 border bg-orange-500/5 border-orange-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-orange-400 font-bold text-sm">➕ إضافة حساب كامل جديد</h3>
                    <button onClick={() => setShowAdd(false)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 mb-1">اسم الحساب *</label>
                    <input type="text" value={newFullAccount.title} onChange={e => setNewFullAccount({ ...newFullAccount, title: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white focus:border-orange-500 outline-none" placeholder="مثال: حساب ألعاب أكشن" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-orange-400/80 mb-1">الألعاب في الحساب * (لعبة واحدة على الأقل)</label>
                    {newFullAccount.games.map((game, gi) => (
                      <div key={gi} className="flex gap-1 mb-1">
                        <input type="text" value={game} onChange={e => {
                          const newGames = [...newFullAccount.games];
                          newGames[gi] = e.target.value;
                          setNewFullAccount({ ...newFullAccount, games: newGames });
                        }}
                          className="flex-1 bg-black/50 border border-orange-500/15 rounded-md px-3 py-2 text-sm text-orange-300 focus:border-orange-500 outline-none"
                          placeholder={`اسم اللعبة ${gi + 1}`} />
                        {newFullAccount.games.length > 1 && (
                          <button onClick={() => setNewFullAccount({ ...newFullAccount, games: newFullAccount.games.filter((_, i) => i !== gi) })}
                            className="w-9 h-9 bg-red-500/10 text-red-500 rounded-md flex items-center justify-center text-xs">✕</button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => setNewFullAccount({ ...newFullAccount, games: [...newFullAccount.games, ""] })}
                      className="w-full py-2 border border-dashed border-orange-500/20 hover:border-orange-500/40 rounded-md text-orange-400/50 hover:text-orange-400 text-xs font-bold mt-1">
                      + إضافة لعبة أخرى للحساب
                    </button>
                  </div>
                  <ImageUploader
                    token={token}
                    currentImage={newFullAccount.imageUrl ? assetPath(newFullAccount.imageUrl) : undefined}
                    uploadPath="public/images/xbox-games"
                    fileName={`full-new-${Date.now()}`}
                    onUpload={(path) => setNewFullAccount({ ...newFullAccount, imageUrl: path })}
                    label="📷 صورة الحساب (اختياري)"
                    accentColor="orange-500"
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-green-400/80 mb-1">💰 سعر الحساب الكامل (د.ل)</label>
                      <input type="number" value={newFullAccount.priceLYD} onChange={e => setNewFullAccount({ ...newFullAccount, priceLYD: Number(e.target.value) })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2.5 text-sm text-green-400 font-bold focus:border-orange-500 text-left outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-blue-400/80 mb-1">💰 سعر الحساب الكامل (رصيد)</label>
                      <input type="number" value={newFullAccount.priceLibyana} onChange={e => setNewFullAccount({ ...newFullAccount, priceLibyana: Number(e.target.value) })}
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2.5 text-sm text-blue-400 font-bold focus:border-orange-500 text-left outline-none" />
                    </div>
                  </div>
                  <button onClick={addFullAccount} disabled={!newFullAccount.title.trim() || !newFullAccount.games.some(g => g.trim())}
                    className={`w-full py-3 font-bold rounded-lg text-sm ${
                      newFullAccount.title.trim() && newFullAccount.games.some(g => g.trim()) 
                        ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-white/10 text-white/30 cursor-not-allowed"
                    }`}>
                    ✅ إضافة الحساب الكامل
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAdd(true)}
                  className="w-full py-3.5 border border-dashed border-orange-500/30 hover:border-orange-500/60 rounded-xl text-orange-400/70 hover:text-orange-400 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
                  <Plus className="w-4 h-4" /> إضافة حساب كامل جديد
                </button>
              )}
            </>
          )}

          {/* Save Button */}
          <div className="pt-2 border-t border-white/5">
            <button onClick={saveData} disabled={saving}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                saving ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30 active:scale-[0.98]"
              }`}>
              <Save className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "💾 حفظ جميع ألعاب Xbox"}
            </button>
            <p className="text-white/20 text-[10px] text-center mt-2">يتم حفظ التغييرات مباشرة في GitHub عند الضغط على حفظ</p>
          </div>
        </div>
      )}
    </div>
  );
}
