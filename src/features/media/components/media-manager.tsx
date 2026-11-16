"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import { uploadToMedia } from "@/features/admin/components/image-field";
import { deleteMedia, updateMediaAlt } from "@/actions/media";
import type { MediaRow } from "@/types";

function fmtBytes(n: number | null) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaManager({ items }: { items: MediaRow[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [, start] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setError(null);
    try {
      for (const f of Array.from(files)) await uploadToMedia(f, "library");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); void onFiles(e.dataTransfer.files); }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 px-6 py-12 text-center transition hover:border-accent/60 hover:bg-white/3"
      >
        <input ref={fileRef} type="file" accept="image/*,video/mp4" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        {busy ? <Loader2 className="size-8 animate-spin text-accent-2" /> : <Upload className="size-8 text-accent-2" />}
        <p className="font-display text-lg font-bold uppercase">{busy ? "Uploading…" : "Drop files here or click to upload"}</p>
        <p className="text-xs text-muted">JPG, PNG, WebP, AVIF, SVG or MP4 · up to 8 MB each · stored in the Supabase “media” bucket</p>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </label>

      {items.length === 0 ? (
        <p className="text-sm text-muted">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              <div className="relative aspect-square bg-navy-2">
                {m.mime_type?.startsWith("video/") ? (
                  <video src={m.url} className="size-full object-cover" muted />
                ) : (
                  <Image src={m.url} alt={m.alt} fill sizes="240px" className="object-cover" unoptimized />
                )}
              </div>
              <div className="space-y-2 p-3">
                <input
                  defaultValue={m.alt}
                  placeholder="Alt text"
                  onBlur={(e) => { if (e.target.value !== m.alt) start(async () => { await updateMediaAlt(m.id, e.target.value); }); }}
                  className="w-full rounded-md border border-white/10 bg-white/4 px-2 py-1 text-xs outline-none focus:border-accent-2/70"
                  aria-label="Alt text"
                />
                <p className="truncate text-[11px] text-muted" title={m.path}>{m.path.split("/").pop()} · {fmtBytes(m.size_bytes)}{m.width ? ` · ${m.width}×${m.height}` : ""}</p>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => { navigator.clipboard.writeText(m.url); setCopied(m.id); setTimeout(() => setCopied(null), 1500); }} className="inline-flex items-center gap-1 rounded-md border border-white/12 px-2 py-1 text-[11px] font-semibold hover:bg-white/6">
                    {copied === m.id ? <Check className="size-3 text-success" /> : <Copy className="size-3" />} {copied === m.id ? "Copied" : "Copy URL"}
                  </button>
                  <button type="button" onClick={() => { if (confirm("Delete this file from storage?")) start(async () => { const r = await deleteMedia(m.id, m.path); if (r && !r.ok) alert(r.message); router.refresh(); }); }} aria-label="Delete" className="rounded-md p-1 text-red-300 hover:bg-red-500/15"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
