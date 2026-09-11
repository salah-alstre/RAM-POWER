// مناطق التغطية كما وردت في ملصق الوكلاء الرسمي (references/agents-original.png)
export interface Region {
  id: string;
  label: string;
}

export const regions: Region[] = [
  { id: "west-bank", label: "الضفة الغربية" },
  { id: "wadi-ara", label: "وادي عارة" },
  { id: "baqa-gharbiya", label: "باقة الغربية" },
  { id: "south-beersheba", label: "الجنوب والسبع" },
  { id: "center-triangle", label: "المركز والمثلث" },
  { id: "jerusalem-lod-ramla-jaffa", label: "القدس واللد والرملة ويافا" },
  { id: "north", label: "الشمال" },
];

export function regionLabel(id: string): string {
  return regions.find((r) => r.id === id)?.label ?? id;
}
