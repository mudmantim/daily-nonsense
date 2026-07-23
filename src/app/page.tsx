import NonsenseExperience from "@/components/NonsenseExperience";
import { getTodayItem, getYesterdayItem, formatDayKeyLong } from "@/lib/content";

// Depends on the current date at request time, so it can't be statically
// prerendered at build time — that would freeze "today" forever.
export const dynamic = "force-dynamic";

export default function Home() {
  const { item, dayKey } = getTodayItem();
  const yesterday = getYesterdayItem();
  return (
    <NonsenseExperience
      item={item}
      dayKey={dayKey}
      mode="today"
      dateLabel={`Today · ${formatDayKeyLong(dayKey)}`}
      prevHref={yesterday ? `/day/${yesterday.dayKey}` : null}
      nextHref={null}
    />
  );
}
