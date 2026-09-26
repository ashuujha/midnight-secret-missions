import { emitMeme, MEMES, type MemeId } from "./memes";
export type Sound = "challenge" | "caught" | "truth" | "place";
const audioCache = new Map<string, HTMLAudioElement>();
let current: HTMLAudioElement | undefined;
let stopTimer: ReturnType<typeof setTimeout> | undefined;
let gameAudio: AudioContext | undefined;
let audioUnlocked = false;
let memePauseUntil = 0;
if (typeof window !== "undefined") {
  const unlock = () => {
    audioUnlocked = true;
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}
export type GameCue =
  "flick" | "turn" | "bluff" | "reveal" | "penalty" | "victory";
const cues: Record<GameCue, [number, number, number][]> = {
  flick: [
    [650, 0, 0.05],
    [350, 0.035, 0.07],
  ],
  turn: [
    [392, 0, 0.07],
    [523, 0.075, 0.08],
  ],
  bluff: [
    [185, 0, 0.11],
    [130, 0.1, 0.14],
  ],
  reveal: [
    [440, 0, 0.06],
    [587, 0.08, 0.08],
  ],
  penalty: [
    [330, 0, 0.08],
    [220, 0.08, 0.11],
  ],
  victory: [
    [392, 0, 0.1],
    [523, 0.1, 0.1],
    [659, 0.2, 0.16],
  ],
};
function texturedHit(context: AudioContext, start: number, cue: GameCue) {
  if (cue !== "flick" && cue !== "bluff" && cue !== "penalty") return;
  const duration = cue === "flick" ? 0.065 : cue === "bluff" ? 0.13 : 0.17;
  const buffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * duration),
    context.sampleRate,
  );
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const volume = context.createGain();
  source.buffer = buffer;
  filter.type = cue === "flick" ? "highpass" : "lowpass";
  filter.frequency.value = cue === "flick" ? 1600 : 420;
  volume.gain.setValueAtTime(cue === "flick" ? 0.045 : 0.065, start);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(volume).connect(context.destination);
  source.start(start);
  source.stop(start + duration);
}
/** Short original cues. Gameplay sounds pre-empt, rather than overlap, meme clips. */
export function playGameCue(cue: GameCue, audible = true) {
  if (!audible || !audioUnlocked || document.hidden) return;
  stopSound();
  memePauseUntil = Date.now() + (cue === "victory" ? 450 : 260);
  try {
    gameAudio ??= new AudioContext();
    if (gameAudio.state === "suspended") void gameAudio.resume();
    const start = gameAudio.currentTime;
    texturedHit(gameAudio, start, cue);
    for (const [frequency, delay, length] of cues[cue]) {
      const oscillator = gameAudio.createOscillator();
      const gain = gameAudio.createGain();
      oscillator.type = cue === "bluff" ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + delay);
      gain.gain.exponentialRampToValueAtTime(0.055, start + delay + 0.009);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + delay + length);
      oscillator.connect(gain).connect(gameAudio.destination);
      oscillator.start(start + delay);
      oscillator.stop(start + delay + length + 0.01);
    }
  } catch {
    /* visual feedback remains available when audio is blocked */
  }
}
export function stopSound() {
  if (stopTimer) clearTimeout(stopTimer);
  if (current) {
    current.pause();
    current.currentTime = 0;
  }
}
export function playMeme(id: MemeId, durationMs = 2200) {
  if (Date.now() < memePauseUntil || document.hidden) return;
  stopSound();
  const source = MEMES[id].audio;
  current = audioCache.get(source);
  if (!current) {
    current = new Audio(source);
    current.preload = "none";
    audioCache.set(source, current);
  }
  current.volume = id === "crying" ? 0.2 : 0.3;
  void current.play().catch(() => {});
  stopTimer = setTimeout(stopSound, durationMs);
}
export function reactMeme(
  id: MemeId,
  audible: boolean,
  caption?: string,
  durationMs?: number,
) {
  emitMeme(id, caption, durationMs);
  if (audible) playMeme(id, durationMs);
}
export function playSound(sound: Sound, audible = true) {
  reactMeme(
    sound === "caught"
      ? "crying"
      : sound === "challenge"
        ? "huh"
        : sound === "truth"
          ? "polite"
          : "pop",
    audible,
  );
}
