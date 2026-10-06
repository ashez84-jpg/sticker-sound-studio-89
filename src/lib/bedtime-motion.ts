import type { TargetAndTransition } from "framer-motion";

export type Bedtime = "ready" | "dancing" | "settling" | "sleeping";
export type BodyPart = "body" | "arm-left" | "arm-right" | "leg-left" | "leg-right";

const loop = { duration: 4, repeat: Infinity, ease: "easeInOut" as const };
const settle = { duration: 8, ease: "easeInOut" as const };

export function characterMotion(state: Bedtime, reduced: boolean, dragging: boolean): TargetAndTransition {
  const home = { x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 };
  const tucked = { ...home, y: "4%", scale: 0.65 };
  if (reduced) return { ...(state === "settling" || state === "sleeping" ? tucked : home), transition: { duration: 0 } };
  if (state === "dancing") return {
    x: ["0%", "-1.5%", "0%", "1.5%", "0%"],
    y: ["0%", "-1.5%", "0%", "-1.5%", "0%"],
    scale: 1, rotate: [0, -2, 0, 2, 0], rotateY: [0, 360],
    transition: { x: loop, y: loop, rotate: loop, scale: { duration: 0.6 }, rotateY: { duration: 4, ease: "easeInOut" } },
  };
  if (state === "settling") return {
    x: ["0%", "-23%", "-23%", "-16%", "0%", "0%"],
    y: ["0%", "0%", "-2%", "-8%", "4%", "4%"],
    scale: [1, 0.72, 0.72, 0.69, 0.65, 0.65],
    rotate: [0, 0, 5, 9, 0, 0], rotateY: [0, -20, 24, 15, 0, 0],
    transition: { ...settle, times: [0, 0.34, 0.48, 0.59, 0.77, 1] },
  };
  if (state === "sleeping") return { ...tucked, scale: [0.65, 0.655, 0.65], transition: { ...loop, duration: 5 } };
  return { ...home, y: dragging ? "0%" : ["0%", "-0.6%", "0%"], transition: { ...loop, duration: 5, x: { duration: 0.4 }, scale: { duration: 0.4 }, rotate: { duration: 0.4 }, rotateY: { duration: 0.4 } } };
}

export function limbMotion(part: BodyPart, state: Bedtime, reduced: boolean): TargetAndTransition {
  if (reduced || part === "body") return { rotate: 0, y: "0%", transition: { duration: 0 } };
  const left = part.endsWith("left");
  const arm = part.startsWith("arm");
  const sign = left ? 1 : -1;
  if (state === "dancing") return { rotate: arm ? [0, sign * 14, sign * 5, 0] : [0, sign * 4, 0], y: "0%", transition: { ...loop, duration: 2.5 } };
  if (state === "settling") return {
    rotate: arm ? [0, 0, sign * 30, sign * 15, sign * 25, -sign * 8] : [0, sign * 8, 0, -sign * 22, sign * 10, 0],
    y: "0%", transition: { ...settle, times: [0, 0.3, 0.44, 0.59, 0.69, 1] },
  };
  return { rotate: state === "sleeping" && arm ? -sign * 8 : 0, y: "0%", transition: { duration: 0.6 } };
}

export function blanketMotion(state: Bedtime, reduced: boolean): TargetAndTransition {
  if (reduced || state === "sleeping") return {
    opacity: 1, y: "0%", clipPath: "inset(44% 0 0 0)", scaleY: reduced ? 1 : [1, 1.006, 1],
    transition: reduced ? { duration: 0 } : { ...loop, duration: 5 },
  };
  return {
    opacity: [0, 0, 1, 1], y: ["10%", "10%", "5%", "0%"],
    clipPath: ["inset(75% 0 0 0)", "inset(75% 0 0 0)", "inset(53% 0 0 0)", "inset(44% 0 0 0)"],
    transition: { ...settle, times: [0, 0.69, 0.88, 1] },
  };
}