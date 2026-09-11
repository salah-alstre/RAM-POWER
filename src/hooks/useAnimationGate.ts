"use client";

import { useEffect, useRef, useState } from "react";

/**
 * يتحكم في تشغيل/إيقاف حركة زخرفية مستمرة (قطرات الماء، التطفّي الخفيف):
 * يوقفها خارج نطاق الرؤية عبر IntersectionObserver، ويوقفها عند مغادرة التبويب،
 * ويعطّلها كليًا عند تفعيل prefers-reduced-motion.
 */
export function useAnimationGate<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const onVisibility = () =>
      setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, active: inView && tabVisible && !reducedMotion, reducedMotion };
}
