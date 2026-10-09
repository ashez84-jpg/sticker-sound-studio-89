import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import sleepStudyRoom from "@/assets/sleep-study-room.jpg";
import sleepStudyFriendsAsset from "@/assets/sleep-study-friends.png.asset.json";
import ballArt from "@/assets/i-spy-objects/ball.png";
import balloonArt from "@/assets/i-spy-objects/balloon.png";
import bookArt from "@/assets/i-spy-objects/book.png";
import bowArt from "@/assets/i-spy-objects/bow.png";
import bunnyArt from "@/assets/i-spy-objects/bunny.png";
import butterflyArt from "@/assets/i-spy-objects/butterfly.png";
import clockArt from "@/assets/i-spy-objects/clock.png";
import cloudArt from "@/assets/i-spy-objects/cloud.png";
import cookieArt from "@/assets/i-spy-objects/cookie.png";
import duckArt from "@/assets/i-spy-objects/duck.png";
import flashlightArt from "@/assets/i-spy-objects/flashlight.png";
import keyArt from "@/assets/i-spy-objects/key.png";
import lampArt from "@/assets/i-spy-objects/lamp.png";
import milkArt from "@/assets/i-spy-objects/milk.png";
import monitorArt from "@/assets/i-spy-objects/monitor.png";
import moonArt from "@/assets/i-spy-objects/moon.png";
import pillowArt from "@/assets/i-spy-objects/pillow.png";
import sheepArt from "@/assets/i-spy-objects/sheep.png";
import sleepyArt from "@/assets/i-spy-objects/sleepy.png";
import sockArt from "@/assets/i-spy-objects/sock.png";
import starArt from "@/assets/i-spy-objects/star.png";
import teddyArt from "@/assets/i-spy-objects/teddy.png";
import toothbrushArt from "@/assets/i-spy-objects/toothbrush.png";
import wheelchairArt from "@/assets/i-spy-objects/wheelchair.png";
import unicornArt from "@/assets/sticker-unicorn.png";
import { playSound } from "@/lib/sfx";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/i-spy")({
  head: () => ({
    meta: [
      { title: "I Spy Sleep Study Games — Get Ready with Me Sleep Study" },
      { name: "description", content: "Two hide-and-find games: the cozy sleep study room and the sleepover friends picture." },
      { property: "og:title", content: "I Spy Sleep Study Games — Get Ready with Me Sleep Study" },
      { property: "og:description", content: "Find the little hidden objects in two playful sleep study scenes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ISpyPage,
});

type Hidden = {
  id: string;
  emoji: string;
  name: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity?: number;
  art?: string;
  flatten?: number;
  skew?: number;
  tone?: "wall" | "bed" | "wood" | "rug" | "fabric" | "floor" | "equipment";
};

// Scene 1 — the cozy sleep study room. Several items hide in more than one spot.
const ROOM_ITEMS: Hidden[] = [
  { id: "star-1", emoji: "⭐", name: "Star", x: 12, y: 14, size: 5, rotate: -12, art: starArt, flatten: 0.9, tone: "wall" },
  { id: "star-2", emoji: "⭐", name: "Star", x: 58, y: 9, size: 5, rotate: 15, art: starArt, flatten: 0.9, tone: "wall" },
  { id: "moon", emoji: "🌙", name: "Moon", x: 87, y: 9, size: 7, rotate: 10, opacity: 0.78, art: moonArt, flatten: 0.9, tone: "wall" },
  { id: "sock-1", emoji: "🧦", name: "Sock", x: 20, y: 88, size: 5, rotate: 25, art: sockArt, flatten: 0.66, skew: -8, tone: "rug" },
  { id: "sock-2", emoji: "🧦", name: "Sock", x: 34, y: 94, size: 5, rotate: -40, art: sockArt, flatten: 0.62, skew: 8, tone: "rug" },
  { id: "book", emoji: "📕", name: "Book", x: 72, y: 78, size: 4.5, rotate: -8, art: bookArt, flatten: 0.58, skew: -7, tone: "bed" },
  { id: "duck", emoji: "🦆", name: "Rubber duck", x: 91, y: 62, size: 4.5, rotate: 0, art: duckArt, tone: "wood" },
  { id: "key", emoji: "🔑", name: "Key", x: 40, y: 94, size: 4, rotate: 40, art: keyArt, flatten: 0.55, skew: 8, tone: "rug" },
  { id: "toothbrush", emoji: "🪥", name: "Toothbrush", x: 6, y: 52, size: 6.5, rotate: -30, opacity: 0.78, art: toothbrushArt, flatten: 0.75, tone: "wood" },
  { id: "cookie", emoji: "🍪", name: "Cookie", x: 55, y: 30, size: 4, rotate: 0, art: cookieArt, flatten: 0.58, skew: -5, tone: "bed" },
  { id: "balloon", emoji: "🎈", name: "Balloon", x: 32, y: 22, size: 5, rotate: 8, art: balloonArt, tone: "wall" },
  { id: "butterfly", emoji: "🦋", name: "Butterfly", x: 63, y: 55, size: 4, rotate: -15, art: butterflyArt, flatten: 0.7, tone: "bed" },
  { id: "flashlight", emoji: "🔦", name: "Flashlight", x: 83, y: 90, size: 4.5, rotate: 20, art: flashlightArt, flatten: 0.58, skew: -8, tone: "rug" },
  { id: "ball", emoji: "⚽", name: "Ball", x: 47, y: 70, size: 4, rotate: 0, art: ballArt, flatten: 0.72, tone: "bed" },
  { id: "pillow", emoji: "🛏️", name: "Pillow", x: 16, y: 68, size: 5, rotate: -6, art: pillowArt, flatten: 0.7, skew: 6, tone: "bed" },
  { id: "sheep-1", emoji: "🐑", name: "Counting sheep", x: 27, y: 36, size: 4.5, rotate: 10, art: sheepArt, tone: "bed" },
  { id: "sheep-2", emoji: "🐑", name: "Counting sheep", x: 68, y: 24, size: 4.5, rotate: -12, art: sheepArt, flatten: 0.9, tone: "wall" },
  { id: "milk", emoji: "🥛", name: "Glass of milk", x: 45, y: 55, size: 4, rotate: 0, art: milkArt, tone: "bed" },
  { id: "clock", emoji: "🕰️", name: "Bedtime clock", x: 95, y: 18, size: 4.5, rotate: 6, art: clockArt, flatten: 0.86, tone: "wall" },
  { id: "teddy", emoji: "🧸", name: "Teddy bear", x: 8, y: 80, size: 4.5, rotate: -8, art: teddyArt, tone: "rug" },
  { id: "sleepy", emoji: "😴", name: "Sleepy face", x: 78, y: 44, size: 4.5, rotate: 0, art: sleepyArt, flatten: 0.68, tone: "bed" },
];

// Scene 2 — the sleepover friends picture. Positions are percentages across it.
const FRIENDS_ITEMS: Hidden[] = [
  { id: "f-moon-1", emoji: "🌙", name: "Moon", x: 55.9, y: 12.7, size: 4.5, rotate: -8, art: moonArt, flatten: 0.82, skew: -5, tone: "wall", opacity: 0.67 },
  { id: "f-moon-2", emoji: "🌙", name: "Moon", x: 15, y: 20, size: 4, rotate: 8, art: moonArt, flatten: 0.88, skew: 4, tone: "wall", opacity: 0.7 },
  { id: "f-star-1", emoji: "⭐", name: "Star", x: 69.3, y: 4.4, size: 4, rotate: -10, art: starArt, flatten: 0.78, tone: "wall", opacity: 0.66 },
  { id: "f-star-2", emoji: "⭐", name: "Star", x: 75.5, y: 4.4, size: 4, rotate: 12, art: starArt, flatten: 0.8, tone: "wall", opacity: 0.66 },
  { id: "f-star-3", emoji: "⭐", name: "Star", x: 79.1, y: 7.3, size: 3.5, rotate: 0, art: starArt, flatten: 0.82, tone: "wall", opacity: 0.62 },
  { id: "f-teddy", emoji: "🧸", name: "Teddy bear", x: 50.8, y: 87, size: 4.5, rotate: 0, art: teddyArt, flatten: 0.78, tone: "fabric", opacity: 0.72 },
  { id: "f-unicorn", emoji: "🦄", name: "Unicorn", x: 27, y: 78, size: 4.5, rotate: -6, art: unicornArt, flatten: 0.76, skew: -5, tone: "fabric", opacity: 0.7 },
  { id: "f-bunny", emoji: "🐰", name: "Bunny", x: 85.3, y: 88, size: 4.5, rotate: 6, art: bunnyArt, flatten: 0.76, skew: 4, tone: "fabric", opacity: 0.7 },
  { id: "f-bow", emoji: "🎀", name: "Hair bow", x: 20.5, y: 28.8, size: 3.5, rotate: -8, art: bowArt, flatten: 0.7, skew: -7, tone: "fabric", opacity: 0.68 },
  { id: "f-lamp", emoji: "💡", name: "Lamp", x: 4.2, y: 44, size: 4.5, rotate: 0, art: lampArt, flatten: 0.86, skew: 3, tone: "wood", opacity: 0.68 },
  { id: "f-cloud", emoji: "☁️", name: "Cloud light", x: 3.9, y: 55.7, size: 4, rotate: 0, art: cloudArt, flatten: 0.72, skew: 3, tone: "wall", opacity: 0.65 },
  { id: "f-monitor", emoji: "🖥️", name: "Sleep monitor", x: 90.5, y: 16, size: 4.5, rotate: 4, art: monitorArt, flatten: 0.82, skew: -4, tone: "equipment", opacity: 0.7 },
  { id: "f-sock", emoji: "🧦", name: "Sock", x: 55.7, y: 95, size: 3.5, rotate: 15, art: sockArt, flatten: 0.55, skew: 9, tone: "floor", opacity: 0.64 },
  { id: "f-wheelchair", emoji: "♿", name: "Wheelchair", x: 7.2, y: 84, size: 4.5, rotate: -6, art: wheelchairArt, flatten: 0.74, skew: -5, tone: "equipment", opacity: 0.68 },
];

type Scene = { id: string; name: string; emoji: string; image: string; alt: string; items: Hidden[] };

const SCENES: Scene[] = [
  { id: "room", name: "Sleep Room", emoji: "🛏️", image: sleepStudyRoom, alt: "Cozy sleep study room", items: ROOM_ITEMS },
  { id: "friends", name: "Sleepover Friends", emoji: "🧸", image: sleepStudyFriendsAsset.url, alt: "Five friends ready for their sleep study", items: FRIENDS_ITEMS },
];

function ISpyPage() {
  const { t } = useLang();
  const [sceneId, setSceneId] = useState(SCENES[0]!.id);
  const [foundMap, setFoundMap] = useState<Record<string, string[]>>({});
  const scene = SCENES.find((s) => s.id === sceneId) ?? SCENES[0]!;
  const found = foundMap[scene.id] ?? [];
  const done = found.length === scene.items.length;

  // Unique item types, in first-seen order, for the "Can you find…" list.
  const TYPE_NAMES = [...new Set(scene.items.map((item) => item.name))];

  const find = (item: Hidden) => {
    if (found.includes(item.id)) return;
    const next = [...found, item.id];
    setFoundMap({ ...foundMap, [scene.id]: next });
    playSound(next.length === scene.items.length ? "cheer" : "star");
  };

  const reset = () => {
    playSound("clear");
    setFoundMap({ ...foundMap, [scene.id]: [] });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-4 py-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-5xl">
          {t("I Spy the Sleep Room")} <span className="inline-block animate-wiggle">🔍</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {t("Little things are hiding all over. Tap each one when you spot it!")}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSceneId(s.id)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition-transform active:scale-95 ${
                s.id === scene.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-foreground/80"
              }`}
            >
              {s.emoji} {t(s.name)}
            </button>
          ))}
        </div>
        <Link
          to="/"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground/80 transition-transform active:scale-95"
        >
          {t("← Choose a study")}
        </Link>
      </header>

      <section className="toy-card p-2 sm:p-3">
        <div className="relative w-full overflow-hidden rounded-2xl">
          <img src={scene.image} alt={scene.alt} className="block w-full" draggable={false} />
          {scene.items.map((item) => {
            const isFound = found.includes(item.id);
            const flatten = item.flatten ?? 1;
            const skew = item.skew ?? 0;
            return (
              <button
                key={item.id}
                onClick={() => find(item)}
                aria-label={isFound ? `${item.name} found` : "Hidden object"}
                className={`absolute flex items-center justify-center rounded-full leading-none transition-all ${isFound ? "bg-card/75 ring-3 ring-sunshine" : "bg-transparent"}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.size * 2}%`,
                  aspectRatio: "1",
                  transform: `translate(-50%,-50%) rotate(${item.rotate}deg) skewX(${skew}deg) scaleY(${flatten})`,
                  fontSize: `clamp(14px, ${item.size * 0.7}vw, 40px)`,
                  opacity: isFound ? 1 : (item.opacity ?? (item.art ? 0.68 : 0.55)),
                }}
              >
                {item.art ? (
                  <img
                    src={item.art}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="lazy"
                     width={768}
                     height={768}
                    className={`h-full w-full object-contain ${isFound ? "animate-pop-in" : `i-spy-camouflage i-spy-camouflage--${item.tone ?? "bed"}`}`}
                  />
                ) : (
                  <span className={isFound ? "animate-pop-in" : ""}>{item.emoji}</span>
                )}
              </button>
            );
          })}
          {done && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <div className="toy-card animate-pop-in px-6 py-5 text-center">
                <p className="text-3xl font-extrabold text-foreground">{t("🎉 You found them all!")}</p>
                <button
                  onClick={reset}
                  className="mt-3 rounded-full bg-primary px-5 py-2 font-extrabold text-primary-foreground active:scale-95"
                >
                  {t("Play again")}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="toy-card p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-foreground">{t("Can you find…")}</h2>
          <span className="text-sm font-bold text-muted-foreground">
            {t("{a} of {b}", { a: found.length, b: scene.items.length })}
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {TYPE_NAMES.map((name) => {
            const spots = scene.items.filter((item) => item.name === name);
            const first = spots[0];
            if (!first) return null;
            const foundCount = spots.filter((item) => found.includes(item.id)).length;
            const complete = foundCount === spots.length;
            return (
              <li
                key={name}
                className={`flex flex-col items-center rounded-2xl px-2 py-2 text-center ${complete ? "bg-mint" : "bg-muted"}`}
              >
                <span className={`text-2xl ${complete ? "" : "grayscale opacity-60"}`}>{first.emoji}</span>
                <span className={`text-xs font-bold ${complete ? "line-through text-foreground/60" : "text-foreground"}`}>
                  {t(first.name)}
                </span>
                {spots.length > 1 && (
                  <span className={`text-[10px] font-bold ${complete ? "text-foreground/50" : "text-muted-foreground"}`}>
                    {t("{a} of {b}", { a: foundCount, b: spots.length })}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        {found.length > 0 && !done && (
          <button onClick={reset} className="mt-3 w-full text-sm font-bold text-muted-foreground">
            {t("Start over")}
          </button>
        )}
      </section>
    </main>
  );
}
