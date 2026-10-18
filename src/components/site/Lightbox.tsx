"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = { id: number; url: string; caption: string };

export function Lightbox({ photos }: { photos: Photo[] }) {
  const [i, setI] = useState<number | null>(null);
  const close = useCallback(() => setI(null), []);
  const go = useCallback((d: number) => setI((v) => (v === null ? v : (v + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [i, close, go]);

  if (!photos.length) return <p className="card p-8 text-center text-navy/70">Photos coming soon.</p>;

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {photos.map((p, idx) => (
          <button key={p.id} type="button" onClick={() => setI(idx)} className="group mb-3 block w-full overflow-hidden rounded-xl bg-royal-50 text-left">
            <Image src={p.url} alt={p.caption || "Gallery photo"} width={800} height={600} sizes="(min-width:1024px) 25vw, 50vw" className="h-auto w-full transition duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {i !== null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-navy/95 p-4" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <div className="flex justify-end">
            <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Close"><X className="size-6" /></button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[i].url} alt={photos[i].caption || "Gallery photo"} fill sizes="100vw" className="object-contain" />
            {photos.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute left-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white" aria-label="Previous"><ChevronLeft className="size-6" /></button>
                <button type="button" onClick={() => go(1)} className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white" aria-label="Next"><ChevronRight className="size-6" /></button>
              </>
            )}
          </div>
          <p className="pt-3 text-center text-sm text-white/85">{photos[i].caption} <span className="text-white/50">({i + 1}/{photos.length})</span></p>
        </div>
      )}
    </>
  );
}
