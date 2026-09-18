import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import {
  PACKING_LIST,
  PACKING_STORAGE_KEY,
  ROUTINE_STORAGE_KEY,
  SLEEP_ROUTINE,
  countDone,
  countTotal,
  useStoredChecklist,
} from "@/lib/checklists";

export const Route = createFileRoute("/parents/")({
  head: () => ({
    meta: [
      { title: "Parent's View - Sleep Study Checklist & Routine | Get Ready with Me Sleep Study" },
      {
        name: "description",
        content:
          "Track the sleep-study packing list and bedtime routine from your phone: medication, pajamas, snacks, equipment, and every step of the night.",
      },
      { property: "og:title", content: "Parent's View - Sleep Study Checklist & Routine" },
      {
        property: "og:description",
        content: "A phone-friendly packing list and sleep routine tracker for your child's sleep study night.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ParentsView,
});

function ParentsView() {
  const packed = useStoredChecklist(PACKING_STORAGE_KEY);
  const routine = useStoredChecklist(ROUTINE_STORAGE_KEY);
  const [openEquipment, setOpenEquipment] = useState(false);

  const packedCount = countDone(PACKING_LIST, packed.checked);
  const packingTotal = countTotal(PACKING_LIST);
  const routineCount = SLEEP_ROUTINE.filter((r) => routine.checked.has(r.id)).length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">For grown-ups</p>
        <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl">
          Parent's View <span aria-hidden>🌙</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track the packing list and the bedtime routine right from your phone. Checks are saved on this device.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[var(--shadow-sticker)] transition-transform active:scale-95"
          >
            🧸 Back to the game
          </Link>
          <Link
            to="/parents/habits"
            className="inline-flex items-center justify-center rounded-full bg-muted px-4 py-2 text-sm font-bold text-muted-foreground transition-transform active:scale-95"
          >
            🌟 Good sleep habits
          </Link>
        </div>
      </header>

      <section aria-label="Packing list" className="toy-card p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="text-lg font-bold text-foreground">🎒 Packing list</h2>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-extrabold text-muted-foreground">
            {packedCount} of {packingTotal} packed
          </span>
        </div>
        <progress
          value={packedCount}
          max={packingTotal}
          aria-label="Packing progress"
          className="mt-2 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
        />
        <ul className="mt-3 flex flex-col gap-1.5">
          {PACKING_LIST.map((item) => {
            const done = packed.checked.has(item.id);
            return (
              <li key={item.id}>
                <div
                  className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 transition-colors ${
                    done ? "bg-mint" : "bg-muted"
                  }`}
                >
                  <button
                    onClick={() => packed.toggle(item.id)}
                    aria-pressed={done}
                    aria-label={`Mark ${item.label} as packed`}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left active:scale-[0.99]"
                  >
                    <span
                      aria-hidden
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-colors ${
                        done ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                      }`}
                    >
                      {done ? "✓" : "○"}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        done ? "text-foreground line-through opacity-70" : "text-foreground/80"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                  {item.children && (
                    <button
                      onClick={() => setOpenEquipment((v) => !v)}
                      aria-expanded={openEquipment}
                      aria-label={openEquipment ? "Hide equipment list" : "Show equipment list"}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-extrabold text-muted-foreground transition-transform active:scale-90"
                    >
                      <span aria-hidden>{openEquipment ? "▴" : "▾"}</span>
                    </button>
                  )}
                </div>
                {item.children && openEquipment && (
                  <ul className="animate-pop-in mt-1 ml-9 flex flex-col gap-1">
                    {item.children.map((child) => {
                      const childDone = packed.checked.has(child.id);
                      return (
                        <li key={child.id}>
                          <button
                            onClick={() => packed.toggle(child.id)}
                            aria-pressed={childDone}
                            className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left transition-colors active:scale-[0.99] ${
                              childDone ? "bg-mint" : "bg-background"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                                childDone ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {childDone ? "✓" : "○"}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                childDone ? "text-foreground line-through opacity-70" : "text-foreground/70"
                              }`}
                            >
                              {child.label}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        {packedCount === packingTotal && (
          <p className="animate-pop-in mt-2 text-center text-sm font-extrabold text-primary">
            🎉 All packed and ready — sweet dreams!
          </p>
        )}
      </section>

      <section aria-label="Sleep routine" className="toy-card p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="text-lg font-bold text-foreground">😴 Sleep study night routine</h2>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-extrabold text-muted-foreground">
            {routineCount} of {SLEEP_ROUTINE.length} done
          </span>
        </div>
        <progress
          value={routineCount}
          max={SLEEP_ROUTINE.length}
          aria-label="Routine progress"
          className="mt-2 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
        />
        <ol className="mt-3 flex flex-col gap-1.5">
          {SLEEP_ROUTINE.map((step, i) => {
            const done = routine.checked.has(step.id);
            return (
              <li key={step.id}>
                <button
                  onClick={() => routine.toggle(step.id)}
                  aria-pressed={done}
                  className={`flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors active:scale-[0.99] ${
                    done ? "bg-mint" : "bg-muted"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors ${
                      done ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-bold ${
                        done ? "text-foreground line-through opacity-70" : "text-foreground/80"
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.hint && (
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{step.hint}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {routineCount === SLEEP_ROUTINE.length && (
          <p className="animate-pop-in mt-2 text-center text-sm font-extrabold text-primary">
            🌟 Routine complete — time for the sleep study!
          </p>
        )}
        <button
          onClick={() => {
            packed.clear();
            routine.clear();
          }}
          className="mt-3 w-full rounded-full bg-muted px-4 py-2 text-sm font-bold text-muted-foreground transition-transform active:scale-95"
        >
          Reset both lists
        </button>
      </section>
    </main>
  );
}
