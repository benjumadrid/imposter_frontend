import { useEffect, useState } from "react";
import GameBackground from "./GameBackground";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 1.2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.6s ease" }}>

      <GameBackground />

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center pt-14 px-6">
        <h1 className="text-white text-center font-black leading-tight"
          style={{ fontSize: "clamp(32px,9vw,46px)", fontFamily: "'Segoe UI', Arial, sans-serif",
            textShadow: "0 2px 30px rgba(0,0,0,0.9)", letterSpacing: "-0.5px" }}>
          Imposter Challenge
        </h1>
        <p className="text-white font-semibold mt-2 tracking-wide"
          style={{ fontSize: "15px", opacity: 0.82, fontFamily: "'Segoe UI', Arial, sans-serif",
            textShadow: "0 1px 10px rgba(0,0,0,0.8)" }}>
          Party Game for 3+ Players
        </p>
      </div>

      <div className="flex-1" />

      {/* Loading bar */}
      <div className="relative z-10 flex flex-col items-center pb-12 px-8">
        <p className="text-white text-sm mb-3 tracking-wide"
          style={{ opacity: 0.65, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
          Loading game configs...
        </p>
        <div className="w-full rounded-full overflow-hidden"
          style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.12)", maxWidth: "320px" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg,#2563eb,#60a5fa)",
            borderRadius: "999px", transition: "width 0.08s linear",
            boxShadow: "0 0 12px rgba(59,130,246,0.9)",
          }} />
        </div>
      </div>
    </div>
  );
}