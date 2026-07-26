export const LS_CUSTOM_CATEGORY = "customCategory";
export const CUSTOM_CATEGORY_ID = "custom-user-category";

export const loadCustomCategory = () => {
  try {
    const stored = localStorage.getItem(LS_CUSTOM_CATEGORY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && Array.isArray(parsed.words)) return parsed;
    return null;
  } catch {
    return null;
  }
};

export const saveCustomCategory = (cat) => {
  if (cat) {
    localStorage.setItem(LS_CUSTOM_CATEGORY, JSON.stringify(cat));
  } else {
    localStorage.removeItem(LS_CUSTOM_CATEGORY);
  }
};