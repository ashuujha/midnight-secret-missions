import { reactMeme, stopSound } from "../game/sound";
export function CatControls({
  theme,
  sound,
  motion,
  onTheme,
  onSound,
  onMotion,
}: {
  theme: string;
  sound: boolean;
  motion: boolean;
  onTheme: () => void;
  onSound: () => void;
  onMotion: () => void;
}) {
  const dark = theme === "dark";
  return (
    <div className="cat-controls" data-meme-silent>
      <button
        className={`sound-cat ${sound ? "is-on" : ""}`}
        aria-label={sound ? "Mute meme sounds" : "Enable meme sounds"}
        aria-pressed={sound}
        onClick={() => {
          if (sound) stopSound();
          else reactMeme("huh", true, "SOUND CHECK. huh?");
          onSound();
        }}
      >
        <img src="/memes/huh.jpg" alt="" />
        <span>
          <b>{sound ? "YAP ON" : "YAP OFF"}</b>
          <small>sound</small>
        </span>
        <i aria-hidden="true">{sound ? "♫" : "×"}</i>
      </button>
      <button
        className="cat-switch"
        role="switch"
        aria-checked={dark}
        aria-label="Dark theme"
        title={dark ? "Return to day cat" : "Activate night goblin"}
        onClick={() => {
          reactMeme(
            dark ? "pop" : "oiia",
            sound,
            dark ? "DAY CAT HAS ENTERED." : "3AM GOBLIN ACTIVATED.",
          );
          onTheme();
        }}
      >
        <span className="switch-day">
          DAY
          <br />
          CAT
        </span>
        <span className="switch-night">
          3AM
          <br />
          CAT
        </span>
        <span className="switch-cat">
          <img src={dark ? "/memes/oiia.png" : "/memes/pop.png"} alt="" />
        </span>
      </button>
      <button
        className="motion-toggle"
        aria-pressed={motion}
        aria-label={
          motion ? "Pause playful animations" : "Enable playful animations"
        }
        title="Click and scroll effects"
        onClick={onMotion}
      >
        FX<span>{motion ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}
