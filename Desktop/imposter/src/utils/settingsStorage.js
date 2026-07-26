// Shared persisted-settings keys + helpers.
// Import this from ANY screen that needs to read or write these toggles,
// so there is exactly one source of truth (localStorage), not the URL.

export const LS_SHOW_CATEGORY = "settings.showCategoryToImposter";
export const LS_SHOW_HINT = "settings.showHintToImposter";
export const LS_SHOW_IMPOSTER_COUNT = "settings.showImposterCount";
export const LS_RANDOM_IMPOSTERS = "settings.randomImposters";

export const loadBool = (key, fallback = false) => {
  const stored = localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
};

export const saveBool = (key, value) => {
  localStorage.setItem(key, String(value));
};