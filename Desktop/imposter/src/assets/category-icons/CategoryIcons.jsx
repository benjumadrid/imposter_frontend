// Flat, colorful vector illustrations for category cards.
// Each icon is a self-contained SVG, viewBox 100x100, transparent background.

export function AnimalIcon() {
  const maneAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const maneCircles = maneAngles.map((angle, i) => {
    const rad = (angle * Math.PI) / 180;
    const cx = 50 + 21 * Math.cos(rad);
    const cy = 38 + 21 * Math.sin(rad);
    const color = i % 2 === 0 ? "#a85f10" : "#c9761a";
    return <circle key={angle} cx={cx} cy={cy} r="11" fill={color} />;
  });

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Tail */}
      <path
        d="M74 76 Q92 72 90 54"
        stroke="#c9761a" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <circle cx="90" cy="52" r="6" fill="#a85f10" />

      {/* Body */}
      <ellipse cx="50" cy="80" rx="27" ry="17" fill="#e8a35c" />

      {/* Front paws */}
      <ellipse cx="37" cy="92" rx="8" ry="6" fill="#fdf1de" />
      <ellipse cx="63" cy="92" rx="8" ry="6" fill="#fdf1de" />
      <line x1="34" y1="90" x2="34" y2="95" stroke="#c9a06a" strokeWidth="1.4" />
      <line x1="37" y1="90" x2="37" y2="96" stroke="#c9a06a" strokeWidth="1.4" />
      <line x1="40" y1="90" x2="40" y2="95" stroke="#c9a06a" strokeWidth="1.4" />
      <line x1="60" y1="90" x2="60" y2="95" stroke="#c9a06a" strokeWidth="1.4" />
      <line x1="63" y1="90" x2="63" y2="96" stroke="#c9a06a" strokeWidth="1.4" />
      <line x1="66" y1="90" x2="66" y2="95" stroke="#c9a06a" strokeWidth="1.4" />

      {/* Mane */}
      {maneCircles}

      {/* Head */}
      <circle cx="50" cy="38" r="17" fill="#f0b06a" />

      {/* Muzzle */}
      <ellipse cx="50" cy="45" rx="11" ry="8.5" fill="#fdf1de" />

      {/* Eyes */}
      <circle cx="43" cy="35" r="2.8" fill="#1a1a1a" />
      <circle cx="57" cy="35" r="2.8" fill="#1a1a1a" />
      <circle cx="44.1" cy="33.8" r="0.9" fill="#fff" />
      <circle cx="58.1" cy="33.8" r="0.9" fill="#fff" />

      {/* Eyebrows */}
      <path d="M38 30 Q43 27 48 30" stroke="#7a4a2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M52 30 Q57 27 62 30" stroke="#7a4a2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Nose + mouth */}
      <path d="M46 42 L54 42 L50 47 Z" fill="#5c3a1e" />
      <path d="M50 47 L50 50" stroke="#5c3a1e" strokeWidth="1.6" />
      <path d="M50 50 Q45 53 41 50" stroke="#5c3a1e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M50 50 Q55 53 59 50" stroke="#5c3a1e" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="41" y1="44" x2="28" y2="41" stroke="#7a4a2a" strokeWidth="1" />
      <line x1="41" y1="47" x2="28" y2="47" stroke="#7a4a2a" strokeWidth="1" />
      <line x1="59" y1="44" x2="72" y2="41" stroke="#7a4a2a" strokeWidth="1" />
      <line x1="59" y1="47" x2="72" y2="47" stroke="#7a4a2a" strokeWidth="1" />
    </svg>
  );
}
export function FruitIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="82" cy="26" r="13" fill="#f5891c" />
      <path d="M77 15 Q82 8 87 15" stroke="#3f8a3f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="70" r="15" fill="#e8453c" />
      <path d="M16 55 L18 47" stroke="#3f8a3f" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="11" cy="64" rx="3.5" ry="5" fill="rgba(255,255,255,0.35)" />
      <path
        d="M78 72 a17 17 0 1 1 -0.01 0 Z"
        fill="#7bc142"
      />
      <path d="M74 72 a13 13 0 1 1 -0.01 0 Z" fill="#f5f0d8" />
      <circle cx="70" cy="70" r="1.6" fill="#3a2a15" />
      <circle cx="78" cy="74" r="1.6" fill="#3a2a15" />
      <circle cx="72" cy="78" r="1.6" fill="#3a2a15" />
      <path
        d="M46 22 C34 22 27 34 27 48 C27 66 37 82 46 82 C55 82 65 66 65 48 C65 34 58 22 46 22Z"
        fill="#f5c518"
      />
      <path d="M42 22 L46 8 L50 22" stroke="#3f8a3f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M38 28 L32 18" stroke="#3f8a3f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M54 28 L60 18" stroke="#3f8a3f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path
        d="M35 34 L57 34 M33 43 L59 43 M32 52 L60 52 M33 61 L59 61 M35 70 L57 70"
        stroke="#c99a10" strokeWidth="1.8" opacity="0.55"
      />
    </svg>
  );
}
export function FoodIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="46" fill="#f5f0e0" />
      <circle cx="50" cy="50" r="41" fill="#fdfaf0" />
      <g>
        <path d="M14 26 L36 16 L44 30 L20 40 Z" fill="#f5c518" />
        <path d="M14 26 L36 16 L39 21 L18 30 Z" fill="#e8683f" />
        <path d="M20 40 L44 30 L44 35 L21 45 Z" fill="#c0392b" />
      </g>
      <g>
        <circle cx="70" cy="26" r="14" fill="#e8453c" />
        <path d="M62 20 Q70 12 78 20" stroke="#f5f0e0" strokeWidth="1.8" fill="none" />
        <circle cx="66" cy="26" r="2" fill="#fdf1de" />
        <circle cx="74" cy="29" r="2" fill="#4caf7d" />
        <circle cx="70" cy="22" r="2" fill="#f5c518" />
      </g>
      <g>
        <ellipse cx="26" cy="68" rx="18" ry="13" fill="#8a5a2a" />
        <ellipse cx="26" cy="64" rx="15.5" ry="9" fill="#c98a3a" />
        <path d="M13 63 Q26 55 39 63" stroke="#fdf1de" strokeWidth="2.4" fill="none" />
        <circle cx="20" cy="66" r="1.8" fill="#e8453c" />
        <circle cx="32" cy="66" r="1.8" fill="#4caf7d" />
      </g>
      <g>
        <path d="M62 54 Q86 56 84 76 Q72 84 60 76 Q57 63 62 54Z" fill="#f5c518" />
        <path d="M65 59 Q80 61 78 73" stroke="#c0392b" strokeWidth="2" fill="none" />
        <circle cx="68" cy="65" r="1.8" fill="#c0392b" />
        <circle cx="75" cy="70" r="1.8" fill="#4caf7d" />
        <circle cx="65" cy="72" r="1.8" fill="#c0392b" />
      </g>
      <circle cx="50" cy="49" r="5" fill="#7bc142" />
    </svg>
  );
}
export function ObjectsIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M18 48 L82 48 L75 80 Q74 84 69 84 L31 84 Q26 84 25 80 Z" fill="#4caf7d" />
      <rect x="18" y="44" width="64" height="8" rx="3" fill="#3f8a5f" />
      <path d="M32 44 Q32 30 44 30 Q56 30 56 44" stroke="#3f8a5f" strokeWidth="4" fill="none" />
      <rect x="26" y="18" width="24" height="20" rx="3" fill="#3ba8e0" />
      <rect x="29" y="21" width="18" height="12" rx="1.5" fill="#dff2fb" />
      <rect x="30" y="34" width="16" height="3" rx="1.5" fill="#dff2fb" />
      <rect x="52" y="14" width="8" height="26" rx="1.5" fill="#e8453c" />
      <rect x="61" y="18" width="8" height="22" rx="1.5" fill="#f5c518" />
      <rect x="70" y="22" width="8" height="18" rx="1.5" fill="#7c3aed" />
      <circle cx="40" cy="64" r="8" fill="#f5f5f5" />
      <circle cx="40" cy="64" r="3.8" fill="#3ba8e0" />
      <rect x="55" y="58" width="16" height="12" rx="2" fill="#e8683f" />
      <rect x="58" y="62" width="10" height="2" fill="#fdf1de" />
    </svg>
  );
}

