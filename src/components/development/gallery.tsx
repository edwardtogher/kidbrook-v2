"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface GalleryProps {
  thumbnails: string[];
  allImages: string[];
  developmentName: string;
}

export function Gallery({
  thumbnails,
  allImages,
  developmentName,
}: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;
  const total = allImages.length;

  const closeLightbox = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % total)),
    [total],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, next, prev]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {thumbnails.map((src, i) => {
          const allIdx = allImages.indexOf(src);
          return (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(allIdx >= 0 ? allIdx : i)}
              className="group relative block text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={src}
                  alt={`${developmentName} — plate ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/0 to-charcoal/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between px-4 pb-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-cream/80">
                    Pl. {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="border-b border-cream pb-0.5 text-[11px] uppercase tracking-[0.3em] text-cream">
                    View &rarr;
                  </span>
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gold transition-[width] duration-700 ease-out group-hover:w-full" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] sm:text-[11px]">
                <span className="text-gold">
                  Pl. {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-cream/60 transition-colors duration-200 group-hover:text-gold">
                  View
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {total > thumbnails.length && (
        <div className="mt-8 flex justify-center sm:mt-10">
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="group inline-flex items-center gap-3 border border-cream bg-transparent px-8 py-4 text-[12px] uppercase tracking-[0.3em] text-cream transition-colors duration-300 hover:bg-cream hover:text-charcoal"
          >
            <span>View all {total} images</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(o) => !o && closeLightbox()}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[92vh] max-h-none w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-none bg-charcoal p-0 text-cream ring-1 ring-cream/10 sm:max-w-6xl"
        >
          <DialogTitle className="sr-only">
            Gallery — {developmentName}
          </DialogTitle>

          <div className="flex items-center justify-between border-b border-cream/20 px-5 py-4 sm:px-8">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
              {developmentName} &nbsp;&mdash;&nbsp; Gallery
            </span>
            <div className="flex items-center gap-6">
              <span className="font-mono text-[12px] tabular-nums text-cream/70">
                {index !== null ? String(index + 1).padStart(2, "0") : "00"}
                <span className="mx-1 text-cream/30">/</span>
                {String(total).padStart(2, "0")}
              </span>
              <DialogClose
                render={
                  <button
                    type="button"
                    aria-label="Close gallery"
                    className="text-[12px] uppercase tracking-[0.3em] text-cream/80 underline decoration-1 underline-offset-4 hover:text-gold"
                  />
                }
              >
                Close
              </DialogClose>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden bg-charcoal">
            {index !== null && (
              <Image
                src={allImages[index]}
                alt={`${developmentName} — plate ${index + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            )}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex h-14 w-14 -translate-y-1/2 items-center justify-center text-cream/70 transition-colors hover:text-gold sm:left-5"
            >
              <span className="text-2xl font-light">&larr;</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex h-14 w-14 -translate-y-1/2 items-center justify-center text-cream/70 transition-colors hover:text-gold sm:right-5"
            >
              <span className="text-2xl font-light">&rarr;</span>
            </button>
          </div>

          <div className="border-t border-cream/20 bg-charcoal px-3 py-3 sm:px-6 sm:py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {allImages.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === index}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden transition-opacity sm:h-16 sm:w-24 ${
                    i === index
                      ? "opacity-100 ring-1 ring-gold"
                      : "opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
