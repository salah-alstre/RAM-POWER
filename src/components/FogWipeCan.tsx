"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { copy } from "@/data/copy";
import { useAnimationGate } from "@/hooks/useAnimationGate";

const GRID_COLS = 22;
const GRID_ROWS = 33;
const REVEAL_THRESHOLD = 0.5;
const BRUSH_RADIUS_RATIO = 0.09; // من عرض الحاوية
const MAX_DPR = 2;

interface Droplet {
  gx: number; // 0..1
  gy: number; // 0..1
  r: number; // نصف قطر نسبي من عرض الحاوية
  drift: number; // سعة الحركة الرأسية البطيئة (px محلي)
  period: number; // مدة الدورة بالثواني
  phase: number;
}

function makeDroplets(seedCount: number, allowDrift: boolean): Droplet[] {
  const positions = [
    { gx: 0.22, gy: 0.18 }, { gx: 0.72, gy: 0.14 }, { gx: 0.45, gy: 0.32 },
    { gx: 0.15, gy: 0.55 }, { gx: 0.82, gy: 0.48 }, { gx: 0.6, gy: 0.68 },
    { gx: 0.3, gy: 0.78 }, { gx: 0.78, gy: 0.82 },
  ];
  return positions.slice(0, seedCount).map((p, i) => ({
    gx: p.gx,
    gy: p.gy,
    r: 0.018 + ((i * 0.7) % 3) * 0.006,
    drift: allowDrift && i % 3 === 0 ? 3 + (i % 2) * 1.5 : 0,
    period: 7 + i * 1.7,
    phase: i * 1.3,
  }));
}

/**
 * تجربة "امسح الضباب" — صورة العلبة الباردة خلف طبقة ضباب وتكاثف قابلة
 * للمسح بالماوس أو الإصبع. الطبقة كلها Canvas 2D فوق صورة HTML عادية:
 * قناع مسح دائم (destination-in) يُعاد تركيبه فوق ضباب مُعاد رسمه كل إطار
 * (لتحريك القطرات) بلا أي قراءة بكسلات — تقدير المساحة الممسوحة عبر شبكة
 * خلايا بسيطة. إن تعطّل Canvas تبقى صورة HTML الأصلية ظاهرة كما هي.
 */
