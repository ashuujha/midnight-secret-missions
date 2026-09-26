export const MEMES = {
  pop: {
    name: "Pop Cat",
    image: "/memes/pop.png",
    audio: "/sounds/pop.mp3",
    caption: "pop. impeccable choice.",
    color: "yellow",
  },
  huh: {
    name: "Huh Cat",
    image: "/memes/huh.jpg",
    audio: "/sounds/huh.mp3",
    caption: "huh? explain yourself.",
    color: "pink",
  },
  oiia: {
    name: "OIIA Cat",
    image: "/memes/oiia.png",
    audio: "/sounds/oiia.mp3",
    caption: "oiia oiia. brain offline.",
    color: "blue",
  },
  smudge: {
    name: "Smudge",
    image: "/memes/smudge.jpg",
    audio: "/sounds/meow.mp3",
    caption: "not buying your story.",
    color: "purple",
  },
  crying: {
    name: "Crying Cat",
    image: "/memes/crying.png",
    audio: "/sounds/fahh.mp3",
    caption: "FAHH. caught in 4K.",
    color: "pink",
  },
  polite: {
    name: "Polite Cat",
    image: "/memes/polite.jpg",
    audio: "/sounds/happy.mp3",
    caption: "happy happy. very innocent.",
    color: "yellow",
  },
} as const;
export type MemeId = keyof typeof MEMES;
const clickPool: readonly MemeId[] = ["pop", "huh", "oiia", "smudge"];
export function pickMeme(previous?: MemeId, random = Math.random): MemeId {
  const available = clickPool.filter((id) => id !== previous);
  return available[
    Math.min(
      available.length - 1,
      Math.max(0, Math.floor(random() * available.length)),
    )
  ];
}
export type MemeReaction = {
  id: MemeId;
  caption?: string;
  durationMs?: number;
};
let lastReaction = 0;
export function lastReactionAt() {
  return lastReaction;
}
export function emitMeme(id: MemeId, caption?: string, durationMs?: number) {
  lastReaction = performance.now();
  window.dispatchEvent(
    new CustomEvent<MemeReaction>("cat-bluff:meme", {
      detail: { id, caption, durationMs },
    }),
  );
}

/** Decoration only: never use a hand, rank, claim, or game RNG to pick a meme. */
export function freshMemeLineup(key: string, count: number): MemeId[] {
  const pool = Object.keys(MEMES) as MemeId[];
  const sample = [...pool];
  for (let i = sample.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [sample[i], sample[j]] = [sample[j], sample[i]];
  }
  let previous: MemeId[] = [];
  try {
    previous = JSON.parse(sessionStorage.getItem(key) || "[]");
    if (!Array.isArray(previous)) previous = [];
  } catch {
    /* Storage is optional for decorative variety. */
  }
  const chosen = sample.slice(0, count);
  // A fresh visit should look different, even if chance picked the same cast.
  if (chosen.every((id) => previous.includes(id))) {
    const replacement = sample.find((id) => !previous.includes(id));
    if (replacement) chosen[0] = replacement;
  }
  return chosen;
}
export function rememberMemeLineup(key: string, chosen: readonly MemeId[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(chosen));
  } catch {
    /* optional */
  }
}
