import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import boyStars from "@/assets/boy-stars.png";
import boyDino from "@/assets/boy-dino.png";
import boyHearts from "@/assets/boy-hearts.png";
import girlStars from "@/assets/girl-stars.png";
import girlDino from "@/assets/girl-dino.png";
import girlHearts from "@/assets/girl-hearts.png";
import { playSound, type SoundName } from "@/lib/sfx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sticker Doctor - Drag & Drop Medical Sticker Game for Kids" },
      {
        name: "description",
        content:
          "A playful drag-and-drop game where kids place bandages, hearts and stars on a cartoon friend, with fun sound effects for every sticker.",
      },
      { property: "og:title", content: "Sticker Doctor - Drag & Drop Sticker Game for Kids" },
      {
        property: "og:description",
        content:
          "Drag medical stickers onto a cartoon child and hear a happy sound with every sticker you place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StickerDoctor,
});

type StickerKind = {
  id: string;
  label: string;
  emoji: string;
  sound: SoundName;
  bg: string;
};

const STICKERS: StickerKind[] = [
  { id: "bandage", label: "Bandage", emoji: "🩹", sound: "bandage", bg: "bg-bubblegum" },
  { id: "plaster", label: "Cast", emoji: "🧻", sound: "plaster", bg: "bg-sky" },
  { id: "heart", label: "Heart", emoji: "❤️", sound: "heart", bg: "bg-accent" },
  { id: "star", label: "Star", emoji: "⭐", sound: "star", bg: "bg-sunshine" },
  { id: "thermometer", label: "Thermometer", emoji: "🌡️", sound: "thermometer", bg: "bg-mint" },
  { id: "shot", label: "Shot", emoji: "💉", sound: "shot", bg: "bg-sky" },
  { id: "stethoscope", label: "Heartbeat", emoji: "🩺", sound: "stethoscope", bg: "bg-mint" },
  { id: "pill", label: "Vitamin", emoji: "💊", sound: "plaster", bg: "bg-bubblegum" },
];

type Placed = { key: number; kind: StickerKind; x: number; y: number };
type DragState = { kind: StickerKind; x: number; y: number; over: boolean };

type Gender = "boy" | "girl";
type PajamaId = "stars" | "dino" | "hearts";

const PAJAMAS: { id: PajamaId; label: string; emoji: string; bg: string }[] = [
  { id: "stars", label: "Starry", emoji: "⭐", bg: "bg-sky" },
  { id: "dino", label: "Dino", emoji: "🦕", bg: "bg-mint" },
  { id: "hearts", label: "Hearts", emoji: "💗", bg: "bg-bubblegum" },
];

const AVATARS: Record<Gender, Record<PajamaId, string>> = {
  boy: { stars: boyStars, dino: boyDino, hearts: boyHearts },
  girl: { stars: girlStars, dino: girlDino, hearts: girlHearts },
};

const NAMES: Record<Gender, string> = { boy: "Sam", girl: "Mia" };

const PRAISE = ["Great job!", "So brave!", "All better!", "Nice fix!", "Woohoo!", "Super doctor!"];

