export type Sound = "challenge" | "caught" | "truth" | "place";
let current: HTMLAudioElement | undefined;
export function stopSound() {
  if (current) {
    current.pause();
    current.currentTime = 0;
  }
}
export function playSound(sound: Sound) {
  stopSound();
  current = new Audio(
    sound === "caught"
      ? "/sounds/fahh.mp3"
      : sound === "challenge"
        ? "/sounds/huh.mp3"
        : "/sounds/pop.mp3",
  );
  current.volume = sound === "caught" ? 0.28 : 0.4;
  void current.play().catch(() => {});
}
