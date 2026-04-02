export function AppIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Hub circle ── */}
      <circle cx="23" cy="19" r="12" stroke="currentColor" strokeWidth="2" />

      {/* ── Person (center) ── */}
      <circle cx="23" cy="15" r="3.5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M 17 24 C 17 19, 29 19, 29 24"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"
      />

      {/* ── Node connections (start from circle edge) ── */}
      {/* Top-left */}
      <path d="M 19 8 L 19 4 L 8 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="4" r="3" stroke="currentColor" strokeWidth="1.9" />

      {/* Top-right */}
      <path d="M 27 8 L 27 4 L 38 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="41" cy="4" r="3" stroke="currentColor" strokeWidth="1.9" />

      {/* Left */}
      <path d="M 11 19 L 4 19" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="2" cy="19" r="3" stroke="currentColor" strokeWidth="1.9" />

      {/* Right */}
      <path d="M 35 19 L 42 19" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="44" cy="19" r="3" stroke="currentColor" strokeWidth="1.9" />

      {/* Bottom-left */}
      <path d="M 15 29 L 15 38 L 8 38" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="38" r="3" stroke="currentColor" strokeWidth="1.9" />

      {/* Bottom-right */}
      <path d="M 31 29 L 31 38 L 38 38" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="41" cy="38" r="3" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  )
}
