"use client";

import { useLayoutEffect } from "react";

let lockCount = 0;
let savedScrollY = 0;

/**
 * يمنع تمرير الصفحة خلف نافذة/عارض مفتوح، ويعيده تلقائيًا عند إغلاقه.
 * يدعم أكثر من قفل متزامن (عدّاد مشترك) حتى لا يفتح التمرير قبل أوانه إذا
 * أُغلقت نافذة بينما أخرى ما زالت مفتوحة.
 */
export function useBodyScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [locked]);
}
