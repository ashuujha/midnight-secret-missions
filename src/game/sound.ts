export type Sound = 'deal' | 'play' | 'win' | 'oops' | 'challenge';
let context: AudioContext | undefined;

// Original, tiny arcade cues. No downloads and no audio until the player opts in.
export function playSound(sound: Sound) {
  try {
    context ??= new AudioContext();
    void context
      .resume()
      .then(() => {
        const ctx = context!;
        const notes: Record<Sound, number[]> = {
          deal: [420, 510, 620],
          play: [420, 680],
          win: [523, 659, 784, 1047],
          oops: [320, 240, 130],
          challenge: [740, 400, 580],
        };
        notes[sound].forEach((frequency, index) => {
          const start = ctx.currentTime + index * 0.09;
          const oscillator = ctx.createOscillator();
          const gain = ctx.createGain();
          oscillator.type =
            sound === 'challenge' || sound === 'oops' ? 'triangle' : 'sine';
          oscillator.frequency.setValueAtTime(frequency, start);
          oscillator.frequency.exponentialRampToValueAtTime(
            frequency * (sound === 'oops' ? 0.55 : 0.95),
            start + 0.15,
          );
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.07, start + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
          oscillator.connect(gain);
          gain.connect(ctx.destination);
          oscillator.start(start);
          oscillator.stop(start + 0.21);
        });
      })
      .catch(() => undefined);
  } catch {
    /* Audio is optional when a browser does not support it. */
  }
}
