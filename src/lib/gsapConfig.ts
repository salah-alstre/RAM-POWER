import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// تسجيل الإضافة آمن حتى لو تكرر (Fast Refresh / استيراد متعدد) — GSAP يتجاهل التسجيل المكرر لنفس الإضافة.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

// نقاط الاستعلام المشتركة لـ gsap.matchMedia() في كل مكوّنات الحركة.
export const MQ = {
  motionOk: "(prefers-reduced-motion: no-preference)",
  desktopHover: "(hover: hover) and (pointer: fine) and (min-width: 768px)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;
