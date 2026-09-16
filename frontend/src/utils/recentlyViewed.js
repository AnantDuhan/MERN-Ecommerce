const STORAGE_KEY = 'recentlyViewedProductIds';
const MAX_ITEMS = 12;

/** Returns the stored list of product ids, most-recently-viewed first. */
export const getRecentlyViewedIds = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

/** Records a product view: moves it to the front, dedupes, caps the list. */
export const recordProductView = (productId) => {
    if (!productId) return;
    try {
        const existing = getRecentlyViewedIds().filter(id => id !== productId);
        const updated = [productId, ...existing].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // localStorage unavailable (private browsing, quota, etc.) — not
        // essential to the page working, so fail silently.
    }
};
