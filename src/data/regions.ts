// مناطق التغطية كما وردت في ملصق الوكلاء الرسمي (references/agents-original.png)
//
// كل منطقة قد تحمل "مركزًا جغرافيًا" لعرضه على خريطة الوكلاء. هذا المركز
// ليس عنوان أي وكيل، بل نقطة تمثيلية لمنطقة الخدمة نفسها — عادة إحداثيات
// بلدة معروفة ومؤكدة تقع ضمن المنطقة أو تحمل اسمها. لا نُدرج مركزًا إلا
// لمنطقة نثق بدقة تمثيلها؛ المناطق الواسعة جدًا أو غير المسماة بمكان محدد
// (الضفة الغربية، الشمال) تُركت بلا مركز خرائطي عمدًا بدل اختراع نقطة، مع
// إبقائها كاملة في الفلاتر والقوائم.
export interface Region {
  id: string;
  label: string;
  /** مركز جغرافي موثّق لعرضه على الخريطة، إن وُجد */
  center?: { lat: number; lng: number };
  /** اسم البلدة/المدينة المستخدمة كنقطة تمثيلية، للشفافية في الواجهة والتقرير */
  anchorTown?: string;
  /** دقة النقطة: مركز بلدة معروفة تمثّل منطقة خدمة، وليست عنوان محل */
  precision?: "town-center";
}

export const regions: Region[] = [
  { id: "west-bank", label: "الضفة الغربية" },
  {
    id: "wadi-ara",
    label: "وادي عارة",
    center: { lat: 32.5169, lng: 35.1518 },
    anchorTown: "أم الفحم",
    precision: "town-center",
  },
  {
    id: "baqa-gharbiya",
    label: "باقة الغربية",
    center: { lat: 32.4136, lng: 35.0431 },
    anchorTown: "باقة الغربية",
    precision: "town-center",
  },
  {
    id: "south-beersheba",
    label: "الجنوب والسبع",
    center: { lat: 31.253, lng: 34.7915 },
    anchorTown: "بئر السبع",
    precision: "town-center",
  },
  {
    id: "center-triangle",
    label: "المركز والمثلث",
    center: { lat: 32.2333, lng: 34.95 },
    anchorTown: "الطيرة",
    precision: "town-center",
  },
  {
    id: "jerusalem-lod-ramla-jaffa",
    label: "القدس واللد والرملة ويافا",
    center: { lat: 31.7683, lng: 35.2137 },
    anchorTown: "القدس",
    precision: "town-center",
  },
  { id: "north", label: "الشمال" },
];

export function regionLabel(id: string): string {
  return regions.find((r) => r.id === id)?.label ?? id;
}

export function regionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}
