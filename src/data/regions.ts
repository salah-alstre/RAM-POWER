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
  /** كل النقاط الحالية تمثّل مركز منطقة خدمة، ولا تمثّل عنوان الوكيل. */
  pointType?: "service-area-center";
  /** دقة النقطة: مركز بلدية/بلدة معروفة تمثّل منطقة خدمة. */
  precision?: "municipality-center";
  coordinateSource?: {
    provider: "OpenStreetMap Nominatim";
    sourceUrl: string;
    verifiedOn: string;
  };
}

export const regions: Region[] = [
  { id: "west-bank", label: "الضفة الغربية" },
  {
    id: "wadi-ara",
    label: "وادي عارة",
    center: { lat: 32.5158385, lng: 35.152491 },
    anchorTown: "أم الفحم",
    pointType: "service-area-center",
    precision: "municipality-center",
    coordinateSource: {
      provider: "OpenStreetMap Nominatim",
      sourceUrl: "https://www.openstreetmap.org/relation/1380228",
      verifiedOn: "2026-09-11",
    },
  },
  {
    id: "baqa-gharbiya",
    label: "باقة الغربية",
    center: { lat: 32.4197144, lng: 35.0428311 },
    anchorTown: "باقة الغربية",
    pointType: "service-area-center",
    precision: "municipality-center",
    coordinateSource: {
      provider: "OpenStreetMap Nominatim",
      sourceUrl: "https://www.openstreetmap.org/relation/1398019",
      verifiedOn: "2026-09-11",
    },
  },
  {
    id: "south-beersheba",
    label: "الجنوب والسبع",
    center: { lat: 31.2457442, lng: 34.7925181 },
    anchorTown: "بئر السبع",
    pointType: "service-area-center",
    precision: "municipality-center",
    coordinateSource: {
      provider: "OpenStreetMap Nominatim",
      sourceUrl: "https://www.openstreetmap.org/relation/1377264",
      verifiedOn: "2026-09-11",
    },
  },
  {
    id: "center-triangle",
    label: "المركز والمثلث",
    center: { lat: 32.2346856, lng: 34.9544553 },
    anchorTown: "الطيرة",
    pointType: "service-area-center",
    precision: "municipality-center",
    coordinateSource: {
      provider: "OpenStreetMap Nominatim",
      sourceUrl: "https://www.openstreetmap.org/relation/1389567",
      verifiedOn: "2026-09-11",
    },
  },
  {
    id: "jerusalem-lod-ramla-jaffa",
    label: "القدس واللد والرملة ويافا",
    center: { lat: 31.7788472, lng: 35.2257856 },
    anchorTown: "القدس",
    pointType: "service-area-center",
    precision: "municipality-center",
    coordinateSource: {
      provider: "OpenStreetMap Nominatim",
      sourceUrl: "https://www.openstreetmap.org/relation/1381350",
      verifiedOn: "2026-09-11",
    },
  },
  { id: "north", label: "الشمال" },
];

export function regionLabel(id: string): string {
  return regions.find((r) => r.id === id)?.label ?? id;
}

export function regionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}
