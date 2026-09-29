import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import sleepStudyRoom from "@/assets/sleep-study-room.jpg";
import { playSound } from "@/lib/sfx";

export const Route = createFileRoute("/i-spy")({
  head: () => ({
    meta: [
      { title: "I Spy Sleep Study Room — Get Ready with Me Sleep Study" },
      { name: "description", content: "Find the little hidden objects around the cozy sleep study room." },
      { property: "og:title", content: "I Spy Sleep Study Room — Get Ready with Me Sleep Study" },
      { property: "og:description", content: "A playful hide-and-find game in a cozy sleep study room." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ISpyPage,
});

type Hidden = { id: string; emoji: string; name: string; x: number; y: number; size: number; rotate: number };

// Positions are percentages across the room picture.
const ITEMS: Hidden[] = [
  { id: "star", emoji: "⭐", name: "Star", x: 12, y: 14, size: 5, rotate: -12 },
  { id: "moon", emoji: "🌙", name: "Moon", x: 86, y: 9, size: 5, rotate: 10 },
  { id: "sock", emoji: "🧦", name: "Sock", x: 20, y: 88, size: 5, rotate: 25 },
  { id: "book", emoji: "📕", name: "Book", x: 72, y: 78, size: 4.5, rotate: -8 },
  { id: "duck", emoji: "🦆", name: "Rubber duck", x: 91, y: 62, size: 4.5, rotate: 0 },
  { id: "key", emoji: "🔑", name: "Key", x: 40, y: 94, size: 4, rotate: 40 },
  { id: "toothbrush", emoji: "🪥", name: "Toothbrush", x: 6, y: 52, size: 4.5, rotate: -30 },
  { id: "cookie", emoji: "🍪", name: "Cookie", x: 55, y: 30, size: 4, rotate: 0 },
  { id: "balloon", emoji: "🎈", name: "Balloon", x: 32, y: 22, size: 5, rotate: 8 },
  { id: "butterfly", emoji: "🦋", name: "Butterfly", x: 63, y: 55, size: 4, rotate: -15 },
  { id: "flashlight", emoji: "🔦", name: "Flashlight", x: 83, y: 90, size: 4.5, rotate: 20 },
  { id: "ball", emoji: "⚽", name: "Ball", x: 47, y: 70, size: 4, rotate: 0 },
];

function ISpyPage() {
  const [found, setFound] = useState<string[]>([]);
  const [pop, setPop] = useState<{ x: number; y: number; key: number } | null>(null);
  const done = found.length === ITEMS.length;

  const find = (item: Hidden) => {
    if (found.includes(item.id)) return;
    const next = [...found, item.id];
    setFound(next);
    setPop({ x: item.x, y: item.y, key: Date.now() });
    playSound(next.length === ITEMS.length ? "cheer" : "star");
  };

  const reset = () => {
    playSound("clear");
    setFound([]);
    setPop(null);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-4 py-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-5xl">
          I Spy the Sleep Room <span className="inline-block animate-wiggle">🔍</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Little things are hiding all over the room. Tap each one when you spot it!
        </p>
        <Link
          to="/"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground/80 transition-transform active:scale-95"
        >
          ← Back to sticker game
        </Link>
      </header>

      <section className="toy-card p-2 sm:p-3">
        <div className="relative w-full overflow-hidden rounded-2xl">
          <img src={sleepStudyRoom} alt="Cozy sleep study room" className="block w-full" draggable={false} />
          {ITEMS.map((item) => {
            const isFound = found.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => find(item)}
                aria-label={isFound ? `${item.name} found` : "Hidden object"}
                className="absolute flex items-center justify-center rounded-full leading-none transition-all"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.size * 2}%`,
                  aspectRatio: "1",
                  transform: `translate(-50%,-50%) rotate(${item.rotate}deg)`,
                  fontSize: `clamp(14px, ${item.size * 0.7}vw, 40px)`,
                  opacity: isFound ? 1 : 0.55,
                  boxShadow: isFound ? "0 0 0 3px var(--sunshine)" : "none",
                  background: isFound ? "color-mix(in oklch, var(--card) 70%, transparent)" : "transparent",
                }}
              >
                <span className={isFound ? "animate-pop-in" : ""}>{item.emoji}</span>
              </button>
            );
          })}
          {pop && (
            <span
              key={pop.key}
              className="pointer-events-none absolute animate-float-up text-2xl font-extrabold"
              style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
            >
              ✨
            </span>
          )}
          {done && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <div className="toy-card animate-pop-in px-6 py-5 text-center">
                <p className="text-3xl font-extrabold text-foreground">🎉 You found them all!</p>
                <button
                  onClick={reset}
                  className="mt-3 rounded-full bg-primary px-5 py-2 font-extrabold text-primary-foreground active:scale-95"
                >
                  Play again
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="toy-card p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-foreground">Can you find…</h2>
          <span className="text-sm font-bold text-muted-foreground">
            {found.length} of {ITEMS.length}
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ITEMS.map((item) => {
            const isFound = found.includes(item.id);
            return (
              <li
                key={item.id}
                className={`flex flex-col items-center rounded-2xl px-2 py-2 text-center ${isFound ? "bg-mint" : "bg-muted"}`}
              >
                <span className={`text-2xl ${isFound ? "" : "grayscale opacity-60"}`}>{item.emoji}</span>
                <span className={`text-xs font-bold ${isFound ? "line-through text-foreground/60" : "text-foreground"}`}>
                  {item.name}
                </span>
              </li>
            );
          })}
        </ul>
        {found.length > 0 && !done && (
          <button onClick={reset} className="mt-3 w-full text-sm font-bold text-muted-foreground">
            Start over
          </button>
        )}
      </section>
    </main>
  );
}
