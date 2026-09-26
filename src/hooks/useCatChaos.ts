import { useEffect, useRef } from "react";
import {
  CHAOS_DURATION_MS,
  createChaosPlayTracker,
  pickChaosMeme,
} from "../game/cat-chaos";
import { reactMeme } from "../game/sound";

export function useCatChaos({
  scope,
  round,
  play,
  pending,
  sound,
}: {
  scope: string;
  round: number | undefined;
  play: number | undefined;
  pending: boolean;
  sound: boolean;
}) {
  const observe = useRef(createChaosPlayTracker());
  useEffect(() => {
    const fresh = observe.current(
      round === undefined || play === undefined
        ? null
        : { scope, round, play, pending },
    );
    if (fresh && !document.hidden) {
      reactMeme(
        pickChaosMeme(),
        sound,
        "Random reaction. Not a clue.",
        CHAOS_DURATION_MS,
      );
    }
  }, [scope, round, play, pending, sound]);
}