export default function FogWipeCan() {
  const { ref: gateRef, active, reducedMotion } = useAnimationGate<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fogBitmapRef = useRef<HTMLCanvasElement | null>(null);
  const brushRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<Uint8Array>(new Uint8Array(GRID_COLS * GRID_ROWS));
  const revealedCellsRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const dropletsRef = useRef<Droplet[]>([]);
  const startRef = useRef(performance.now());
  const readyRef = useRef(false);

  const [revealed, setRevealed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsTouchDevice(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // بناء نسيج الضباب مرة واحدة لكل حجم (يُعاد إنشاؤه فقط عند تغيّر الأبعاد)
  const buildFogBitmap = useCallback((w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return c;

    ctx.fillStyle = "rgba(226,228,231,0.9)";
    ctx.fillRect(0, 0, w, h);

    const blobs = 9;
    for (let i = 0; i < blobs; i++) {
      const bx = ((i * 137.5) % 100) / 100 * w;
      const by = ((i * 71.3) % 100) / 100 * h;
      const br = w * (0.22 + ((i * 0.37) % 1) * 0.2);
      const tone = 200 + Math.round(((i * 53) % 40));
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, `rgba(${tone},${tone + 4},${tone + 8},0.5)`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    // خطوط تكاثف رفيعة خفيفة غير منتظمة
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 14; i++) {
      const sx = ((i * 61.8) % 100) / 100 * w;
      let sy = ((i * 29.4) % 100) / 100 * h * 0.5;
      ctx.lineWidth = 1 + (i % 2);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      for (let s = 0; s < 4; s++) {
        sy += h * 0.06;
        ctx.lineTo(sx + Math.sin(i + s) * w * 0.02, sy);
      }
      ctx.stroke();
    }
    return c;
  }, []);

  const buildBrush = useCallback((radiusPx: number) => {
    const size = Math.ceil(radiusPx * 2);
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    if (!ctx) return c;
    const g = ctx.createRadialGradient(
      radiusPx, radiusPx, 0,
      radiusPx, radiusPx, radiusPx
    );
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.7, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(radiusPx, radiusPx, radiusPx, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }, []);

  const markGridRevealed = useCallback((cx: number, cy: number, r: number, w: number, h: number) => {
    const gx0 = Math.max(0, Math.floor(((cx - r) / w) * GRID_COLS));
    const gx1 = Math.min(GRID_COLS - 1, Math.ceil(((cx + r) / w) * GRID_COLS));
    const gy0 = Math.max(0, Math.floor(((cy - r) / h) * GRID_ROWS));
    const gy1 = Math.min(GRID_ROWS - 1, Math.ceil(((cy + r) / h) * GRID_ROWS));
    const grid = gridRef.current;
    for (let gy = gy0; gy <= gy1; gy++) {
      for (let gx = gx0; gx <= gx1; gx++) {
        const idx = gy * GRID_COLS + gx;
        if (!grid[idx]) {
          grid[idx] = 1;
          revealedCellsRef.current++;
        }
      }
    }
    return revealedCellsRef.current / (GRID_COLS * GRID_ROWS);
  }, []);

  const stampErase = useCallback((x: number, y: number, radiusPx: number) => {
    const mask = maskCanvasRef.current;
    const brush = brushRef.current;
    if (!mask || !brush) return;
    const mctx = mask.getContext("2d");
    if (!mctx) return;
    mctx.globalCompositeOperation = "destination-out";
    mctx.drawImage(brush, x - radiusPx, y - radiusPx, radiusPx * 2, radiusPx * 2);
  }, []);

  const fullReveal = useCallback((animated: boolean) => {
    const mask = maskCanvasRef.current;
    const { w, h } = sizeRef.current;
    if (!mask || !w || !h) return;
    const mctx = mask.getContext("2d");
    if (!mctx) return;

    if (!animated || reducedMotion) {
      mctx.clearRect(0, 0, w, h);
      setRevealed(true);
      return;
    }

    // لقطة من حالة القناع الحالية (بثقوب المسح المتراكمة) لتلاشيتها كاملة
    // تدريجيًا نحو الصفر — لا تُستبدَل بمستطيل موحّد حتى لا يظهر "رجوع ضباب"
    // وهمي فوق الأجزاء الممسوحة سلفًا أثناء الانتقال.
    const snapshot = document.createElement("canvas");
    snapshot.width = mask.width;
    snapshot.height = mask.height;
    snapshot.getContext("2d")?.drawImage(mask, 0, 0);

    const duration = 950;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.clearRect(0, 0, mask.width, mask.height);
      mctx.globalCompositeOperation = "source-over";
      mctx.globalAlpha = 1 - t;
      mctx.drawImage(snapshot, 0, 0);
      mctx.globalAlpha = 1;
      mctx.scale(dprRef.current, dprRef.current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        mctx.setTransform(1, 0, 0, 1, 0, 0);
        mctx.clearRect(0, 0, mask.width, mask.height);
        mctx.scale(dprRef.current, dprRef.current);
        setRevealed(true);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [reducedMotion]);

  // إعداد/إعادة إعداد اللوحات عند تغيّر الحجم
  const setupCanvases = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    sizeRef.current = { w, h };
    dprRef.current = dpr;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCanvasReady(false);
      return;
    }

    // أعد بناء قناع المسح مع الحفاظ على النسبة الممسوحة سابقًا (حسب الشبكة) عند تغيّر الحجم
    const prevGrid = gridRef.current;
    const mask = document.createElement("canvas");
    mask.width = w * dpr;
    mask.height = h * dpr;
    const mctx = mask.getContext("2d");
    if (mctx) {
      mctx.scale(dpr, dpr);
      mctx.fillStyle = "#000";
      mctx.fillRect(0, 0, w, h);
      mctx.globalCompositeOperation = "destination-out";
      const cellW = w / GRID_COLS;
      const cellH = h / GRID_ROWS;
      for (let gy = 0; gy < GRID_ROWS; gy++) {
        for (let gx = 0; gx < GRID_COLS; gx++) {
          if (prevGrid[gy * GRID_COLS + gx]) {
            mctx.fillRect(gx * cellW - 1, gy * cellH - 1, cellW + 2, cellH + 2);
          }
        }
      }
    }
    maskCanvasRef.current = mask;

    fogBitmapRef.current = buildFogBitmap(w, h);
    brushRef.current = buildBrush(w * BRUSH_RADIUS_RATIO);
    dropletsRef.current = makeDroplets(6, !reducedMotion);
    readyRef.current = true;
    setCanvasReady(true);
  }, [buildFogBitmap, buildBrush, reducedMotion]);

  useLayoutEffect(() => {
    setupCanvases();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(setupCanvases);
    });
    ro.observe(container);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // حلقة الرسم: ترسم الضباب + القطرات ثم تطبّق قناع المسح — تتوقف نهائيًا بعد الكشف الكامل
  useEffect(() => {
    if (revealed || !canvasReady) return;
    const canvas = canvasRef.current;
    const mask = maskCanvasRef.current;
    const fog = fogBitmapRef.current;
    if (!canvas || !mask || !fog) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const { w, h } = sizeRef.current;
      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(fog, 0, 0, w, h);

      const t = (performance.now() - startRef.current) / 1000;
      for (const d of dropletsRef.current) {
        const dy = d.drift ? Math.sin((t + d.phase) * ((2 * Math.PI) / d.period)) * d.drift : 0;
        const cx = d.gx * w;
        const cy = d.gy * h + dy;
        const r = d.r * w;
        const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 0, cx, cy, r);
        g.addColorStop(0, "rgba(255,255,255,0.75)");
        g.addColorStop(0.55, "rgba(215,222,228,0.45)");
        g.addColorStop(1, "rgba(180,190,198,0.12)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 1.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.28, cy - r * 0.4, r * 0.22, r * 0.3, -0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, w, h);

      rafRef.current = requestAnimationFrame(render);
    };

    if (active) {
      rafRef.current = requestAnimationFrame(render);
    } else {
      // ارسم إطارًا ثابتًا واحدًا فقط ليبقى المحتوى ظاهرًا دون تشغيل حلقة الرسم
      render();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [active, revealed, reducedMotion, canvasReady]);

  const doWipe = useCallback(
    (x: number, y: number) => {
      if (revealed) return;
      const { w, h } = sizeRef.current;
      const radiusPx = w * BRUSH_RADIUS_RATIO;
      const last = lastPointRef.current;

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const step = Math.max(radiusPx * 0.35, 4);
        const steps = Math.min(40, Math.ceil(dist / step));
        for (let i = 1; i <= steps; i++) {
          const px = last.x + (dx * i) / steps;
          const py = last.y + (dy * i) / steps;
          stampErase(px, py, radiusPx);
        }
      } else {
        stampErase(x, y, radiusPx);
      }
      lastPointRef.current = { x, y };

      const ratio = markGridRevealed(x, y, radiusPx, w, h);
      if (ratio >= REVEAL_THRESHOLD) {
        fullReveal(true);
      }
    },
    [revealed, stampErase, markGridRevealed, fullReveal]
  );

  const localPoint = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // كمبيوتر: يبدأ المسح بمجرد تحريك الماوس فوق الصورة
  const onMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice) return;
    const p = localPoint(e.clientX, e.clientY);
    if (p) doWipe(p.x, p.y);
  };
  const onMouseLeave = () => {
    lastPointRef.current = null;
  };

  // هاتف: المسح مباشرة باللمس؛ touch-action يمنع تمرير الصفحة داخل مساحة الضباب.
  const onTouchMove = (e: React.TouchEvent) => {
    if (revealed) return;
    const t = e.touches[0];
    if (!t) return;
    const p = localPoint(t.clientX, t.clientY);
    if (p) doWipe(p.x, p.y);
  };
  const onTouchEnd = () => {
    lastPointRef.current = null;
  };

  function resetFog() {
    gridRef.current = new Uint8Array(GRID_COLS * GRID_ROWS);
    revealedCellsRef.current = 0;
    lastPointRef.current = null;
    startRef.current = performance.now();
    setupCanvases();
    setRevealed(false);
  }

  return (
    <div ref={gateRef}>
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[2/3] w-full max-w-[360px] overflow-hidden rounded-[1.5rem] ring-1 ring-white/10"
      >
        <Image
          src="/images/ram/ram-cold.png"
          alt={copy.coldCan.imageAlt}
          fill
          sizes="(min-width: 768px) 360px, 70vw"
          className="object-cover"
        />

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            touchAction: !revealed && canvasReady ? "none" : "auto",
            cursor: !isTouchDevice && !revealed ? "crosshair" : "default",
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchMove}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        />

        {!revealed && !isTouchDevice && (
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-charcoal/60 px-3 py-1 text-[11px] font-semibold text-pearl/90 backdrop-blur-sm">
            {copy.coldCan.hintDesktop}
          </p>
        )}

        {!revealed && isTouchDevice && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <p
              className="rounded-full bg-orange px-4 py-2 text-xs font-bold text-charcoal shadow-lg"
            >
              {copy.coldCan.tryWipe}
            </p>
          </div>
        )}

        {revealed && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <button
              type="button"
              onClick={resetFog}
              className="rounded-full border border-pearl/50 bg-charcoal/70 px-4 py-2 text-xs font-bold text-pearl backdrop-blur-sm active:scale-95"
            >
              {copy.coldCan.resetFog}
            </button>
          </div>
        )}
      </div>

      {!revealed && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => fullReveal(true)}
            className="text-xs font-bold text-silver underline decoration-dotted underline-offset-4 transition-colors hover:text-orange"
          >
            {copy.coldCan.seeFull}
          </button>
        </div>
      )}
    </div>
  );
}
