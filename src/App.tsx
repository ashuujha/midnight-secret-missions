import { useEffect, useState } from "react";
import { ArcadeHome } from "./components/ArcadeHome";
import { CatAtmosphere } from "./components/CatAtmosphere";
import { CatControls } from "./components/CatControls";
import { ClassicGame } from "./components/ClassicGame";
import { ClassicRules } from "./components/ClassicHelp";
import { Dialog } from "./components/Dialog";
import { readClassicInvite } from "./game/classic-invite";
import { curiousCat, stopSound } from "./game/sound";
import { freshMemeLineup, rememberMemeLineup, MEMES } from "./game/memes";

type Mode = "home" | "classic-practice" | "classic-live";

export default function App() {
  const [mode, setMode] = useState<Mode>(() =>
    readClassicInvite(location.search) ? "classic-live" : "home",
  );
  const [hostCat] = useState(() => freshMemeLineup("cat-bluff-door-cat", 1)[0]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("cat-bluff-theme") || "dark",
  );
  const [sound, setSound] = useState(
    () => localStorage.getItem("cat-bluff-sound") !== "off",
  );
  const [gameSound, setGameSound] = useState(
    () => localStorage.getItem("cat-bluff-game-sound") !== "off",
  );
  const [motion, setMotion] = useState(
    () => localStorage.getItem("cat-bluff-motion") !== "off",
  );
  const [rulesOpen, setRulesOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => rememberMemeLineup("cat-bluff-door-cat", [hostCat]), [hostCat]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cat-bluff-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#201b2c" : "#fff5dc");
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("cat-bluff-sound", sound ? "on" : "off");
    if (!sound) stopSound();
  }, [sound]);
  useEffect(() => {
    localStorage.setItem("cat-bluff-game-sound", gameSound ? "on" : "off");
  }, [gameSound]);
  useEffect(() => {
    document.documentElement.dataset.fx = motion ? "on" : "off";
    localStorage.setItem("cat-bluff-motion", motion ? "on" : "off");
  }, [motion]);

  return (
    <div className={`app mode-${mode}`}>
      <CatAtmosphere motion={motion} mode={mode} />
      <header className="topbar">
        <button
          className="wordmark"
          disabled={busy}
          onClick={() => {
            if (mode === "home") curiousCat(sound);
            setMode("home");
          }}
          aria-label="Cat Bluff home"
          title={`${MEMES[hostCat].name} is on door duty today`}
        >
          <span className="wordmark-meme" aria-hidden="true">
            <img src={MEMES[hostCat].image} alt="" />
          </span>
          cat bluff<span className="wordmark-dot">.</span>
        </button>
        <nav aria-label="Game controls">
          <button
            className="text-button"
            onClick={() => {
              setRulesOpen(true);
              if (mode === "home") curiousCat(sound);
            }}
          >
            How to play
          </button>
          <CatControls
            theme={theme}
            sound={sound}
            gameSound={gameSound}
            motion={motion}
            onTheme={() => setTheme(theme === "light" ? "dark" : "light")}
            onSound={() => setSound(!sound)}
            onGameSound={() => setGameSound(!gameSound)}
            onMotion={() => setMotion(!motion)}
          />
        </nav>
      </header>
      <main>
        {mode === "home" ? (
          <ArcadeHome
            onPractice={() => setMode("classic-practice")}
            onFriends={() => setMode("classic-live")}
            sound={sound}
          />
        ) : (
          <ClassicGame
            key={mode}
            online={mode === "classic-live"}
            sound={sound}
            gameSound={gameSound}
            onBusy={setBusy}
            onHome={() => setMode("home")}
            onFriends={() => setMode("classic-live")}
            onPractice={() => setMode("classic-practice")}
          />
        )}
      </main>
      {rulesOpen && (
        <Dialog title="Small rules. Big trust issues." onClose={() => setRulesOpen(false)}>
          <ClassicRules />
        </Dialog>
      )}
    </div>
  );
}
