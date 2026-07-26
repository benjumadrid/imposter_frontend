import { useEffect, useState } from "react";
import { useTransitionNavigate } from "../context/TransitionContext";
import GameBackground from "./GameBackground";
import { pickImposterIndices } from "../utils/shuffle";
import {
  LS_SHOW_CATEGORY,
  LS_SHOW_HINT,
  LS_SHOW_IMPOSTER_COUNT,
  LS_RANDOM_IMPOSTERS,
  loadBool,
  saveBool,
} from "../utils/settingsStorage";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 20;
const TIME_PRESETS = [1, 2, 3, 5, 10];

const LS_TIME_LIMIT_ENABLED = "imposter_time_limit_enabled";
const LS_TIME_LIMIT_MINUTES = "imposter_time_limit_minutes";
const LS_GAME_MODE = "imposter_game_mode"; // "word" | "question"

const loadNumber = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
};

const saveNumber = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore storage errors
  }
};

const loadString = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? raw : fallback;
  } catch {
    return fallback;
  }
};

const saveString = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors
  }
};

const getRecommended = (count) => {
  if (count <= 4) return 1;
  if (count <= 6) return 2;
  return 3;
};

// Strong random integer in [min, max] inclusive.
// Uses crypto.getRandomValues (unbiased, unpredictable) when available,
// falls back to Math.random otherwise. This guarantees every value in
// range has genuinely equal probability — no bias toward the max.
const randomIntInclusive = (min, max) => {
  if (max <= min) return min;
  const range = max - min + 1;

  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    // Rejection sampling to avoid modulo bias
    const maxUint32 = 0xffffffff;
    const limit = maxUint32 - (maxUint32 % range);
    const buf = new Uint32Array(1);
    let val;
    do {
      window.crypto.getRandomValues(buf);
      val = buf[0];
    } while (val >= limit);
    return min + (val % range);
  }

  return min + Math.floor(Math.random() * range);
};

