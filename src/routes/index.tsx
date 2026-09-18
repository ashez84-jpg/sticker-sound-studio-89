import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import boyStars from "@/assets/boy-stars.png";
import boyDino from "@/assets/boy-dino.png";
import boyHearts from "@/assets/boy-hearts.png";
import girlStars from "@/assets/girl-stars.png";
import girlDino from "@/assets/girl-dino.png";
import girlHearts from "@/assets/girl-hearts.png";
import stickerBelt from "@/assets/sticker-belt.png";
import stickerEkg from "@/assets/sticker-ekg.png";
import stickerEeg from "@/assets/sticker-eeg.png";
import stickerCannula from "@/assets/sticker-cannula.png";
import stickerPulseox from "@/assets/sticker-pulseox.png";
import stickerTeddy from "@/assets/sticker-teddy.png";
import stickerPuppy from "@/assets/sticker-puppy.png";
import stickerUnicorn from "@/assets/sticker-unicorn.png";
import stickerGauze from "@/assets/sticker-gauze-wrap.png";
import sleepStudyReference from "@/assets/sleep-study-reference.jpg";
import sleepStudyRoom from "@/assets/sleep-study-room.jpg";

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
  sub: string;
  img: string;
  sound: SoundName;
  bg: string;
};

const STICKERS: StickerKind[] = [
  {
    id: "belt",
    label: "The Elastic Hug Band",
    sub: "Chest & belly belts",
    img: stickerBelt,
    sound: "plaster",
    bg: "bg-sky",
  },
  {
    id: "ekg",
    label: "EKG & EMG Sensors",
    sub: "Heart & leg stickers",
    img: stickerEkg,
    sound: "heart",
    bg: "bg-bubblegum",
  },
  {
    id: "eeg",
    label: "EEG & EOG Electrodes",
    sub: "Head & face stickers",
    img: stickerEeg,
    sound: "bandage",
    bg: "bg-mint",
  },
  {
    id: "cannula",
    label: "Nasal Cannula",
    sub: "Airflow tube under the nose",
    img: stickerCannula,
    sound: "star",
    bg: "bg-sunshine",
  },
  {
    id: "pulseox",
    label: "Pulse Oximeter",
    sub: "Finger or toe light",
    img: stickerPulseox,
    sound: "heart",
    bg: "bg-bubblegum",
  },
  {
    id: "teddy",
    label: "Ready Bear",
    sub: "A brave buddy for the bed",
    img: stickerTeddy,
    sound: "star",
    bg: "bg-sunshine",
  },
  {
    id: "puppy",
    label: "Puppy Dog",
    sub: "A cuddly sleep friend",
    img: stickerPuppy,
    sound: "heart",
    bg: "bg-mint",
  },
  {
    id: "unicorn",
    label: "Unicorn",
    sub: "A magical stuffed animal",
    img: stickerUnicorn,
    sound: "star",
    bg: "bg-bubblegum",
  },
  {
    id: "gauze",
    label: "Gauze Hat",
    sub: "Soft net cap for the head",
    img: stickerGauze,
    sound: "bandage",
    bg: "bg-sky",
  },
];

type Gender = "boy" | "girl";
type PajamaId = "stars" | "dino" | "hearts";

/** A precise landing spot on the avatar, in % of the avatar image box. */
type Slot = {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  /** width % — set for band-style stickers drawn as a strap */
  band?: number;
  /** px height for band-style stickers */
  bandH?: number;
  /** stretch the band artwork instead of preserving its aspect ratio */
  stretch?: boolean;
  size?: number;
  hint: string;
};

/**
 * The avatar artwork is a wide canvas (1264x848) displayed with object-cover in a
 * tall box, so the visible horizontal window is artwork 24.06%..75.94%.
 * fx() converts an artwork x% into a box x%.
 */
const fx = (a: number) => (a - 24.06) / 0.5187;

/** dy nudges every head landmark for slightly different face heights. */
type Tune = {
  dy: number;
  cannulaY: number;
  chestY: number;
  chestW: number;
  bellyY: number;
  bellyW: number;
  /** gauze wrap center and dimensions, tuned so its ties meet beneath the chin */
  hatY: number;
  hatW: number;
  hatH: number;
};

