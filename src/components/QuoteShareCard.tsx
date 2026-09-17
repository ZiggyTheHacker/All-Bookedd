"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  author: string;
  book?: string | null;
};

// Rendered at a fixed high resolution regardless of display size, so the
// downloaded/shared image stays crisp on any device.
const SIZE = 1080;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Draws the quote onto the canvas using the site's walnut/brass/parchment
// palette. Uses Georgia as the serif stack — the same fallback the site's
// own display/body fonts fall back to — so it reads consistently even
// though canvas can't pick up the custom @font-face directly.
function draw(canvas: HTMLCanvasElement, text: string, author: string, book?: string | null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = SIZE;
  canvas.height = SIZE;

  const bg = ctx.createRadialGradient(SIZE * 0.28, SIZE * 0.22, 80, SIZE / 2, SIZE / 2, SIZE * 0.85);
  bg.addColorStop(0, "#4A3222");
  bg.addColorStop(1, "#2A1C13");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Faint wood-grain, echoing the site's repeating-gradient background.
  ctx.strokeStyle = "rgba(43,36,28,0.18)";
  ctx.lineWidth = 1;
  for (let y = 0; y < SIZE; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(SIZE, y);
    ctx.stroke();
  }

  // Double brass frame.
  ctx.strokeStyle = "#B8923F";
  ctx.lineWidth = 5;
  ctx.strokeRect(46, 46, SIZE - 92, SIZE - 92);
  ctx.strokeStyle = "rgba(184,146,63,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, SIZE - 128, SIZE - 128);

  // Oversized opening quotation mark.
  ctx.fillStyle = "rgba(184,146,63,0.45)";
  ctx.textAlign = "left";
  ctx.font = "italic 170px Georgia, 'Times New Roman', serif";
  ctx.fillText("\u201C", 100, 300);

  // Quote text, vertically centered and wrapped to fit the frame.
  ctx.fillStyle = "#F4EEDC";
  ctx.textAlign = "center";
  const fontSize = text.length > 170 ? 38 : text.length > 100 ? 46 : 54;
  ctx.font = `italic ${fontSize}px Georgia, 'Times New Roman', serif`;
  const maxWidth = SIZE - 230;
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = fontSize * 1.4;
  const blockHeight = lines.length * lineHeight;
  let y = SIZE / 2 - blockHeight / 2 + fontSize * 0.35;
  for (const line of lines) {
    ctx.fillText(line, SIZE / 2, y);
    y += lineHeight;
  }

  ctx.fillStyle = "#D4B36A";
  ctx.font = "28px Georgia, serif";
  const attribution = book ? `\u2014 ${author}, ${book}` : `\u2014 ${author}`;
  ctx.fillText(attribution, SIZE / 2, y + 20);

  ctx.fillStyle = "rgba(212,179,106,0.7)";
  ctx.font = "20px Georgia, serif";
  ctx.fillText("T H E   G I L D E D   S P I N E", SIZE / 2, SIZE - 90);
}

export default function QuoteShareCard({ text, author, book }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (open && canvasRef.current) {
      draw(canvasRef.current, text, author, book);
    }
  }, [open, text, author, book]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "gilded-spine-quote.png";
    a.click();
  }

  function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "gilded-spine-quote.png", { type: "image/png" });
      const shareData: ShareData = {
        files: [file],
        title: "Quote of the Day",
        text: `"${text}" \u2014 ${author}`,
      };
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share(shareData);
        } catch {
          // User cancelled the share sheet — nothing to do.
        }
      } else {
        handleDownload();
      }
    }, "image/png");
  }

  return (
    <div className="mt-6 flex flex-col items-center">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="btn-secondary border-brass-light text-sm text-parchment-light hover:bg-parchment-light/10"
        >
          Share this quote
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            className="aspect-square w-56 rounded-sm border border-brass/40 shadow-spine sm:w-64"
          />
          <div className="flex flex-wrap justify-center gap-3">
            {canNativeShare && (
              <button onClick={handleShare} className="btn-primary text-sm">
                Share
              </button>
            )}
            <button onClick={handleDownload} className="btn-secondary text-sm">
              Download image
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-parchment-light/60 hover:text-parchment-light"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
