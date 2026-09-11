"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export interface LightboxImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * عارض صورة مكبّرة: يقفل تمرير الخلفية، يحبس التركيز داخله، يدعم Escape
 * للإغلاق، ويعيد التركيز للعنصر الذي فتحه عند الإغلاق (عبر useFocusTrap).
 */
export default function ImageLightbox({
  image,
  onClose,
}: {
  image: LightboxImage | null;
  onClose: () => void;
}) {
  const open = image !== null;
  useBodyScrollLock(open);
  const containerRef = useFocusTrap(open);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/92 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="relative flex max-h-full max-w-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-full bg-pearl p-2.5 text-charcoal shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:left-auto sm:right-0 sm:top-0 sm:translate-x-0 sm:-translate-y-0"
        >
          <span className="sr-only">سكّر</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative max-h-[80svh] w-full overflow-hidden rounded-2xl bg-charcoal-soft">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="90vw"
            className="max-h-[80svh] w-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
