// إعدادات "الخيط الضوئي" حول حروف RAM — كل ما يضبط السماكة/مدى التموّج/
// السرعة/التوهج في مكان واحد. القيم بكسلات فعلية ثابتة (لا تتناسب مع حجم
// الخط) لأن المطلوب خط رفيع ثابت السماكة بصريًا (~1-2px) بغضّ النظر عن حجم
// الكلمة على الشاشة.

export interface RamEdgeStyle {
  /** سماكة الخط الأساسية بالبكسل */
  strokeWidthPx: number;
  /** أقصى انحراف للتموّج عن حافة الحرف الحقيقية، بالبكسل */
  wobbleAmplitudePx: number;
  /** طول دورة نسيج الضوضاء بالبكسل */
  noiseCyclePx: number;
  octaves: number;
  /** نسبة تذبذب baseFrequency حول قيمتها الأساسية (تغيّر سلس بلا قفزات) */
  freqWobbleRatio: number;
  /** مدة دورة تذبذب التردد بالثواني */
  freqDurationSec: number;
  /** مدة دورة نبض الشدة الخفيف بالثواني */
  opacityPulseDurationSec: number;
  glowDilatePx: number;
  glowBlurPx: number;
  glowOpacity: number;
  coreOpacity: number;
}

const desktop: RamEdgeStyle = {
  strokeWidthPx: 1.6,
  wobbleAmplitudePx: 3,
  noiseCyclePx: 30,
  octaves: 2,
  freqWobbleRatio: 0.35,
  freqDurationSec: 6,
  opacityPulseDurationSec: 5,
  glowDilatePx: 1.5,
  glowBlurPx: 5,
  glowOpacity: 0.4,
  coreOpacity: 0.95,
};

const mobile: RamEdgeStyle = {
  strokeWidthPx: 1.3,
  wobbleAmplitudePx: 2,
  noiseCyclePx: 26,
  octaves: 1,
  freqWobbleRatio: 0.3,
  freqDurationSec: 6,
  opacityPulseDurationSec: 5,
  glowDilatePx: 1.2,
  glowBlurPx: 3.5,
  glowOpacity: 0.32,
  coreOpacity: 0.9,
};

export const fireConfig = {
  // نسبة أبعاد صندوق "RAM" بخط Cairo ExtraBold إلى حجم الخط — لحساب مساحة
  // SVG كافية دون قياس DOM إضافي (القيم مضبوطة بصريًا لهذه الكلمة تحديدًا).
  textWidthPerFontSize: 2.05,
  textHeightPerFontSize: 0.86,

  // هامش ثابت بالبكسل حول صندوق النص يكفي لبروز التوهج/التموّج دون قصّ
  paddingPx: { desktop: 16, mobile: 12 },

  colors: { core: "#FFC65C", glow: "#FF8A24" },

  edge: { desktop, mobile },
} as const;
