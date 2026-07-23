import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildCalendarMonth, currentMonth, isMonthInRange } from "@/lib/calendar";
import { UNIVERSES } from "@/lib/universes";

// The browsable window ends at "today", which changes daily — can't be
// frozen at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calendar — The Daily Nonsense",
  description: "Browse the archive by date. Every day since the beginning has its own document.",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function resolveMonth(ym: string[] | undefined): { year: number; month: number } | null {
  if (!ym || ym.length === 0) return currentMonth();
  if (ym.length !== 2) return null;
  const year = Number(ym[0]);
  const month = Number(ym[1]);
  if (!isMonthInRange(year, month)) return null;
  return { year, month };
}

function href(m: { year: number; month: number }): string {
  return `/calendar/${m.year}/${String(m.month).padStart(2, "0")}`;
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ ym?: string[] }>;
}) {
  const { ym } = await params;
  const resolved = resolveMonth(ym);
  if (!resolved) notFound();

  const cal = buildCalendarMonth(resolved.year, resolved.month);

  return (
    <div className="min-h-dvh bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">The Daily Nonsense</p>
          <h1 className="font-serif text-3xl">Calendar</h1>
          <p className="text-sm text-white/60">Every day on file. Pick one.</p>
        </div>

        {/* Month header + navigation */}
        <div className="flex items-center justify-between gap-4">
          {cal.prev ? (
            <Link
              href={href(cal.prev)}
              rel="prev"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
            >
              <span aria-hidden="true">←</span>
              <span className="hidden sm:inline">Previous month</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <span className="text-xs uppercase tracking-[0.2em] text-white/20">←</span>
          )}

          <h2 className="font-serif text-xl sm:text-2xl">{cal.label}</h2>

          {cal.next ? (
            <Link
              href={href(cal.next)}
              rel="next"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
            >
              <span className="hidden sm:inline">Next month</span>
              <span className="sm:hidden">Next</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="text-xs uppercase tracking-[0.2em] text-white/20">→</span>
          )}
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] uppercase tracking-[0.15em] text-white/30">
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d[0]}</span>
            </div>
          ))}

          {/* Day cells */}
          {cal.weeks.flat().map((cell, i) => {
            if (!cell) return <div key={`pad-${i}`} className="aspect-square" />;

            if (!cell.inRange) {
              return (
                <div
                  key={cell.dayKey}
                  className="flex aspect-square items-start justify-end rounded-lg border border-white/5 p-1.5 text-xs text-white/20"
                >
                  {cell.day}
                </div>
              );
            }

            const universe = UNIVERSES[cell.universe!];
            return (
              <Link
                key={cell.dayKey}
                href={`/day/${cell.dayKey}`}
                title={`${universe.name} — ${cell.dayKey}`}
                aria-label={`${cell.dayKey}: ${universe.name}${cell.isToday ? " (today)" : ""}`}
                className={`group relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg border bg-gradient-to-br p-1.5 transition ${universe.gradient} ${
                  cell.isToday
                    ? "border-white ring-2 ring-white/70"
                    : "border-white/10 hover:border-white/40"
                }`}
              >
                <span className="pointer-events-none absolute inset-0 bg-black/20 transition group-hover:bg-black/0" />
                <span className="relative self-end text-xs font-medium text-white">{cell.day}</span>
                {cell.isToday && (
                  <span className="relative text-[8px] font-semibold uppercase tracking-[0.15em] text-white/90">
                    Today
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5 pt-2">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
          >
            Today
          </Link>
          <Link
            href="/archive"
            className="text-xs uppercase tracking-[0.2em] text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
          >
            Archive
          </Link>
          <a
            href="/rss.xml"
            className="text-xs uppercase tracking-[0.2em] text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
          >
            RSS
          </a>
        </nav>
      </div>
    </div>
  );
}
