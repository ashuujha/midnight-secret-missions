import { CATS } from "../game/cat-bluff";
export function CatCard({
  cat,
  back = false,
  small = false,
  face,
}: {
  cat?: number;
  back?: boolean;
  small?: boolean;
  face?: {
    name: string;
    image: string;
    rank: string;
    suit: string;
    quote: string;
  };
}) {
  const c = face ?? CATS[cat ?? 0];
  const red = face ? ["♥", "♦"].includes(face.suit) : cat === 1 || cat === 3;
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
          <span className="back-eyes" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="back-caption">trust nobody</span>
        </span>
      </span>
    );
  return (
    <span className={`playing-card cat-${cat} ${small ? "small" : ""}`}>
      <span className={`corner ${red ? "red" : ""}`}>
        <b>{c.rank}</b>
        {c.suit}
      </span>
      <span className="meme-frame">
        <img src={c.image} alt="" draggable={false} />
      </span>
      <strong className="cat-name">{c.name}</strong>
      <span className="cat-quote">{c.quote}</span>
      <span className={`corner upside ${red ? "red" : ""}`}>
        <b>{c.rank}</b>
        {c.suit}
      </span>
    </span>
  );
}
