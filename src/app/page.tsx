import NonsenseExperience from "@/components/NonsenseExperience";
import { getTodayItem } from "@/lib/content";

// Depends on the current date at request time, so it can't be statically
// prerendered at build time — that would freeze "today" forever.
export const dynamic = "force-dynamic";

export default function Home() {
  const { item, dayKey } = getTodayItem();
  return <NonsenseExperience item={item} dayKey={dayKey} mode="today" />;
}
