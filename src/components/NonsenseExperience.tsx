"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { DailyItem, shareTextFor } from "@/lib/content";
import { UNIVERSES } from "@/lib/universes";
import {
  EXPIRED_COPY,
  LOADING_PHRASES,
  REACTION_RESPONSES,
  ReactionKind,
  SHARE_CONFIRMATIONS,
  pickForKey,
  pickRandom,
} from "@/lib/microcopy";

interface Props {
  item: DailyItem;
  dayKey: string;
  mode: "today" | "yesterday";
}

type Stage = "loading" | "revealed";

export default function NonsenseExperience({ item, dayKey, mode }: Props) {
  const universe = UNIVERSES[item.universe];
  const reactionKey = `dn-reaction-${dayKey}`;

  const [stage, setStage] = useState<Stage>(mode === "yesterday" ? "revealed" : "loading");
  const [loadingPhrase] = useState(() => pickForKey(LOADING_PHRASES, dayKey));
  const [reaction, setReaction] = useState<ReactionKind | null>(null);
  const [reactionNote, setReactionNote] = useState<string | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);

  const shareText = useMemo(() => shareTextFor(item), [item]);

  useEffect(() => {
    if (mode !== "today") return;
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(reactionKey) as ReactionKind | null;
      if (stored) setReaction(stored);
      setStage("revealed");
    }, 1300);
    return () => clearTimeout(timer);
  }, [mode, reactionKey]);

  function handleReact(kind: ReactionKind) {
    setReaction(kind);
    setReactionNote(pickRandom(REACTION_RESPONSES[kind]));
    if (typeof window !== "undefined") localStorage.setItem(reactionKey, kind);
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "The Daily Nonsense", text: shareText });
        return;
      } catch {
        // user cancelled or share failed; fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setShareNote(pickRandom(SHARE_CONFIRMATIONS));
      setTimeout(() => setShareNote(null), 2600);
    } catch {
      setShareNote("Couldn't copy. Select the text above instead.");
    }
  }

  return (
    <div
      className={`relative flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br ${universe.gradient} px-6 py-16 text-white transition-colors duration-700`}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {stage === "loading" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white"
              />
              <p className="font-serif text-lg text-white/80">{loadingPhrase}</p>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex w-full flex-col items-center gap-8"
            >
              {mode === "yesterday" && (
                <p className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
                  {EXPIRED_COPY}
                </p>
              )}

              <div className="flex flex-col items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${universe.badge}`}
                >
                  {universe.name}
                </span>
                {item.rarity === "rare" && (
                  <span className="rare-shimmer rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    ✦ Rare Nonsense
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{item.title}</p>
                <p className="font-serif text-2xl leading-snug sm:text-3xl">{item.body}</p>
                <p className="text-sm italic text-white/60">{universe.tagline}</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Was that amazing, terrible, or both?
                </p>
                <div className="flex gap-3">
                  {(["amazing", "terrible", "both"] as ReactionKind[]).map((kind) => (
                    <button
                      key={kind}
                      onClick={() => handleReact(kind)}
                      className={`rounded-full border px-4 py-2 text-sm capitalize transition ${
                        reaction === kind
                          ? "border-white bg-white text-black"
                          : "border-white/40 bg-white/5 text-white hover:bg-white/15"
                      }`}
                    >
                      {kind}
                    </button>
                  ))}
                </div>
                <div className="h-5">
                  <AnimatePresence>
                    {reactionNote && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-white/70"
                      >
                        {reactionNote}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleShare}
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Share today&rsquo;s nonsense
                </button>
                <div className="h-5">
                  <AnimatePresence>
                    {shareNote && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-white/70"
                      >
                        {shareNote}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <Link
                href={mode === "today" ? "/yesterday" : "/"}
                className="text-xs uppercase tracking-[0.2em] text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
              >
                {mode === "today" ? "See yesterday's nonsense" : "Back to today"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