export function CelebritiesIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="42" fill="#7c3aed" />
      <path
        d="M50 10 L60 36 L88 36 L65 52 L74 78 L50 62 L26 78 L35 52 L12 36 L40 36 Z"
        fill="#f5c518"
      />
      <circle cx="50" cy="46" r="15" fill="#f0c8a0" />
      <path d="M36 41 Q50 27 64 41 L64 35 Q50 24 36 35 Z" fill="#2a1c10" />
      <circle cx="45" cy="46" r="1.8" fill="#1a1a1a" />
      <circle cx="55" cy="46" r="1.8" fill="#1a1a1a" />
      <path d="M46 52 Q50 55 54 52" stroke="#7a4a2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M35 66 Q50 58 65 66 L65 76 L35 76 Z" fill="#2a2a3a" />
      <path d="M46 66 L50 71 L54 66 L50 61 Z" fill="#e8453c" />
      <circle cx="50" cy="72" r="1.4" fill="#f5c518" />
    </svg>
  );
}

export function CitiesIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="14" y="50" width="16" height="30" fill="#e8683f" />
      <rect x="30" y="36" width="18" height="44" fill="#3ba8e0" />
      <rect x="48" y="20" width="14" height="60" fill="#f5c518" />
      <rect x="62" y="42" width="16" height="38" fill="#4caf7d" />
      <rect x="78" y="56" width="10" height="24" fill="#7c3aed" />
      {[[17, 55], [17, 63], [17, 71], [33, 42], [33, 50], [33, 58], [33, 66], [51, 26], [51, 34], [51, 42], [51, 50], [51, 58], [51, 66], [65, 48], [65, 56], [65, 64], [65, 72]].map(
        ([x, y], i) => (
          <rect key={i} x={x} y={y} width="4" height="4" fill="rgba(255,255,255,0.55)" />
        )
      )}
      <rect x="10" y="80" width="82" height="4" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}

