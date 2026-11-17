import { units } from "@/content";
import { UnitPlayer } from "@/components/lesson/UnitPlayer";

export const dynamicParams = false;

export function generateStaticParams() {
  return units.map((u) => ({ unit: u.id }));
}

export default async function UnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit } = await params;
  return <UnitPlayer unitId={unit} />;
}
