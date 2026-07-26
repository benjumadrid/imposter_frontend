import { useEffect, useState } from "react";
import { useTransitionNavigate } from "../context/TransitionContext";
import GameBackground from "./GameBackground";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 20;

export default function PlayersScreen() {
  const navigate = useTransitionNavigate();
  const [players, setPlayers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Load existing players (or create defaults)
  useEffect(() => {
    const stored = sessionStorage.getItem("gamePlayers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= MIN_PLAYERS) {
          setPlayers(parsed);
          return;
        }
      } catch {
        // fall through to defaults
      }
    }
    setPlayers([
      { id: 1, name: "Player 1" },
      { id: 2, name: "Player 2" },
      { id: 3, name: "Player 3" },
    ]);
  }, []);

  const persist = (next) => {
    setPlayers(next);
    sessionStorage.setItem("gamePlayers", JSON.stringify(next));
  };

  const handleAdd = () => {
    if (players.length >= MAX_PLAYERS) return;
    const nextId =
      players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1;
    persist([...players, { id: nextId, name: `Player ${nextId}` }]);
  };

  const handleRemove = () => {
    if (players.length <= MIN_PLAYERS) return;
    persist(players.slice(0, -1));
  };

  const startEdit = (player) => {
    setEditingId(player.id);
    setEditValue(player.name);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    persist(
      players.map((p) => (p.id === editingId ? { ...p, name: trimmed } : p))
    );
    setEditingId(null);
  };

  const handleBack = () => {
    sessionStorage.setItem("gamePlayers", JSON.stringify(players));
    navigate("/new-game");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center">
      <GameBackground />
      <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.55)" }} />

      <div className="relative z-10 w-full h-full flex flex-col" style={{ maxWidth: "440px" }}>
        {/* Header */}
        <div className="flex items-center justify-center relative pt-12 pb-6 px-5">
          <button
            onClick={handleBack}
            className="absolute left-5 w-9 h-9 flex items-center justify-center text-white"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-white font-bold" style={{ fontSize: "24px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            Players
          </h1>
        </div>

        {/* Count bar */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "rgba(20,45,80,0.7)" }}
        >
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span className="text-white" style={{ fontSize: "15px", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
              Players: {players.length}
            </span>
          </div>
          <span className="text-white" style={{ fontSize: "14px", opacity: 0.7, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            {MIN_PLAYERS}-{MAX_PLAYERS}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(20,40,70,0.65)" }}
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shrink-0"
                style={{ background: "#3b82f6", fontFamily: "'Segoe UI', Arial, sans-serif" }}
              >
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
                  style={{
                    fontSize: "16px",
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    borderColor: "#3b82f6",
                  }}
                />
              ) : (
                <span
                  className="flex-1 text-white"
                  style={{ fontSize: "16px", fontFamily: "'Segoe UI', Arial, sans-serif" }}
                >
                  {player.name}
                </span>
              )}

              <button
                onClick={() => startEdit(player)}
                className="w-8 h-8 flex items-center justify-center text-white shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                    stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="grid grid-cols-2 gap-4 px-5 pb-8 pt-2">
          <button
            onClick={handleRemove}
            disabled={players.length <= MIN_PLAYERS}
            className="py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            style={{
              border: "2px solid #ef4444",
              color: "#ef4444",
              background: "rgba(239,68,68,0.08)",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              opacity: players.length <= MIN_PLAYERS ? 0.4 : 1,
              cursor: players.length <= MIN_PLAYERS ? "not-allowed" : "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
              <circle cx="9" cy="7" r="4" />
              <path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" fill="none" stroke="#ef4444" strokeWidth="2" />
              <rect x="15" y="10" width="7" height="2" rx="1" fill="#ef4444" />
            </svg>
            Remove
          </button>

          <button
            onClick={handleAdd}
            disabled={players.length >= MAX_PLAYERS}
            className="py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            style={{
              border: "2px solid #3b82f6",
              color: "#3b82f6",
              background: "rgba(59,130,246,0.08)",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              opacity: players.length >= MAX_PLAYERS ? 0.4 : 1,
              cursor: players.length >= MAX_PLAYERS ? "not-allowed" : "pointer",
            }}
          >
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
  );
}