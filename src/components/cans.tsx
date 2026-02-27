import { useId } from 'react'

const CanTile = () => {
  const id = useId()
  const roughId = `${id}-rough`

  return (
    <svg
      className="can-tile"
      viewBox="0 0 520 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <title>Sketch cans strip</title>
      <defs>
        <filter id={roughId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="2"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="0.35" />
        </filter>
      </defs>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${roughId})`}
      >
        <g transform="translate(6,4)">
          <path d="M6 4 Q18 0 30 4" />
          <path d="M6 4 Q18 8 30 4" />
          <rect x="6" y="4" width="24" height="28" rx="6" />
          <path d="M10 12 C16 9, 20 9, 26 12" />
          <path d="M12 22 C16 25, 20 25, 24 22" />
          <path d="M8 30 Q18 34 28 30" />
        </g>
        <g transform="translate(76,6)">
          <path d="M6 3 Q18 -1 30 3" />
          <rect x="6" y="3" width="24" height="26" rx="6" />
          <path d="M10 10 C16 12, 20 12, 26 10" />
          <path d="M12 18 C16 16, 20 16, 24 18" />
          <path d="M9 27 Q18 31 27 27" />
          <path d="M14 6 L22 6" />
        </g>
        <g transform="translate(146,5)">
          <path d="M6 3 Q18 1 30 3" />
          <rect x="6" y="3" width="24" height="27" rx="6" />
          <path d="M9 13 Q18 8 27 13" />
          <path d="M9 21 Q18 26 27 21" />
          <path d="M12 9 L10 11" />
          <path d="M24 9 L26 11" />
        </g>
        <g transform="translate(216,4)">
          <path d="M6 4 Q18 0 30 4" />
          <rect x="6" y="4" width="24" height="28" rx="6" />
          <path d="M10 14 C16 11, 20 11, 26 14" />
          <path d="M10 20 C16 23, 20 23, 26 20" />
          <path d="M13 8 Q18 10 23 8" />
          <path d="M8 30 Q18 34 28 30" />
        </g>
        <g transform="translate(286,7)">
          <path d="M6 2 Q18 -1 30 2" />
          <rect x="6" y="2" width="24" height="25" rx="6" />
          <path d="M10 9 Q18 12 26 9" />
          <path d="M12 16 Q18 14 24 16" />
          <path d="M11 23 Q18 27 25 23" />
          <path d="M16 5 L21 5" />
        </g>
        <g transform="translate(356,5)">
          <path d="M6 3 Q18 1 30 3" />
          <rect x="6" y="3" width="24" height="27" rx="6" />
          <path d="M10 12 C16 10, 20 10, 26 12" />
          <path d="M12 20 C16 22, 20 22, 24 20" />
          <path d="M9 28 Q18 31 27 28" />
          <path d="M10 6 L12 7" />
          <path d="M26 6 L24 7" />
        </g>
        <g transform="translate(426,4)">
          <path d="M6 4 Q18 0 30 4" />
          <rect x="6" y="4" width="24" height="28" rx="6" />
          <path d="M9 13 Q18 9 27 13" />
          <path d="M9 21 Q18 25 27 21" />
          <path d="M14 8 Q18 6 22 8" />
          <path d="M8 30 Q18 34 28 30" />
        </g>
      </g>
    </svg>
  )
}

const Cans = () => {
  const tiles = Array.from({ length: 4 })

  return (
    <div className="can-strip bg-black/30 text-white/80 backdrop-blur-sm" aria-hidden="true">
      <div className="can-track">
        <div className="can-row">
          {tiles.map((_, index) => (
            <CanTile key={`a-${index}`} />
          ))}
        </div>
        <div className="can-row" aria-hidden="true">
          {tiles.map((_, index) => (
            <CanTile key={`b-${index}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cans
