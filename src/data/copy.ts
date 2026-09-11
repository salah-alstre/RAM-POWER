// كل نصوص الواجهة (غير بيانات الوكلاء والتواصل) في مكان واحد، بلهجة فلسطينية
// بسيطة وقريبة من الناس. عدّل هنا فقط لتغيير أي نص ظاهر في الموقع.
//
// ملاحظات مهمة قبل أي تعديل:
// - لا تُضف ادعاءات صحية أو وعودًا بالطاقة/التركيز/الأداء غير موثّقة (راجع src/data/product.ts).
// - لا تفترض نكهة أو مكوّنات لم تُذكر رسميًا.
// - أسماء الوكلاء والشركات والمناطق والأرقام في src/data/agents.ts و
//   src/data/contact.ts تبقى كما اعتمدناها حرفيًا؛ هذا الملف لا يغيّرها.

export const copy = {
  meta: {
    title: "RAM POWER | رام باور",
    description:
      "موقع رام باور الرسمي — تعرّف على المشروب، شوف المنتج عن قرب، ولاقِ وكيل منطقتك.",
    ogAlt: "علبة رام باور مع رذاذ الماء",
  },

  skipLink: "تخطي إلى المحتوى",

  nav: {
    mainLabel: "التنقل الرئيسي",
    footerLabel: "روابط التذييل",
    home: "الرئيسية",
    about: "عن رام",
    agents: "الوكلاء",
    contact: "احكي معنا",
    findAgent: "وين بلاقي رام؟",
    menuSr: "القائمة",
    menuOpen: "افتح القائمة",
    menuClose: "سكّر القائمة",
  },

  hero: {
    kicker: "RAM POWER",
    headingPlain: "هاي",
    headingAccent: "رام باور",
    description: "وين ما كانت طلعتك، خلّي رام باور معك.",
    ctaPrimary: "شوف رام عن قرب",
    ctaSecondary: "وين بلاقي رام؟",
    scrollCue: "كمّل وشوف",
    pauseMotion: "وقّف حركة الخلفية",
    playMotion: "شغّل حركة الخلفية",
  },

  sceneDivider: {
    sr: "RAM POWER — مشروب طاقة — 250 مل",
  },

  about: {
    kicker: "تعرّف على رام باور",
    heading: "رام باور… افتحها وعيش الجو",
    intro:
      "رام باور مشروب طاقة بحجم عملي. برّده، خده معك، واقرأ معلومات المنتج كاملة من العبوة.",
    sizeLabel: "الحجم",
    sizeUnit: "مل",
    categoryLabel: "النوع",
    imageAlt: "علبتين رام باور واقفين بين قطع ثلج، على سطح أبيض مبلول",
    packageInfoCta: "شوف تفاصيل العبوة",
    highlights: [
      {
        title: "بتنقدم باردة",
        body: "حطّها بالثلاجة وخليها جاهزة للطلعة أو القعدة.",
      },
      {
        title: "حجمها 250 مل",
        body: "حجم العبوة الرسمي مطبوع بوضوح على واجهتها.",
      },
      {
        title: "المعلومة من مصدرها",
        body: "شوف التحذيرات والمكونات والقيم المطبوعة مباشرة على العبوة.",
      },
    ],
  },

  coldCan: {
    kicker: "برودة حقيقية",
    heading: "امسح الضباب... وشوفها عن قرب",
    imageAlt: "علبة رام باور عليها قطرات ماء، على خلفية داكنة",
    hintDesktop: "مرّر الماوس عالصورة",
    hintTouch: "امسح بإصبعك عالصورة",
    tryWipe: "جرّب المسح",
    exitWipe: "اطلع من وضع المسح",
    doneWiping: "خلصت",
    seeFull: "شوف الصورة كاملة",
    resetFog: "رجّع الضباب",
  },

  detail: {
    kicker: "شوف التفاصيل",
    heading: "هاي رام، بكل تفاصيلها",
    body: "اضغط على أي نقطة عالصورة تعرف أكثر، أو كبّرها تقرا الملصق كامل.",
    imageAlt: "صورة قريبة لشعار رام باور وقطرات الماء على العلبة",
    expandCta: "كبّر الصورة",
    hotspotLabelTitle: "كافيين وفيتامينات",
    hotspotLabelBody: "مكتوبة على واجهة العلبة نفسها، فوق شعار رام باور.",
    hotspotSizeTitle: "250 مل",
    hotspotSizeBody: "الحجم الرسمي للعلبة، مطبوع تحت شعار Energy Drink.",
  },

  gallery: {
    kicker: "من قريب",
    heading: "رام، من قريب",
    body: "لمحات من العلبة بزوايا مختلفة.",
    items: [
      { alt: "علبة رام باور بخلفية داكنة ورذاذ ماء" },
      { alt: "علبتا رام باور بين قطع الثلج" },
      { alt: "قرب من ملصق رام باور وقطرات الماء" },
    ],
  },

  agents: {
    kicker: "الوكلاء",
    heading: "وين بلاقي رام؟",
    description: "اختار منطقتك، وشوف مين الوكيل اللي بخدمك.",
    searchSr: "دوّر على اسم الوكيل أو البلد",
    searchPlaceholder: "دوّر على اسم الوكيل أو البلد...",
    resetLabel: "شيل الفلاتر",
    regionGroupLabel: "اختار منطقتك",
    allRegions: "كل المناطق",
    resultsFound: (count: number, total: number) =>
      `لقينا ${count} من أصل ${total}`,
    resultsEmpty: "ولا نتيجة",
    emptyTitle: "ما لقينا نتيجة لهالبحث",
    emptyBody: "جرّب اسم البلد، اعرض كل المناطق، أو احكي معنا.",
    emptyReset: "شيل الفلاتر",
    callLabel: "اتصل",
    whatsappLabel: "واتساب",
    callAgent: "اتصل بالوكيل",

    regionPickerHeading: "من أي منطقة إنت؟",
    regionPickerBody: "بنفلترلك النتائج على طول.",
    regionMatchCount: (count: number) =>
      count === 0
        ? "ولا وكيل مسجّل بهالمنطقة بعد"
        : count === 1
          ? "وكيل واحد بخدم منطقتك"
          : `${count} وكلاء بخدموا منطقتك`,
    clearSavedRegion: "امسح اختياري",
    notFoundRegion: "مش لاقي منطقتك؟",
    notFoundMessage: (regionQuery: string) =>
      `السلام عليكم، ما لقيت منطقتي (${regionQuery || "..."}) بموقع رام باور. ممكن تساعدوني ألاقي أقرب وكيل إلي؟`,

    viewMap: "الخريطة",
    viewList: "القائمة",
    mapLoading: "عم نجهّز الخريطة...",
    mapUnavailable: "ما قدرنا نحمّل الخريطة هلق. قائمة الوكلاء تحت لسا شغالة.",
    mapNoPointNote:
      "هالمنطقة وسيعة ما عنا لها نقطة مؤكدة عالخريطة بعد، بس وكلاؤها موجودين بالقائمة.",
    mapPointDisclaimer: "النقطة بتمثّل منطقة الخدمة، مش عنوان المحل.",
    mapZoomIn: "تكبير",
    mapZoomOut: "تصغير",
    showAllRegions: "عرض كل المناطق",
    clusterOpen: (count: number) => `${count} وكلاء بهالمنطقة — اضغط لعرضهم`,
    serviceCitiesLabel: "بتخدم",
  },

  copyButton: {
    idleLabel: "انسخ الرقم",
    copiedLabel: "تم نسخ الرقم",
    errorLabel: "ما انسخ",
    tooltipCopied: "تم نسخ الرقم ✓",
    ariaLabel: (value: string) => `انسخ الرقم ${value}`,
    announceCopied: "تم نسخ الرقم",
    announceError: "ما قدرنا ننسخ الرقم. بتقدر تحدّده وتنسخه مباشرة.",
  },

  shopOwner: {
    kicker: "لأصحاب المحلات",
    heading: "عندك محل وبدك رام عندك؟",
    body: "عبّي المعلومات الأساسية وكمّل الحديث معنا عالواتساب.",
    steps: ["عرّفنا على محلك", "اختار منطقتك", "احكي معنا"],
    shopNameLabel: "اسم المحل",
    shopNamePlaceholder: "مثال: سوبرماركت الأمل",
    regionLabel: "المنطقة",
    regionPlaceholder: "اختار منطقتك",
    messageLabel: "رسالة (اختياري)",
    messagePlaceholder: "أي تفاصيل حابب تضيفها...",
    submitCta: "كمّل عالواتساب",
    afterSubmitNote: "بيفتحلك واتساب على رسالة جاهزة — إنت اللي بترسلها.",
    validationError: "عبّي اسم المحل والمنطقة الأول.",
    waMessage: (shop: string, region: string, message: string) =>
      `السلام عليكم، معي محل اسمه "${shop}" بمنطقة ${region}، وحابب أعرف كيف بصير عندي رام باور.${
        message ? `\n\nملاحظة: ${message}` : ""
      }`,
  },

  faq: {
    kicker: "أسئلة سريعة",
    heading: "يمكن هاد اللي بدك تعرفه",
    items: [
      {
        q: "وين بلاقي رام؟",
        a: "دور على منطقتك بقسم الوكلاء فوق، بتلاقي كل وكيل ورقمه.",
      },
      {
        q: "كيف أتواصل مع وكيل منطقتي؟",
        a: "اضغط اتصل أو انسخ الرقم من بطاقة الوكيل، أو من النقطة عالخريطة.",
      },
      {
        q: "عندي محل، كيف بحكي معكم؟",
        a: "عبّي نموذج \"عندك محل وبدك رام عندك؟\" وكمّل عالواتساب مباشرة.",
      },
      {
        q: "وين بشوف معلومات العبوة؟",
        a: "بقسم \"شوف التفاصيل\"، كبّر الصورة تقرا كل شي مكتوب على العلبة.",
      },
    ],
  },

  contact: {
    kicker: "تواصل معنا",
    heading: "عندك سؤال؟ احكي معنا.",
    description:
      "بدك تعرف أكثر عن رام، أو تستفسر عن التوزيع والتوريد لمحلك؟ تواصل مع الفريق.",
    whatsappCardLabel: "رقم الشركة على واتساب",
    ctaWhatsapp: "احكي معنا عالواتساب",
    callLabel: "اتصل",
    followLabel: "تابعونا:",
    tiktokCta: "شوفنا عالتيك توك",
    instagramCta: "شوفنا عالانستغرام",
    shareCta: "ابعث الموقع لحدا",
    shareCopied: "تم نسخ الرابط",
    shareFailed: "ما قدرنا ننسخ الرابط",
  },

  mobileBar: {
    findAgent: "وين بلاقي رام؟",
    contact: "احكي معنا",
  },

  footer: {
    rightsReserved: "جميع الحقوق محفوظة",
    disclaimer: "",
    studioLabel: "Programming & UI",
    studioName: "XENON WEBS",
    studioAria: "Programming and UI by Xenon Webs — visit website",
  },
} as const;
