import { useState } from "react";
import { CatCard } from "./CatCard";
import { DECK } from "../game/classic-cards";
import { CATS } from "../game/cat-bluff";
import { reactMeme } from "../game/sound";
import type { MemeId } from "../game/memes";
const reactions: MemeId[] = ["pop", "huh", "polite", "oiia", "crying"];
const bios = [
  "No thoughts. Just POP.",
  "Asks questions. Trusts nobody.",
  "The face of a repeat offender.",
  "Slips out of every accusation.",
  "Already preparing an apology.",
];
export function ArcadeHome({
  onPractice,
  onFriends,
  sound,
}: {
  onPractice: () => void;
  onFriends: () => void;
  sound: boolean;
}) {
  const [suspect, setSuspect] = useState(0);
  return (
    <div className="arcade-home">
      <section className="arcade-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="mood-label">
            <img src="/memes/huh.jpg" alt="" /> A PARTY GAME WITH TRUST ISSUES
          </span>
          <h1 id="hero-title">
            GOOD CATS.
            <br />
            <span>BAD ALIBIS.</span>
          </h1>
          <p>
            52 cats. One very risky pile.
            <br />
            Lie to your friends. Get judged by cats.
          </p>
          <div className="hero-actions">
            <button className="button primary hero-play" onClick={onPractice}>
              Try a practice round <span aria-hidden="true">↗</span>
              <img src="/memes/pop.png" alt="" />
            </button>
            <button className="button secondary" onClick={onFriends}>
              Play with friends <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="hero-notes">
            <span>INSTANT PRACTICE</span>
            <i />
            2–4 PLAYERS
            <i />
            100% SUSPICIOUS
          </div>
          <a className="scroll-nudge" href="#suspects">
            Meet your extremely innocent cards <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-scene" aria-label="Interactive cat-card stack">
          <div className="scene-board">
            <span className="board-corner">NO PEEKING.</span>
            <span className="board-corner lower">CAT BLUFF SOCIAL CLUB</span>
          </div>
          <span className="hero-stamp">
            CERTIFIED
            <br />
            <b>
              LITTLE
              <br />
              LIARS
            </b>
          </span>
          <div className="scene-cards">
            {[1, 0, 2].map((cat, i) => (
              <button
                key={cat}
                className={`scene-card scene-card-${i}`}
                data-meme-silent
                aria-label={`React with ${CATS[cat].name}`}
                onClick={() => reactMeme(reactions[cat], sound)}
              >
                <CatCard
                  face={{
                    ...DECK[cat],
                    image: CATS[cat].image,
                    quote: CATS[cat].quote,
                  }}
                />
              </button>
            ))}
          </div>
          <button
            className="hero-peeker"
            data-meme-silent
            aria-label="Make OIIA Cat spin"
            onClick={() => reactMeme("oiia", sound)}
          >
            <img src="/memes/oiia.png" alt="OIIA Cat" />
            <span>click me. trust me.</span>
          </button>
          <span className="hero-speech">
            “that is definitely
            <br />
            two Queens.”
          </span>
          <span className="handwritten-note">← famous last words</span>
        </div>
      </section>
      <div className="arcade-ticker" aria-hidden="true">
        <div>
          <span>PLAY A CAT</span>
          <img src="/memes/pop.png" alt="" />
          <span>TELL A LIE</span>
          <img src="/memes/huh.jpg" alt="" />
          <span>CALL A BLUFF</span>
          <img src="/memes/crying.png" alt="" />
          <span>LOSE YOUR FRIENDS*</span>
          <img src="/memes/polite.jpg" alt="" />
        </div>
        <small>*temporarily. probably.</small>
      </div>
      <section
        className="suspect-section"
        id="suspects"
        data-reveal
        aria-labelledby="suspect-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE LINEUP</span>
            <h2 id="suspect-title">
              ALL FACES.
              <br />
              NO INNOCENCE.
            </h2>
          </div>
          <p>
            Tap a suspect. Get acquainted.
            <br />
            They’ll be in your hand in a minute.
          </p>
        </div>
        <div className="suspect-lineup">
          {CATS.map((c, i) => (
            <button
              key={c.name}
              className={`suspect suspect-${i} ${suspect === i ? "chosen" : ""}`}
              aria-label={`Meet ${c.name}`}
              aria-pressed={suspect === i}
              data-meme-silent
              onClick={() => {
                setSuspect(i);
                reactMeme(reactions[i], sound);
              }}
            >
              <span className="suspect-file">SUSPECT 0{i + 1}</span>
              <img src={c.image} alt="" loading="lazy" />
              <strong>{c.name}</strong>
              <span className="suspect-verdict">
                {i === suspect ? "UNDER INVESTIGATION" : "LOOKS INNOCENT"}
              </span>
            </button>
          ))}
        </div>
        <div className="suspect-caption" aria-live="polite">
          <span>{CATS[suspect].name}</span> {bios[suspect]}
          <small>52 different cat faces. 13 ranks. Four of each.</small>
        </div>
      </section>
      <section className="how-section" data-reveal aria-labelledby="how-title">
        <div className="how-title">
          <span className="eyebrow">THE ENTIRE RULEBOOK</span>
          <h2 id="how-title">
            SMALL RULES.
            <br />
            BIG SIDE-EYE.
          </h2>
          <div className="scroll-cat">
            <img
              src="/memes/oiia.png"
              alt="OIIA Cat rolling as you scroll"
              loading="lazy"
            />
            <span>scrolling? i'm rolling.</span>
          </div>
        </div>
        <ol className="how-cards">
          <li>
            <span className="step-number">01</span>
            <div>
              <h3>Drop a cat.</h3>
              <p>Play one or more cards face down. Your hand stays yours.</p>
            </div>
            <img src="/memes/pop.png" alt="" loading="lazy" />
          </li>
          <li>
            <span className="step-number">02</span>
            <div>
              <h3>Sell the story.</h3>
              <p>
                Claim the required rank. Tell the truth, or lie with confidence.
              </p>
            </div>
            <img src="/memes/polite.jpg" alt="" loading="lazy" />
          </li>
          <li>
            <span className="step-number">03</span>
            <div>
              <h3>Risk the “huh?”</h3>
              <p>
                Opponents trust or call BLUFF! Wrong side takes the whole pile.
                Your last claim must survive before you win.
              </p>
            </div>
            <img src="/memes/huh.jpg" alt="" loading="lazy" />
          </li>
        </ol>
      </section>
      <section className="last-call" data-reveal>
        <img
          className="last-smudge"
          src="/memes/smudge.jpg"
          alt="Smudge judging the table"
          loading="lazy"
        />
        <div>
          <span className="eyebrow">YOUR POKER FACE IS LOADING…</span>
          <h2>
            GO ON.
            <br />
            LOOK INNOCENT.
          </h2>
          <button className="button primary" onClick={onPractice}>
            Deal me a practice hand <span aria-hidden="true">↗</span>
          </button>
        </div>
        <span className="last-sticker">
          NO WALLET.
          <br />
          NO WAIT.
          <br />
          <b>JUST CATS.</b>
        </span>
      </section>
    </div>
  );
}
