"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Library, X } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { recordMedia } from "@/actions/media";
import { Input } from "@/components/ui/form";
import { slugify } from "@/lib/utils";
import type { MediaRow } from "@/types";

const MAX_MB = 8;

export async function uploadToMedia(file: File, folder = "uploads"): Promise<{ url: string; path: string }> {
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`File is larger than ${MAX_MB} MB.`);
  const supabase = getBrowserSupabase();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  const dims = await new Promise<{ width: number | null; height: number | null }>((resolve) => {
    if (!file.type.startsWith("image/")) return resolve({ width: null, height: null });
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = URL.createObjectURL(file);
  });
  const res = await recordMedia({ path, url: data.publicUrl, alt: "", mime_type: file.type || null, size_bytes: file.size, ...dims });
  if (res && !res.ok) throw new Error(res.message ?? "Could not record upload.");
  return { url: data.publicUrl, path };
}

export function ImageField({ name, defaultValue, folder = "uploads", id }: { name: string; defaultValue?: string | null; folder?: string; id?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true); setError(null);
    try {
      const { url } = await uploadToMedia(file, folder);
      setValue(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input id={id} name={name} value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://… or upload" />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} title="Upload image" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs font-semibold hover:bg-white/6 disabled:opacity-50">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />} Upload
        </button>
        <button type="button" onClick={() => setLibraryOpen(true)} title="Choose from media library" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs font-semibold hover:bg-white/6">
          <Library className="size-4" /> Library
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {value && (
        <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-lg border border-line bg-navy-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="size-full object-cover" />
          <button type="button" onClick={() => setValue("")} aria-label="Clear image" className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 hover:bg-black/80"><X className="size-3.5" /></button>
        </div>
      )}
      {libraryOpen && <MediaLibraryDialog onPick={(url) => { setValue(url); setLibraryOpen(false); }} onClose={() => setLibraryOpen(false)} />}
    </div>
  );
}

function MediaLibraryDialog({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/media")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => setItems(d.media ?? []))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Media library">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-line bg-navy p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold uppercase">Media library</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 hover:bg-white/10"><X className="size-5" /></button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!items && !error && <p className="text-sm text-muted">Loading…</p>}
        {items && items.length === 0 && <p className="text-sm text-muted">No uploads yet. Use the Upload button or the Media page.</p>}
        {items && items.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {items.map((m) => (
              <button key={m.id} type="button" onClick={() => onPick(m.url)} className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-navy-2 hover:border-accent">
                <Image src={m.url} alt={m.alt} fill sizes="160px" className="object-cover transition group-hover:scale-105" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
