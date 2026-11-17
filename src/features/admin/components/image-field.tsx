"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Library, X } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { recordMedia } from "@/actions/media";
import { Button } from "@/components/ui/button";
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
        <Button onClick={() => fileRef.current?.click()} disabled={busy} title="Upload image" className="h-9!">
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />} Upload
        </Button>
        <Button onClick={() => setLibraryOpen(true)} title="Choose from media library" className="h-9!">
          <Library className="size-4" aria-hidden /> Library
        </Button>
      </div>
      {error && <p className="type-body-small text-danger">{error}</p>}
      {value && (
        <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-lg border bg-neutral">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="size-full object-cover" />
          <button type="button" onClick={() => setValue("")} aria-label="Clear image" className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-sm bg-surface-overlay text-icon shadow-overlay hover:bg-surface-overlay-hovered"><X className="size-3.5" aria-hidden /></button>
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
      <div className="absolute inset-0 bg-blanket" onClick={onClose} />
      {/* Modal dialog: elevation.surface.overlay with elevation.shadow.overlay */}
      <div className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-overlay p-6 shadow-overlay">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="type-heading-medium">Media library</h2>
          <Button appearance="subtle" iconOnly onClick={onClose} aria-label="Close"><X className="size-4" aria-hidden /></Button>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        {!items && !error && <p className="text-sm text-subtle">Loading…</p>}
        {items && items.length === 0 && <p className="text-sm text-subtle">No uploads yet. Use the Upload button or the Media page.</p>}
        {items && items.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {items.map((m) => (
              <button key={m.id} type="button" onClick={() => onPick(m.url)} className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-neutral hover:border-selected">
                <Image src={m.url} alt={m.alt} fill sizes="160px" className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
