import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState("hidden"); // hidden → zoomin → hold → fadeout

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("zoomin"), 100);
    const t2 = setTimeout(() => setPhase("hold"), 2200);
    const t3 = setTimeout(() => setPhase("fadeout"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getStyles = () => {
    switch (phase) {
      case "hidden":
        return { opacity: 0, transform: "scale(0.05)" };
      case "zoomin":
        return {
          opacity: 1,
          transform: "scale(1)",
          transition: "opacity 1.2s ease-out, transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
        };
      case "hold":
        return { opacity: 1, transform: "scale(1)" };
      case "fadeout":
        return {
          opacity: 0,
          transform: "scale(1.08)",
          transition: "opacity 0.8s ease-in, transform 0.8s ease-in",
        };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0e0e0e",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ ...getStyles(), display: "flex", alignItems: "center", gap: "22px" }}>

        {/* MADE WITH */}
        <div
          style={{
            color: "#5a5a5a",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "3px",
            textTransform: "uppercase",
            lineHeight: "1.6",
            textAlign: "center",
          }}
        >
          MADE<br />WITH
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "50px", background: "#2e2e2e" }} />

        {/* Logo */}
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <rect width="56" height="56" rx="12" fill="#1a1a1a" />
          <rect x="13" y="10" width="7" height="36" rx="3" fill="#5a5a5a" />
          <rect x="20" y="10" width="14" height="17" rx="4" fill="#6e6e6e" />
          <rect x="20" y="29" width="15" height="17" rx="4" fill="#6e6e6e" />
          <rect x="27" y="10" width="7" height="17" rx="0" fill="#6e6e6e" />
          <rect x="27" y="29" width="7" height="17" rx="0" fill="#6e6e6e" />
          <rect x="34" y="14" width="4" height="9" rx="4" fill="#888" />
          <rect x="35" y="32" width="4" height="10" rx="4" fill="#888" />
        </svg>

        {/* Divider */}
        <div style={{ width: "1px", height: "50px", background: "#2e2e2e" }} />

        {/* Benjamin */}
        <div
          style={{
            color: "#c8c8c8",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: "40px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          Benjamin
        </div>
      </div>
    </div>
  );
}