// تطبيع نص عربي لأغراض البحث فقط — لا يُستخدم لعرض أي نص، لأننا لا نريد
// تغيير الأسماء المعتمدة كما وردت، بل فقط تجاهل فروقات التشكيل والتطويل
// واختلافات الألف عند المطابقة (مثال: "امنيا" تطابق "أمنيا").
export function normalizeArabic(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[ً-ٰٟ]/g, "") // تشكيل
    .replace(/ـ/g, "") // تطويل
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase()
    .trim();
}

export function textIncludes(haystack: string, needle: string): boolean {
  const n = normalizeArabic(needle);
  if (!n) return true;
  return normalizeArabic(haystack).includes(n);
}
