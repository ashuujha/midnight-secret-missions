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
export type MemeReaction = { id: MemeId; caption?: string; durationMs?: number };
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
