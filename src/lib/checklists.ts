import { useCallback, useEffect, useState } from "react";

/** Parent's packing list for the night of the sleep study. */
export type PackingItem = { id: string; label: string; children?: { id: string; label: string }[] };

export const PACKING_LIST: PackingItem[] = [
  { id: "meds", label: "Your child's medication" },
  { id: "pajamas", label: "Pajamas or two-piece clothing, such as a T-shirt and shorts" },
  { id: "snacks", label: "Snacks for before and after the sleep study" },
  { id: "diapers", label: "Diapers and wipes" },
  { id: "bottles", label: "Bottles and formula, including formula for G-tube feedings" },
  {
    id: "equipment",
    label: "Any medical equipment your child uses at night, such as:",
    children: [
      { id: "cpap", label: "A CPAP or BiPAP machine" },
      { id: "vent", label: "A ventilator, suction supplies, or feeding pumps" },
    ],
  },
  { id: "comfort", label: "Any comfort stuffed animal, toy, sound machine, or blanket" },
];

export const PACKING_STORAGE_KEY = "sleep-study-packed";

/** Bedtime routine for the day of the sleep study. */
export type RoutineItem = { id: string; label: string; hint?: string };

export const SLEEP_ROUTINE: RoutineItem[] = [
  { id: "no-nap", label: "Skip naps today", hint: "A tired child falls asleep faster at the lab." },
  { id: "no-caffeine", label: "No caffeine after lunch", hint: "That includes chocolate and soda." },
  { id: "wash-hair", label: "Wash hair, skip conditioner and oils", hint: "Clean hair helps the EEG stickers stay on." },
  { id: "dinner", label: "Eat dinner before arriving", hint: "The lab visit starts with setup, not food." },
  { id: "meds", label: "Give evening medication as usual", hint: "Bring the medication along too." },
  { id: "pack", label: "Pack the sleep-study bag", hint: "Use the packing checklist above." },
  { id: "pajamas", label: "Dress in pajamas or a T-shirt and shorts", hint: "Two-piece clothing makes sensor placement easy." },
  { id: "comfort", label: "Grab the comfort stuffed animal or blanket", hint: "Familiar things make the new room feel safe." },
  { id: "arrive", label: "Arrive at the sleep center on time", hint: "Setup takes about an hour before lights out." },
];

export const ROUTINE_STORAGE_KEY = "sleep-study-routine";

/** Read the stored set once (SSR-safe: starts empty, fills on mount). */
function readStored(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

/**
 * Checkbox state persisted in localStorage so the game page and the
 * parent's view share the same packed list on this device.
 */
export function useStoredChecklist(storageKey: string) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setChecked(readStored(storageKey));
  }, [storageKey]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {
          /* storage unavailable — keep in-memory state */
        }
        return next;
      });
    },
    [storageKey],
  );

  const clear = useCallback(() => {
    setChecked(new Set());
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  return { checked, toggle, clear };
}

/** Count a checked-off item plus its checked children as one unit each. */
export function countDone(items: PackingItem[], checked: Set<string>): number {
  return items.reduce(
    (n, item) => n + (checked.has(item.id) ? 1 : 0) + (item.children?.filter((c) => checked.has(c.id)).length ?? 0),
    0,
  );
}

export function countTotal(items: PackingItem[]): number {
  return items.reduce((n, item) => n + 1 + (item.children?.length ?? 0), 0);
}
