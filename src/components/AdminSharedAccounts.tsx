"use client";
import { useState } from "react";
import { Save, Plus, Trash2, Edit3, ChevronDown, ChevronUp, Image, X } from "lucide-react";

interface SharedAccount {
  id: string;
  title: string;
  titleAr: string;
  image: string;
  priceLYD: number;
  priceLibyana: number;
}

interface Props {
  token: string;
}

export default function AdminSharedAccounts({ token }: Props) {
  const [accounts, setAccounts] = useState<SharedAccount[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newGame, setNewGame] = useState({ title: "", priceLYD: 15, priceLibyana: 20, imageUrl: "" });

  const owner = "redaipoo", repo = "MD.LY", branch = "main";
  const filePath = "src/data/shared-accounts.json";

  const loadData = async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3.raw" },
        cache: "no-store"
      });
      if (res.ok) { setAccounts(await res.json()); setLoaded(true); }
    } catch (e) { console.error(e); }
  };

  const saveData = async () => {
    setSaving(true); setMsg(null);
    try {
      const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }, cache: "no-store"
      });
      if (!getRes.ok) throw new Error("Failed to fetch");
      const { sha } = await getRes.json();
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(accounts, null, 2))));
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Update shared accounts via Admin", content, sha, branch })
      });
      if (!putRes.ok) throw new Error("Failed to save");
      setMsg({ text: "✅ تم حفظ الحسابات المشتركة بنجاح!", type: "success" });
    } catch (e) {
      setMsg({ text: `❌ خطأ: ${e instanceof Error ? e.message : String(e)}`, type: "error" });
    }
    setSaving(false);
  };

  const updateAccount = (id: string, field: keyof SharedAccount, value: string | number) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, [field]: field.includes("price") ? Number(value) : value } : a));
  };

  const deleteAccount = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه اللعبة؟")) return;
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addAccount = () => {
    if (!newGame.title.trim()) return;
    const nextId = accounts.length > 0 ? Math.max(...accounts.map(a => parseInt(a.id.split("-")[1]) || 0)) + 1 : 1;
    setAccounts(prev => [...prev, {
      id: `shared-${nextId}`,
      title: newGame.title,
      titleAr: "حساب مشترك",
      image: newGame.imageUrl || `/images/shared-accounts/game-${nextId}.jpg`,
      priceLYD: newGame.priceLYD,
      priceLibyana: newGame.priceLibyana
    }]);
    setNewGame({ title: "", priceLYD: 15, priceLibyana: 20, imageUrl: "" });
    setShowAdd(false);
  };

  return (
    <div className="bg-navy-dark border border-white/5 rounded-2xl overflow-hidden shadow-lg">
      <div
        className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => { if (!loaded) loadData(); setExpanded(!expanded); }}
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">🎮</div>
          <div>
            <h2 className="text-white font-bold text-lg">حسابات مشتركة</h2>
            <span className="text-white/40 text-xs">{loaded ? `${accounts.length} لعبة` : "اضغط للتحميل"}</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </div>

      {expanded && loaded && (
        <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
          {msg && (
            <div className={`p-3 rounded-xl text-sm font-bold ${msg.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
              {msg.text}
            </div>
          )}

          {accounts.map((game) => (
            <div key={game.id} className="bg-navy border border-white/5 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-3">
                <img src={game.image} alt={game.title} className="w-12 h-16 object-cover rounded-lg border border-white/10" />
                <div className="flex-1 min-w-0">
                  {editingId === game.id ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-1">اسم اللعبة</label>
                        <input type="text" value={game.title} onChange={e => updateAccount(game.id, "title", e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:border-crimson" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-1">رابط الصورة</label>
                        <input type="text" value={game.image} onChange={e => updateAccount(game.id, "image", e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:border-crimson" />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-green-400/80 mb-1">سعر د.ل</label>
                          <input type="number" value={game.priceLYD} onChange={e => updateAccount(game.id, "priceLYD", e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-green-400 font-bold focus:border-crimson text-left" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-blue-400/80 mb-1">سعر ليبيانا</label>
                          <input type="number" value={game.priceLibyana} onChange={e => updateAccount(game.id, "priceLibyana", e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm text-blue-400 font-bold focus:border-crimson text-left" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-white font-bold text-sm truncate" dir="ltr">{game.title}</h3>
                      <div className="flex gap-3 text-xs">
                        <span className="text-green-400 font-bold">{game.priceLYD} د.ل</span>
                        <span className="text-blue-400 font-bold">{game.priceLibyana} رصيد</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditingId(editingId === game.id ? null : game.id)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${editingId === game.id ? "bg-crimson/20 text-crimson" : "bg-white/5 hover:bg-white/10 text-white/50"}`}>
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteAccount(game.id)}
                    className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Game Form */}
          {showAdd ? (
            <div className="bg-navy border border-[#107C10]/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[#00ff00] font-bold text-sm">➕ إضافة لعبة مشتركة جديدة</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 mb-1">اسم اللعبة *</label>
                <input type="text" value={newGame.title} onChange={e => setNewGame({ ...newGame, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-[#107C10]" placeholder="مثال: GTA V" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 mb-1">رابط الصورة (اختياري)</label>
                <input type="text" value={newGame.imageUrl} onChange={e => setNewGame({ ...newGame, imageUrl: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-[#107C10]" placeholder="/images/shared-accounts/game-41.jpg" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-green-400/80 mb-1">سعر د.ل</label>
                  <input type="number" value={newGame.priceLYD} onChange={e => setNewGame({ ...newGame, priceLYD: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-green-400 font-bold focus:border-[#107C10] text-left" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-blue-400/80 mb-1">سعر ليبيانا</label>
                  <input type="number" value={newGame.priceLibyana} onChange={e => setNewGame({ ...newGame, priceLibyana: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-blue-400 font-bold focus:border-[#107C10] text-left" />
                </div>
              </div>
              <button onClick={addAccount} className="w-full py-2.5 bg-[#107C10] hover:bg-[#0e6b0e] text-white font-bold rounded-lg transition-colors text-sm">
                إضافة اللعبة
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="w-full py-3 border border-dashed border-[#107C10]/40 hover:border-[#107C10] rounded-lg text-[#00ff00]/70 hover:text-[#00ff00] transition-colors flex items-center justify-center gap-2 text-sm font-bold">
              <Plus className="w-4 h-4" /> إضافة لعبة مشتركة جديدة
            </button>
          )}

          {/* Save Button */}
          <button onClick={saveData} disabled={saving}
            className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${saving ? "bg-white/10 text-white/50" : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30"}`}>
            <Save className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ الحسابات المشتركة"}
          </button>
        </div>
      )}
    </div>
  );
}
