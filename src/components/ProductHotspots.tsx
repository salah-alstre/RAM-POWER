"use client";

import { useState } from "react";

export interface Hotspot {
  id: string;
  /** موضع النقطة كنسبة مئوية من عرض/ارتفاع الصورة */
  xPct: number;
  yPct: number;
  title: string;
  body: string;
}

/**
 * نقاط تفاعلية فوق صورة المنتج: أزرار حقيقية (كيبورد ولمس) لا تعتمد على
 * hover فقط. الضغط يفتح بطاقة شرح قصيرة قرب النقطة نفسها؛ نقطة واحدة مفتوحة
 * في كل مرة، والضغط عليها مجددًا أو على أخرى يغلقها/يبدّلها.
 */
export default function ProductHotspots({ hotspots }: { hotspots: Hotspot[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="pointer-events-none absolute inset-0">
      {hotspots.map((h) => {
        const isOpen = openId === h.id;
        const anchorRight = h.xPct > 55;
        const anchorBottom = h.yPct > 65;
        return (
          <div
            key={h.id}
            className="pointer-events-auto absolute"
            style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : h.id)}
              aria-expanded={isOpen}
              aria-label={h.title}
              className={`relative -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-pearl/80 bg-charcoal/70 text-pearl shadow-lg backdrop-blur-sm transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                isOpen ? "scale-110 border-orange bg-orange text-charcoal" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 rounded-full ${
                  isOpen ? "" : "animate-[hotspot-pulse_1.8s_ease-out_3]"
                } bg-orange/40`}
              />
              <span className="relative text-sm font-extrabold leading-none">+</span>
            </button>

            {isOpen && (
              <div
                role="status"
                className={`absolute z-10 w-52 rounded-xl bg-pearl p-3.5 text-right shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] ${
                  anchorBottom ? "bottom-full mb-3" : "top-full mt-3"
                } ${anchorRight ? "right-0" : "left-0"}`}
              >
                <p className="text-sm font-extrabold text-charcoal">{h.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/65">{h.body}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