export function CountriesIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="46" cy="46" r="30" fill="#3ba8e0" />
      <path d="M22 36 Q30 28 40 32 Q48 26 58 32 Q68 30 70 40 Q64 48 54 46 Q50 54 40 52 Q30 56 24 48 Q18 42 22 36Z" fill="#4caf7d" />
      <ellipse cx="46" cy="46" rx="30" ry="10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <path d="M46 16 Q56 46 46 76 Q36 46 46 16Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path
        d="M74 30 C64 30 58 40 58 50 C58 62 74 78 74 78 C74 78 90 62 90 50 C90 40 84 30 74 30Z"
        fill="#e8453c"
      />
      <circle cx="74" cy="49" r="7" fill="#fdf1de" />
    </svg>
  );
}

export function BodyHealthIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M50 78 C30 64 14 50 14 34 C14 22 23 14 33 14 C40 14 46 18 50 24 C54 18 60 14 67 14 C77 14 86 22 86 34 C86 50 70 64 50 78Z"
        fill="#e8453c"
      />
      <path d="M18 44 L34 44 L40 32 L46 56 L52 40 L58 48 L64 48"
        stroke="#fdf1de" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="70" y="58" width="18" height="18" rx="3" fill="#f5f5f5" />
      <rect x="76.5" y="61" width="5" height="12" fill="#e8453c" />
      <rect x="73" y="64.5" width="12" height="5" fill="#e8453c" />
    </svg>
  );
}

export function SportsIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="46" fill="#3ba8e0" />
      <circle cx="36" cy="62" r="22" fill="#f5f5f5" />
      <path d="M36 40 L36 84 M14 52 L58 72 M14 72 L58 52" stroke="#1a1a1a" strokeWidth="2.2" />
      <path d="M28 47 L44 47 L47 59 L36 67 L25 59Z" fill="#1a1a1a" />
      <circle cx="68" cy="32" r="20" fill="#e8683f" />
      <path d="M48 32 L88 32 M68 12 L68 52 M55 19 Q68 32 55 45 M81 19 Q68 32 81 45"
        stroke="#8a3a10" strokeWidth="2.2" fill="none" />
    </svg>
  );
}

