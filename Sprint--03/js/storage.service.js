// ========== Storage Service Module ==========
const StorageService = (function() {
  const STORAGE_KEY = 'github_battle_cache';
  
  function saveToCache(key, data) {
    try {
      const cache = getCache();
      cache[key] = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      // Silently fail - storage is not critical
    }
  }
  
  function getCache() {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }
  
  function getFromCache(key, maxAge = 5 * 60 * 1000) {
    try {
      const cache = getCache();
      const item = cache[key];
      
      if (item && (Date.now() - item.timestamp) < maxAge) {
        return item.data;
      }
      return null;
    } catch {
      return null;
    }
  }
  
  function clearExpiredCache() {
    try {
      const cache = getCache();
      const now = Date.now();
      let hasChanges = false;
      
      for (const key in cache) {
        if ((now - cache[key].timestamp) > 30 * 60 * 1000) {
          delete cache[key];
          hasChanges = true;
        }
      }
      
      if (hasChanges) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      }
    } catch {
      // Silent fail
    }
  }
  
  return { saveToCache, getFromCache, clearExpiredCache };
})();