import type { TargetAndTransition } from "framer-motion";

export type Bedtime = "ready" | "dancing" | "settling" | "sleeping";
export type BodyPart = "body" | "arm-left" | "arm-right" | "leg-left" | "leg-right";

const loop = { duration: 4, repeat: Infinity, ease: "easeInOut" as const };
const settle = { duration: 8, repeat: 0, ease: "easeInOut" as const };

// Shared with the end of the climb: the head is centred over the blanket's
// body mold (which sits ~2.6% left of the scene centre) with the chin tucked
// just behind the blanket's top edge so the head reads as attached to it.
const bedPose = { x: "-2.6%", y: "7.3%", scale: 0.43, rotate: 0, rotateY: 0 };

export function characterMotion(state: Bedtime, reduced: boolean, dragging: boolean): TargetAndTransition {
  const home = { x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 };
  const tucked = bedPose;
  if (reduced) return { ...(state === "settling" || state === "sleeping" ? tucked : home), transition: { duration: 0 } };
  if (state === "dancing") return {
    x: ["0%", "-1.5%", "0%", "1.5%", "0%"],
    y: ["0%", "-1%", "0%", "-1%", "0%"],
    scale: [1, 1.006, 1, 1.006, 1], rotate: [0, -1.5, 0, 1.5, 0],
    // A front-facing bitmap has no back surface. Shallow turns preserve its
    // plush volume instead of flipping/mirroring it like a paper cutout.
    rotateY: [0, -16, 0, 16, 0],
    transition: { ...loop },
  };
  if (state === "settling") return {
    x: ["0%", "-23%", "-23%", "-14%", tucked.x, tucked.x],
    y: ["0%", "0%", "-2%", "1%", tucked.y, tucked.y],
    scale: [1, 0.72, 0.72, 0.54, tucked.scale, tucked.scale],
    rotate: [0, -1, 2, 3, 0, 0], rotateY: [0, -12, -12, -6, 0, 0],
    transition: { ...settle, times: [0, 0.34, 0.48, 0.59, 0.77, 1] },
  };
  if (state === "sleeping") return { ...tucked, scale: [tucked.scale, tucked.scale + 0.002, tucked.scale], transition: { ...loop, duration: 5, x: { duration: 0, repeat: 0 }, y: { duration: 0, repeat: 0 }, rotate: { duration: 0, repeat: 0 }, rotateY: { duration: 0, repeat: 0 } } };
  return { ...home, y: dragging ? "0%" : ["0%", "-0.6%", "0%"], transition: { duration: 0.4, repeat: 0, y: dragging ? { duration: 0.2, repeat: 0 } : { ...loop, duration: 5 } } };
}

export function limbMotion(part: BodyPart, state: Bedtime, reduced: boolean): TargetAndTransition {
  if (reduced || part === "body") return { rotate: 0, y: "0%", transition: { duration: 0 } };
  const left = part.endsWith("left");
  const arm = part.startsWith("arm");
  const sign = left ? 1 : -1;
  if (state === "dancing") return { rotate: arm ? [0, sign * 7, sign * 3, 0] : [0, sign * 2, 0], y: "0%", transition: { ...loop, duration: 4 } };
  if (state === "settling") return {
    rotate: arm ? [0, 0, sign * 10, sign * 6, sign * 8, 0] : [0, sign * 3, 0, -sign * 5, sign * 3, 0],
    y: "0%", transition: { ...settle, times: [0, 0.3, 0.44, 0.59, 0.69, 1] },
  };
  return { rotate: 0, y: "0%", transition: { duration: 0.6, repeat: 0 } };
}

export function blanketMotion(state: Bedtime, reduced: boolean): TargetAndTransition {
  if (reduced || state === "sleeping") return {
    opacity: 1, y: "0%", clipPath: "inset(40% 0 0 0)", scaleY: reduced ? 1 : [1, 1.003, 1],
    transition: reduced ? { duration: 0 } : { ...loop, duration: 5 },
  };
  return {
    opacity: [0, 0, 1, 1], y: ["10%", "10%", "5%", "0%"],
    clipPath: ["inset(75% 0 0 0)", "inset(75% 0 0 0)", "inset(53% 0 0 0)", "inset(40% 0 0 0)"],
    transition: { ...settle, times: [0, 0.69, 0.88, 1] },
  };
}