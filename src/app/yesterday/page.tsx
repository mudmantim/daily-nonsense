import Link from "next/link";
import NonsenseExperience from "@/components/NonsenseExperience";
import { getYesterdayItem } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function Yesterday() {
  const result = getYesterdayItem();

  if (!result) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center text-white">
        <p className="font-serif text-2xl">There is no yesterday yet.</p>
        <p className="text-sm text-white/60">The Daily Nonsense started today.</p>
        <Link href="/" className="text-xs uppercase tracking-[0.2em] underline underline-offset-4">
          Back to today
        </Link>
      </div>
    );
  }

  const { item, dayKey } = result;
  return <NonsenseExperience item={item} dayKey={dayKey} mode="yesterday" />;
}
