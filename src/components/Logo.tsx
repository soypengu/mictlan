export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MICTLAN ARENA"
    >
      <defs>
        <linearGradient id="ma_border" x1="8" y1="6" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#3b82f6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#60a5fa" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <rect
        x="5"
        y="5"
        width="38"
        height="38"
        rx="10"
        fill="rgba(255,255,255,0.02)"
        stroke="url(#ma_border)"
        strokeWidth="2"
      />

      <g
        stroke="rgba(255, 255, 255, 0.92)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M24 13 L34 18.5 L24 24 L14 18.5 L24 13 Z" />
        <path d="M14 18.5 L24 24 V35 L14 29.5 V18.5 Z" />
        <path d="M34 18.5 L24 24 V35 L34 29.5 V18.5 Z" />
        <path d="M24 24 V35" />
        <path d="M14 18.5 L24 24 L34 18.5" />
      </g>
    </svg>
  );
}
