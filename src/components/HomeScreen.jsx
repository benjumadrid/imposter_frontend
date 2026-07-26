import { useTransitionNavigate } from "../context/TransitionContext";
import GameBackground from "./GameBackground";

export default function HomeScreen() {
  const navigate = useTransitionNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      <GameBackground />

      {/* Top icons */}
      <div className="relative z-10 flex justify-between px-5 pt-12">
        <button className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.74-.07-1.08l2.32-1.82c.21-.16.27-.46.13-.7l-2.2-3.82c-.13-.24-.42-.32-.66-.24l-2.74 1.1c-.57-.44-1.18-.8-1.86-1.08l-.42-2.9C14.34 2.18 14.08 2 13.8 2h-4.4c-.28 0-.54.18-.58.44l-.42 2.9C7.7 5.6 7.1 5.96 6.52 6.4L3.78 5.3c-.24-.08-.53 0-.66.24L.92 9.36c-.14.24-.08.54.13.7l2.32 1.82C3.33 12.26 3.3 12.6 3.3 13s.03.74.07 1.08L1.05 15.9c-.21.16-.27.46-.13.7l2.2 3.82c.13.24.42.32.66.24l2.74-1.1c.57.44 1.18.8 1.86 1.08l.42 2.9c.04.26.3.44.58.44h4.4c.28 0 .54-.18.58-.44l.42-2.9c.68-.28 1.28-.64 1.86-1.08l2.74 1.1c.24.08.53 0 .66-.24l2.2-3.82c.14-.24.08-.54-.13-.7l-2.32-1.82z" />
          </svg>
        </button>
        <button className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col items-center px-6 pb-10"
        style={{ background: "linear-gradient(0deg,rgba(4,8,18,0.97) 65%,transparent 100%)", paddingTop: "100px" }}>
        <p className="text-white text-center font-semibold mb-7 tracking-wide"
          style={{ fontSize: "18px", opacity: 0.88, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
          Party Game for 3+ Players
        </p>
        <div className="flex flex-col gap-4 w-full" style={{ maxWidth: "340px" }}>
          {[
            { label: "NEW GAME", path: "/new-game" },
            { label: "CATEGORY", path: "/category" },
            { label: "HOW TO PLAY", path: "/how-to-play" },
          ].map((btn) => (
            <button key={btn.label} onClick={() => navigate(btn.path)}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                boxShadow: "0 4px 24px rgba(37,99,235,0.5)",
                fontFamily: "'Segoe UI', Arial, sans-serif",
                letterSpacing: "2px", border: "none", cursor: "pointer" }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}