export function MoviesIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="34" y="20" width="52" height="38" rx="4" fill="#2a3550" />
      <rect x="38" y="24" width="44" height="30" fill="#3ba8e0" />
      <path d="M52 32 L52 46 L64 39 Z" fill="#fdf1de" />
      <rect x="50" y="58" width="20" height="5" fill="#4a5570" />
      <rect x="42" y="63" width="36" height="4" rx="2" fill="#4a5570" />
      <path
        d="M14 48 L38 48 L34 88 L18 88 Z"
        fill="#e8453c"
      />
      <path d="M14 48 L38 48 L36 56 L16 56Z" fill="#c0392b" />
      <path d="M18 56 L18 84 M22 56 L23 84 M26 56 L27 84 M30 56 L30 84 M34 56 L33 84"
        stroke="#fdf1de" strokeWidth="1" opacity="0.4" />
      <circle cx="16" cy="44" r="5" fill="#fdf1de" />
      <circle cx="24" cy="40" r="6" fill="#fdf1de" />
      <circle cx="32" cy="44" r="5.5" fill="#fdf1de" />
      <circle cx="20" cy="36" r="5" fill="#fdf1de" />
      <circle cx="28" cy="36" r="5" fill="#fdf1de" />
    </svg>
  );
}

export function BrandsIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="16" y="40" width="30" height="34" rx="3" fill="#e8453c" />
      <path d="M23 40 L23 30 Q23 20 31 20 Q39 20 39 30 L39 40" stroke="#8a1f1a" strokeWidth="3" fill="none" />
      <rect x="50" y="34" width="34" height="40" rx="3" fill="#3ba8e0" />
      <path d="M58 34 L58 24 Q58 12 67 12 Q76 12 76 24 L76 34" stroke="#1a5c8a" strokeWidth="3" fill="none" />
      <circle cx="31" cy="56" r="4" fill="#fdf1de" />
      <circle cx="67" cy="52" r="5" fill="#fdf1de" />
    </svg>
  );
}

export function TechnologyIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="18" y="24" width="46" height="32" rx="3" fill="#1a1a1a" />
      <rect x="22" y="28" width="38" height="24" fill="#3ba8e0" />
      <path d="M10 60 L72 60 L66 68 L16 68Z" fill="#4a4a4a" />
      <rect x="60" y="42" width="30" height="42" rx="5" fill="#2a2a2a" />
      <rect x="63" y="46" width="24" height="30" fill="#7bc142" />
      <circle cx="75" cy="80" r="2" fill="#7a7a7a" />
      <circle cx="32" cy="38" r="3" fill="#f5c518" />
      <circle cx="42" cy="38" r="3" fill="#e8453c" />
      <circle cx="50" cy="38" r="2" fill="#fdf1de" />
    </svg>
  );
}

export function GamesIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="42" fill="#c94fc9" />
      <path
        d="M26 42 Q26 32 38 32 L62 32 Q74 32 74 42 L76 60 Q78 72 68 72 Q62 72 60 64 L40 64 Q38 72 32 72 Q22 72 24 60 Z"
        fill="#fdfaf5"
      />
      <rect x="33" y="44" width="4" height="12" rx="1.5" fill="#5b3a9e" />
      <rect x="28" y="48" width="14" height="4" rx="1.5" fill="#5b3a9e" />
      <circle cx="58" cy="44" r="3.6" fill="#e8453c" />
      <circle cx="66" cy="48" r="3.6" fill="#3ba8e0" />
      <circle cx="62" cy="54" r="3.6" fill="#f5c518" />
      <circle cx="54" cy="50" r="3.6" fill="#4caf7d" />
    </svg>
  );
}

export function LocationsIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M16 26 L38 18 L62 26 L84 18 L84 76 L62 84 L38 76 L16 84 Z" fill="#f5f0e0" />
      <path d="M38 18 L38 76" stroke="#c9c0a0" strokeWidth="1.5" strokeDasharray="3,3" />
      <path d="M62 26 L62 84" stroke="#c9c0a0" strokeWidth="1.5" strokeDasharray="3,3" />
      <path d="M20 30 Q28 26 34 32 Q30 40 22 38Z" fill="#7bc142" />
      <path d="M66 30 Q74 34 80 30 Q78 40 68 40Z" fill="#7bc142" />
      <path d="M40 60 Q50 56 58 64 Q52 72 42 68Z" fill="#7bc142" />
      <path d="M18 50 Q26 52 24 60" stroke="#3ba8e0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M70 55 Q78 58 76 66" stroke="#3ba8e0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path
        d="M50 34 C40 34 33 41 33 50 C33 62 50 78 50 78 C50 78 67 62 67 50 C67 41 60 34 50 34Z"
        fill="#e8453c"
      />
      <circle cx="50" cy="50" r="8" fill="#fdf1de" />
    </svg>
  );
}

