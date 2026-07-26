import { useState } from "react";
import { motion } from "framer-motion";
import { useTransitionNavigate } from "../context/TransitionContext";
import GameBackground from "./GameBackground";

const FONT = "'Segoe UI', Arial, sans-serif";
const CBE_ACCOUNT = "1000553576017";
const PRICE = "$5 (789 ETB)";

function getDeviceId() {
  let id = localStorage.getItem("imposter_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("imposter_device_id", id);
  }
  return id;
}

function CrownIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 12L9 17L20 6" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function UpgradeScreen() {
  const navigate = useTransitionNavigate();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState(() => localStorage.getItem("imposter_email") || "");
  const [unlocked, setUnlocked] = useState(localStorage.getItem("premium") === "true");
  const [copied, setCopied] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    localStorage.setItem("imposter_email", value);
  };

  const handleRedeem = async () => {
    try {
    const res = await fetch("https://game-backend-x355.onrender.com/api/premium/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email, device_id: getDeviceId() }),
      });
      const result = await res.json();
      setStatus(result);
      if (result.ok) {
        setUnlocked(true);
        setCode("");
        localStorage.setItem("premium", "true");
      }
    } catch {
      setStatus({ ok: false, message: "Server error" });
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(CBE_ACCOUNT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center">
      <GameBackground />
      <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.65)" }} />

      <div
        className="relative z-10 w-full h-full flex flex-col overflow-y-auto px-5"
        style={{ maxWidth: "480px" }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{ paddingTop: "max(24px, env(safe-area-inset-top))", paddingBottom: "20px" }}
        >
          <button
            onClick={() => navigate("/category")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ cursor: "pointer", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-white font-extrabold" style={{ fontSize: "20px", fontFamily: FONT, letterSpacing: "-0.4px" }}>
            Premium Upgrade
          </h1>
          <div style={{ width: "40px" }} className="shrink-0" />
        </div>

        {/* ── Banner card (horizontal, compact) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl mb-5 overflow-hidden shrink-0"
          style={{
            background: "linear-gradient(135deg,#3b2a6b 0%,#1c1440 100%)",
            border: "1.5px solid rgba(251,191,36,0.35)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          {/* gold strip */}
          <div style={{ height: "3px", background: "linear-gradient(90deg,#fbbf24,#f97316,#fbbf24)" }} />

          <div className="flex items-center gap-4 px-5 py-4">
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", boxShadow: "0 6px 20px rgba(251,191,36,0.4)" }}
            >
              <CrownIcon />
            </div>

            <div className="flex-1 min-w-0">
              <p style={{ color: "#fbbf24", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", fontFamily: FONT, marginBottom: "2px" }}>
                PREMIUM PLAN
              </p>
              <h2 className="text-white font-extrabold" style={{ fontSize: "18px", fontFamily: FONT, letterSpacing: "-0.3px", lineHeight: 1.2, marginBottom: "3px" }}>
                Unlock All Categories
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                {["5 categories", "400+ words", "Regular updates"].map((f) => (
                  <div key={f} className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12L9 17L20 6" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontFamily: FONT }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="shrink-0 px-3 py-2 rounded-xl"
              style={{ background: "rgba(251,191,36,0.15)", border: "1.5px solid rgba(251,191,36,0.4)" }}
            >
              <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: "14px", fontFamily: FONT, whiteSpace: "nowrap" }}>
                {PRICE}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Unlocked state ── */}
        {unlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-8 mb-8 flex flex-col items-center text-center"
            style={{
              background: "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))",
              border: "1.5px solid rgba(34,197,94,0.5)",
              boxShadow: "0 8px 32px rgba(34,197,94,0.2)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(34,197,94,0.2)", border: "2px solid rgba(34,197,94,0.4)" }}
            >
              <CheckIcon />
            </div>
            <p className="text-white font-extrabold mb-2" style={{ fontSize: "20px" }}>Premium Active! 🎉</p>
            <p className="text-white text-sm opacity-70 mb-6">All premium categories are unlocked on this device</p>
            <button
              onClick={() => navigate("/category")}
              className="px-8 py-3 rounded-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", boxShadow: "0 4px 16px rgba(37,99,235,0.4)", cursor: "pointer" }}
            >
              Back to Categories
            </button>
          </motion.div>
        ) : (
          <>
            {/* ── Email ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="rounded-3xl p-5 mb-4"
              style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: "16px" }}>📧</span>
                <p className="text-white font-bold" style={{ fontSize: "15px", fontFamily: FONT }}>Your Email</p>
              </div>
              <p className="text-white text-sm mb-3" style={{ opacity: 0.6, fontFamily: FONT }}>
                Links your payment to this device for premium access
              </p>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-white outline-none"
                style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(59,130,246,0.3)", fontSize: "15px", fontFamily: FONT }}
              />
            </motion.div>

            {/* ── Payment ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-3xl p-5 mb-4"
              style={{ background: "linear-gradient(135deg,#9c7a1e,#7a5c14)", boxShadow: "0 4px 20px rgba(156,122,30,0.3)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white shrink-0"
                  style={{ background: "rgba(0,0,0,0.3)", fontSize: "12px", fontFamily: FONT }}>1</span>
                <p className="text-white font-bold" style={{ fontSize: "15px", fontFamily: FONT }}>Pay {PRICE} via CBE</p>
              </div>

              <p className="text-white text-sm mb-3" style={{ opacity: 0.85, fontFamily: FONT }}>
                Send the exact amount to this account number:
              </p>

              <div
                className="flex justify-between items-center rounded-xl px-4 py-3 mb-4"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <p className="text-white font-bold" style={{ fontSize: "16px", letterSpacing: "1px", fontFamily: FONT }}>
                  {CBE_ACCOUNT}
                </p>
                <button
                  onClick={handleCopyAccount}
                  className="px-3 py-1.5 rounded-lg text-white font-bold flex items-center gap-1.5"
                  style={{ background: "rgba(255,255,255,0.15)", cursor: "pointer", fontSize: "13px", fontFamily: FONT }}
                >
                  {copied ? (
                    <><CheckIcon /> Copied!</>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="white" strokeWidth="2" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white shrink-0"
                  style={{ background: "rgba(0,0,0,0.3)", fontSize: "12px", fontFamily: FONT }}>2</span>
                <p className="text-white font-bold" style={{ fontSize: "15px", fontFamily: FONT }}>Send Receipt to Bot</p>
              </div>

              <p className="text-white text-sm mb-3" style={{ opacity: 0.85, fontFamily: FONT, lineHeight: "1.5" }}>
                Screenshot your payment and send it to our Telegram bot to receive your unlock code.
              </p>

              <a
                href="https://t.me/ImposterPremiumBot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl p-3 text-white font-bold"
                style={{ background: "linear-gradient(135deg,#3b2a6b,#1c1440)", border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer", fontFamily: FONT, fontSize: "14px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Send to @ImposterPremiumBot
              </a>
            </motion.div>

            {/* ── Redeem Code ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-3xl p-5 mb-8"
              style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white shrink-0"
                  style={{ background: "rgba(59,130,246,0.25)", border: "1.5px solid rgba(59,130,246,0.5)", fontSize: "12px", fontFamily: FONT }}>3</span>
                <p className="text-white font-bold" style={{ fontSize: "15px", fontFamily: FONT }}>Enter Your Unlock Code</p>
              </div>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleRedeem(); }}
                placeholder="IMPOSTER-VIP-2026"
                className="w-full rounded-xl px-4 py-3 mb-3 text-white outline-none"
                style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(59,130,246,0.3)", fontSize: "15px", fontFamily: FONT, letterSpacing: "0.5px" }}
              />

              {status && (
                <p
                  className="mb-3 text-sm px-3 py-2 rounded-lg"
                  style={{
                    color: status.ok ? "#22c55e" : "#ef4444",
                    background: status.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${status.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    fontFamily: FONT,
                  }}
                >
                  {status.message}
                </p>
              )}

              <button
                onClick={handleRedeem}
                disabled={!code.trim() || !email.trim()}
                className="w-full py-4 rounded-2xl font-extrabold text-white text-lg flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg,#f5a623,#f97316)",
                  opacity: (!code.trim() || !email.trim()) ? 0.5 : 1,
                  cursor: (!code.trim() || !email.trim()) ? "not-allowed" : "pointer",
                  boxShadow: (!code.trim() || !email.trim()) ? "none" : "0 4px 20px rgba(245,166,35,0.4)",
                  fontFamily: FONT,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.6 5.9L21 9l-4.5 4.4L17.6 20 12 16.8 6.4 20l1.1-6.6L3 9l6.4-1.1L12 2z" fill="white" />
                </svg>
                Unlock Premium
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
