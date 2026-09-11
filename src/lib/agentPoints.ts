import { agents, type Agent } from "@/data/agents";
import { regionById, regionLabel, type Region } from "@/data/regions";

// مصدر بيانات موحّد للخريطة والقائمة: نقطة واحدة لكل (وكيل × منطقة لها
// مركز موثّق). إن خدم وكيل عدة مناطق، تُنشأ نقطة لكل منطقة منها على حدة
// حتى لا يضيع ربطه بأي منطقة، ودون تكرار بيانات الوكيل نفسها — كل نقطة
// تحمل مرجعًا لنفس سجل الوكيل. المناطق بلا مركز موثّق (الضفة الغربية،
// الشمال) لا تُنتج نقطة خريطة؛ وكلاؤها يبقون في القائمة كاملين.
export interface AgentPoint {
  pointId: string;
  agent: Agent;
  regionId: string;
  lat: number;
  lng: number;
  anchorTown: string;
  pointType: "service-area-center";
  precision: "municipality-center";
  coordinateSource?: Region["coordinateSource"];
}

export const agentPoints: AgentPoint[] = agents.flatMap((agent) =>
  agent.regionIds.flatMap((regionId) => {
    const region = regionById(regionId);
    if (!region?.center) return [];
    return [
      {
        pointId: `${agent.id}__${regionId}`,
        agent,
        regionId,
        lat: region.center.lat,
        lng: region.center.lng,
        anchorTown: region.anchorTown ?? regionLabel(regionId),
        pointType: "service-area-center",
        precision: "municipality-center",
        coordinateSource: region.coordinateSource,
      },
    ];
  })
);

/** أسماء المناطق التي ليس لها بعد مركز موثّق على الخريطة — لإظهار تنويه شفاف بدل إخفاء النقص. */
export const regionsWithoutMapPoint = new Set(
  agents
    .flatMap((a) => a.regionIds)
    .filter((id) => !regionById(id)?.center)
);
