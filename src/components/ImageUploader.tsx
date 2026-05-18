"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  token: string;
  /** Current image path/url */
  currentImage?: string;
  /** GitHub path prefix, e.g. "public/images/xbox-games" */
  uploadPath: string;
  /** Filename without extension, e.g. "buy-1" */
  fileName: string;
  /** Called with the resulting image path when upload completes */
  onUpload: (imagePath: string) => void;
  /** Label text */
  label?: string;
  /** Accent color class */
  accentColor?: string;
  /** Small variant */
  small?: boolean;
}

export default function ImageUploader({
  token,
  currentImage,
  uploadPath,
  fileName,
  onUpload,
  label = "صورة اللعبة",
  accentColor = "[#107C10]",
  small = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const owner = "redaipoo", repo = "MD218.ly", branch = "main";

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("الرجاء اختيار ملف صورة فقط");
      setUploadStatus("error");
      return;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("حجم الصورة كبير جداً (الحد الأقصى 5MB)");
      setUploadStatus("error");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to GitHub
    setUploading(true);
    setUploadStatus("idle");
    setErrorMsg("");

    try {
      // Get file extension
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
      const fullFileName = `${fileName}.${safeExt}`;
      const githubPath = `${uploadPath}/${fullFileName}`;

      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const result = r.result as string;
          // Remove data:image/...;base64, prefix
          resolve(result.split(",")[1]);
        };
        r.onerror = reject;
        r.readAsDataURL(file);
      });

      // Check if file already exists (to get sha)
      let sha: string | undefined;
      try {
        const getRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}?ref=${branch}&t=${Date.now()}`,
          {
            headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
            cache: "no-store",
          }
        );
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }
      } catch {
        // File doesn't exist yet, that's fine
      }

      // Upload file
      const body: Record<string, string> = {
        message: `Upload image: ${fullFileName}`,
        content: base64,
        branch,
      };
      if (sha) body.sha = sha;

      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!putRes.ok) {
        throw new Error(`فشل رفع الصورة: ${putRes.status}`);
      }

      // Generate the public path (remove "public/" prefix for Next.js)
      const publicPath = githubPath.startsWith("public/")
        ? "/" + githubPath.slice("public/".length)
        : "/" + githubPath;

      onUpload(publicPath);
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "فشل رفع الصورة");
      setUploadStatus("error");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [token, uploadPath, fileName, onUpload, owner, repo, branch]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const displayImage = preview || currentImage;

  if (small) {
    return (
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-white/50 mb-1">{label}</label>
        <div className="flex items-center gap-2">
          {displayImage && (
            <div className="relative w-10 h-10 rounded-md overflow-hidden border border-white/10 flex-shrink-0">
              <img src={displayImage} alt="" className="w-full h-full object-cover" />
              {uploadStatus === "success" && (
                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              uploading
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : `border border-dashed border-${accentColor}/30 hover:border-${accentColor}/60 text-${accentColor}/70 hover:text-${accentColor} hover:bg-${accentColor}/5`
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" />
                {displayImage ? "تغيير" : "رفع صورة"}
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
        {uploadStatus === "error" && (
          <p className="text-red-400 text-[10px]">{errorMsg}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-white/50 mb-1">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
          dragOver
            ? "border-green-400 bg-green-500/10 scale-[1.01]"
            : uploading
            ? "border-white/10 bg-white/5 cursor-not-allowed"
            : uploadStatus === "success"
            ? "border-green-500/30 bg-green-500/5"
            : uploadStatus === "error"
            ? "border-red-500/30 bg-red-500/5"
            : "border-white/10 hover:border-white/20 bg-black/20 hover:bg-black/30"
        }`}
      >
        {/* Preview or Placeholder */}
        {displayImage ? (
          <div className="relative">
            <div className="flex items-center gap-3 p-3">
              <div className="w-16 h-20 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                <img src={displayImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                {uploading ? (
                  <div className="flex items-center gap-2 text-white/50">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-bold">جاري رفع الصورة...</span>
                  </div>
                ) : uploadStatus === "success" ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">تم رفع الصورة بنجاح! ✅</span>
                  </div>
                ) : (
                  <div className="text-white/40 text-xs">
                    <p className="font-bold text-white/60 mb-0.5">اضغط لتغيير الصورة</p>
                    <p>أو اسحب وأفلت صورة جديدة هنا</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-white/30 animate-spin mb-2" />
                <p className="text-white/50 text-xs font-bold">جاري رفع الصورة...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2">
                  <ImageIcon className="w-6 h-6 text-white/30" />
                </div>
                <p className="text-white/60 text-xs font-bold mb-0.5">📷 اضغط لاختيار صورة من جهازك</p>
                <p className="text-white/30 text-[10px]">أو اسحب وأفلت الصورة هنا • JPG, PNG, WebP (حد 5MB)</p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {uploadStatus === "error" && (
        <div className="flex items-center gap-1.5 text-red-400 text-[10px] px-1">
          <X className="w-3 h-3" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
