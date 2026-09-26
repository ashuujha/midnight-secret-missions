import { emitMeme, MEMES, type MemeId } from "./memes";
export type Sound = "challenge" | "caught" | "truth" | "place";
const audioCache = new Map<string, HTMLAudioElement>();
let current: HTMLAudioElement | undefined;
let stopTimer: ReturnType<typeof setTimeout> | undefined;
export function stopSound() {
  if (stopTimer) clearTimeout(stopTimer);
  if (current) {
    current.pause();
    current.currentTime = 0;
  }
}
export function playMeme(id: MemeId) {
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
  stopTimer = setTimeout(stopSound, 2200);
}
export function reactMeme(id: MemeId, audible: boolean, caption?: string) {
  emitMeme(id, caption);
  if (audible) playMeme(id);
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
