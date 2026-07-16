import Link from "next/link";
import { getAllItems } from "@/lib/content";
import { UNIVERSES, UniverseId } from "@/lib/universes";

export default function Archive() {
  const items = getAllItems();
  const byUniverse = (Object.keys(UNIVERSES) as UniverseId[]).map((id) => ({
    universe: UNIVERSES[id],
    items: items.filter((item) => item.universe === id),
  }));

  return (
    <div className="min-h-dvh bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-14">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">The Daily Nonsense</p>
          <h1 className="font-serif text-3xl">Archive</h1>
          <p className="text-sm text-white/60">Every finding, exhibit, and notice on file.</p>
        </div>

        {byUniverse.map(({ universe, items: universeItems }) => (
          <section key={universe.id} className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-1 text-center">
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${universe.badge}`}
              >
                {universe.name}
              </span>
              <p className="text-xs italic text-white/50">{universe.tagline}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] tracking-[0.15em] text-white/30">
                {universe.masthead && <span>{universe.masthead}</span>}
                {universe.masthead && universe.metadata && <span aria-hidden="true">·</span>}
                {universe.metadata && (
                  <span>
                    {universe.metadata.label}: {universe.metadata.value}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {universeItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border border-white/10 bg-gradient-to-br p-5 ${universe.gradient}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">{item.format}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">{item.title}</p>
                  <p className="mt-3 font-serif text-lg leading-snug">{item.body}</p>
                  {item.rarity === "rare" && (
                    <span className="rare-shimmer mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      ✦ Rare Nonsense
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <Link
          href="/"
          className="text-center text-xs uppercase tracking-[0.2em] text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
        >
          Back to today
        </Link>
      </div>
    </div>
  );
}
