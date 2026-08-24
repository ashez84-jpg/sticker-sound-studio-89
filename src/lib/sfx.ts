let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Tone = {
  freq: number;
  dur: number;
  type?: OscillatorType;
  delay?: number;
  slideTo?: number;
  gain?: number;
};

function playTones(tones: Tone[]) {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  for (const t of tones) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const start = now + (t.delay ?? 0);
    const peak = t.gain ?? 0.18;
    osc.type = t.type ?? "sine";
    osc.frequency.setValueAtTime(t.freq, start);
    if (t.slideTo) osc.frequency.exponentialRampToValueAtTime(t.slideTo, start + t.dur);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + t.dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + t.dur + 0.05);
  }
}

function noise(dur: number, gainValue = 0.12) {
  const audio = getCtx();
  if (!audio) return;
  const frames = Math.floor(audio.sampleRate * dur);
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = audio.createBufferSource();
  const gain = audio.createGain();
  gain.gain.value = gainValue;
  src.buffer = buffer;
  src.connect(gain).connect(audio.destination);
  src.start();
}

export type SoundName =
  | "pick"
  | "bandage"
  | "plaster"
  | "heart"
  | "star"
  | "thermometer"
  | "shot"
  | "stethoscope"
  | "cheer"
  | "clear";

export function playSound(name: SoundName) {
  switch (name) {
    case "pick":
      playTones([{ freq: 660, dur: 0.08, type: "triangle", gain: 0.1 }]);
      break;
    case "bandage":
      noise(0.22, 0.09);
      playTones([{ freq: 300, dur: 0.14, type: "triangle", slideTo: 520 }]);
      break;
    case "plaster":
      playTones([
        { freq: 420, dur: 0.1, type: "square", gain: 0.08 },
        { freq: 700, dur: 0.14, type: "triangle", delay: 0.06 },
      ]);
      break;
    case "heart":
      playTones([
        { freq: 180, dur: 0.16, type: "sine", gain: 0.25 },
        { freq: 150, dur: 0.2, type: "sine", delay: 0.22, gain: 0.22 },
      ]);
      break;
    case "star":
      playTones([
        { freq: 880, dur: 0.1, type: "triangle" },
        { freq: 1170, dur: 0.1, type: "triangle", delay: 0.07 },
        { freq: 1560, dur: 0.16, type: "triangle", delay: 0.14 },
      ]);
      break;
    case "thermometer":
      playTones([{ freq: 500, dur: 0.4, type: "sine", slideTo: 1200, gain: 0.12 }]);
      break;
    case "shot":
      playTones([{ freq: 1400, dur: 0.12, type: "square", slideTo: 500, gain: 0.08 }]);
      noise(0.1, 0.05);
      break;
    case "stethoscope":
      playTones([
        { freq: 120, dur: 0.18, type: "sine", gain: 0.3 },
        { freq: 95, dur: 0.22, type: "sine", delay: 0.2, gain: 0.25 },
      ]);
      break;
    case "cheer":
      playTones([
        { freq: 523, dur: 0.16, type: "triangle" },
        { freq: 659, dur: 0.16, type: "triangle", delay: 0.12 },
        { freq: 784, dur: 0.18, type: "triangle", delay: 0.24 },
        { freq: 1046, dur: 0.32, type: "triangle", delay: 0.36 },
      ]);
      break;
    case "clear":
      playTones([{ freq: 700, dur: 0.22, type: "sine", slideTo: 260, gain: 0.1 }]);
      break;
  }
}
