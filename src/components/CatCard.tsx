import { CATS } from "../game/cat-bluff";
export function CatCard({
  cat,
  back = false,
  small = false,
}: {
  cat?: number;
  back?: boolean;
  small?: boolean;
}) {
  const c = CATS[cat ?? 0];
  if (back)
    return (
      <span
        className={`playing-card card-back ${small ? "small" : ""}`}
        aria-label="Face-down cat card"
      >
        <span className="back-border">
          <span className="back-type">
            CAT
            <br />
            BLUFF
          </span>
          <img className="back-meme" src="/memes/polite.jpg" alt="" />
          <span className="back-caption">trust issues inside</span>
        </span>
      </span>
    );
  return (
    <span className={`playing-card cat-${cat} ${small ? "small" : ""}`}>
      <span className={`corner ${cat === 1 || cat === 3 ? "red" : ""}`}>
        <b>{c.rank}</b>
        {c.suit}
      </span>
      <span className="meme-frame">
        <img src={c.image} alt="" draggable={false} />
      </span>
      <strong className="cat-name">{c.name}</strong>
      <span className="cat-quote">{c.quote}</span>
      <span className={`corner upside ${cat === 1 || cat === 3 ? "red" : ""}`}>
        <b>{c.rank}</b>
        {c.suit}
      </span>
    </span>
  );
}
