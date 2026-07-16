import { DailyItem } from "./content";
import { UNIVERSES } from "./universes";

const WIDTH = 1080;
const HEIGHT = 1350;

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function renderShareCard(item: DailyItem): Promise<Blob> {
  const universe = UNIVERSES[item.universe];
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas not supported"));

  const [from, via, to] = universe.canvasStops;
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, from);
  gradient.addColorStop(0.55, via);
  gradient.addColorStop(1, to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const marginX = 96;
  let y = 220;

  // Universe pill
  ctx.font = "600 28px Georgia, serif";
  const universeLabel = universe.name.toUpperCase();
  const pillPaddingX = 28;
  const pillWidth = ctx.measureText(universeLabel).width + pillPaddingX * 2;
  const pillHeight = 64;
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  roundRect(ctx, WIDTH / 2 - pillWidth / 2, y, pillWidth, pillHeight, pillHeight / 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(universeLabel, WIDTH / 2, y + pillHeight / 2 + 2);
  y += pillHeight + 70;

  // Format label
  ctx.font = "500 26px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText(item.format.toUpperCase(), WIDTH / 2, y);
  y += 50;

  // Title
  ctx.font = "600 34px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(item.title, WIDTH / 2, y);
  y += 90;

  // Body (wrapped, serif, large)
  ctx.font = "44px Georgia, serif";
  ctx.fillStyle = "#ffffff";
  const bodyLines = wrapLines(ctx, item.body, WIDTH - marginX * 2);
  const lineHeight = 60;
  for (const line of bodyLines) {
    ctx.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  }

  // Watermark
  ctx.font = "italic 30px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("The Daily Nonsense", WIDTH / 2, HEIGHT - 90);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to render share card"));
    }, "image/png");
  });
}
