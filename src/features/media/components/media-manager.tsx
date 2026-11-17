"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import { uploadToMedia } from "@/features/admin/components/image-field";
import { deleteMedia, updateMediaAlt } from "@/actions/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
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
    <div className="space-y-4">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); void onFiles(e.dataTransfer.files); }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-bold px-6 py-10 text-center transition-colors hover:border-selected hover:bg-selected has-focus-visible:border-focused"
      >
        <input ref={fileRef} type="file" accept="image/*,video/mp4" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        {busy ? <Loader2 className="size-6 animate-spin text-icon-subtle" aria-hidden /> : <Upload className="size-6 text-icon-subtle" aria-hidden />}
        <p className="type-heading-small">{busy ? "Uploading…" : "Drop files here or click to upload"}</p>
        <p className="type-body-small text-subtle">JPG, PNG, WebP, AVIF, SVG or MP4 · up to 8 MB each · stored in the Supabase “media” bucket</p>
        {error && <p className="text-sm text-danger">{error}</p>}
      </label>

      {items.length === 0 ? (
        <p className="text-sm text-subtle">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              <div className="relative aspect-square bg-neutral">
                {m.mime_type?.startsWith("video/") ? (
                  <video src={m.url} className="size-full object-cover" muted />
                ) : (
                  <Image src={m.url} alt={m.alt} fill sizes="240px" className="object-cover" unoptimized />
                )}
              </div>
              <div className="space-y-2 p-3">
                <Input
                  defaultValue={m.alt}
                  placeholder="Alt text"
                  onBlur={(e) => { if (e.target.value !== m.alt) start(async () => { await updateMediaAlt(m.id, e.target.value); }); }}
                  className="py-[3px]!"
                  aria-label="Alt text"
                />
                <p className="type-body-small truncate text-subtlest" title={m.path}>{m.path.split("/").pop()} · {fmtBytes(m.size_bytes)}{m.width ? ` · ${m.width}×${m.height}` : ""}</p>
                <div className="flex items-center justify-between">
                  <Button spacing="compact" onClick={() => { navigator.clipboard.writeText(m.url); setCopied(m.id); setTimeout(() => setCopied(null), 1500); }}>
                    {copied === m.id ? <Check className="size-3.5 text-icon-success" aria-hidden /> : <Copy className="size-3.5" aria-hidden />} {copied === m.id ? "Copied" : "Copy URL"}
                  </Button>
                  <Button appearance="subtle" spacing="compact" iconOnly className="text-danger!" onClick={() => { if (confirm("Delete this file from storage?")) start(async () => { const r = await deleteMedia(m.id, m.path); if (r && !r.ok) alert(r.message); router.refresh(); }); }} aria-label="Delete"><Trash2 className="size-4" aria-hidden /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
