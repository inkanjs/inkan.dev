// The inkan seal, as in assets/logo.svg: a red stamp with braces and a tick inside.
export function Seal({ className = "", ink = true }: { className?: string; ink?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="inkan">
      <defs>
        <filter id="seal-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
      </defs>
      <g transform="rotate(-4 60 60)" filter={ink ? "url(#seal-ink)" : undefined}>
        <rect x="10" y="10" width="100" height="100" rx="22" fill="#c4381f" />
        <rect x="20" y="20" width="80" height="80" rx="13" fill="none" stroke="#fbf7ef" strokeWidth="3.5" />
        <g fill="none" stroke="#fbf7ef" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M44 34 C37 34 36 39 36 46 L36 53 C36 57.5 33.5 60 30 60 C33.5 60 36 62.5 36 67 L36 74 C36 81 37 86 44 86" />
          <path d="M76 34 C83 34 84 39 84 46 L84 53 C84 57.5 86.5 60 90 60 C86.5 60 84 62.5 84 67 L84 74 C84 81 83 86 76 86" />
          <path d="M48.5 61 L56.5 69 L72 51" />
        </g>
      </g>
    </svg>
  );
}
