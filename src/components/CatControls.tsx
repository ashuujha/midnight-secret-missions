import { stopSound } from "../game/sound";

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      className="club-switch-row"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      <span>{label}</span>
      <span className="club-switch-track" aria-hidden="true">
        <i>·</i>
      </span>
    </button>
  );
}

export function CatControls({
  theme,
  sound,
  gameSound,
  motion,
  onTheme,
  onSound,
  onGameSound,
  onMotion,
}: {
  theme: string;
  sound: boolean;
  gameSound: boolean;
  motion: boolean;
  onTheme: () => void;
  onSound: () => void;
  onGameSound: () => void;
  onMotion: () => void;
}) {
  return (
    <div className="cat-controls" data-meme-silent>
      <details className="club-settings">
        <summary aria-label="Game settings" title="Game settings">
          Settings <span aria-hidden="true">⚙</span>
        </summary>
        <div className="club-settings-menu">
          <strong>Make yourself at home</strong>
          <Switch
            label="Night clubhouse"
            checked={theme === "dark"}
            onChange={onTheme}
          />
          <Switch
            label="Game sounds"
            checked={gameSound}
            onChange={onGameSound}
          />
          <Switch
            label="Meme sounds"
            checked={sound}
            onChange={() => {
              if (sound) stopSound();
              onSound();
            }}
          />
          <Switch label="Motion effects" checked={motion} onChange={onMotion} />
        </div>
      </details>
    </div>
  );
}
