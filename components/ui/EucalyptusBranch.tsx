type EucalyptusBranchProps = {
  className?: string;
  /** Mirror horizontally so branches can hang from either side. */
  flip?: boolean;
};

/** Decorative hanging eucalyptus branch. Purely visual — hidden from screen readers. */
export function EucalyptusBranch({ className = "", flip = false }: EucalyptusBranchProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 160"
      className={`pointer-events-none ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M0 18 Q90 30 150 90 Q180 120 200 150" fill="none" stroke="#8b6b4e" strokeWidth="5" strokeLinecap="round" />
      {[
        { x: 40, y: 24, r: 30, c: "#7fbf95" },
        { x: 72, y: 36, r: -20, c: "#a8d8b0" },
        { x: 100, y: 50, r: 40, c: "#7fbf95" },
        { x: 128, y: 70, r: -10, c: "#a8d8b0" },
        { x: 150, y: 94, r: 50, c: "#7fbf95" },
        { x: 172, y: 118, r: 0, c: "#a8d8b0" },
      ].map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r + (i % 2 ? 110 : 70)})`}>
          <path
            d="M0 0 Q14 -10 34 0 Q14 10 0 0 Z"
            fill={leaf.c}
            stroke="#2f6249"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M2 0 L30 0" stroke="#2f6249" strokeWidth="1.2" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}
