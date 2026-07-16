import { ImageResponse } from "next/og";
import { getTodayItem } from "@/lib/content";
import { UNIVERSES } from "@/lib/universes";

// Regenerated per request so a shared link always previews *today's*
// item, styled like its universe - not a static banner. This is the
// preview surface most people actually see when a link gets shared
// (iMessage/Slack/Twitter link unfurls), as opposed to the Copy Image
// PNG, which requires the sharer to attach it manually.
export const dynamic = "force-dynamic";
export const alt = "The Daily Nonsense";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const { item } = getTodayItem();
  const universe = UNIVERSES[item.universe];
  const [from, via, to] = universe.canvasStops;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${from}, ${via} 55%, ${to})`,
          color: "white",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 38, textTransform: "uppercase", letterSpacing: 4, opacity: 0.95 }}>
          {universe.name}
        </div>
        <div style={{ display: "flex", fontSize: 24, textTransform: "uppercase", opacity: 0.55, marginTop: 24, letterSpacing: 2 }}>
          {item.format}
        </div>
        <div style={{ display: "flex", fontSize: 46, marginTop: 32, lineHeight: 1.35, maxWidth: 980 }}>
          {item.body}
        </div>
        <div style={{ display: "flex", fontSize: 22, opacity: 0.5, marginTop: 48, fontStyle: "italic" }}>
          The Daily Nonsense
        </div>
      </div>
    ),
    { ...size }
  );
}
