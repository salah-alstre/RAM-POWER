"use client";

import { useEffect, useState } from "react";

/**
 * تخزين محلي بسيط لقيمة نصية واحدة (مثل المنطقة المختارة) — لا يُستخدم إطلاقًا
 * لأي موقع جغرافي دقيق، فقط لتذكّر اختيار المستخدم النصي بين الزيارات.
 * يبدأ دائمًا بالقيمة الافتراضية أثناء الريندر الأول (تطابق الخادم) ثم يقرأ
 * التخزين المحلي بعد التركيب لتفادي اختلاف hydration.
 */
export function useLocalStorage(key: string, defaultValue: string | null) {
  const [value, setValue] = useState<string | null>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(stored);
    } catch {
      // تخزين غير متاح (وضع خاص مثلًا) — نبقى على القيمة الافتراضية بصمت
    }
    setHydrated(true);
  }, [key]);

  function update(next: string | null) {
    setValue(next);
    try {
      if (next === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, next);
    } catch {
      // تجاهل بصمت
    }
  }

  return [value, update, hydrated] as const;
}
