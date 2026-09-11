// بيانات التواصل المركزية للشركة — من أسفل references/agents-original.png
// وحساب التواصل الاجتماعي من references/social-original.png
// لا تُضف أي منصة هنا دون رابط فعلي موثّق.

export interface CompanyContact {
  id: string;
  name: string;
  title: string;
  phone: string;
  whatsapp?: boolean;
}

export const companyContacts: CompanyContact[] = [
  {
    id: "sales-rep",
    name: "روان أجميل",
    title: "مندوبة مبيعات الشركة",
    phone: "0552820454",
  },
  {
    id: "global-sales-manager",
    name: "الأستاذ محمد المصري",
    title: "مدير مبيعات الشركة في العالم",
    phone: "+905383828174",
  },
];

// رقم واتساب الشركة الرسمي — مطابق في ملصق الوكلاء وبايو حساب TikTok
export const companyWhatsapp = "+972526866696";

export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

// حساب TikTok الوحيد الموثّق في المرجع. لا تُضف إنستغرام أو فيسبوك دون رابط فعلي مؤكد.
export const socialLinks: SocialLink[] = [
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@rampower_energy",
  },
];

export const brand = {
  name: "RAM POWER",
  tagline: "أكثر من مشروب طاقة... إحنا عيلة وحدة",
};
