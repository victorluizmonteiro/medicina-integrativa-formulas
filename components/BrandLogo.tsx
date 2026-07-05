/** Logo Vitalyx Health — lockup horizontal (símbolo V + wordmark). */
export default function BrandLogo({
  light = false,
  width = 150,
}: {
  light?: boolean;
  width?: number;
}) {
  const wordFill = light ? "#FFFFFF" : "var(--vivea-dark)";
  return (
    <svg
      width={width}
      viewBox="0 0 200 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vitalyx Health"
    >
      <defs>
        <linearGradient id="vitalyx-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16C0C9" />
          <stop offset="1" stopColor="#8FD64B" />
        </linearGradient>
      </defs>
      {/* símbolo V */}
      <path
        d="M8 9 L20 37 L32 9"
        fill="none"
        stroke="url(#vitalyx-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* wordmark */}
      <text
        x="45"
        y="29"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "25px",
          fontWeight: 600,
          fill: wordFill,
          letterSpacing: "0.5px",
        }}
      >
        vitalyx
      </text>
      <text
        x="46"
        y="40"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "7.5px",
          fontWeight: 600,
          fill: "#2AA8A2",
          letterSpacing: "3.5px",
        }}
      >
        HEALTH
      </text>
    </svg>
  );
}
