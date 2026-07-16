export type UniverseId =
  | "deir"
  | "museum"
  | "committee"
  | "wildlife"
  | "lostfound"
  | "notices";

export interface Universe {
  id: UniverseId;
  name: string;
  eyebrow: string;
  tagline: string;
  gradient: string;
  accent: string;
  badge: string;
  // Hex stops mirroring `gradient`, for canvas-rendered share cards
  // (canvas can't read Tailwind's gradient classes directly).
  canvasStops: [string, string, string];
}

export const UNIVERSES: Record<UniverseId, Universe> = {
  deir: {
    id: "deir",
    name: "The Department of Extremely Important Research",
    eyebrow: "Finding No.",
    tagline: "Peer-reviewed by nobody.",
    gradient: "from-sky-500 via-blue-600 to-indigo-800",
    accent: "text-sky-100",
    badge: "border-sky-300/40 bg-sky-400/10 text-sky-100",
    canvasStops: ["#0ea5e9", "#2563eb", "#3730a3"],
  },
  museum: {
    id: "museum",
    name: "The Museum of Useless History",
    eyebrow: "Exhibit",
    tagline: "This definitely happened. Somewhere. Probably.",
    gradient: "from-amber-600 via-orange-700 to-red-900",
    accent: "text-amber-100",
    badge: "border-amber-300/40 bg-amber-400/10 text-amber-100",
    canvasStops: ["#d97706", "#c2410c", "#7f1d1d"],
  },
  committee: {
    id: "committee",
    name: "The Committee for Poor Decisions",
    eyebrow: "Official Advisory No.",
    tagline: "We do not recommend this. We insist on it.",
    gradient: "from-rose-600 via-red-700 to-orange-800",
    accent: "text-rose-100",
    badge: "border-rose-300/40 bg-rose-400/10 text-rose-100",
    canvasStops: ["#e11d48", "#b91c1c", "#9a3412"],
  },
  wildlife: {
    id: "wildlife",
    name: "Neighborhood Wildlife Reports",
    eyebrow: "Bulletin",
    tagline: "Filed by a concerned neighbor who is definitely not overreacting.",
    gradient: "from-emerald-600 via-green-700 to-teal-900",
    accent: "text-emerald-100",
    badge: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
    canvasStops: ["#059669", "#15803d", "#134e4a"],
  },
  lostfound: {
    id: "lostfound",
    name: "Lost & Found",
    eyebrow: "Item Recovered",
    tagline: "Please claim within a reasonable, undefined amount of time.",
    gradient: "from-yellow-500 via-amber-600 to-orange-700",
    accent: "text-yellow-50",
    badge: "border-yellow-200/40 bg-yellow-300/10 text-yellow-50",
    canvasStops: ["#eab308", "#d97706", "#c2410c"],
  },
  notices: {
    id: "notices",
    name: "Official Public Notices",
    eyebrow: "Public Notice",
    tagline: "Issued by an authority that may or may not exist.",
    gradient: "from-slate-700 via-slate-800 to-zinc-950",
    accent: "text-slate-100",
    badge: "border-slate-300/40 bg-slate-400/10 text-slate-100",
    canvasStops: ["#334155", "#1e293b", "#09090b"],
  },
};
