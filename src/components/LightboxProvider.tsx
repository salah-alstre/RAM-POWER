"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ImageLightbox, { type LightboxImage } from "./ImageLightbox";

const LightboxContext = createContext<((image: LightboxImage) => void) | null>(null);

/** يوفّر عارض صورة واحدًا مشتركًا لكل الموقع — أي قسم يفتح صورة عبر useLightbox()
 * دون الحاجة لعارض منفصل خاص به. */
export default function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const open = useCallback((img: LightboxImage) => setImage(img), []);
  const close = useCallback(() => setImage(null), []);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <ImageLightbox image={image} onClose={close} />
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
