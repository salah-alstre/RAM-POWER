// إعدادات مزوّد الخريطة في مكان واحد — لا اشتراك مدفوع ولا مفتاح API.
//
// نستخدم بلاطات OpenStreetMap القياسية المجانية بالكامل. سياسة OSM تطلب
// استخدامًا معقولًا (حركة موقع تعريفي/تجاري صغير، لا استخراج جماعي للبيانات)
// وإبقاء الإسناد ظاهرًا دائمًا — كلاهما محقَّق هنا. إذا زادت حركة الموقع
// كثيرًا مستقبلًا، الأفضل الانتقال لمزوّد مخصص (MapTiler / Stadia Maps /
// استضافة بلاطات ذاتية) بتعديل tileUrl وattribution هنا فقط دون لمس أي
// مكوّن آخر.
export const mapConfig = {
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
  subdomains: ["a", "b", "c"] as const,
  maxZoom: 18,
  minZoom: 6,
  // مركز افتراضي يغطي فلسطين التاريخية تقريبًا قبل احتساب حدود النقاط الفعلية
  defaultCenter: { lat: 31.9, lng: 35.1 },
  defaultZoom: 8,
} as const;