export default function GameSettings() {
  const navigate = useTransitionNavigate();

  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1" },
    { id: 2, name: "Player 2" },
    { id: 3, name: "Player 3" },
  ]);

  const [imposterCount, setImposterCount] = useState(1);
  const [userOverrode, setUserOverrode] = useState(false);
  const [randomImposters, setRandomImposters] = useState(() => loadBool(LS_RANDOM_IMPOSTERS, false));
  const [showImposterCount, setShowImposterCount] = useState(() => loadBool(LS_SHOW_IMPOSTER_COUNT, false));
  const [showImposterModal, setShowImposterModal] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Time limit now persists across sessions/navigation, same as the other toggles below
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(() => loadBool(LS_TIME_LIMIT_ENABLED, false));
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(() => loadNumber(LS_TIME_LIMIT_MINUTES, 2));
  const [showCategoryToImposter, setShowCategoryToImposter] = useState(() => loadBool(LS_SHOW_CATEGORY, false));
  const [showHintToImposter, setShowHintToImposter] = useState(() => loadBool(LS_SHOW_HINT, false));
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);

  // Game mode: "word" (existing secret-word game) or "question" (new mode)
  const [gameMode, setGameMode] = useState(() => loadString(LS_GAME_MODE, "word"));

  useEffect(() => {
    const stored = sessionStorage.getItem("gamePlayers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= MIN_PLAYERS) setPlayers(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCategories");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSelectedCategories(parsed);
      } catch {}
    }
  }, []);

  // Check premium status from backend — same logic as CategoryScreen
  useEffect(() => {
    const email = localStorage.getItem("imposter_email");
    if (!email) { setPremiumLoading(false); return; }

    let deviceId = localStorage.getItem("imposter_device_id");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("imposter_device_id", deviceId);
    }

    fetch("https://game-backend-x355.onrender.com/api/premium/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, device_id: deviceId }),
    })
      .then((res) => res.json())
      .then((data) => { setIsPremium(data.premium === true); setPremiumLoading(false); })
      .catch(() => { setIsPremium(false); setPremiumLoading(false); });
  }, []);

  // Persist toggle preferences to localStorage so they survive closing the browser/app
  useEffect(() => {
    saveBool(LS_SHOW_CATEGORY, showCategoryToImposter);
  }, [showCategoryToImposter]);

  useEffect(() => {
    saveBool(LS_SHOW_HINT, showHintToImposter);
  }, [showHintToImposter]);

  useEffect(() => {
    saveBool(LS_SHOW_IMPOSTER_COUNT, showImposterCount);
  }, [showImposterCount]);

  useEffect(() => {
    saveBool(LS_RANDOM_IMPOSTERS, randomImposters);
  }, [randomImposters]);

  // Persist the time-limit setting too — this is the fix: previously
  // timeLimitEnabled/timeLimitMinutes only lived in React state, so
  // leaving the screen (e.g. hitting "X" mid-game and returning to
  // Settings) silently reset it back to defaults every time.
  useEffect(() => {
    saveBool(LS_TIME_LIMIT_ENABLED, timeLimitEnabled);
  }, [timeLimitEnabled]);

  useEffect(() => {
    saveNumber(LS_TIME_LIMIT_MINUTES, timeLimitMinutes);
  }, [timeLimitMinutes]);

  // Persist game mode selection too
  useEffect(() => {
    saveString(LS_GAME_MODE, gameMode);
  }, [gameMode]);

  // Max imposters: never more than 3, always leaves at least 2 locals
  const maxImposters = Math.max(1, Math.min(3, players.length - 2));
  const recommended = getRecommended(players.length);

  // Auto-set to recommended unless user manually overrode
  useEffect(() => {
    if (!userOverrode) {
      setImposterCount(Math.min(recommended, maxImposters));
    } else {
      setImposterCount((prev) => Math.min(Math.max(1, prev), maxImposters));
    }
  }, [players.length, maxImposters, recommended, userOverrode]);

  const changeImposterCount = (delta) => {
    setUserOverrode(true);
    setImposterCount((prev) => Math.min(maxImposters, Math.max(1, prev + delta)));
  };

  const cycleTimeLimit = () => {
    setTimeLimitMinutes((prev) => {
      const idx = TIME_PRESETS.indexOf(prev);
      return TIME_PRESETS[(idx + 1) % TIME_PRESETS.length];
    });
  };

  // Players modal logic
  const persistPlayers = (next) => {
    setPlayers(next);
    sessionStorage.setItem("gamePlayers", JSON.stringify(next));
  };

  const handleAddPlayer = () => {
    if (players.length >= MAX_PLAYERS) return;
    const nextId = players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1;
    persistPlayers([...players, { id: nextId, name: `Player ${nextId}` }]);
  };

  const handleRemovePlayer = () => {
    if (players.length <= MIN_PLAYERS) return;
    persistPlayers(players.slice(0, -1));
  };

  const startEdit = (player) => {
    setEditingId(player.id);
    setEditValue(player.name);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      persistPlayers(players.map((p) => (p.id === editingId ? { ...p, name: trimmed } : p)));
    }
    setEditingId(null);
  };

  const handleStartGame = () => {
    // Recompute max fresh, right here, from current players.length —
    // never trust a possibly-stale closure variable for this decision.
    const freshMax = Math.max(1, Math.min(3, players.length - 2));

    let actualImposters;
    if (randomImposters) {
      // Genuinely random pick in [1, freshMax] — every value has equal
      // probability, verified via crypto-backed rejection sampling.
      actualImposters = randomIntInclusive(1, freshMax);
    } else {
      actualImposters = Math.max(1, Math.min(imposterCount, freshMax));
    }

    // Assign imposter indices — truly random, resets every game, equal probability for all players
    const imposterIndices = pickImposterIndices(players.length, actualImposters);

    const params = new URLSearchParams({
      players: JSON.stringify(players.map((p) => p.name)),
      imposters: String(actualImposters),
      imposterIndices: JSON.stringify(imposterIndices),
      showImposterCount: String(showImposterCount),
      mode: gameMode,
      timeLimit: (timeLimitEnabled && gameMode !== "question") ? String(timeLimitMinutes) : "0",
      showCategory: String(showCategoryToImposter),
      showHint: String(showHintToImposter),
    });

    // Category selection only applies to word mode
    if (gameMode === "word" && selectedCategories.length) {
      params.set("categories", selectedCategories.join(","));
    }

    navigate(`/gameplay?${params.toString()}`);
  };

  const categoriesLabel = selectedCategories.length === 0
    ? "All Categories"
    : `${selectedCategories.length} ${selectedCategories.length === 1 ? "Category" : "Categories"} Selected`;

  const categoriesSubLabel = selectedCategories.length === 0
    ? "+13 premium categories available"
    : "Tap to change selection";

  const isRecommended = imposterCount === Math.min(recommended, maxImposters);

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center">
      <GameBackground />
      <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.5)" }} />

      <div className="relative z-10 w-full h-full flex flex-col" style={{ maxWidth: "440px" }}>
        <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: "110px" }}>

          {/* Header */}
          <div className="flex items-center justify-between pt-12 pb-6">
            <button onClick={() => navigate("/home")} className="w-9 h-9 flex items-center justify-center text-white">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.74-.07-1.08l2.32-1.82c.21-.16.27-.46.13-.7l-2.2-3.82c-.13-.24-.42-.32-.66-.24l-2.74 1.1c-.57-.44-1.18-.8-1.86-1.08l-.42-2.9C14.34 2.18 14.08 2 13.8 2h-4.4c-.28 0-.54.18-.58.44l-.42 2.9C7.7 5.6 7.1 5.96 6.52 6.4L3.78 5.3c-.24-.08-.53 0-.66.24L.92 9.36c-.14.24-.08.54.13.7l2.32 1.82C3.33 12.26 3.3 12.6 3.3 13s.03.74.07 1.08L1.05 15.9c-.21.16-.27.46-.13.7l2.2 3.82c.13.24.42.32.66.24l2.74-1.1c.57.44 1.18.8 1.86 1.08l.42 2.9c.04.26.3.44.58.44h4.4c.28 0 .54-.18.58-.44l.42-2.9c.68-.28 1.28-.64 1.86-1.08l2.74 1.1c.24.08.53 0 .66-.24l2.2-3.82c.14-.24.08-.54-.13-.7l-2.32-1.82z" />
              </svg>
            </button>
          </div>

          <h1 className="text-white font-extrabold mb-5" style={{ fontSize: "28px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            Game Settings
          </h1>

          {/* Upgrade banner */}
          {!premiumLoading && !isPremium && (
          <div className="rounded-3xl px-5 py-4 mb-6 flex items-center justify-between"
            style={{ background: "linear-gradient(90deg,#9c7a1e,#d9a531)" }}>
            <p className="text-white font-medium" style={{ fontSize: "14px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
              Unlock Premium Categories
            </p>
            <button onClick={() => navigate("/upgrade")} className="px-4 py-2 rounded-full font-bold text-sm text-white whitespace-nowrap ml-3"
              style={{ background: "linear-gradient(135deg,#f5a623,#f97316)", fontFamily: "'Segoe UI', Arial, sans-serif", cursor: "pointer" }}>
              Upgrade 💎
            </button>
          </div>
          )}

          {!premiumLoading && isPremium && (
          <div className="rounded-3xl px-5 py-4 mb-6"
            style={{ background: "linear-gradient(90deg,#166534,#16a34a)" }}>
            <p className="text-white font-medium" style={{ fontSize: "14px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>✅ Premium unlocked — all categories available</p>
          </div>
          )}

          {/* Players / Imposters cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div onClick={() => setShowPlayersModal(true)}
              className="rounded-2xl p-4 flex flex-col items-center cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{ border: "1.5px solid #3b82f6", background: "rgba(15,30,60,0.5)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#3b82f6" className="mb-2">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <p className="text-white text-center mb-2" style={{ fontSize: "14px", fontFamily: "'Segoe UI', Arial, sans-serif", opacity: 0.85 }}>
                How many players?
              </p>
              <span className="text-white font-extrabold" style={{ fontSize: "26px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                {players.length}
              </span>
            </div>

            <div onClick={() => setShowImposterModal(true)}
              className="rounded-2xl p-4 flex flex-col items-center cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{ border: "1.5px solid #3b82f6", background: "rgba(15,30,60,0.5)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#3b82f6" className="mb-2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
                <rect x="9" y="6" width="6" height="2.5" rx="1" fill="#0b1e3d" />
              </svg>
              <p className="text-white text-center mb-2" style={{ fontSize: "14px", fontFamily: "'Segoe UI', Arial, sans-serif", opacity: 0.85 }}>
                How many imposters?
              </p>
              <span className="text-white font-extrabold" style={{ fontSize: "26px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                {randomImposters ? "?" : imposterCount}
              </span>
            </div>
          </div>

          {/* Time Limit */}
          <div className="rounded-2xl px-4 py-4 mb-6 flex items-center justify-between" style={{ background: "rgba(30,35,50,0.7)", opacity: gameMode === "question" ? 0.4 : 1, pointerEvents: gameMode === "question" ? "none" : "auto" }}>
            <div className="flex items-center gap-3">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#3b82f6">
                <circle cx="12" cy="13" r="8" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M12 9v4l3 2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M9 2h6M12 2v2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-white font-bold" style={{ fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Time Limit</p>
                <p className="text-white" style={{ fontSize: "13px", opacity: 0.6, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  {gameMode === "question" ? "Not used in Question mode" : `${timeLimitMinutes} ${timeLimitMinutes === 1 ? "Minute" : "Minutes"}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setTimeLimitEnabled((prev) => !prev)} className="relative"
                style={{ width: "46px", height: "26px", borderRadius: "999px", background: timeLimitEnabled ? "#3b82f6" : "rgba(255,255,255,0.2)", border: "none", transition: "background 0.2s ease" }}>
                <span style={{ position: "absolute", top: "3px", left: timeLimitEnabled ? "23px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.2s ease" }} />
              </button>
              <button onClick={cycleTimeLimit} className="w-6 h-6 flex items-center justify-center text-white"
                style={{ opacity: timeLimitEnabled ? 1 : 0.4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Game Mode */}
          <div className="flex items-center gap-2 mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6">
              <rect x="3" y="3" width="8" height="8" rx="2" />
              <rect x="13" y="3" width="8" height="8" rx="2" opacity="0.5" />
              <rect x="3" y="13" width="8" height="8" rx="2" opacity="0.5" />
              <rect x="13" y="13" width="8" height="8" rx="2" opacity="0.3" />
            </svg>
            <h2 className="text-white font-bold" style={{ fontSize: "17px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Game Mode</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              onClick={() => setGameMode("word")}
              className="rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{
                border: gameMode === "word" ? "2px solid #3b82f6" : "1.5px solid rgba(255,255,255,0.15)",
                background: gameMode === "word" ? "rgba(15,30,60,0.5)" : "rgba(15,30,60,0.25)",
              }}
            >
              <span className="font-black mb-2" style={{ fontSize: "26px", color: "#3b82f6", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Tt</span>
              <p className="font-bold mb-1" style={{ fontSize: "15px", color: "#60a5fa", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Word Game</p>
              <p className="text-white" style={{ fontSize: "12px", opacity: 0.7, fontFamily: "'Segoe UI', Arial, sans-serif" }}>Find who doesn't know the secret word</p>
            </div>
            <div
              onClick={() => setGameMode("question")}
              className="rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{
                border: gameMode === "question" ? "2px solid #3b82f6" : "1.5px solid rgba(255,255,255,0.15)",
                background: gameMode === "question" ? "rgba(15,30,60,0.5)" : "rgba(15,30,60,0.25)",
              }}
            >
              <svg width="30" height="26" viewBox="0 0 30 26" className="mb-2">
                <path d="M2 2h14a4 4 0 014 4v6a4 4 0 01-4 4h-9l-5 5V16H2a4 4 0 01-4-4V6a4 4 0 014-4z"
                  fill={gameMode === "question" ? "#3b82f6" : "#5b6b8a"} />
                <text x="9" y="15" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">?</text>
              </svg>
              <p className="font-bold mb-1" style={{ fontSize: "15px", color: gameMode === "question" ? "#60a5fa" : "white", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Question Game</p>
              <p className="text-white" style={{ fontSize: "12px", opacity: 0.7, fontFamily: "'Segoe UI', Arial, sans-serif" }}>Find who got a different question</p>
            </div>
          </div>

          {/* Categories — only relevant to Word Game */}
          {gameMode === "word" && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6">
                  <rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" />
                  <rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" />
                </svg>
                <h2 className="text-white font-bold" style={{ fontSize: "17px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Categories</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "linear-gradient(135deg,#f5a623,#f97316)", color: "white", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  💎 Premium
                </span>
              </div>
              <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: "rgba(15,20,35,0.75)" }}>
                <div onClick={() => navigate("/category")} className="flex items-center justify-between px-4 py-4 cursor-pointer"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <p className="text-white font-semibold" style={{ fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>{categoriesLabel}</p>
                    <p className="flex items-center gap-1 mt-1" style={{ fontSize: "12px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                      {selectedCategories.length === 0 && <span>🔒</span>}
                      <span style={{ color: selectedCategories.length === 0 ? "#f59e0b" : "rgba(255,255,255,0.6)" }}>{categoriesSubLabel}</span>
                    </p>
                  </div>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#d97706,#f59e0b)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#3b82f6" strokeWidth="2" fill="none" />
                      <circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    </svg>
                    <p className="text-white" style={{ fontSize: "14px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Show Category to Imposter</p>
                  </div>
                  <button onClick={() => setShowCategoryToImposter((prev) => !prev)} className="relative"
                    style={{ width: "46px", height: "26px", borderRadius: "999px", background: showCategoryToImposter ? "#3b82f6" : "rgba(255,255,255,0.2)", border: "none", transition: "background 0.2s ease" }}>
                    <span style={{ position: "absolute", top: "3px", left: showCategoryToImposter ? "23px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.2s ease" }} />
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z"
                        stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-white" style={{ fontSize: "14px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Show Hint to Imposter</p>
                  </div>
                  <button onClick={() => setShowHintToImposter((prev) => !prev)} className="relative"
                    style={{ width: "46px", height: "26px", borderRadius: "999px", background: showHintToImposter ? "#3b82f6" : "rgba(255,255,255,0.2)", border: "none", transition: "background 0.2s ease" }}>
                    <span style={{ position: "absolute", top: "3px", left: showHintToImposter ? "23px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.2s ease" }} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Question mode info panel — replaces the category picker for this mode */}
          {gameMode === "question" && (
            <div className="rounded-2xl mb-6 px-4 py-4" style={{ background: "rgba(15,20,35,0.75)" }}>
              <div className="flex items-center gap-2 mb-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z"
                    stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-white font-bold" style={{ fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>How Question Mode works</p>
              </div>
              <p className="text-white" style={{ fontSize: "13px", opacity: 0.7, fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1.5 }}>
                Everyone gets a similar-but-different question. Imposters answer a slightly different question than everyone else — listen closely during discussion!
              </p>
            </div>
          )}
        </div>

        {/* Sticky Start Game button */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-4"
          style={{ background: "linear-gradient(0deg,rgba(4,8,18,0.98) 70%,transparent 100%)", maxWidth: "440px", margin: "0 auto" }}>
          <button onClick={handleStartGame} className="w-full py-4 rounded-2xl font-bold text-white text-lg"
            style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", boxShadow: "0 4px 24px rgba(37,99,235,0.5)", fontFamily: "'Segoe UI', Arial, sans-serif", border: "none", cursor: "pointer" }}>
            Start Game
          </button>
        </div>
      </div>

      {/* ===== PLAYERS MODAL ===== */}
      {showPlayersModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => { setEditingId(null); setShowPlayersModal(false); }}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl pt-5 pb-6"
            style={{ maxWidth: "440px", background: "rgba(10,22,48,0.98)", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>

            {/* Modal header */}
            <div className="flex items-center gap-3 px-6 mb-4">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </span>
              <div>
                <h2 className="text-white font-bold" style={{ fontSize: "20px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  Players
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  {players.length} players · tap name to edit
                </p>
              </div>
            </div>

            {/* Scrollable player list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
              <div className="flex flex-col gap-3">
                {players.map((player, idx) => (
                  <div key={player.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: "rgba(20,40,70,0.65)" }}>
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shrink-0"
                      style={{ background: "#3b82f6", fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: "14px" }}>
                      {idx + 1}
                    </span>
                    {editingId === player.id ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        maxLength={20}
                        className="flex-1 bg-transparent text-white outline-none border-b"
                        style={{ fontSize: "16px", fontFamily: "'Segoe UI', Arial, sans-serif", borderColor: "#3b82f6" }}
                      />
                    ) : (
                      <span className="flex-1 text-white"
                        style={{ fontSize: "16px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                        {player.name}
                      </span>
                    )}
                    <button onClick={() => startEdit(player)} className="w-8 h-8 flex items-center justify-center shrink-0">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                          stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add / Remove */}
            <div className="grid grid-cols-2 gap-4 px-6 pt-4">
              <button onClick={handleRemovePlayer} disabled={players.length <= MIN_PLAYERS}
                className="py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                style={{ border: "2px solid #ef4444", color: "#ef4444", background: "rgba(239,68,68,0.08)", fontFamily: "'Segoe UI', Arial, sans-serif", opacity: players.length <= MIN_PLAYERS ? 0.4 : 1, cursor: players.length <= MIN_PLAYERS ? "not-allowed" : "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
                  <circle cx="9" cy="7" r="4" />
                  <path d="M2 21c0-3.5 3 -6 7-6s7 2.5 7 6" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <rect x="15" y="10" width="7" height="2" rx="1" fill="#ef4444" />
                </svg>
                Remove
              </button>
              <button onClick={handleAddPlayer} disabled={players.length >= MAX_PLAYERS}
                className="py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                style={{ border: "2px solid #3b82f6", color: "#3b82f6", background: "rgba(59,130,246,0.08)", fontFamily: "'Segoe UI', Arial, sans-serif", opacity: players.length >= MAX_PLAYERS ? 0.4 : 1, cursor: players.length >= MAX_PLAYERS ? "not-allowed" : "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6">
                  <circle cx="9" cy="7" r="4" />
                  <path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="16" y="7" width="2" height="7" rx="1" fill="#3b82f6" />
                  <rect x="13" y="10" width="8" height="2" rx="1" fill="#3b82f6" />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== IMPOSTERS MODAL ===== */}
      {showImposterModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowImposterModal(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl px-6 pt-6 pb-8"
            style={{ maxWidth: "440px", background: "rgba(15,30,55,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}>

            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7f1d1d,#dc2626)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
                </svg>
              </span>
              <h2 className="text-white font-bold" style={{ fontSize: "20px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                Select Imposters
              </h2>
            </div>

            {/* Random toggle */}
            <div className="flex items-center justify-between px-4 py-4 rounded-2xl mb-3"
              style={{ border: randomImposters ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)", background: "rgba(20,40,75,0.6)" }}>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white font-semibold" style={{ fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  Random (1–{maxImposters})
                </span>
              </div>
              <button onClick={() => setRandomImposters((prev) => !prev)} className="relative"
                style={{ width: "46px", height: "26px", borderRadius: "999px", background: randomImposters ? "#3b82f6" : "rgba(255,255,255,0.2)", border: "none", transition: "background 0.2s ease" }}>
                <span style={{ position: "absolute", top: "3px", left: randomImposters ? "23px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.2s ease" }} />
              </button>
            </div>

            {/* Show Imposter Count toggle */}
            <div className="flex items-center justify-between px-4 py-4 rounded-2xl mb-6"
              style={{ background: "rgba(20,40,75,0.4)" }}>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="2" fill="none" />
                </svg>
                <span className="text-white" style={{ fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>Show Imposter Count</span>
              </div>
              <button onClick={() => setShowImposterCount((prev) => !prev)} className="relative"
                style={{ width: "46px", height: "26px", borderRadius: "999px", background: showImposterCount ? "#3b82f6" : "rgba(255,255,255,0.2)", border: "none", transition: "background 0.2s ease" }}>
                <span style={{ position: "absolute", top: "3px", left: showImposterCount ? "23px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.2s ease" }} />
              </button>
            </div>

            {/* Manual stepper */}
            <div className="flex items-center justify-center gap-6"
              style={{ opacity: randomImposters ? 0.35 : 1, pointerEvents: randomImposters ? "none" : "auto" }}>
              <button onClick={() => changeImposterCount(-1)} disabled={imposterCount <= 1}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
                style={{ border: "2px solid #ef4444", color: "#ef4444", background: "rgba(239,68,68,0.08)", opacity: imposterCount <= 1 ? 0.4 : 1 }}>
                −
              </button>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-white"
                  style={{ background: "#3b82f6", fontSize: "28px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  {imposterCount}
                </div>
                <span className="mt-2 text-xs font-semibold"
                  style={{ color: isRecommended ? "#60a5fa" : "transparent", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  Recommended
                </span>
              </div>
              <button onClick={() => changeImposterCount(1)} disabled={imposterCount >= maxImposters}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
                style={{ border: "2px solid #3b82f6", color: "#3b82f6", background: "rgba(59,130,246,0.08)", opacity: imposterCount >= maxImposters ? 0.4 : 1 }}>
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