const buildSlots = (t: Tune): Slot[] => [
  // Respiratory effort belts: nipple line and over the navel
  { id: "belt-chest", stickerId: "belt", x: 50, y: t.chestY, band: t.chestW, bandH: 24, stretch: true, hint: "Chest band" },
  { id: "belt-belly", stickerId: "belt", x: 50, y: t.bellyY, band: t.bellyW, bandH: 22, stretch: true, hint: "Belly band" },
  // ECG below the collarbones, chin EMG under the jaw, leg EMG on the shins
  { id: "ekg-l", stickerId: "ekg", x: fx(46.5), y: 43.5, size: 26, hint: "Chest (ECG)" },
  { id: "ekg-r", stickerId: "ekg", x: fx(53.5), y: 43.5, size: 26, hint: "Chest (ECG)" },

  { id: "chin-emg", stickerId: "ekg", x: 50, y: 37 + t.dy, size: 20, hint: "Under the chin (EMG)" },
  { id: "emg-l", stickerId: "ekg", x: fx(47), y: 80, size: 22, hint: "Shin (leg EMG)" },
  { id: "emg-r", stickerId: "ekg", x: fx(53), y: 80, size: 22, hint: "Shin (leg EMG)" },
  // EEG on the forehead and top of the head, EOG at the outer eye corners
  { id: "eeg-top-l", stickerId: "eeg", x: fx(47), y: 11 + t.dy, size: 20, hint: "Top of head (EEG)" },
  { id: "eeg-top-r", stickerId: "eeg", x: fx(53), y: 11 + t.dy, size: 20, hint: "Top of head (EEG)" },
  { id: "eeg-l", stickerId: "eeg", x: fx(46.5), y: 19.5 + t.dy, size: 22, hint: "Forehead (EEG)" },
  { id: "eeg-r", stickerId: "eeg", x: fx(53.5), y: 19.5 + t.dy, size: 22, hint: "Forehead (EEG)" },
  { id: "eog-l", stickerId: "eeg", x: fx(42.3), y: 25.3 + t.dy, size: 18, hint: "Outer eye corner (EOG)" },
  { id: "eog-r", stickerId: "eeg", x: fx(57.7), y: 25.3 + t.dy, size: 18, hint: "Outer eye corner (EOG)" },
  // Cannula centered in the gap between the nostrils and the mouth
  { id: "cannula", stickerId: "cannula", x: 50, y: t.cannulaY, band: 26, bandH: 20, stretch: true, hint: "Between the nose and mouth" },
  // Pulse ox on a finger or toe
  { id: "ox-hand-l", stickerId: "pulseox", x: fx(38), y: 62, size: 24, hint: "Finger (pulse ox)" },
  { id: "ox-hand-r", stickerId: "pulseox", x: fx(62.5), y: 62, size: 24, hint: "Finger (pulse ox)" },
  { id: "ox-toe-l", stickerId: "pulseox", x: fx(46), y: 92, size: 20, hint: "Toe (pulse ox)" },
  { id: "ox-toe-r", stickerId: "pulseox", x: fx(54), y: 92, size: 20, hint: "Toe (pulse ox)" },
  // Cuddly stuffed animals tucked on the avatar's arms
  { id: "teddy", stickerId: "teddy", x: fx(37.5), y: 57, size: 78, hint: "On the arm" },
  { id: "puppy", stickerId: "puppy", x: fx(62.5), y: 57, size: 78, hint: "On the arm" },
  { id: "unicorn", stickerId: "unicorn", x: fx(38.5), y: 68, size: 72, hint: "On the arm" },
  // Wide, shallow gauze cap fitted over the crown without covering the face
  { id: "gauze-hat", stickerId: "gauze", x: 50, y: t.hatY, band: t.hatW, bandH: t.hatH, stretch: true, hint: "Fitted over the crown and sides of the head" },
];

const SLOTS: Record<Gender, Record<PajamaId, Slot[]>> = {
  boy: {
    stars: buildSlots({ dy: 0, cannulaY: 30.4, chestY: 51, chestW: 30, bellyY: 60, bellyW: 27, hatY: 13, hatW: 43, hatH: 80 }),
    dino: buildSlots({ dy: 0, cannulaY: 30.2, chestY: 50, chestW: 31, bellyY: 59, bellyW: 29, hatY: 13, hatW: 43, hatH: 80 }),
    hearts: buildSlots({ dy: 0, cannulaY: 30.4, chestY: 51, chestW: 30, bellyY: 60, bellyW: 27, hatY: 13, hatW: 43, hatH: 80 }),
  },
  girl: {
    stars: buildSlots({ dy: -0.8, cannulaY: 30.3, chestY: 52.5, chestW: 32, bellyY: 62.5, bellyW: 29, hatY: 10.5, hatW: 58, hatH: 105 }),
    dino: buildSlots({ dy: -0.8, cannulaY: 28.7, chestY: 52, chestW: 32, bellyY: 62, bellyW: 30, hatY: 10.5, hatW: 58, hatH: 105 }),
    hearts: buildSlots({ dy: -0.8, cannulaY: 28.7, chestY: 52, chestW: 31, bellyY: 61.5, bellyW: 29, hatY: 10.5, hatW: 58, hatH: 105 }),
  },
};