export function HollywoodIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="26" y="46" width="48" height="40" rx="2" fill="#e8683f" />
      <rect x="34" y="54" width="8" height="10" rx="1" fill="#3a1a10" />
      <rect x="46" y="54" width="8" height="10" rx="1" fill="#3a1a10" />
      <rect x="58" y="54" width="8" height="10" rx="1" fill="#3a1a10" />
      <rect x="34" y="70" width="8" height="10" rx="1" fill="#3a1a10" />
      <rect x="46" y="70" width="8" height="10" rx="1" fill="#3a1a10" />
      <rect x="58" y="70" width="8" height="10" rx="1" fill="#3a1a10" />
      <rect x="20" y="40" width="60" height="8" rx="2" fill="#c0392b" />
      <path
        d="M50 12 L55 26 L70 26 L58 35 L62 50 L50 41 L38 50 L42 35 L30 26 L45 26 Z"
        fill="#f5c518"
      />
    </svg>
  );
}

export function AnimeIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M50 14 C34 14 24 26 24 42 C24 62 32 78 50 90 C68 78 76 62 76 42 C76 26 66 14 50 14Z"
        fill="#e8e4f0"
      />
      <path
        d="M50 14 C34 14 24 26 24 42 C24 62 32 78 50 90 C68 78 76 62 76 42 C76 26 66 14 50 14Z"
        fill="none" stroke="#7a7090" strokeWidth="2"
      />
      <ellipse cx="38" cy="46" rx="2.4" ry="4" fill="#3a3450" />
      <ellipse cx="62" cy="46" rx="2.4" ry="4" fill="#3a3450" />
      <path d="M30 62 Q50 70 70 62" stroke="#3a3450" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}

export function ProfessionsIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="24" y="44" width="52" height="34" rx="4" fill="#3ba8e0" />
      <rect x="40" y="34" width="20" height="12" rx="3" fill="#1a5c8a" />
      <rect x="24" y="54" width="52" height="6" fill="#1a5c8a" />
      <circle cx="50" cy="57" r="4" fill="#f5c518" />
      <circle cx="50" cy="26" r="12" fill="#f0c8a0" />
      <path d="M40 24 Q50 12 60 24 L60 20 Q50 10 40 20Z" fill="#3a2a1a" />
    </svg>
  );
}

export function SchoolIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M50 16 L90 34 L50 52 L10 34 Z" fill="#e8683f" />
      <path d="M28 42 L28 62 Q50 74 72 62 L72 42 L50 52Z" fill="#3ba8e0" />
      <line x1="90" y1="34" x2="90" y2="58" stroke="#8a4a10" strokeWidth="3" strokeLinecap="round" />
      <circle cx="90" cy="61" r="3" fill="#8a4a10" />
    </svg>
  );
}

export function DefaultIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="30" fill="#7c8aa0" />
      <path d="M50 30 v20 M50 62 v4" stroke="#fdf1de" strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </svg>
  );
}

// Map lowercase category name (or partial match) -> icon component
const ICON_MAP = [
  { keys: ["animal"], Icon: AnimalIcon },
  { keys: ["fruit"], Icon: FruitIcon },
  { keys: ["food"], Icon: FoodIcon },
  { keys: ["object"], Icon: ObjectsIcon },
  { keys: ["celebrit"], Icon: CelebritiesIcon },
  { keys: ["cit"], Icon: CitiesIcon },
  { keys: ["countr"], Icon: CountriesIcon },
  { keys: ["body", "health"], Icon: BodyHealthIcon },
  { keys: ["sport"], Icon: SportsIcon },
  { keys: ["movie", "film"], Icon: MoviesIcon },
  { keys: ["brand"], Icon: BrandsIcon },
  { keys: ["tech"], Icon: TechnologyIcon },
  { keys: ["hollywood"], Icon: HollywoodIcon },
  { keys: ["game"], Icon: GamesIcon },
  { keys: ["location"], Icon: LocationsIcon },
  { keys: ["anime"], Icon: AnimeIcon },
  { keys: ["profession", "job", "career"], Icon: ProfessionsIcon },
  { keys: ["school", "education"], Icon: SchoolIcon },
];

export function getCategoryIcon(name = "") {
  const lower = name.toLowerCase();
  const match = ICON_MAP.find(({ keys }) => keys.some((k) => lower.includes(k)));
  return match ? match.Icon : DefaultIcon;
}