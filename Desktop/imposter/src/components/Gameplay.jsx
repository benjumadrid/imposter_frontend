import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionNavigate } from "../context/TransitionContext";
import GameBackground from "./GameBackground";
import { pickImposterIndices } from "../utils/shuffle";
import { LS_SHOW_CATEGORY, LS_SHOW_HINT, loadBool } from "../utils/settingsStorage";
import { CUSTOM_CATEGORY_ID, loadCustomCategory } from "../utils/customCategory";
import playerCardImg from "../assets/player-card.png";

const API_BASE = "https://game-backend-x355.onrender.com/api";
const QUESTIONS_API = "https://game-backend-x355.onrender.com/api/questions";

// ---- helpers ----
const getUsedWordIds = () => {
  try {
    const stored = sessionStorage.getItem("usedWordIds");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const markWordUsed = (wordId) => {
  const used = getUsedWordIds();
  used.push(wordId);
  sessionStorage.setItem("usedWordIds", JSON.stringify(used));
};

const getUsedQuestionIds = () => {
  try {
    const stored = sessionStorage.getItem("usedQuestionIds");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const markQuestionUsed = (id) => {
  const used = getUsedQuestionIds();
  used.push(id);
  sessionStorage.setItem("usedQuestionIds", JSON.stringify(used));
};

// Fisher-Yates shuffle — used to randomize which clue index each imposter
// starts from, so it's not always "imposter #1 gets clue #1" every game.
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Distribute clues across imposters so no two imposters see the same clue
// unless there are genuinely more imposters than available clues (in which
// case clues repeat, but as evenly and unpredictably as possible).
const assignCluesToImposters = (imposterIndices, cluesList) => {
  const map = {};
  if (!cluesList.length) {
    imposterIndices.forEach((idx) => { map[idx] = ""; });
    return map;
  }
  const shuffledClues = shuffleArray(cluesList);
  const shuffledImposters = shuffleArray(imposterIndices);
  shuffledImposters.forEach((impIdx, i) => {
    map[impIdx] = shuffledClues[i % shuffledClues.length].clue;
  });
  return map;
};

// ---- Fuzzy match helpers (forgive small typos, not wrong concepts) ----

const normalizeGuess = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[.,'"’-]/g, "")
    .replace(/\s+/g, " ");

const levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
};

const isCloseEnough = (guessRaw, answerRaw) => {
  const guess = normalizeGuess(guessRaw);
  const answer = normalizeGuess(answerRaw);
  if (!guess) return false;
  if (guess === answer) return true;

  const distance = levenshtein(guess, answer);
  const tolerance = Math.max(1, Math.floor(answer.length / 6));
  return distance <= tolerance;
};

// ---- Time's-up alert sound (generated in-browser, no audio file needed) ----
const playTimeUpSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const beep = (startTime, freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    };

    const now = ctx.currentTime;
    beep(now, 880);
    beep(now + 0.5, 880);
    beep(now + 1.0, 1040);
    beep(now + 1.5, 1040);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 2200);
  } catch {
    // Fail silently — sound is a nice-to-have, never block gameplay on it.
  }
};

// ---- Reveal Card Component (crisp HTML text over image) ----
function RevealCard({ playerName, onReveal }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleTap = () => {
    if (flipped) return;
    setFlipped(true);
    setTimeout(() => onReveal(), 320);
  };

  return (
    <div style={{ perspective: "1200px", width: "100%" }}>
      <motion.div
        onClick={handleTap}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{
          rotateY: flipped ? 90 : 0,
          scale: hovered && !flipped ? 1.02 : 1,
        }}
        transition={{
          rotateY: { duration: 0.32, ease: "easeIn" },
          scale: { duration: 0.2, ease: "easeOut" },
        }}
        style={{
          cursor: "pointer",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          width: "100%",
          maxWidth: "440px",
          margin: "0 auto",
          borderRadius: "28px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <img
          src={playerCardImg}
          alt=""
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />

        {/* Name bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "17%",
            background: "linear-gradient(90deg, #1d4ed8 50%, #b91c1c 50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              padding: "6px 22px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "clamp(20px, 5vw, 28px)",
                fontWeight: 800,
                fontFamily: "'Segoe UI', Arial, sans-serif",
                margin: 0,
                whiteSpace: "nowrap",
                letterSpacing: "0.3px",
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              {playerName}
            </h2>
          </div>
        </div>

        {/* Tap to reveal bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "13%",
            background: "linear-gradient(90deg, #1d4ed8 50%, #b91c1c 50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "clamp(16px, 4vw, 20px)",
              fontWeight: 700,
              fontFamily: "'Segoe UI', Arial, sans-serif",
              margin: 0,
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(0,0,0,0.35)",
            }}
          >
            Tap to reveal
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Polished spy icon (fedora + glasses) matching the reference card ----
function SpyIcon() {
  return (
    <svg width="76" height="70" viewBox="0 0 76 70" className="relative z-10">
      <ellipse cx="38" cy="26" rx="32" ry="7.5" fill="#f87171" />
      <path
        d="M17 26c0-10.5 9-17.5 21-17.5s21 7 21 17.5c0 3-2.2 5.5-5.5 5.5H22.5C19.2 31.5 17 29 17 26z"
        fill="#f87171"
      />
      <rect x="20" y="20" width="36" height="6" rx="3" fill="#dc2626" opacity="0.55" />
      <rect x="35" y="44" width="6" height="3" rx="1.5" fill="#f87171" />
      <circle cx="27" cy="46" r="10" fill="none" stroke="#f87171" strokeWidth="3.4" />
      <circle cx="49" cy="46" r="10" fill="none" stroke="#f87171" strokeWidth="3.4" />
      <path d="M17 45h-5M59 45h5" stroke="#f87171" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

// ---- Compact timer for the voting phase (fits without scrolling) ----
function CompactTimer({ secondsLeft, totalSeconds }) {
  const size = 150;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = totalSeconds > 0 ? totalSeconds : 1;
  const progress = Math.max(0, Math.min(1, secondsLeft / safeTotal));
  const dashOffset = circumference * (1 - progress);

  const isLow = secondsLeft <= 10;
  const isMid = secondsLeft <= 30 && secondsLeft > 10;
  const ringColor = isLow ? "#ef4444" : isMid ? "#f59e0b" : "#3b82f6";
  const glowColor = isLow ? "rgba(239,68,68,0.5)" : isMid ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.35)";
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <motion.div
      animate={isLow ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={isLow ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" } : {}}
      style={{ position: "relative", width: `${size}px`, height: `${size}px`, filter: `drop-shadow(0 0 14px ${glowColor})` }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="rgba(0,0,0,0.3)" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={ringColor} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.65 }}>
          <circle cx="12" cy="12" r="9" stroke={ringColor} strokeWidth="2" />
          <path d="M12 7v5l3 3" stroke={ringColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
          <span style={{ fontSize: "32px", fontWeight: 900, color: isLow ? "#f87171" : isMid ? "#fbbf24" : "white", fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1, letterSpacing: "-1px", transition: "color 0.3s" }}>{minutes}</span>
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "26px", fontWeight: 900, color: isLow ? "#f87171" : isMid ? "#fbbf24" : "white", fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1 }}>:</motion.span>
          <span style={{ fontSize: "32px", fontWeight: 900, color: isLow ? "#f87171" : isMid ? "#fbbf24" : "white", fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1, letterSpacing: "-1px", transition: "color 0.3s" }}>{seconds}</span>
        </div>
        <span style={{ fontSize: "10px", fontWeight: 700, color: isLow ? "#f87171" : "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Segoe UI', Arial, sans-serif", transition: "color 0.3s" }}>
          {isLow ? "hurry!" : "left"}
        </span>
      </div>
    </motion.div>
  );
}

export default function Gameplay() {
  const navigate = useTransitionNavigate();
  const [searchParams] = useSearchParams();

  const players = (() => {
    try {
      const parsed = JSON.parse(searchParams.get("players") || "[]");
      return Array.isArray(parsed) && parsed.length ? parsed : ["Player 1", "Player 2", "Player 3"];
    } catch {
      return ["Player 1", "Player 2", "Player 3"];
    }
  })();

  const imposterIndicesFromParams = (() => {
    try {
      const parsed = JSON.parse(searchParams.get("imposterIndices") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const imposterCount = imposterIndicesFromParams.length
    ? imposterIndicesFromParams.length
    : Math.min(parseInt(searchParams.get("imposters") || "1", 10), Math.max(1, players.length - 2));

  const showImposterCount = searchParams.get("showImposterCount") === "true";
  const timeLimitMinutes = parseInt(searchParams.get("timeLimit") || "0", 10);
  const categoriesParam = searchParams.get("categories");
  const selectedCategoryIds = categoriesParam
    ? categoriesParam.split(",").map((id) => (id === CUSTOM_CATEGORY_ID ? id : parseInt(id, 10)))
    : [];

  // Game mode: "word" (default, existing secret-word game) or "question" (new mode)
  const gameMode = searchParams.get("mode") === "question" ? "question" : "word";

  const showCategoryToImposter = loadBool(LS_SHOW_CATEGORY, false);
  const showHintToImposter = loadBool(LS_SHOW_HINT, false);

  const [phase, setPhase] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const [imposterIndices, setImposterIndices] = useState([]);
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(0);

  const [word, setWord] = useState("");
  const [wordId, setWordId] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Question-mode content
  const [normalQuestion, setNormalQuestion] = useState("");
  const [imposterQuestion, setImposterQuestion] = useState("");

  // Per-imposter clue assignment: { [playerIndex]: clueText }.
  const [imposterClues, setImposterClues] = useState({});

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [timerActive, setTimerActive] = useState(false);

  // ---- Imposter guess state (word mode only — triggered automatically when timer hits 0) ----
  const [guessInput, setGuessInput] = useState("");
  const [imposterWon, setImposterWon] = useState(false);
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [timeRanOut, setTimeRanOut] = useState(false);

  const hasPlayedOnceRef = useRef(false);

  const setupGame = useCallback(async () => {
    setPhase("loading");
    setErrorMsg("");
    try {
      let imposters;
      const starter = Math.floor(Math.random() * players.length);

      if (gameMode === "question") {
        // ---- QUESTION MODE ----
        const usedIds = getUsedQuestionIds();
        let attempt = null;
        for (let i = 0; i < 5; i++) {
          const res = await fetch(`${QUESTIONS_API}/random`);
          if (!res.ok) throw new Error("Failed to load a question");
          const data = await res.json();
          if (!usedIds.includes(data.id) || i === 4) {
            attempt = data;
            break;
          }
        }
        if (!attempt) throw new Error("No questions available");

        markQuestionUsed(attempt.id);

        if (!hasPlayedOnceRef.current && imposterIndicesFromParams.length) {
          imposters = imposterIndicesFromParams;
        } else {
          imposters = pickImposterIndices(players.length, imposterCount);
        }
        hasPlayedOnceRef.current = true;

        setNormalQuestion(attempt.normal_question);
        setImposterQuestion(attempt.imposter_question);
        setCategoryName(attempt.category || "");
        setWord("");
        setWordId(null);
        setImposterClues({});
      } else {
        // ---- WORD MODE ----
        const customCategory = loadCustomCategory();

        let candidateIds = selectedCategoryIds;
        let allCategories = [];
        const catRes = await fetch(`${API_BASE}/categories`);
        if (!catRes.ok) throw new Error("Failed to load categories");
        allCategories = await catRes.json();

        if (!candidateIds.length) {
          candidateIds = allCategories.filter((c) => !c.is_premium).map((c) => c.id);
        }
        if (!candidateIds.length) throw new Error("No categories available");

        const chosenCategoryId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
        const isCustomChosen = chosenCategoryId === CUSTOM_CATEGORY_ID;

        const chosenCategory = isCustomChosen
          ? { id: CUSTOM_CATEGORY_ID, name: customCategory?.name || "Custom" }
          : allCategories.find((c) => c.id === chosenCategoryId);

        let words;
        if (isCustomChosen) {
          if (!customCategory || !customCategory.words.length) {
            throw new Error(`Your custom category "${customCategory?.name || ""}" has no words yet`);
          }
          words = customCategory.words.map((w, i) => ({ id: `custom-${i}-${w}`, word: w }));
        } else {
          const wordsRes = await fetch(`${API_BASE}/words/${chosenCategoryId}`);
          if (!wordsRes.ok) throw new Error("Failed to load words for category");
          words = await wordsRes.json();
          if (!words.length) throw new Error(`No words found in "${chosenCategory?.name}"`);
        }

        const usedIds = getUsedWordIds();
        let available = words.filter((w) => !usedIds.includes(w.id));

        if (!available.length) {
          available = words;
        }

        const chosenWord = available[Math.floor(Math.random() * available.length)];

        let cluesList = [];
        if (!isCustomChosen) {
          try {
            const cluesRes = await fetch(`${API_BASE}/clues/${chosenWord.id}`);
            if (cluesRes.ok) {
              const fetchedClues = await cluesRes.json();
              if (Array.isArray(fetchedClues)) cluesList = fetchedClues;
            }
          } catch {}
        }

        markWordUsed(chosenWord.id);

        if (!hasPlayedOnceRef.current && imposterIndicesFromParams.length) {
          imposters = imposterIndicesFromParams;
        } else {
          imposters = pickImposterIndices(players.length, imposterCount);
        }
        hasPlayedOnceRef.current = true;

        const cluesForImposters = assignCluesToImposters(imposters, cluesList);

        setWord(chosenWord.word);
        setWordId(chosenWord.id);
        setCategoryName(chosenCategory?.name || "");
        setImposterClues(cluesForImposters);
        setNormalQuestion("");
        setImposterQuestion("");
      }

      setImposterIndices(imposters);
      setStartingPlayerIndex(starter);
      setCurrentPlayerIndex(0);
      setCardRevealed(false);
      setGuessInput("");
      setImposterWon(false);
      setGuessSubmitted(false);
      setTimeRanOut(false);
      setPhase("reveal");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
      setPhase("error");
    }
  }, [players.length, imposterCount, selectedCategoryIds.join(","), gameMode]);

  useEffect(() => {
    setupGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer during voting.
  // Word mode: hitting 0 sends the imposter to a bonus guess screen.
  // Question mode: hitting 0 goes straight to results (no word to guess).
  useEffect(() => {
    if (phase !== "voting" || !timerActive || timeLimitMinutes <= 0) return;
    if (secondsLeft <= 0) {
      setTimerActive(false);
      playTimeUpSound();
      if (gameMode === "word") {
        setTimeRanOut(true);
        setPhase("imposterGuess");
      } else {
        setPhase("results");
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timerActive, secondsLeft, timeLimitMinutes, gameMode]);

  useEffect(() => {
    if (phase === "voting" && timeLimitMinutes > 0) {
      setSecondsLeft(timeLimitMinutes * 60);
      setTimerActive(true);
    }
  }, [phase, timeLimitMinutes]);

  const isCurrentImposter = imposterIndices.includes(currentPlayerIndex);
  const currentPlayerName = players[currentPlayerIndex];
  const imposterNames = imposterIndices.map((i) => players[i]);

  // The clue this specific imposter (at currentPlayerIndex) should see — word mode only.
  const currentImposterClue = imposterClues[currentPlayerIndex] || "";

  const handleRevealCard = () => setCardRevealed(true);

  const handleGotIt = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex((i) => i + 1);
      setCardRevealed(false);
    } else {
      setPhase("voting");
    }
  };

  const handleClose = () => navigate("/home");

  const handlePlayAgain = () => {
    setImposterIndices([]);
    setWord("");
    setWordId(null);
    setCategoryName("");
    setImposterClues({});
    setNormalQuestion("");
    setImposterQuestion("");
    setCurrentPlayerIndex(0);
    setCardRevealed(false);
    setStartingPlayerIndex(0);
    setSecondsLeft(timeLimitMinutes * 60);
    setTimerActive(false);
    setGuessInput("");
    setImposterWon(false);
    setGuessSubmitted(false);
    setTimeRanOut(false);
    setupGame();
  };

  const handleSubmitGuess = () => {
    const correct = isCloseEnough(guessInput, word);
    setImposterWon(correct);
    setGuessSubmitted(true);
    setPhase("results");
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const cardWrapperStyle = {
    maxWidth: "440px",
    margin: "0 auto",
  };

  // ================= LOADING =================
  if (phase === "loading") {
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <GameBackground />
        <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            style={{
              width: "44px", height: "44px", borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#3b82f6",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p className="text-white" style={{ fontFamily: "'Segoe UI', Arial, sans-serif", opacity: 0.8 }}>
            Preparing round...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (phase === "error") {
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center px-6">
        <GameBackground />
        <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center" style={cardWrapperStyle}>
          <p className="text-red-400 font-semibold" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            {errorMsg}
          </p>
          <button
            onClick={() => navigate("/new-game")}
            className="px-6 py-3 rounded-2xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", fontFamily: "'Segoe UI', Arial, sans-serif", border: "none" }}
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  // ================= REVEAL PHASE =================
  if (phase === "reveal") {
    return (
      <div className="relative w-full h-screen overflow-hidden flex flex-col items-center px-5 pt-6">
        <GameBackground />
        <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.55)" }} />

        <button
          onClick={handleClose}
          className="absolute z-20 flex items-center justify-center text-white"
          style={{ top: "20px", right: "20px", width: "36px", height: "36px" }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative z-10 w-full flex flex-col items-center" style={{ ...cardWrapperStyle, marginTop: "60px" }}>
          {!cardRevealed ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ width: "100%" }}
              >
                <RevealCard playerName={currentPlayerName} onReveal={handleRevealCard} />

                <div className="flex flex-col items-center mt-8 gap-3">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 11.5V6a2 2 0 114 0v5.5M13 9.5V5a2 2 0 114 0v6.5M9 12l-1.5-1.5a1.8 1.8 0 00-2.5 2.5l4 5A5 5 0 0013 22h1a6 6 0 006-6v-4.5a2 2 0 10-4 0"
                        stroke="#3b82f6" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  <p className="text-white text-center" style={{ fontSize: "14px", opacity: 0.75, fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: "1.5" }}>
                    Tap your card to reveal the word.<br />Make sure no one else sees it.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : isCurrentImposter ? (
            // ---- Imposter revealed card ----
            <motion.div
              key="imposter-reveal"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ width: "100%" }}
            >
              {gameMode === "question" ? (
                <>
                  <p className="text-center mb-1" style={{ fontSize: "17px", fontFamily: "'Segoe UI', Arial, sans-serif", color: "white" }}>
                    Your question, <span style={{ color: "#ef4444", fontWeight: 700 }}>{currentPlayerName}</span>
                  </p>
                  <div
                    className="w-full rounded-3xl flex flex-col items-center px-6 py-12 relative overflow-hidden"
                    style={{
                      background: "radial-gradient(circle at 50% 40%, #7f1d1d 0%, #450a0a 70%)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
                    }}
                  >
                    <h1
                      className="font-black mb-6 relative z-10 text-center"
                      style={{ fontSize: "30px", color: "#f87171", fontFamily: "'Segoe UI', Arial, sans-serif", letterSpacing: "-0.5px", lineHeight: 1.3 }}
                    >
                      {imposterQuestion}
                    </h1>
                    <SpyIcon />
                    <p className="text-white text-center mt-6 relative z-10" style={{ fontSize: "14px", opacity: 0.85, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                      Answer this out loud — but don't say the question itself!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-center mb-1" style={{ fontSize: "17px", fontFamily: "'Segoe UI', Arial, sans-serif", color: "white" }}>
                    The word for <span style={{ color: "#ef4444", fontWeight: 700 }}>{currentPlayerName}</span>
                  </p>
                  {showCategoryToImposter && (
                    <p className="text-white font-bold text-center mb-5" style={{ fontSize: "20px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                      Category: {categoryName}
                    </p>
                  )}

                  <div
                    className="w-full rounded-3xl flex flex-col items-center px-6 py-12 relative overflow-hidden"
                    style={{
                      background: "radial-gradient(circle at 50% 40%, #7f1d1d 0%, #450a0a 70%)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
                    }}
                  >
                    <h1
                      className="font-black mb-6 relative z-10"
                      style={{ fontSize: "44px", color: "#f87171", fontFamily: "'Segoe UI', Arial, sans-serif", letterSpacing: "-0.5px" }}
                    >
                      Imposter
                    </h1>

                    <SpyIcon />

                    {showHintToImposter && (
                      <div className="relative z-10 flex flex-col items-center">
                        <p className="mt-7 font-bold flex items-center gap-2" style={{ color: "#fbbf24", fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                          💡 Your Clue
                        </p>
                        <p className="text-white font-extrabold mt-1" style={{ fontSize: "24px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                          {currentImposterClue ? currentImposterClue.toUpperCase() : "No clue available this round"}
                        </p>
                        {currentImposterClue && (
                          <p className="text-white text-center mt-2" style={{ fontSize: "14px", opacity: 0.85, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                            Use this in the first round to blend in!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              <button
                onClick={handleGotIt}
                className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-lg"
                style={{ background: "#3b4bd6", boxShadow: "0 4px 24px rgba(37,99,235,0.5)", fontFamily: "'Segoe UI', Arial, sans-serif", border: "none" }}
              >
                Got it!
              </button>

              {currentPlayerIndex < players.length - 1 && (
                <p className="text-white text-center mt-5" style={{ fontSize: "14px", opacity: 0.85, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  Pass device to the next player
                </p>
              )}
            </motion.div>
          ) : (
            // ---- Local (non-imposter) revealed card ----
            <motion.div
              key="local-reveal"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ width: "100%" }}
            >
              {gameMode === "question" ? (
                <div
                  className="w-full rounded-3xl flex flex-col items-center px-6 py-12"
                  style={{ background: "linear-gradient(160deg,#1e3a8a,#172554)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                >
                  <p className="text-white text-center font-semibold mb-6" style={{ fontSize: "17px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                    Answer this question out loud —<br />don't repeat the question itself!
                  </p>
                  <h1 className="text-white font-extrabold mb-8 text-center" style={{ fontSize: "26px", fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1.3 }}>
                    {normalQuestion}
                  </h1>
                  <svg width="70" height="34" viewBox="0 0 70 34" fill="#3b82f6">
                    <circle cx="15" cy="10" r="9" />
                    <circle cx="35" cy="7" r="10" />
                    <circle cx="55" cy="10" r="9" />
                    <path d="M0 34c0-9 6-15 15-15s15 6 15 15z" />
                    <path d="M20 34c0-11 7-18 15-18s15 7 15 18z" />
                    <path d="M40 34c0-9 6-15 15-15s15 6 15 15z" />
                  </svg>
                </div>
              ) : (
                <div
                  className="w-full rounded-3xl flex flex-col items-center px-6 py-12"
                  style={{ background: "linear-gradient(160deg,#1e3a8a,#172554)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                >
                  <p className="text-white text-center font-semibold mb-6" style={{ fontSize: "17px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                    Find the Imposter before<br />time runs out!
                  </p>
                  <h1 className="text-white font-extrabold mb-8" style={{ fontSize: "38px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                    {word}
                  </h1>
                  <svg width="70" height="34" viewBox="0 0 70 34" fill="#3b82f6">
                    <circle cx="15" cy="10" r="9" />
                    <circle cx="35" cy="7" r="10" />
                    <circle cx="55" cy="10" r="9" />
                    <path d="M0 34c0-9 6-15 15-15s15 6 15 15z" />
                    <path d="M20 34c0-11 7-18 15-18s15 7 15 18z" />
                    <path d="M40 34c0-9 6-15 15-15s15 6 15 15z" />
                  </svg>
                </div>
              )}

              <button
                onClick={handleGotIt}
                className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-lg"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", boxShadow: "0 4px 24px rgba(37,99,235,0.5)", fontFamily: "'Segoe UI', Arial, sans-serif", border: "none" }}
              >
                Got it!
              </button>

              {currentPlayerIndex < players.length - 1 && (
                <p className="text-white text-center mt-5" style={{ fontSize: "14px", opacity: 0.7, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                  Pass device to the next player
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ================= VOTING PHASE =================
  if (phase === "voting") {
    const votingSteps = [
      {
        num: 1, color: "#3b82f6", iconBg: "#3b82f6",
        title: "Starting Player",
        desc: <>Player <span style={{ color: "#fbbf24", fontWeight: 700 }}>{players[startingPlayerIndex]}</span> starts the round</>,
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" /></svg>,
      },
      {
        num: 2, color: "#a855f7", iconBg: "#a855f7",
        title: "Group Discussion",
        desc: gameMode === "question" ? "Answer your question out loud — go clockwise" : "Discuss and give clues — go clockwise",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2 20c0-3 2.5-5 6-5s6 2 6 5M10 20c0-3 2.5-5 6-5s6 2 6 5" /></svg>,
      },
      {
        num: 3, color: "#f59e0b", iconBg: "#f59e0b",
        title: "Vote Time",
        desc: gameMode === "question" ? "Listen closely — imposters answered a different question" : "Each player says one word related to the secret",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" /></svg>,
      },
      {
        num: 4, color: "#ef4444", iconBg: "#ef4444",
        title: "Time's Up",
        desc: gameMode === "question"
          ? "Vote then tap Reveal Results below"
          : (timeLimitMinutes > 0
            ? "Timer hits 0 → imposter gets one guess"
            : "Vote then tap Reveal Results below"),
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" /><path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>,
      },
    ];

    return (
      <div className="relative w-full h-screen overflow-hidden flex flex-col">
        <GameBackground />
        <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.6)" }} />

        <button
          onClick={handleClose}
          className="absolute z-20 flex items-center justify-center text-white"
          style={{ top: "18px", right: "18px", width: "36px", height: "36px" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className="relative z-10 flex-1 overflow-y-auto px-5 pt-8 pb-4"
          style={{ maxWidth: "440px", width: "100%", margin: "0 auto" }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-extrabold" style={{ fontSize: "22px", fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1.2 }}>
                Voting Phase
              </h1>
              <p className="text-white" style={{ fontSize: "13px", opacity: 0.65, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                {gameMode === "question" ? "Find who answered a different question!" : "Discuss and find the imposter!"}
              </p>
            </div>
          </div>

          {timeLimitMinutes > 0 && (
            <div className="flex justify-center my-3">
              <CompactTimer secondsLeft={secondsLeft} totalSeconds={timeLimitMinutes * 60} />
            </div>
          )}

          {showImposterCount && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-3"
              style={{ border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.1)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
              </svg>
              <span className="font-bold" style={{ color: "#f87171", fontSize: "13px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                {imposterCount} {imposterCount === 1 ? "Imposter" : "Imposters"}
              </span>
            </div>
          )}

          <p className="text-white font-bold mb-2" style={{ fontSize: "13px", opacity: 0.7, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            How to Vote
          </p>
          <div className="flex flex-col gap-2">
            {votingSteps.map((step) => (
              <div
                key={step.num}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl"
                style={{ background: "rgba(15,30,55,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-black text-white shrink-0"
                  style={{ background: step.color, fontSize: "12px", fontFamily: "'Segoe UI', Arial, sans-serif" }}
                >
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold" style={{ fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                    {step.title}
                  </p>
                  <p className="text-white" style={{ fontSize: "13px", opacity: 0.65, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                    {step.desc}
                  </p>
                </div>
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: step.iconBg }}
                >
                  {step.icon}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative z-10 px-5 pb-6 pt-3"
          style={{
            maxWidth: "440px",
            width: "100%",
            margin: "0 auto",
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 70%, transparent)",
          }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setTimerActive(false);
              setPhase("results");
            }}
            className="w-full py-4 rounded-2xl font-extrabold text-white text-lg flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg,#b91c1c,#dc2626)",
              boxShadow: "0 4px 24px rgba(220,38,38,0.5)",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              border: "none",
              letterSpacing: "0.3px",
            }}
          >
            Reveal Results
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>
    );
  }

  // ================= IMPOSTER GUESS PHASE (word mode only) =================
  if (phase === "imposterGuess") {
    const guessingName = imposterNames.length === 1 ? imposterNames[0] : imposterNames.join(" & ");

    return (
      <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center px-6">
        <GameBackground />
        <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.65)" }} />

        <div className="relative z-10 w-full flex flex-col items-center" style={cardWrapperStyle}>
          <p className="font-bold mb-1 text-center" style={{ color: "#f87171", fontSize: "15px", letterSpacing: "1px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            TIME'S UP
          </p>
          <h1 className="text-white font-extrabold mb-3 text-center" style={{ fontSize: "26px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            Pass the device to {guessingName}
          </h1>
          <p className="text-white text-center mb-8" style={{ fontSize: "15px", opacity: 0.8, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            Last chance — guess the secret word correctly to win, even though your time ran out! Small typos are okay.
          </p>

          <div
            className="w-full rounded-3xl flex flex-col items-center px-6 py-10"
            style={{
              background: "radial-gradient(circle at 50% 40%, #7f1d1d 0%, #450a0a 70%)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
            }}
          >
            <SpyIcon />

            <input
              autoFocus
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitGuess()}
              placeholder="Type your guess..."
              className="w-full mt-8 rounded-xl px-4 py-3 text-white text-center outline-none"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                fontFamily: "'Segoe UI', Arial, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
              }}
            />
          </div>

          <button
            onClick={handleSubmitGuess}
            disabled={!guessInput.trim()}
            className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-lg"
            style={{
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              boxShadow: "0 4px 24px rgba(37,99,235,0.5)",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              border: "none",
              opacity: guessInput.trim() ? 1 : 0.5,
              cursor: guessInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            Submit Guess
          </button>
        </div>
      </div>
    );
  }

  // ================= RESULTS =================
  if (phase === "results") {
    const won = timeRanOut && guessSubmitted && imposterWon;
    const multipleImposters = imposterNames.length > 1;
    // When manually revealed (no timer guess), locals win by default
    const localsWin = !timeRanOut || (timeRanOut && guessSubmitted && !imposterWon);

    return (
      <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center px-5">
        <GameBackground />
        <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.72)" }} />

        <button
          onClick={handleClose}
          className="absolute z-20 flex items-center justify-center"
          style={{
            top: "18px", right: "18px", width: "38px", height: "38px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 w-full flex flex-col items-center"
          style={{ maxWidth: "400px" }}
        >
          {/* Win / Lose banner — word mode only; question mode shows a neutral reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="w-full rounded-3xl px-6 py-7 mb-4 flex flex-col items-center text-center relative overflow-hidden"
            style={{
              background: gameMode === "question"
                ? "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.3) 0%, rgba(15,10,40,0.95) 70%)"
                : localsWin
                  ? "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.3) 0%, rgba(10,20,50,0.95) 70%)"
                  : "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.3) 0%, rgba(30,5,5,0.95) 70%)",
              border: `1.5px solid ${gameMode === "question" ? "rgba(139,92,246,0.4)" : localsWin ? "rgba(59,130,246,0.4)" : "rgba(239,68,68,0.4)"}`,
              boxShadow: gameMode === "question"
                ? "0 0 40px rgba(139,92,246,0.2), 0 20px 50px rgba(0,0,0,0.5)"
                : localsWin
                  ? "0 0 40px rgba(59,130,246,0.2), 0 20px 50px rgba(0,0,0,0.5)"
                  : "0 0 40px rgba(239,68,68,0.2), 0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{
              position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%)",
              width: "120px", height: "120px", borderRadius: "50%",
              background: gameMode === "question" ? "rgba(139,92,246,0.25)" : localsWin ? "rgba(59,130,246,0.25)" : "rgba(239,68,68,0.25)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }} />

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 14 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3 relative z-10"
              style={{
                background: gameMode === "question" ? "rgba(139,92,246,0.2)" : localsWin ? "rgba(59,130,246,0.2)" : "rgba(239,68,68,0.2)",
                border: `2px solid ${gameMode === "question" ? "rgba(139,92,246,0.5)" : localsWin ? "rgba(59,130,246,0.5)" : "rgba(239,68,68,0.5)"}`,
              }}
            >
              <span style={{ fontSize: "34px" }}>{gameMode === "question" ? "🕵️" : localsWin ? "🏆" : "🕵️"}</span>
            </motion.div>

            {timeRanOut && guessSubmitted && gameMode !== "question" && (
              <p style={{
                color: localsWin ? "#93c5fd" : "#fca5a5",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                fontFamily: "'Segoe UI', Arial, sans-serif",
                marginBottom: "4px",
              }}>
                TIME RAN OUT
              </p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.35 }}
              style={{
                color: gameMode === "question" ? "#c4b5fd" : localsWin ? "#93c5fd" : "#f87171",
                fontSize: "28px",
                fontWeight: 900,
                fontFamily: "'Segoe UI', Arial, sans-serif",
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
              }}
            >
              {gameMode === "question"
                ? (multipleImposters ? "Imposters Revealed!" : "Imposter Revealed!")
                : localsWin
                  ? "Locals Win! 🎉"
                  : (multipleImposters ? "Imposters Win!" : "Imposter Wins!")}
            </motion.h1>
            <p style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              marginTop: "6px",
            }}>
              {gameMode === "question"
                ? "See who answered a different question"
                : localsWin
                  ? (timeRanOut ? "Wrong guess — imposter exposed!" : "The imposter was found!")
                  : "The imposter guessed the secret word!"}
            </p>
          </motion.div>

          {/* Info cards */}
          <div className="w-full grid grid-cols-2 gap-3 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              className="rounded-2xl px-4 py-5 flex flex-col items-center text-center"
              style={{
                background: "rgba(127,29,29,0.3)",
                border: "1px solid rgba(239,68,68,0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                style={{ background: "rgba(239,68,68,0.2)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f87171">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
                </svg>
              </div>
              <p style={{ color: "#f87171", fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", fontFamily: "'Segoe UI', Arial, sans-serif", marginBottom: "4px" }}>
                {multipleImposters ? "IMPOSTERS" : "IMPOSTER"}
              </p>
              <p style={{ color: "white", fontSize: "16px", fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1.3 }}>
                {imposterNames.join(", ")}
              </p>
            </motion.div>

            {gameMode === "question" ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.35 }}
                className="rounded-2xl px-4 py-5 flex flex-col items-center text-center"
                style={{
                  background: "rgba(120,84,10,0.25)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ background: "rgba(251,191,36,0.2)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z"
                      stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{ color: "#fbbf24", fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", fontFamily: "'Segoe UI', Arial, sans-serif", marginBottom: "4px" }}>
                  IMPOSTER QUESTION
                </p>
                <p style={{ color: "white", fontSize: "13px", fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1.35 }}>
                  {imposterQuestion}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.35 }}
                className="rounded-2xl px-4 py-5 flex flex-col items-center text-center"
                style={{
                  background: "rgba(120,84,10,0.25)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ background: "rgba(251,191,36,0.2)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z"
                      stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{ color: "#fbbf24", fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", fontFamily: "'Segoe UI', Arial, sans-serif", marginBottom: "4px" }}>
                  SECRET WORD
                </p>
                <p style={{ color: "white", fontSize: "16px", fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1.3 }}>
                  {word}
                </p>
              </motion.div>
            )}
          </div>

          {gameMode === "question" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              className="w-full rounded-2xl px-4 py-4 mb-4 text-center"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)" }}
            >
              <p style={{ color: "#93c5fd", fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", fontFamily: "'Segoe UI', Arial, sans-serif", marginBottom: "4px" }}>
                EVERYONE ELSE'S QUESTION
              </p>
              <p style={{ color: "white", fontSize: "13px", fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", lineHeight: 1.35 }}>
                {normalQuestion}
              </p>
            </motion.div>
          )}

          {/* Play Again */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePlayAgain}
            className="w-full py-4 rounded-2xl font-extrabold text-white text-lg flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              boxShadow: "0 8px 28px rgba(37,99,235,0.45)",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              border: "none",
              letterSpacing: "0.3px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}