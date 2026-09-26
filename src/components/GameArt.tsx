import type { CSSProperties } from 'react';
import { PLACES } from '../game/table';

export function PlaceArt({ place }: { place: number }) {
  return (
    <svg
      viewBox="0 0 160 130"
      className="place-art"
      aria-hidden="true"
      fill="none"
      stroke="#303d36"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse
        cx="80"
        cy="115"
        rx="60"
        ry="6"
        fill="#303d36"
        opacity=".09"
        stroke="none"
      />
      {place === 0 && (
        <>
          <path d="M27 51 80 20l53 31Z" fill="#e7a184" />
          <path d="M38 52h84v55H38z" fill="#fff4dd" />
          <path
            d="M32 52h96v9H32zM29 106h102v9H29zM25 115h110"
            fill="#d99977"
          />
          {[45, 70, 95, 115].map((x) => (
            <g key={x}>
              <path d={`M${x - 4} 65h9v38h-9z`} fill="#f5cf95" />
              <path d={`M${x - 6} 64h13M${x - 6} 103h13`} />
            </g>
          ))}
          <circle cx="80" cy="40" r="6" fill="#fcdf87" />
          <path d="M15 84v23m-5-18 5-5 5 5m118-6v25" />
          <circle cx="138" cy="77" r="7" fill="#80aa87" />
        </>
      )}
      {place === 1 && (
        <>
          <path d="M35 47h91v63H35z" fill="#fff5d9" />
          <path d="M32 38h97v18H32z" fill="#df927f" />
          <path d="m32 56-6 15h110l-7-15" fill="#f1ac93" />
          <path
            d="m48 56-2 15m19-15-1 15m19-15 1 15m19-15 2 15m17-15 3 15"
            stroke="#fff5d9"
            strokeWidth="8"
          />
          <path d="M42 81h30v21H42zM86 80h28v30H86z" fill="#b4ccc1" />
          <path d="M101 96v5" />
          <path
            d="M65 21h20v9H65zM85 22h4a4 4 0 0 1 0 7h-4M65 33h24M72 14q-5-4 0-8m8 8q-5-4 0-8"
            fill="#fff5d9"
          />
          <path d="M16 98h11v15H16z" fill="#80aa87" />
          <path d="M21 98V88m0 5-6-5m6 1 6-5M29 113h101" />
        </>
      )}
      {place === 2 && (
        <>
          <path d="M25 67q55-43 110 0v34q-55 33-110 0Z" fill="#b5a4cf" />
          <ellipse cx="80" cy="68" rx="55" ry="27" fill="#ede2f2" />
          <ellipse cx="80" cy="69" rx="40" ry="18" fill="#a9bd8f" />
          <path d="M80 52v34M40 69h80" stroke="#fff5d9" />
          <ellipse cx="80" cy="69" rx="9" ry="7" stroke="#fff5d9" />
          <path
            d="M20 30v37m120-37v37M13 28h15v9H13zM132 28h15v9h-15z"
            fill="#ffdf8d"
          />
          <path d="M43 86v24m24-19v25m24-25v25m25-31v25" />
          <path d="M80 17v24m0-24 19 7-19 7" fill="#e7a184" />
        </>
      )}
      {place === 3 && (
        <>
          <path d="M44 56v57" strokeWidth="5" />
          <path
            d="M45 35c-21-14-33 6-26 17-21 13-4 35 10 29 14 13 35 1 31-11 18-17 2-34-15-35Z"
            fill="#85ac7e"
          />
          <path d="m35 66 10 10 12-17" />
          <path d="M105 48v64" strokeWidth="4" />
          <path d="M105 19 81 55h12L76 76h57l-16-21h12Z" fill="#a9c393" />
          <path
            d="M59 91h35v8H59zM57 102h40M62 99v14m29-14v14"
            fill="#deab7c"
          />
          <path d="M15 115h130m-20-9 3-6 3 6m-110-3 3-6 3 6" />
          <circle cx="71" cy="27" r="9" fill="#f7d980" stroke="none" />
          <path d="m63 46 4-3 4 3m64-17 4-3 4 3" />
        </>
      )}
      {place === 4 && (
        <>
          <path d="M30 42h99v70H30z" fill="#e3c9ae" />
          <path d="M24 35h111v13H24z" fill="#8cabbb" />
          <path d="M42 25h78v10H42z" fill="#fff2d8" />
          <path
            d="M40 60h20v18H40zM70 60h20v18H70zM100 60h20v18h-20z"
            fill="#a7c8ce"
          />
          <path d="M43 89h20v23H43zM78 88h39v24H78z" fill="#b8d2d4" />
          <path d="M98 89v22M24 113h112" />
          <path d="m15 84-4 26h21l-4-26Z" fill="#e6a291" />
          <path d="M17 84v-6a5 5 0 0 1 9 0v6M139 88v23" />
          <circle cx="139" cy="79" r="10" fill="#95b089" />
        </>
      )}
    </svg>
  );
}

