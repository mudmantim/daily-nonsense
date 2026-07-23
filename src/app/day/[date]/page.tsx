import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NonsenseExperience from "@/components/NonsenseExperience";
import {
  getItemByDayKey,
  getAdjacentDayKeys,
  formatDayKeyLong,
  relativeDayLabel,
} from "@/lib/content";
import { UNIVERSES } from "@/lib/universes";

// Bounds ("no future days") depend on the current date, so this can't be
// prerendered once and frozen — same reasoning as the "today" route.
export const dynamic = "force-dynamic";

function label(dayKey: string): string {
  const long = formatDayKeyLong(dayKey);
  const rel = relativeDayLabel(dayKey);
  return rel ? `${rel} · ${long}` : long;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const result = getItemByDayKey(date);
  if (!result) return { title: "Not found — The Daily Nonsense" };
  const universe = UNIVERSES[result.item.universe];
  const title = `${universe.name} — ${formatDayKeyLong(date)}`;
  return {
    title,
    description: result.item.body,
    openGraph: { title, description: result.item.body },
  };
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const result = getItemByDayKey(date);
  if (!result) notFound();

  const { prev, next } = getAdjacentDayKeys(result.dayKey);

  return (
    <NonsenseExperience
      item={result.item}
      dayKey={result.dayKey}
      mode="day"
      dateLabel={label(result.dayKey)}
      prevHref={prev ? `/day/${prev}` : null}
      nextHref={next ? `/day/${next}` : null}
    />
  );
}