function StickerDoctor() {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const keyRef = useRef(0);
  const [gender, setGender] = useState<Gender>("boy");
  const [pajama, setPajama] = useState<PajamaId>("stars");
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [praise, setPraise] = useState<{ id: number; text: string } | null>(null);


  const isOverBoard = useCallback((x: number, y: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }, []);

  const startDrag = (kind: StickerKind, e: React.PointerEvent) => {
    e.preventDefault();
    playSound("pick");
    setDrag({ kind, x: e.clientX, y: e.clientY, over: false });
  };

  useEffect(() => {
    if (!drag) return;

    const move = (e: PointerEvent) => {
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY, over: isOverBoard(e.clientX, e.clientY) } : d));
    };

    const up = (e: PointerEvent) => {
      const rect = boardRef.current?.getBoundingClientRect();
      setDrag((current) => {
        if (current && rect && isOverBoard(e.clientX, e.clientY)) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          keyRef.current += 1;
          const key = keyRef.current;
          setPlaced((p) => [...p, { key, kind: current.kind, x, y }]);
          playSound(current.kind.sound);
          setPraise({ id: key, text: PRAISE[key % PRAISE.length] ?? "Great job!" });
        }
        return null;
      });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [drag, isOverBoard]);

  useEffect(() => {
    if (!praise) return;
    const t = setTimeout(() => setPraise(null), 1100);
    return () => clearTimeout(t);
  }, [praise]);

  useEffect(() => {
    if (placed.length === 6) playSound("cheer");
  }, [placed.length]);

  const removeSticker = (key: number) => {
    playSound("pick");
    setPlaced((p) => p.filter((s) => s.key !== key));
  };

  const clearAll = () => {
    playSound("clear");
    setPlaced([]);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-4 py-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-5xl">
          Sticker Doctor <span className="inline-block animate-wiggle">🧸</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Build your friend, then drag stickers on to make {NAMES[gender]} feel better. Tap a
          sticker to take it off.
        </p>
      </header>

      <section aria-label="Choose your character" className="toy-card p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">Who?</span>
            {(["boy", "girl"] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGender(g);
                  playSound("pick");
                }}
                aria-pressed={gender === g}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition-transform active:scale-95 ${
                  gender === g
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-sticker)]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {g === "boy" ? "👦 Sam" : "👧 Mia"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">Pajamas</span>
            {PAJAMAS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPajama(p.id);
                  playSound("star");
                }}
                aria-pressed={pajama === p.id}
                className={`${p.bg} flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-foreground/80 transition-transform active:scale-95 ${
                  pajama === p.id ? "ring-4 ring-primary/50" : "opacity-70"
                }`}
              >
                <span aria-hidden>{p.emoji}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={boardRef}
        aria-label="Cartoon child to decorate with stickers"
        className={`toy-card relative mx-auto w-full max-w-md overflow-hidden transition-all duration-200 ${
          drag?.over ? "ring-8 ring-primary/40 scale-[1.01]" : "ring-0"
        }`}
      >
        <img
          key={`${gender}-${pajama}`}
          src={AVATARS[gender][pajama]}
          alt={`Cartoon ${gender === "boy" ? "boy" : "girl"} named ${NAMES[gender]} wearing ${pajama} pajamas`}
          width={768}
          height={1024}
          className="animate-pop-in pointer-events-none mx-auto block h-auto w-full max-h-[52vh] object-contain"
        />


        {placed.map((s) => (
          <button
            key={s.key}
            onClick={() => removeSticker(s.key)}
            aria-label={`Remove ${s.kind.label} sticker`}
            className="animate-pop-in absolute -translate-x-1/2 -translate-y-1/2 text-4xl sticker-shadow transition-transform hover:scale-110 active:scale-95"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span aria-hidden>{s.kind.emoji}</span>
          </button>
        ))}

        {praise && (
          <span
            key={praise.id}
            className="animate-float-up pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 font-display text-lg font-bold text-primary-foreground"
          >
            {praise.text}
          </span>
        )}

        {placed.length === 0 && !drag && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-muted-foreground">
            Drop stickers here!
          </p>
        )}
      </section>

      <section aria-label="Sticker tray" className="toy-card p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-foreground">Sticker Tray</h2>
          <button
            onClick={clearAll}
            disabled={placed.length === 0}
            className="rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground shadow-[var(--shadow-sticker)] transition-transform active:scale-95 disabled:opacity-40"
          >
            Start over
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
          {STICKERS.map((kind) => (
            <button
              key={kind.id}
              onPointerDown={(e) => startDrag(kind, e)}
              aria-label={`Drag ${kind.label} sticker`}
              className={`${kind.bg} flex touch-none flex-col items-center gap-0.5 rounded-2xl py-2.5 shadow-[var(--shadow-sticker)] transition-transform hover:-translate-y-1 active:scale-95`}
            >
              <span aria-hidden className="text-3xl">
                {kind.emoji}
              </span>
              <span className="text-[10px] font-bold text-foreground/70">{kind.label}</span>
            </button>
          ))}
        </div>
      </section>

      <p className="pb-4 text-center text-sm font-semibold text-muted-foreground">
        Stickers placed: {placed.length}
      </p>

      {drag && (
        <span
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 text-5xl sticker-shadow"
          style={{ left: drag.x, top: drag.y, transform: `translate(-50%,-50%) scale(${drag.over ? 1.2 : 1})` }}
          aria-hidden
        >
          {drag.kind.emoji}
        </span>
      )}
    </main>
  );
}
