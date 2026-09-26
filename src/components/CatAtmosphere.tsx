import { useEffect, useState } from "react";
import { MEMES, type MemeReaction } from "../game/memes";
import { stopSound } from "../game/sound";

export function CatAtmosphere({
  motion,
  mode,
}: {
  motion: boolean;
  mode: string;
}) {
  const [reaction, setReaction] = useState<
    (MemeReaction & { key: number }) | null
  >(null);
  useEffect(() => {
    let clear: ReturnType<typeof setTimeout>;
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<MemeReaction>).detail;
      setReaction({ ...detail, key: Date.now() });
      clearTimeout(clear);
      clear = setTimeout(() => setReaction(null), detail.durationMs ?? 1750);
    };
    const visibility = () => {
      if (document.hidden) {
        stopSound();
        setReaction(null);
      }
    };
    window.addEventListener("cat-bluff:meme", receive);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearTimeout(clear);
      window.removeEventListener("cat-bluff:meme", receive);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)"),
      fine = matchMedia("(pointer:fine)");
    let frame = 0,
      x = 0,
      y = 0,
      lastPaw = 0;
    const decorations = new Set<HTMLElement>();
    const allowed = () => motion && !reduce.matches && !document.hidden;
    const move = (e: PointerEvent) => {
      if (!allowed() || !fine.matches || e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const scene = document.querySelector<HTMLElement>(".hero-scene");
        if (scene) {
          const r = scene.getBoundingClientRect();
          const dx = (x - r.left - r.width / 2) / r.width,
            dy = (y - r.top - r.height / 2) / r.height;
          scene.style.setProperty(
            "--tilt-x",
            `${Math.max(-1, Math.min(1, dx)) * 10}deg`,
          );
          scene.style.setProperty(
            "--tilt-y",
            `${Math.max(-1, Math.min(1, dy)) * -7}deg`,
          );
        }
      });
    };
    const click = (e: PointerEvent) => {
      if (
        mode !== "home" ||
        !allowed() ||
        performance.now() - lastPaw < 180 ||
        decorations.size >= 4 ||
        !(e.target instanceof Element) ||
        e.target.closest("dialog,input,select,[data-meme-silent]")
      )
        return;
      lastPaw = performance.now();
      const paw = document.createElement("span");
      paw.className = "click-paw";
      paw.setAttribute("aria-hidden", "true");
      paw.style.left = `${e.clientX}px`;
      paw.style.top = `${e.clientY}px`;
      paw.innerHTML = "<i></i><i></i><i></i><i></i><b></b>";
      document.body.append(paw);
      decorations.add(paw);
      paw
        .animate(
          [
            {
              opacity: 1,
              transform: "translate(-50%,-50%) scale(.45) rotate(-18deg)",
            },
            {
              opacity: 0,
              transform: "translate(-50%,-110%) scale(1.4) rotate(12deg)",
            },
          ],
          { duration: 650, easing: "ease-out" },
        )
        .finished.then(
          () => {
            paw.remove();
            decorations.delete(paw);
          },
          () => {
            paw.remove();
            decorations.delete(paw);
          },
        );
    };
    const reset = () => {
      if (reduce.matches) decorations.forEach((p) => p.remove());
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", click, { passive: true });
    reduce.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
      reduce.removeEventListener("change", reset);
      decorations.forEach((p) => p.remove());
    };
  }, [motion, mode]);
  useEffect(() => {
    if (!motion || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    targets.forEach((el) => {
      el.classList.add("reveal-ready");
      observer.observe(el);
    });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const show = () =>
      targets.forEach((el) => el.classList.remove("reveal-ready"));
    reduced.addEventListener("change", show);
    let frame = 0;
    const scroll = () => {
      if (frame || reduced.matches || document.hidden) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const stage = document.querySelector<HTMLElement>(".scroll-cat");
        if (stage) {
          const r = stage.getBoundingClientRect();
          stage.style.setProperty(
            "--roll",
            `${(innerHeight / 2 - r.top) * 0.22}deg`,
          );
        }
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      observer.disconnect();
      show();
      reduced.removeEventListener("change", show);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, [mode, motion]);
  return (
    <>
      {reaction && (
        <div
          key={reaction.key}
          className={`meme-reaction reaction-${MEMES[reaction.id].color} ${reaction.id === "oiia" ? "reaction-spin" : ""}`}
          style={
            reaction.durationMs
              ? { animationDuration: `${reaction.durationMs}ms` }
              : undefined
          }
          aria-hidden="true"
        >
          <img src={MEMES[reaction.id].image} alt="" />
          <span>{reaction.caption || MEMES[reaction.id].caption}</span>
        </div>
      )}
    </>
  );
}
