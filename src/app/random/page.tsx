import NonsenseExperience from "@/components/NonsenseExperience";
import { getRandomItem } from "@/lib/content";

// A fresh roll on every visit — never prerendered.
export const dynamic = "force-dynamic";

export default function Random() {
  const item = getRandomItem();
  return <NonsenseExperience item={item} dayKey={item.id} mode="random" />;
}