export type CatMood = 'smug' | 'watching' | 'happy' | 'panic';
export function Cat({
  mood = 'smug',
  className = '',
}: {
  mood?: CatMood;
  className?: string;
}) {
  return (
    <svg
      className={`cat-art ${className}`}
      viewBox="0 0 170 145"
      fill="none"
      aria-hidden="true"
      stroke="#303d36"
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M112 119c43 2 38-38 24-36-15 2 11 22-18 23" fill="#dfac75" />
      <path d="M44 133c-2-31 4-52 37-52 34 0 39 26 39 52" fill="#edc58f" />
      <path
        d="m41 48-4-33 29 17q19-6 39 1l26-19-2 40c22 50-96 62-96 12 0-8 3-13 8-18Z"
        fill="#f0cb95"
      />
      <path
        d="m45 38-2-14 15 12m54 1 13-12-2 17"
        fill="#e99d92"
        stroke="none"
      />
      <path
        d="m77 31 2 13m9-14-1 13m10-11-3 12"
        stroke="#c68f58"
        strokeWidth="4"
      />
      {mood === 'happy' ? (
        <path d="M52 61q8-12 16 0m31 0q8-12 16 0" />
      ) : mood === 'panic' ? (
        <>
          <ellipse cx="60" cy="61" rx="8" ry="10" fill="#fff4dc" />
          <ellipse cx="107" cy="61" rx="8" ry="10" fill="#fff4dc" />
          <path d="M60 59v5m47-5v5" strokeWidth="4" />
          <path d="m48 45 13-3m43 0 13 3" />
        </>
      ) : (
        <>
          <path
            d="M50 56h20v11H50zM97 56h20v11H97z"
            fill="#fff4dc"
            stroke="none"
          />
          <path d="M64 57v8m38-8v8" strokeWidth="4" />
          <path
            d={
              mood === 'watching'
                ? 'm49 52 23 6m23 0 23-6'
                : 'M49 56h22m25 0h23'
            }
          />
        </>
      )}
      <path d="m79 72 5 4 5-4Z" fill="#b46f61" />
      <path
        d={
          mood === 'panic'
            ? 'M79 88q5-9 11 0'
            : 'M84 76v5q-7 8-13 0m13 0q7 8 13 0'
        }
      />
      <path d="m28 69 17 3m-19 7 18-1m77-6 18-3m-18 9 19 1" />
      <path d="m54 106-2 27m53-27 3 27" />
      <path d="M40 134h80" />
      {mood === 'panic' && (
        <path d="M141 45q-10 14 0 14t0-14Z" fill="#a7cedc" stroke="none" />
      )}
      {mood === 'happy' && (
        <>
          <path
            d="m21 33 3 5 6 1-4 4 1 6-5-3-5 2 1-5-4-4 6-1Z"
            fill="#e6b857"
            stroke="none"
          />
          <path
            d="m147 63 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z"
            fill="#e6b857"
            stroke="none"
          />
        </>
      )}
    </svg>
  );
}

export function CardBack({
  number,
  small = false,
}: {
  number?: number;
  small?: boolean;
}) {
  return (
    <div className={`card-back ${small ? 'small' : ''}`} aria-hidden="true">
      <div>
        {number !== undefined && <span className="card-corner">{number}</span>}
        <Cat mood="watching" />
        <span className="back-label">
          SECRET
          <br />
          TRAIL
        </span>
        <span className="back-bottom">KEEP A STRAIGHT FACE.</span>
      </div>
    </div>
  );
}

export function LocationCard({
  location,
  index = 0,
  selected = false,
  disabled = false,
  mini = false,
  onClick,
}: {
  location: number;
  index?: number;
  selected?: boolean;
  disabled?: boolean;
  mini?: boolean;
  onClick?: () => void;
}) {
  const place = PLACES[location];
  const content = (
    <>
      <span className="card-topline">
        <span>{String(location + 1).padStart(2, '0')}</span>
        <span>ARCHIVED ROUTE GAME</span>
      </span>
      <PlaceArt place={location} />
      <strong>{place.name}</strong>
      {!mini && <span className="card-caption">{place.caption}</span>}
      <span className="card-bottomline">
        {mini ? 'PUBLIC MOVE' : selected ? 'READY TO PLAY' : 'LOCATION CARD'}
        <span>{String(location + 1).padStart(2, '0')}</span>
      </span>
    </>
  );
  const className = `location-card ${place.color} ${selected ? 'selected' : ''} ${mini ? 'mini' : ''}`;
  const style = {
    '--card-index': index,
    '--tilt': `${(index - 2) * 3}deg`,
  } as CSSProperties;
  return onClick ? (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Select ${place.name} card`}
    >
      {content}
    </button>
  ) : (
    <div className={className} style={style}>
      {content}
    </div>
  );
}