type Placed = { key: number; kind: StickerKind; slot: Slot };
type DragState = { kind: StickerKind; x: number; y: number; over: boolean; slotId: string | null };

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
  const [showReference, setShowReference] = useState(false);


  const slots = SLOTS[gender][pajama];

  /** Nearest valid slot for this sticker, in avatar-relative % space. */
  const findSlot = useCallback(
    (kind: StickerKind, clientX: number, clientY: number) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return null;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      if (x < -8 || x > 108 || y < -8 || y > 108) return null;
      const candidates = slots.filter((s) => s.stickerId === kind.id);
      let best: Slot | null = null;
      let bestD = Infinity;
      for (const s of candidates) {
        const d = (s.x - x) ** 2 + (s.y - y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = s;
        }
      }
      return best;
    },
    [slots],
  );

  const startDrag = (kind: StickerKind, e: React.PointerEvent) => {
    e.preventDefault();
    playSound("pick");
    setDrag({ kind, x: e.clientX, y: e.clientY, over: false, slotId: null });
  };

  useEffect(() => {
    if (!drag) return;

    const move = (e: PointerEvent) => {
      setDrag((d) => {
        if (!d) return d;
        const slot = findSlot(d.kind, e.clientX, e.clientY);
        return { ...d, x: e.clientX, y: e.clientY, over: !!slot, slotId: slot?.id ?? null };
      });
    };

    const up = (e: PointerEvent) => {
      setDrag((current) => {
        if (current) {
          const slot = findSlot(current.kind, e.clientX, e.clientY);
          if (slot) {
            keyRef.current += 1;
            const key = keyRef.current;
            setPlaced((p) => [
              ...p.filter((s) => s.slot.id !== slot.id),
              { key, kind: current.kind, slot },
            ]);
            playSound(current.kind.sound);
            setPraise({ id: key, text: PRAISE[key % PRAISE.length] ?? "Great job!" });
          }
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
  }, [drag, findSlot]);

  useEffect(() => {
    if (!praise) return;
    const t = setTimeout(() => setPraise(null), 1100);
    return () => clearTimeout(t);
  }, [praise]);

  useEffect(() => {
    if (placed.length === slots.length) playSound("cheer");
  }, [placed.length, slots.length]);

  // Slot positions shift between boy and girl, so start fresh on a swap.
  useEffect(() => {
    setPlaced([]);
  }, [gender, pajama]);

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

      <section aria-label="Real sleep study reference" className="toy-card p-3 sm:p-4">
        <button
          onClick={() => {
            setShowReference((v) => !v);
            playSound("pick");
          }}
          aria-expanded={showReference}
          className="flex w-full items-center justify-between gap-2 rounded-2xl px-1 text-left"
        >
          <span className="text-lg font-bold text-foreground">
            📋 Real sleep study map {showReference ? "" : "— peek inside"}
          </span>
          <span aria-hidden className="text-xl">{showReference ? "▴" : "▾"}</span>
        </button>
        {showReference && (
          <figure className="animate-pop-in mt-3">
            <img
              src={sleepStudyReference}
              alt="Diagram of a child set up for a sleep study, labelling EEG on the forehead and top of head, EOG at the outer eye corners, chin EMG, nasal cannula under the nose, ECG on the chest, effort belts around the chest and belly, leg EMG on the shins and a pulse oximeter on a finger"
              width={1024}
              height={1024}
              loading="lazy"
              className="mx-auto w-full max-w-sm rounded-2xl"
            />
            <figcaption className="mt-2 text-center text-xs font-semibold text-muted-foreground">
              Every glowing spot in the game matches these real sensor positions.
            </figcaption>
          </figure>
        )}
      </section>

      <section aria-label="Sleep study checklist" className="toy-card p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-foreground">✅ Sleep Study Checklist</h2>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-extrabold text-muted-foreground">
            {doneCount} of {STICKERS.length} done
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          {STICKERS.map((kind) => {
            const done = placed.some((p) => p.kind.id === kind.id);
            return (
              <li
                key={kind.id}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2 transition-colors ${
                  done ? "bg-mint" : "bg-muted"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    done ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : "○"}
                </span>
                <img src={kind.img} alt="" aria-hidden loading="lazy" className="h-7 w-7 object-contain" />
                <span
                  className={`text-sm font-bold ${
                    done ? "text-foreground line-through opacity-70" : "text-foreground/80"
                  }`}
                >
                  {kind.label}
                </span>
              </li>
            );
          })}
        </ul>
        {doneCount === STICKERS.length && (
          <p className="animate-pop-in mt-2 text-center text-sm font-extrabold text-primary">
            🎉 All set for the sleep study — sweet dreams!
          </p>
        )}
      </section>

      <section
        aria-label="Cartoon child to decorate with stickers"
        className={`toy-card relative mx-auto w-full max-w-md overflow-hidden p-2 transition-all duration-200 ${
          drag?.over ? "ring-8 ring-primary/40" : "ring-0"
        }`}
      >
        <div ref={boardRef} className="relative mx-auto aspect-[54/70] w-full max-w-[432px]">
          <img
            src={sleepStudyRoom}
            alt="A cozy sleep study room with teddy bear, bunny, and dinosaur toys on the bed"
            width={1088}
            height={1408}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <img
            key={`${gender}-${pajama}`}
            src={AVATARS[gender][pajama]}
            alt={`Cartoon ${gender === "boy" ? "boy" : "girl"} named ${NAMES[gender]} wearing ${pajama} pajamas`}
            width={1264}
            height={848}
            className="animate-pop-in pointer-events-none relative block h-full w-full object-cover drop-shadow-lg"
          />


          {/* Target outlines for the sticker being dragged */}
          {drag &&
            slots
              .filter((s) => s.stickerId === drag.kind.id)
              .map((s) => (
                <span
                  key={s.id}
                  aria-hidden
                  className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed transition-all ${
                    drag.slotId === s.id
                      ? "border-primary bg-primary/20 scale-110"
                      : "border-primary/50 bg-primary/5"
                  }`}
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.band ? `${s.band}%` : `${s.size ?? 22}px`,
                    height: s.band ? `${s.bandH ?? 16}px` : `${s.size ?? 22}px`,
                    borderRadius: s.band ? "9999px" : undefined,
                  }}
                />
              ))}

          {placed.map((s) =>
            s.slot.band ? (
              <button
                key={s.key}
                onClick={() => removeSticker(s.key)}
                aria-label={`Remove ${s.kind.label} from the ${s.slot.hint}`}
                className="animate-pop-in absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform hover:scale-105 active:scale-95"
                style={{ left: `${s.slot.x}%`, top: `${s.slot.y}%`, width: `${s.slot.band}%`, height: s.slot.bandH ?? 18 }}
              >
                <img
                  src={s.kind.img}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className={`h-full w-full drop-shadow ${s.slot.stretch ? "object-fill" : "object-contain"}`}
                />
              </button>

            ) : (
              <button
                key={s.key}
                onClick={() => removeSticker(s.key)}
                aria-label={`Remove ${s.kind.label} from the ${s.slot.hint}`}
                className="animate-pop-in absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center sticker-shadow transition-transform hover:scale-110 active:scale-95"
                style={{
                  left: `${s.slot.x}%`,
                  top: `${s.slot.y}%`,
                  width: `${s.slot.size ?? 22}px`,
                  height: `${s.slot.size ?? 22}px`,
                }}
              >
                <img src={s.kind.img} alt="" aria-hidden loading="lazy" className="h-full w-full object-contain" />
              </button>
            ),
          )}
        </div>

        {praise && (
          <span
            key={praise.id}
            className="animate-float-up pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 font-display text-lg font-bold text-primary-foreground"
          >
            {praise.text}
          </span>
        )}

        {placed.length === 0 && !drag && (
          <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-sm font-semibold text-muted-foreground">
            Pick a sticker — the right spots light up!
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
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
          {STICKERS.map((kind, i) => (
            <button
              key={kind.id}
              onPointerDown={(e) => startDrag(kind, e)}
              aria-label={`Drag ${kind.label} sticker`}
              className={`${kind.bg} flex touch-none flex-col items-center gap-0.5 rounded-2xl px-2 py-3 text-center shadow-[var(--shadow-sticker)] transition-transform hover:-translate-y-1 active:scale-95`}
            >
              <img
                src={kind.img}
                alt=""
                aria-hidden
                loading="lazy"
                className="pointer-events-none h-12 w-12 object-contain drop-shadow"
              />
              <span className="text-xs font-extrabold leading-tight text-foreground/80">
                {i + 1}. {kind.label}
              </span>
              <span className="text-[10px] font-bold text-foreground/60">{kind.sub}</span>
            </button>

          ))}
        </div>
      </section>

      <p className="pb-4 text-center text-sm font-semibold text-muted-foreground">
        Stickers placed: {placed.length}
      </p>

      {drag && (
        <span
          className="pointer-events-none fixed z-50 block h-14 w-14 -translate-x-1/2 -translate-y-1/2 sticker-shadow"
          style={{ left: drag.x, top: drag.y, transform: `translate(-50%,-50%) scale(${drag.over ? 1.2 : 1})` }}
          aria-hidden
        >
          <img src={drag.kind.img} alt="" className="h-full w-full object-contain" />
        </span>
      )}
    </main>
  );
}
