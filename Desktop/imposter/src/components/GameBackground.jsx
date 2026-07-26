import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Shared defs (gradients used by both layouts)                       */
/* ------------------------------------------------------------------ */
function SharedDefs() {
  return (
    <defs>
      <linearGradient id="leftSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0b1e3d" />
        <stop offset="100%" stopColor="#040e1e" />
      </linearGradient>
      <linearGradient id="rightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3d0b0b" />
        <stop offset="100%" stopColor="#0f0404" />
      </linearGradient>
      <radialGradient id="blueGlow" cx="25%" cy="25%" r="55%">
        <stop offset="0%" stopColor="rgba(30,80,200,0.25)" />
        <stop offset="100%" stopColor="rgba(30,80,200,0)" />
      </radialGradient>
      <radialGradient id="redGlow" cx="75%" cy="15%" r="55%">
        <stop offset="0%" stopColor="rgba(200,30,30,0.28)" />
        <stop offset="100%" stopColor="rgba(200,30,30,0)" />
      </radialGradient>
      <linearGradient id="fogBand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(180,200,230,0)" />
        <stop offset="100%" stopColor="rgba(180,200,230,0.10)" />
      </linearGradient>
      <radialGradient id="lampGlowSoft" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,210,80,0.35)" />
        <stop offset="100%" stopColor="rgba(255,210,80,0)" />
      </radialGradient>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable "actors" — identical art, driven purely by a transform    */
/*  so the same brushwork can be repositioned/rescaled per layout.     */
/*  Each actor's transform anchors on its feet/base point.             */
/* ------------------------------------------------------------------ */

// anchor: (148, 367) — base of the glowing shadow figure
function ShadowFigure({ transform, opacity = 1 }) {
  return (
    <g transform={transform} opacity={opacity}>
      <ellipse cx="148" cy="367" rx="28" ry="8" fill="rgba(0,0,0,0.45)" />
      <path
        d="M148 138 C130 154 120 192 118 242 C116 288 120 328 124 367 L172 367 C176 328 180 288 178 242 C176 192 166 154 148 138 Z"
        fill="rgba(15,32,55,0.8)"
      />
      <ellipse cx="148" cy="128" rx="25" ry="27" fill="rgba(15,32,55,0.85)" />
      <ellipse cx="140" cy="128" rx="5" ry="4" fill="#cc2200" opacity="0.8" />
      <ellipse cx="156" cy="128" rx="5" ry="4" fill="#cc2200" opacity="0.8" />
      <ellipse cx="140" cy="128" rx="3" ry="2.2" fill="#ff4400" opacity="0.9" />
      <ellipse cx="156" cy="128" rx="3" ry="2.2" fill="#ff4400" opacity="0.9" />
      <ellipse cx="140" cy="128" rx="9" ry="7" fill="rgba(255,50,0,0.18)" />
      <ellipse cx="156" cy="128" rx="9" ry="7" fill="rgba(255,50,0,0.18)" />
    </g>
  );
}

// anchor: (82, 369) — base of the main hooded impostor figure
function HoodedFigure({ transform }) {
  return (
    <g transform={transform}>
      <ellipse cx="82" cy="369" rx="58" ry="13" fill="rgba(0,0,0,0.6)" />
      <path
        d="M82 70 C60 88 40 130 33 188 C26 246 24 295 22 342 C20 370 27 388 36 369 L62 369 C64 348 66 325 68 300 C70 272 72 245 74 218 L82 88 L90 218 C92 245 94 272 96 300 C98 325 100 348 102 369 L128 369 C137 388 144 370 142 342 C140 295 138 246 131 188 C124 130 104 88 82 70 Z"
        fill="#0a0a0a"
      />
      <path
        d="M33 205 C18 238 10 278 14 328 C16 350 23 363 36 369 L62 369 C50 342 42 305 40 265 C38 235 40 215 33 205 Z"
        fill="#080808"
      />
      <path
        d="M131 205 C146 238 154 278 150 328 C148 350 141 363 128 369 L102 369 C114 342 122 305 124 265 C126 235 124 215 131 205 Z"
        fill="#0d0d0d"
      />
      <path
        d="M68 155 C66 205 64 265 63 315"
        stroke="rgba(255,255,255,0.025)"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M52 84 C52 38 112 38 112 84 C112 110 102 125 82 130 C62 125 52 110 52 84 Z"
        fill="#111"
      />
      <path
        d="M60 88 C60 50 104 50 104 88 C104 107 96 118 82 122 C68 118 60 107 60 88 Z"
        fill="#080808"
      />
      <path d="M54 80 Q82 64 110 80" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
      <ellipse cx="72" cy="92" rx="7" ry="5.5" fill="#dd2200" />
      <ellipse cx="92" cy="92" rx="7" ry="5.5" fill="#dd2200" />
      <ellipse cx="72" cy="92" rx="4.5" ry="3.5" fill="#ff5500" />
      <ellipse cx="92" cy="92" rx="4.5" ry="3.5" fill="#ff5500" />
      <ellipse cx="73" cy="91" rx="1.8" ry="1.4" fill="#ffaa88" />
      <ellipse cx="93" cy="91" rx="1.8" ry="1.4" fill="#ffaa88" />
      <ellipse cx="72" cy="92" rx="12" ry="9" fill="rgba(255,50,0,0.14)" />
      <ellipse cx="92" cy="92" rx="12" ry="9" fill="rgba(255,50,0,0.14)" />
      <path
        d="M42 208 C30 228 26 258 28 282"
        stroke="#0a0a0a"
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="29" cy="285" rx="13" ry="11" fill="#0d0d0d" />
      <path
        d="M52 84 C52 38 112 38 112 84 L142 369 L22 369 Z"
        fill="rgba(20,60,150,0.05)"
      />
    </g>
  );
}

// anchor: (296, 369) — base of the trench-coat detective figure
function Detective({ transform }) {
  return (
    <g transform={transform}>
      <ellipse cx="296" cy="369" rx="54" ry="13" fill="rgba(0,0,0,0.5)" />
      <rect x="270" y="292" width="24" height="78" rx="8" fill="#181818" />
      <rect x="298" y="292" width="24" height="78" rx="8" fill="#141414" />
      <ellipse cx="282" cy="369" rx="20" ry="8" fill="#0f0f0f" />
      <ellipse cx="310" cy="369" rx="18" ry="8" fill="#111" />
      <path
        d="M244 158 C237 205 234 258 237 298 L355 298 C358 258 355 205 348 158 Z"
        fill="#3d2810"
      />
      <path d="M296 158 L338 170 L348 298 L296 298 Z" fill="#2e1e0a" />
      <path d="M296 158 L276 190 L280 298 L296 288 L312 298 L316 190 Z" fill="#231508" />
      <rect x="284" y="158" width="24" height="68" rx="3" fill="#e0daca" />
      <path d="M291 162 L301 162 L303 220 L296 226 L289 220 Z" fill="#7a0000" />
      <path d="M293 162 L299 162 L300 175 L296 179 L292 175 Z" fill="#5a0000" />
      <path
        d="M272 158 C278 136 296 130 296 130 C296 130 314 136 320 158 L308 174 L296 165 L284 174 Z"
        fill="#2a1c0a"
      />
      <path d="M284 174 L272 158 L264 175 L274 205 L284 198 Z" fill="#3d2810" />
      <path d="M308 174 L320 158 L328 175 L318 205 L308 198 Z" fill="#2e1e0a" />
      <circle cx="296" cy="205" r="3.5" fill="#1a1008" />
      <circle cx="296" cy="225" r="3.5" fill="#1a1008" />
      <circle cx="296" cy="245" r="3.5" fill="#1a1008" />
      <path
        d="M237 282 C233 298 230 332 232 369 L262 369 L272 298 Z"
        fill="#3d2810"
      />
      <path
        d="M355 282 C359 298 362 332 360 369 L330 369 L320 298 Z"
        fill="#2a1c0a"
      />
      <ellipse cx="296" cy="97" rx="35" ry="39" fill="#c8956c" />
      <rect x="284" y="128" width="24" height="28" rx="5" fill="#b8855c" />
      <path d="M261 90 C261 52 331 52 331 90 L331 76 C331 46 261 46 261 76 Z" fill="#1a1008" />
      <path d="M261 76 C261 52 296 50 296 50 L261 65 Z" fill="#0f0a04" />
      <rect x="261" y="88" width="8" height="18" rx="3" fill="#1a1008" />
      <rect x="323" y="88" width="8" height="18" rx="3" fill="#1a1008" />
      <ellipse cx="261" cy="100" rx="7" ry="11" fill="#b8855c" />
      <ellipse cx="261" cy="100" rx="4" ry="7" fill="#a87550" />
      <ellipse cx="331" cy="100" rx="7" ry="11" fill="#b8855c" />
      <ellipse cx="331" cy="100" rx="4" ry="7" fill="#a87550" />
      <path d="M273 82 Q282 77 291 80" stroke="#1a1008" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M301 80 Q310 77 319 82" stroke="#1a1008" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="281" cy="94" rx="7" ry="7" fill="#1a1008" />
      <ellipse cx="311" cy="94" rx="7" ry="7" fill="#1a1008" />
      <ellipse cx="283" cy="91" rx="2.5" ry="2.5" fill="white" />
      <ellipse cx="313" cy="91" rx="2.5" ry="2.5" fill="white" />
      <ellipse cx="282" cy="94" rx="3.5" ry="3.5" fill="#3d2810" />
      <ellipse cx="312" cy="94" rx="3.5" ry="3.5" fill="#3d2810" />
      <path d="M291 107 Q296 115 301 107" stroke="#a06040" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M281 118 Q296 126 311 118" stroke="#8b5030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="270" cy="110" rx="12" ry="9" fill="rgba(140,70,30,0.18)" />
      <ellipse cx="322" cy="108" rx="10" ry="8" fill="rgba(255,180,80,0.1)" />
      <path
        d="M244 170 C230 200 226 236 228 272"
        stroke="#3d2810"
        strokeWidth="28"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M244 170 C230 200 226 236 228 272"
        stroke="#2a1c0a"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M348 170 C362 192 366 224 364 256"
        stroke="#3d2810"
        strokeWidth="28"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M348 170 C362 192 366 224 364 256"
        stroke="#2e1e0a"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="228" cy="276" rx="15" ry="13" fill="#b8855c" />
      <rect x="196" y="270" width="62" height="44" rx="6" fill="#1a1008" />
      <rect x="196" y="292" width="62" height="3" fill="#2a2010" />
      <path d="M216 258 Q229 250 242 258" stroke="#2a2010" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="223" y="258" width="12" height="14" rx="3" fill="#1a1008" />
      <rect x="224" y="283" width="10" height="12" rx="2" fill="#8b7040" />
      <rect x="221" y="279" width="16" height="6" rx="2" fill="#7a6030" />
    </g>
  );
}

// anchor: (330, 124) approx — top of the lamp post's light head; base sits ~196px below
function StreetLamp({ transform }) {
  return (
    <g transform={transform}>
      <rect x="358" y="0" width="9" height="125" fill="#1a1008" />
      <rect x="295" y="120" width="72" height="8" rx="4" fill="#1a1008" />
      <rect x="284" y="110" width="36" height="22" rx="5" fill="#2a2010" />
      <rect x="287" y="113" width="30" height="16" rx="4" fill="#181008" />
      <ellipse cx="302" cy="124" rx="13" ry="7" fill="rgba(255,220,100,0.95)" />
      <ellipse cx="302" cy="124" rx="8" ry="4" fill="rgba(255,240,180,0.9)" />
      <ellipse cx="302" cy="128" rx="40" ry="30" fill="rgba(255,210,80,0.08)" />
      <polygon points="290,131 314,131 355,320 255,320" fill="rgba(255,200,80,0.05)" />
      <polygon points="294,131 310,131 330,220 274,220" fill="rgba(255,200,80,0.04)" />
    </g>
  );
}

/* Small tiled building silhouette with lit windows — used to pad out
   extra horizontal space so nothing looks stretched. */
function BuildingBlock({ x, y, w, h, fill, seed = 1, tint = "180,220,255" }) {
  const cols = Math.max(1, Math.floor(w / 22));
  const rows = Math.max(1, Math.floor(h / 26));
  const windows = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const wx = x + 6 + c * 22;
      const wy = y + 14 + r * 26;
      const lit = Math.sin(seed * (c + 1) * (r + 2)) > 0.15;
      windows.push(
        <rect
          key={`${x}-${y}-${c}-${r}`}
          x={wx}
          y={wy}
          width="10"
          height="8"
          rx="1"
          fill={lit ? `rgba(${tint},${(Math.abs(Math.sin(seed * c * r + 1)) * 0.1 + 0.08).toFixed(2)})` : "rgba(0,0,0,0)"}
        />
      );
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      {windows}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  MOBILE layout — original 390x700 composition, unchanged            */
/* ------------------------------------------------------------------ */
function MobileScene() {
  return (
    <svg
      viewBox="0 0 390 700"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <SharedDefs />

      <rect x="0" y="0" width="195" height="700" fill="url(#leftSky)" />
      <rect x="195" y="0" width="195" height="700" fill="url(#rightSky)" />
      <rect x="0" y="0" width="390" height="700" fill="url(#blueGlow)" />
      <rect x="0" y="0" width="390" height="700" fill="url(#redGlow)" />

      {/* LEFT BUILDINGS */}
      <rect x="0" y="45" width="55" height="325" fill="#050f20" />
      <rect x="50" y="95" width="48" height="275" fill="#060d1a" />
      <rect x="93" y="25" width="52" height="345" fill="#040c18" />
      <rect x="140" y="75" width="58" height="295" fill="#051018" />
      {[8, 24, 40].map((x) =>
        [65, 85, 105, 125, 145, 165, 185].map((y) => (
          <rect
            key={`w${x}${y}`}
            x={x}
            y={y}
            width="10"
            height="7"
            rx="1"
            fill={`rgba(180,220,255,${(Math.sin(x + y) * 0.08 + 0.1).toFixed(2)})`}
          />
        ))
      )}
      {[58, 74, 90].map((x) =>
        [110, 130, 150, 170, 190].map((y) => (
          <rect
            key={`w2${x}${y}`}
            x={x}
            y={y}
            width="12"
            height="8"
            rx="1"
            fill={`rgba(180,220,255,${(Math.sin(x * y) * 0.06 + 0.1).toFixed(2)})`}
          />
        ))
      )}
      {[100, 118, 132].map((x) =>
        [42, 62, 82, 102, 122, 142].map((y) => (
          <rect
            key={`w3${x}${y}`}
            x={x}
            y={y}
            width="10"
            height="8"
            rx="1"
            fill={`rgba(180,220,255,${(Math.cos(x + y) * 0.07 + 0.12).toFixed(2)})`}
          />
        ))
      )}
      {[148, 168].map((x) =>
        [90, 110, 130, 150, 170].map((y) => (
          <rect
            key={`w4${x}${y}`}
            x={x}
            y={y}
            width="12"
            height="8"
            rx="1"
            fill={`rgba(180,220,255,${(Math.sin(x - y) * 0.06 + 0.09).toFixed(2)})`}
          />
        ))
      )}

      <rect x="0" y="368" width="195" height="332" fill="#040e1e" />
      <rect x="0" y="368" width="195" height="30" fill="#050f22" />

      {/* RIGHT ALLEY */}
      <rect x="195" y="0" width="195" height="500" fill="#1e0707" />
      <rect x="220" y="60" width="140" height="280" fill="#180606" />
      {[75, 95, 115, 135, 155, 175, 195, 215, 235, 255, 275, 295].map((y) => (
        <rect
          key={`brick${y}`}
          x={220}
          y={y}
          width={140}
          height={18}
          rx="1"
          fill={y % 40 === 15 ? "#1f0808" : "#1a0606"}
        />
      ))}
      <rect x="265" y="120" width="60" height="80" rx="4" fill="rgba(255,190,80,0.07)" />
      <rect x="270" y="125" width="50" height="70" rx="3" fill="rgba(255,200,100,0.05)" />
      <rect x="195" y="368" width="195" height="332" fill="#0f0404" />
      <line x1="195" y1="368" x2="290" y2="700" stroke="rgba(100,20,20,0.25)" strokeWidth="1" />
      <line x1="390" y1="368" x2="295" y2="700" stroke="rgba(100,20,20,0.25)" strokeWidth="1" />

      <StreetLamp transform="translate(0,0)" />

      <ShadowFigure transform="translate(0,0)" />
      <HoodedFigure transform="translate(0,0)" />
      <Detective transform="translate(0,0)" />

      <polygon points="302,132 390,0 390,340 280,340" fill="rgba(255,200,100,0.04)" />
      <line x1="195" y1="0" x2="195" y2="700" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DESKTOP layout — wide cinematic composition (1920x1080 canvas)     */
/*  Same characters + same brushwork, repositioned & rescaled, with    */
/*  extra city depth added to fill the wider frame instead of          */
/*  stretching the mobile art.                                        */
/* ------------------------------------------------------------------ */
function anchorTransform(anchorX, anchorY, targetX, targetY, scale) {
  return `translate(${targetX},${targetY}) scale(${scale}) translate(${-anchorX},${-anchorY})`;
}

function DesktopScene() {
  const W = 1920;
  const H = 1080;
  const split = W * 0.5; // 960
  const groundY = 760;

  // Far background silhouettes (parallax depth layer)
  const farBuildingsLeft = [
    { x: -40, y: 260, w: 120, h: 500 },
    { x: 70, y: 320, w: 100, h: 440 },
    { x: 160, y: 220, w: 130, h: 540 },
    { x: 280, y: 300, w: 110, h: 460 },
  ];
  const farBuildingsRight = [
    { x: split + 40, y: 300, w: 120, h: 460 },
    { x: split + 150, y: 240, w: 100, h: 520 },
    { x: split + 260, y: 330, w: 130, h: 430 },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <SharedDefs />

      {/* base sky */}
      <rect x="0" y="0" width={split} height={H} fill="url(#leftSky)" />
      <rect x={split} y="0" width={split} height={H} fill="url(#rightSky)" />
      <rect x="0" y="0" width={W} height={H} fill="url(#blueGlow)" />
      <rect x="0" y="0" width={W} height={H} fill="url(#redGlow)" />

      {/* far parallax skyline, dimmer, to add depth across the wider frame */}
      {farBuildingsLeft.map((b, i) => (
        <BuildingBlock key={`fl${i}`} {...b} fill="#030a16" seed={i + 2} />
      ))}
      {farBuildingsRight.map((b, i) => (
        <BuildingBlock key={`fr${i}`} {...b} fill="#160505" seed={i + 5} tint="255,190,120" />
      ))}
      <rect x="0" y="500" width={W} height="120" fill="url(#fogBand)" />

      {/* LEFT CITY BLOCK — extends original mobile buildings across the
          extra width instead of stretching them */}
      <BuildingBlock x={-20} y={380} w={90} h={410} fill="#050f20" seed={1.3} />
      <BuildingBlock x={65} y={430} w={78} h={360} fill="#060d1a" seed={1.7} />
      <BuildingBlock x={135} y={360} w={85} h={430} fill="#040c18" seed={2.1} />
      <BuildingBlock x={215} y={410} w={92} h={380} fill="#051018" seed={2.5} />
      <BuildingBlock x={300} y={440} w={80} h={350} fill="#050f1c" seed={2.9} />
      <BuildingBlock x={375} y={470} w={70} h={320} fill="#040d19" seed={3.3} />
      <BuildingBlock x={440} y={500} w={100} h={290} fill="#040b16" seed={3.8} />
      <BuildingBlock x={540} y={520} w={90} h={270} fill="#050e1c" seed={4.2} />
      <BuildingBlock x={630} y={540} w={110} h={250} fill="#040c18" seed={4.6} />

      <rect x="0" y={groundY} width={split} height={H - groundY} fill="#040e1e" />
      <rect x="0" y={groundY} width={split} height="30" fill="#050f22" />

      {/* RIGHT ALLEY BLOCK — extended brickwork + extra structures */}
      <rect x={split} y="0" width={split} height={groundY + 30} fill="#1e0707" />
      <BuildingBlock x={split + 40} y={480} w={340} h={280} fill="#180606" seed={5.4} tint="255,190,120" />
      <BuildingBlock x={split + 400} y={510} w={260} h={250} fill="#1a0707" seed={5.9} tint="255,190,120" />
      <BuildingBlock x={split + 660} y={470} w={220} h={290} fill="#160505" seed={6.3} tint="255,190,120" />
      {[500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700].map((y) => (
        <rect
          key={`brickd${y}`}
          x={split + 40}
          y={y}
          width={840}
          height="18"
          rx="1"
          fill={y % 40 === 0 ? "#1f0808" : "#1a0606"}
        />
      ))}
      <rect x={split + 120} y="540" width="90" height="120" rx="5" fill="rgba(255,190,80,0.06)" />
      <rect x={split + 128} y="546" width="74" height="106" rx="4" fill="rgba(255,200,100,0.04)" />
      <rect x={split + 600} y="560" width="80" height="100" rx="5" fill="rgba(255,190,80,0.05)" />

      <rect x={split} y={groundY} width={split} height={H - groundY} fill="#0f0404" />
      <line x1={split} y1={groundY} x2={split + 260} y2={H} stroke="rgba(100,20,20,0.25)" strokeWidth="1" />
      <line x1={W} y1={groundY} x2={split - 260} y2={H} stroke="rgba(100,20,20,0.25)" strokeWidth="1" />

      {/* wet-street reflection strip for a AAA touch */}
      <rect x="0" y={groundY + 6} width={W} height="10" fill="rgba(255,255,255,0.03)" />

      {/* extra lamps to punctuate the wider street */}
      <StreetLamp transform={anchorTransform(330, 124, 260, 230, 1.15)} />
      <StreetLamp transform={anchorTransform(330, 124, split + 470, 230, 1.35)} />
      <ellipse cx="260" cy="360" rx="90" ry="46" fill="url(#lampGlowSoft)" />
      <ellipse cx={split + 470} cy="380" rx="110" ry="52" fill="url(#lampGlowSoft)" />

      {/* atmospheric fog drifting across the divide */}
      <rect x={split - 140} y="420" width="280" height={groundY - 420} fill="rgba(180,200,230,0.05)" />

      {/* CHARACTERS — same art, spaced out across the wider stage */}
      <ShadowFigure transform={anchorTransform(148, 367, split - 210, groundY + 8, 1.3)} opacity={0.92} />
      <HoodedFigure transform={anchorTransform(82, 369, 560, groundY + 10, 1.55)} />
      <Detective transform={anchorTransform(296, 369, split + 480, groundY + 10, 1.55)} />

      <polygon
        points={`${split + 60},560 ${W},0 ${W},520 ${split - 60},520`}
        fill="rgba(255,200,100,0.03)"
      />
      <line x1={split} y1="0" x2={split} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component — picks a layout based on viewport width             */
/* ------------------------------------------------------------------ */
const DESKTOP_BREAKPOINT = 900;

export default function GameBackground() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : false
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isDesktop ? <DesktopScene /> : <MobileScene />;
}