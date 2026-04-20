"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DropAnimation } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type ImageDoc = {
  _id: Id<"images">;
  storageId: Id<"_storage">;
  rank: number;
  category: string;
  originalFilename?: string;
  url: string | null;
};

const dropAnimation: DropAnimation = {
  duration: 220,
  easing: "cubic-bezier(0.2, 0, 0, 1)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.35" } },
  }),
};

export function GalleryManager({
  developmentId,
}: {
  developmentId: Id<"developments">;
}) {
  const data = useQuery(api.images.listForDevelopment, { developmentId });
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const createImage = useMutation(api.images.createImage);
  const updateRank = useMutation(api.images.updateRank);
  const renormalise = useMutation(api.images.renormaliseRanks);
  const deleteImage = useMutation(api.images.deleteImage);
  const setHero = useMutation(api.images.setDevelopmentHero);

  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<{ name: string; progress: number }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [localOrder, setLocalOrder] = useState<ImageDoc[] | null>(null);
  const [activeId, setActiveId] = useState<Id<"images"> | null>(null);

  const images = localOrder ?? data?.images ?? [];
  const heroStorageId = data?.heroStorageId;
  const active = activeId ? images.find((i) => i._id === activeId) : null;

  useEffect(() => {
    if (!data) return;
    setLocalOrder(null);
  }, [data?.images.map((i) => `${i._id}:${i.rank}`).join(",")]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (arr.length === 0) return;
      setUploadQueue((q) => [...q, ...arr.map((f) => ({ name: f.name, progress: 0 }))]);
      for (const file of arr) {
        try {
          const uploadUrl = await generateUploadUrl({});
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!response.ok) throw new Error(`Upload failed (${response.status})`);
          const { storageId } = (await response.json()) as {
            storageId: Id<"_storage">;
          };
          await createImage({
            developmentId,
            storageId,
            originalFilename: file.name,
            category: inferCategory(file.name),
          });
          setUploadQueue((q) =>
            q.map((u) => (u.name === file.name ? { ...u, progress: 100 } : u)),
          );
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          setUploadQueue((q) =>
            q.map((u) => (u.name === file.name ? { ...u, progress: -1 } : u)),
          );
        }
      }
      setTimeout(() => setUploadQueue([]), 1500);
    },
    [createImage, developmentId, generateUploadUrl],
  );

  const sensors = useSensors(
    // Shorter distance = feels more responsive, but still lets plain clicks through.
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as Id<"images">);
  }

  async function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i._id === active.id);
    const newIndex = images.findIndex((i) => i._id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(images, oldIndex, newIndex);
    setLocalOrder(reordered);
    const moved = reordered[newIndex];
    const prev = reordered[newIndex - 1];
    const next = reordered[newIndex + 1];
    let newRank: number;
    if (!prev) newRank = next ? next.rank - 10 : 10;
    else if (!next) newRank = prev.rank + 10;
    else newRank = (prev.rank + next.rank) / 2;
    await updateRank({ imageId: moved._id, rank: newRank });
    if (Math.abs(newRank - Math.round(newRank)) > 0.01) {
      await renormalise({ developmentId });
    }
  }

  async function onDelete(img: ImageDoc) {
    if (!confirm(`Delete ${img.originalFilename ?? "image"}? Cannot be undone.`)) return;
    await deleteImage({ imageId: img._id });
  }

  async function onSetHero(img: ImageDoc) {
    await setHero({ developmentId, storageId: img.storageId });
  }

  async function onClearHero() {
    await setHero({ developmentId, storageId: undefined });
  }

  if (data === undefined) {
    return <p className="text-[12px] text-charcoal/40">Loading gallery…</p>;
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "border-2 border-dashed p-8 text-center transition-colors",
          dragOver
            ? "border-charcoal bg-charcoal/5"
            : "border-charcoal/25 bg-white",
        )}
      >
        <p className="font-heading text-[11px] uppercase tracking-[0.3em] text-charcoal">
          Drop images here
        </p>
        <p className="mt-2 text-[12px] text-charcoal/60">
          or{" "}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="underline hover:text-charcoal"
          >
            browse to choose files
          </button>
          . Accepted: JPG, PNG, WebP.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploadQueue.length > 0 && (
        <div className="mt-4 space-y-1">
          {uploadQueue.map((u) => (
            <div
              key={u.name}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="truncate">{u.name}</span>
              <span
                className={
                  u.progress === -1
                    ? "text-red-600"
                    : u.progress === 100
                      ? "text-green-700"
                      : "text-charcoal/50"
                }
              >
                {u.progress === -1
                  ? "Failed"
                  : u.progress === 100
                    ? "Uploaded"
                    : "Uploading…"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-b border-charcoal/15 pb-3">
        <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
          {images.length} image{images.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-3">
          {heroStorageId && (
            <button
              type="button"
              onClick={onClearHero}
              className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 hover:text-charcoal"
            >
              Clear hero
            </button>
          )}
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
            Drag to reorder · Rank 1 = first shown
          </p>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="mt-8 text-center text-[13px] text-charcoal/50">
          No images yet. Drop some above.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext items={images.map((i) => i._id)} strategy={rectSortingStrategy}>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((img, idx) => (
                <ImageTile
                  key={img._id}
                  image={img}
                  rankIndex={idx + 1}
                  isHero={img.storageId === heroStorageId}
                  onDelete={() => onDelete(img)}
                  onSetHero={() => onSetHero(img)}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation}>
            {active ? <OverlayTile image={active} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

function ImageTile({
  image,
  rankIndex,
  isHero,
  onDelete,
  onSetHero,
}: {
  image: ImageDoc;
  rankIndex: number;
  isHero: boolean;
  onDelete: () => void;
  onSetHero: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image._id,
    animateLayoutChanges: () => true,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
    opacity: isDragging ? 0.25 : 1,
    zIndex: isDragging ? 0 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative border bg-white transition-[box-shadow,border-color] duration-200",
        isHero ? "border-gold ring-2 ring-gold/40" : "border-charcoal/15",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="relative block aspect-[4/3] w-full cursor-grab overflow-hidden bg-charcoal/5 touch-none select-none active:cursor-grabbing"
      >
        {image.url ? (
          <Image
            src={image.url}
            alt={image.originalFilename ?? ""}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover pointer-events-none"
            draggable={false}
            unoptimized
          />
        ) : (
          <span className="flex h-full items-center justify-center text-[10px] text-charcoal/40">
            no preview
          </span>
        )}
        <span className="absolute top-2 left-2 bg-charcoal px-1.5 py-0.5 font-heading text-[9px] tracking-[0.2em] text-cream pointer-events-none">
          {String(rankIndex).padStart(2, "0")}
        </span>
        {isHero && (
          <span className="absolute top-2 right-2 bg-gold px-1.5 py-0.5 font-heading text-[9px] tracking-[0.2em] text-charcoal pointer-events-none">
            HERO
          </span>
        )}
      </button>
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <span
          className="truncate text-[10px] text-charcoal/60"
          title={image.originalFilename}
        >
          {image.originalFilename ?? "image"}
        </span>
        <div className="flex items-center gap-1">
          {!isHero && (
            <button
              type="button"
              onClick={onSetHero}
              className="rounded px-1.5 py-0.5 font-heading text-[9px] uppercase tracking-[0.2em] text-charcoal/60 hover:bg-gold/20 hover:text-charcoal"
              title="Set as hero"
            >
              Hero
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="rounded px-1.5 py-0.5 font-heading text-[9px] uppercase tracking-[0.2em] text-charcoal/60 hover:bg-red-100 hover:text-red-600"
            title="Delete"
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight tile rendered in the <DragOverlay> — mirrors the dragged item
 * but sits outside the reflowing list so the motion stays buttery.
 */
function OverlayTile({ image }: { image: ImageDoc }) {
  return (
    <div className="group relative border border-charcoal bg-white shadow-[0_18px_40px_-12px_rgba(35,31,32,0.45)] ring-1 ring-gold/30 rotate-[1.25deg] scale-[1.03] cursor-grabbing">
      <div className="relative block aspect-[4/3] w-full overflow-hidden bg-charcoal/5">
        {image.url ? (
          <Image
            src={image.url}
            alt={image.originalFilename ?? ""}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            draggable={false}
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <span className="truncate text-[10px] text-charcoal/60">
          {image.originalFilename ?? "image"}
        </span>
      </div>
    </div>
  );
}

function inferCategory(filename: string): "cgi" | "interior" | "photo" | "siteplan" | "floorplan" | "other" {
  const f = filename.toLowerCase();
  if (f.includes("cgi") || f.startsWith("cgi")) return "cgi";
  if (f.includes("interior")) return "interior";
  if (f.includes("siteplan") || f.includes("aerial")) return "siteplan";
  if (f.includes("floorplan")) return "floorplan";
  if (f.includes("photo")) return "photo";
  return "other";
}
