import { useEffect, useState } from "react";
import { useTransitionNavigate } from "../context/TransitionContext";
import GameBackground from "./GameBackground";
import { getCategoryIcon } from "../assets/category-icons/CategoryIcons";
import {
  CUSTOM_CATEGORY_ID,
  loadCustomCategory,
  saveCustomCategory
} from "../utils/customCategory";
import { PREMIUM_CATEGORIES } from "../data/premiumCategoriesData";

const API_URL = "https://game-backend-x355.onrender.com/api/categories";
const PREMIUM_STATUS_URL = "https://game-backend-x355.onrender.com/api/premium/status";

const MAX_SELECTED = 3;
const FONT = "'Segoe UI', Arial, sans-serif";

function getDeviceId() {
  let id = localStorage.getItem("imposter_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("imposter_device_id", id);
  }
  return id;
}

function PremiumCategoryIcon() {
  return (
    <svg width="90%" height="90%" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="26" fill="#3b2a6b" />
      <path
        d="M32 14l4.5 9.2 10.1 1.5-7.3 7.1 1.7 10-9-4.8-9 4.8 1.7-10-7.3-7.1 10.1-1.5z"
        fill="#fbbf24"
      />
    </svg>
  );
}

// Cute clustered "Solid Things" icon — monitor, chair, brick, hammer,
// books, cube — matching the thick-white-outline pastel flat style used
// by the Animal / Fruit / Food / Objects icons. No background circle;
// the parent component already supplies the circular frame.
function CustomCategoryIcon() {
  return (
    <svg width="90%" height="90%" viewBox="0 0 64 64" fill="none">
      {/* Stack of books (back-left) */}
      <g>
        <rect x="4" y="40" width="16" height="5" rx="1.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
        <rect x="5" y="35" width="14" height="5" rx="1.5" fill="#34d399" stroke="#ffffff" strokeWidth="2" />
        <rect x="4" y="30" width="16" height="5" rx="1.5" fill="#fb7185" stroke="#ffffff" strokeWidth="2" />
      </g>

      {/* Brick (back-right) */}
      <g>
        <rect x="44" y="36" width="17" height="10" rx="2" fill="#f97066" stroke="#ffffff" strokeWidth="2" />
        <line x1="44" y1="41" x2="61" y2="41" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="52.5" y1="36" x2="52.5" y2="41" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="48" y1="41" x2="48" y2="46" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="57" y1="41" x2="57" y2="46" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* Chair (mid-left, behind monitor) */}
      <g>
        <rect x="8" y="18" width="12" height="10" rx="2" fill="#a78bfa" stroke="#ffffff" strokeWidth="2" />
        <rect x="8" y="26" width="3" height="10" rx="1.5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.8" />
        <rect x="17" y="26" width="3" height="10" rx="1.5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.8" />
        <rect x="6" y="10" width="16" height="9" rx="2.5" fill="#a78bfa" stroke="#ffffff" strokeWidth="2" />
      </g>

      {/* Metal cube (mid-right, behind monitor) */}
      <g>
        <rect x="42" y="10" width="14" height="14" rx="2" fill="#60a5fa" stroke="#ffffff" strokeWidth="2" />
        <line x1="42" y1="17" x2="56" y2="17" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        <circle cx="49" cy="14" r="1.4" fill="#ffffff" opacity="0.85" />
      </g>

      {/* Central computer monitor */}
      <g>
        <rect x="18" y="20" width="28" height="20" rx="2.5" fill="#f3f4f6" stroke="#ffffff" strokeWidth="2.4" />
        <rect x="21" y="23" width="22" height="14" rx="1.5" fill="#93c5fd" />
        <rect x="23" y="25" width="8" height="5.5" rx="1" fill="#fbbf24" />
        <rect x="33" y="25" width="8" height="2.5" rx="1" fill="#34d399" />
        <rect x="33" y="29" width="8" height="2.5" rx="1" fill="#fb7185" />
        <rect x="28" y="40" width="8" height="4" fill="#cbd5e1" stroke="#ffffff" strokeWidth="1.6" />
        <rect x="22" y="44" width="20" height="3" rx="1.5" fill="#94a3b8" stroke="#ffffff" strokeWidth="1.6" />
      </g>

      {/* Hammer, tucked front-right of monitor */}
      <g transform="rotate(28 50 46)">
        <rect x="47" y="30" width="4" height="20" rx="2" fill="#c48a53" stroke="#ffffff" strokeWidth="1.8" />
        <rect x="42" y="26" width="14" height="7" rx="2" fill="#94a3b8" stroke="#ffffff" strokeWidth="2" />
      </g>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7m2 0v13a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 20V7h10zM10 11v6M14 11v6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Checkmark badge shown on the bottom-right corner of a selected card.
function SelectedCheckIcon() {
  return (
    <span
      className="absolute flex items-center justify-center rounded-full"
      style={{
        bottom: "10px",
        right: "10px",
        width: "26px",
        height: "26px",
        background: "#ef4444",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M4 12L9 17L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function CategoryScreen() {
  const navigate = useTransitionNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState([]);

  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);

  const [customCategory, setCustomCategory] = useState(() => loadCustomCategory());

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [newWordInput, setNewWordInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // GET FREE CATEGORIES
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        const freeOnly = data.filter((c) => !c.is_premium);
        setCategories(freeOnly);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // CHECK PREMIUM FROM DATABASE
  useEffect(() => {
    const deviceId = getDeviceId();
    const email = localStorage.getItem("imposter_email");

    if (!email) {
      setIsPremium(false);
      setPremiumLoading(false);
      return;
    }

    fetch(PREMIUM_STATUS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, device_id: deviceId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPremium(data.premium === true);
        setPremiumLoading(false);
      })
      .catch(() => {
        setIsPremium(false);
        setPremiumLoading(false);
      });
  }, []);

  // LOAD SELECTED
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCategories");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSelected(parsed);
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  const toggleCategory = (cat) => {
    const locked = cat.is_premium && !isPremium;
    if (locked) {
      navigate("/upgrade");
      return;
    }

    const id = cat.id;
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_SELECTED) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleDone = () => {
    if (!selected.length) return;
    sessionStorage.setItem("selectedCategories", JSON.stringify(selected));
    navigate("/new-game");
  };

  const handleNewClick = () => {
    if (customCategory) {
      setShowEditModal(true);
      return;
    }
    setNewCategoryName("");
    setShowCreateModal(true);
  };

  const handleCreateCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;

    const cat = {
      id: CUSTOM_CATEGORY_ID,
      name,
      words: [],
      is_premium: false,
      is_custom: true,
    };

    setCustomCategory(cat);
    saveCustomCategory(cat);
    setShowCreateModal(false);
    setShowEditModal(true);
  };

  const handleAddWord = () => {
    const word = newWordInput.trim();
    if (!word || !customCategory) return;

    const updated = {
      ...customCategory,
      words: [...customCategory.words, word],
    };

    setCustomCategory(updated);
    saveCustomCategory(updated);
    setNewWordInput("");
  };

  const handleRemoveWord = (idx) => {
    if (!customCategory) return;

    const updated = {
      ...customCategory,
      words: customCategory.words.filter((_, i) => i !== idx),
    };

    setCustomCategory(updated);
    saveCustomCategory(updated);
  };

  const handleDeleteCustomCategory = () => {
    setCustomCategory(null);
    saveCustomCategory(null);
    setShowEditModal(false);
    setShowDeleteConfirm(false);
    setSelected((prev) => prev.filter((id) => id !== CUSTOM_CATEGORY_ID));
  };

  // Names already used by free categories — so premium never repeats them
  const freeNameSet = new Set(categories.map((c) => c.name.trim().toLowerCase()));

  const premiumFiltered = PREMIUM_CATEGORIES.filter(
    (cat) => !freeNameSet.has(cat.name.trim().toLowerCase())
  );

  const displayCategories = [
    ...(customCategory
      ? [
          {
            id: customCategory.id,
            name: customCategory.name,
            word_count: customCategory.words.length,
            is_premium: false,
            is_custom: true,
            _kind: "c",
          },
        ]
      : []),

    ...categories.map((cat) => ({
      ...cat,
      is_premium: false,
      is_custom: false,
      _kind: "f",
    })),

    ...premiumFiltered.map((cat) => ({
      id: cat.id,
      name: cat.name,
      word_count: cat.words.length,
      is_premium: true,
      is_custom: false,
      _kind: "p",
    })),
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center">
      <GameBackground />

      <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.5)" }} />

      <div className="relative z-10 w-full h-full flex flex-col" style={{ maxWidth: "440px" }}>
        <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: selected.length ? "110px" : "40px" }}>
          <div className="flex items-center justify-between pt-12 pb-6">
            <button
              onClick={() => navigate("/new-game")}
              className="w-9 h-9 flex items-center justify-center text-white"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={handleNewClick}
              className="px-5 py-2 rounded-full text-white font-bold text-sm"
              style={{ border: "2px solid #3b82f6" }}
            >
              +New
            </button>
          </div>

          <h1 className="text-white font-extrabold mb-5" style={{ fontSize: "28px" }}>
            Category Selection
          </h1>

          {!premiumLoading && !isPremium && (
            <div
              className="rounded-3xl px-5 py-4 mb-6 flex items-center justify-between"
              style={{ background: "linear-gradient(90deg,#9c7a1e,#d9a531)" }}
            >
              <p className="text-white font-medium">Unlock Premium Categories</p>
              <button
                onClick={() => navigate("/upgrade")}
                className="px-4 py-2 rounded-full font-bold text-white"
                style={{ background: "linear-gradient(135deg,#f5a623,#f97316)", cursor: "pointer" }}
              >
                Upgrade 💎
              </button>
            </div>
          )}

          {!premiumLoading && isPremium && (
            <div
              className="rounded-3xl px-5 py-4 mb-6"
              style={{ background: "linear-gradient(90deg,#166534,#16a34a)" }}
            >
              <p className="text-white font-medium">✅ Premium unlocked — all categories available</p>
            </div>
          )}

          {!loading && !error && (
            <p className="text-white mb-4" style={{ fontSize: "13px", opacity: 0.6 }}>
              Select up to {MAX_SELECTED} categories ({selected.length}/{MAX_SELECTED})
            </p>
          )}

          {loading && <p className="text-white text-center py-20">Loading categories...</p>}

          {error && <p className="text-red-400 text-center py-20">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-2 gap-4">
              {displayCategories.map((cat) => {
                const locked = cat.is_premium && !isPremium;
                const selectedCat = selected.includes(cat.id);

                const Icon = locked
                  ? PremiumCategoryIcon
                  : cat.is_custom
                  ? CustomCategoryIcon
                  : getCategoryIcon(cat.name);

                return (
                  <div
                    key={`${cat._kind}-${cat.id}`}
                    onClick={() => toggleCategory(cat)}
                    className="relative rounded-3xl p-4 aspect-square"
                    style={{
                      background: locked
                        ? "linear-gradient(150deg,#6d3fc9,#3b7fd4)"
                        : "#16233d",
                      boxShadow: selectedCat
                        ? "0 0 0 3px #ef4444"
                        : "0 6px 18px rgba(0,0,0,.35)",
                    }}
                  >
                    {locked && (
                      <div
                        className="absolute top-[-10px] right-[-10px] rounded-full flex items-center justify-center"
                        style={{ width: "34px", height: "34px", background: "#fbbf24" }}
                      >
                        🔒
                      </div>
                    )}

                    {cat.is_custom && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                          }}
                          className="absolute flex items-center justify-center rounded-full"
                          style={{
                            top: "-10px",
                            right: "-10px",
                            width: "30px",
                            height: "30px",
                            background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                            border: "2px solid rgba(0,0,0,0.15)",
                          }}
                        >
                          <TrashIcon />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEditModal(true);
                          }}
                          className="absolute flex items-center justify-center rounded-full"
                          style={{
                            top: "-10px",
                            left: "-10px",
                            width: "30px",
                            height: "30px",
                            background: "rgba(59,130,246,0.9)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                            border: "2px solid rgba(0,0,0,0.15)",
                          }}
                        >
                          <PencilIcon />
                        </button>
                      </>
                    )}

                    {/* Selected checkmark badge */}
                    {selectedCat && !locked && <SelectedCheckIcon />}

                    <h2 className="text-white font-bold mb-2">{cat.name}</h2>

                    <div className="flex items-center justify-center flex-1">
                      <div
                        className="rounded-full flex items-center justify-center overflow-hidden"
                        style={{ width: "80%", aspectRatio: "1", border: "3px solid white" }}
                      >
                        <Icon />
                      </div>
                    </div>

                    <p className="text-white text-center text-sm">{cat.word_count ?? 0} words</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-4"
            style={{ background: "linear-gradient(0deg,rgba(4,8,18,.98),transparent)" }}
          >
            <button
              onClick={handleDone}
              className="w-full py-4 rounded-2xl text-white font-bold"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}
            >
              {selected.length} Pack Selected - Done
            </button>
          </div>
        )}
      </div>

      {/* ===== CREATE CATEGORY MODAL ===== */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-3xl p-6"
            style={{ maxWidth: "380px", background: "rgba(15,30,55,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="text-white font-bold mb-4" style={{ fontSize: "20px", fontFamily: FONT }}>
              Create a Category
            </h2>
            <input
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              placeholder="e.g. Solid Things"
              maxLength={30}
              className="w-full rounded-xl px-4 py-3 mb-4 text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(59,130,246,0.5)",
                fontFamily: FONT,
                fontSize: "15px",
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl font-bold"
                style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "white", fontFamily: FONT }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim()}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  fontFamily: FONT,
                  opacity: newCategoryName.trim() ? 1 : 0.5,
                  border: "none",
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT CATEGORY MODAL ===== */}
      {showEditModal && customCategory && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-6 pt-24"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-3xl p-6"
            style={{ maxWidth: "420px", background: "rgba(20,40,75,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-col items-center mb-5">
              <div
                className="rounded-2xl flex items-center justify-center mb-3"
                style={{ width: "120px", height: "100px", background: "rgba(255,255,255,0.06)", border: "3px solid rgba(255,255,255,0.85)" }}
              >
                <CustomCategoryIcon />
              </div>
              <h2 className="text-white font-extrabold" style={{ fontSize: "22px", fontFamily: FONT }}>
                {customCategory.name}
              </h2>
            </div>

            {/* Add word row */}
            <div className="flex items-center gap-2 mb-2">
              <input
                value={newWordInput}
                onChange={(e) => setNewWordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
                placeholder="Add a new item..."
                className="flex-1 rounded-xl px-4 py-3 text-white outline-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontFamily: FONT,
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleAddWord}
                disabled={!newWordInput.trim()}
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(59,130,246,0.2)", border: "1.5px solid #3b82f6", opacity: newWordInput.trim() ? 1 : 0.5 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#60a5fa" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="text-white text-center mb-3" style={{ fontSize: "13px", opacity: 0.6, fontFamily: FONT }}>
              Total words: {customCategory.words.length}
            </p>

            {/* Word list */}
            <div
              className="rounded-2xl mb-5 overflow-hidden"
              style={{ background: "rgba(10,20,40,0.6)", maxHeight: "240px", overflowY: "auto" }}
            >
              {customCategory.words.length === 0 ? (
                <p className="text-white text-center py-6" style={{ fontSize: "13px", opacity: 0.5, fontFamily: FONT }}>
                  No words yet — add some above
                </p>
              ) : (
                customCategory.words.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: idx < customCategory.words.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                  >
                    <span className="text-white" style={{ fontSize: "15px", fontFamily: FONT }}>
                      {w}
                    </span>
                    <button onClick={() => handleRemoveWord(idx)} className="w-7 h-7 flex items-center justify-center">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M18 6L6 18" stroke="rgba(255,100,100,0.85)" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Delete category / Done */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                style={{ border: "2px solid #ef4444", color: "#ef4444", background: "rgba(239,68,68,0.08)", fontFamily: FONT }}
              >
                <TrashIcon />
                Delete Category
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", fontFamily: FONT, border: "none" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {showDeleteConfirm && customCategory && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-3xl p-6 flex flex-col items-center text-center"
            style={{ maxWidth: "360px", background: "rgba(20,20,30,0.98)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <span
              className="rounded-full flex items-center justify-center mb-4"
              style={{ width: "56px", height: "56px", background: "rgba(239,68,68,0.15)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7m2 0v13a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 20V7h10zM10 11v6M14 11v6"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="text-white font-bold mb-2" style={{ fontSize: "18px", fontFamily: FONT }}>
              Delete "{customCategory.name}"?
            </h2>
            <p className="text-white mb-6" style={{ fontSize: "14px", opacity: 0.65, fontFamily: FONT }}>
              This will permanently remove this category and all {customCategory.words.length} of its words. This can't be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ border: "1.5px solid rgba(255,255,255,0.2)", fontFamily: FONT }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomCategory}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)", fontFamily: FONT, border: "none" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
