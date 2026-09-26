import { MEMES, type MemeId } from "./memes";

export const CHAOS_DURATION_MS = 1200;
const reactions = Object.keys(MEMES) as MemeId[];

// Presentation randomness is independent of cards, ranks, claims and game RNG.
// Repeats and accidental matches are allowed; there is no truth/lie weighting.
export function pickChaosMeme(
  random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000,
): MemeId {
  return reactions[
    Math.min(
      reactions.length - 1,
      Math.max(0, Math.floor(random() * reactions.length)),
    )
  ];
}

type PublicPlay = { scope: string; round: number; play: number; pending: boolean };

/** Observe public play counters only; don't replay history on join/reconnect. */
export function createChaosPlayTracker() {
  let previous: PublicPlay | null = null;
  return (next: PublicPlay | null): boolean => {
    const fresh =
      !!next &&
      !!previous &&
      next.scope === previous.scope &&
      next.round === previous.round &&
      next.play > previous.play &&
      next.pending;
    previous = next;
    return fresh;
  };
}
