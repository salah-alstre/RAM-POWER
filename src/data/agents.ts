// بيانات الوكلاء الرسميين — مستخرجة ومراجعة بصريًا من references/agents-original.png
// عدّل هذا الملف فقط عند تحديث شبكة الوكلاء. أرقام الهاتف نصوص (string) دائمًا لحماية الصفر البادئ.
// لا تُضف "whatsapp: true" إلا لجهة ورد صراحة في المصدر أنها تستقبل واتساب.

export interface Agent {
  id: string;
  name: string;
  title?: string;
  company?: string;
  regionIds: string[];
  cities?: string[];
  phone: string;
  whatsapp?: boolean;
}

export const agents: Agent[] = [
  {
    id: "agent-west-bank",
    name: "شحادة الشيخ الطريفي",
    title: "رجل الأعمال",
    regionIds: ["west-bank"],
    phone: "0592255555",
  },
  {
    id: "agent-wadi-ara",
    name: "رامي عسلي",
    title: "السيد",
    regionIds: ["wadi-ara"],
    cities: [
      "كفر قرع",
      "عارة",
      "عرعرة",
      "برطعة",
      "ميسر",
      "أم القطف",
      "الفريديس",
      "جسر الزرقاء",
    ],
    phone: "0507740004",
  },
  {
    id: "agent-baqa-gharbiya",
    name: "أحمد أبو مخ",
    title: "الأخ",
    regionIds: ["baqa-gharbiya"],
    cities: ["جت", "زيمر"],
    phone: "0547296668",
  },
  {
    id: "agent-south-1",
    name: "نزار أبو سلمي",
    title: "السيد",
    regionIds: ["south-beersheba"],
    phone: "0502284722",
  },
  {
    id: "agent-south-2",
    name: "أحمد زجينة",
    title: "السيد",
    regionIds: ["south-beersheba"],
    phone: "0507001010",
  },
  {
    id: "agent-south-3",
    name: "شريف صقور",
    title: "السيد",
    regionIds: ["south-beersheba"],
    phone: "0545330201",
  },
  {
    id: "agent-daas-group",
    name: "أمجد",
    title: "السيد",
    company: "شركة دعاس جروب",
    // نفس الوكيل يخدم منطقتين حسب الملصق الأصلي (المركز والمثلث + الشمال)
    regionIds: ["center-triangle", "north"],
    phone: "0505736360",
  },
  {
    id: "agent-hammam-tayyiba",
    name: "إبراهيم مصاروة",
    title: "السيد",
    company: "مشروبات الحمام الطيبة",
    regionIds: ["center-triangle"],
    phone: "0528013915",
  },
  {
    id: "agent-jerusalem",
    name: "عيسى فاروق",
    title: "الأخ",
    company: "شركة نخلة القدس",
    regionIds: ["jerusalem-lod-ramla-jaffa"],
    phone: "0586292713",
  },
];
