// ========== API Service Module ==========
const APIService = (function() {
  const API_BASE = 'https://api.github.com/users/';
  
  async function fetchUser(username) {
    const cleanUsername = username.trim();
    if (!cleanUsername) throw new Error('Username cannot be empty');
    
    const url = `${API_BASE}${encodeURIComponent(cleanUsername)}`;
    
    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      
      if (response.status === 404) {
        const error = new Error('User Not Found');
        error.status = 404;
        throw error;
      }
      
      if (!response.ok) {
        const error = new Error(`GitHub API error: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        const networkError = new Error('Network error - please check your connection');
        networkError.isNetworkError = true;
        throw networkError;
      }
      throw error;
    }
  }
  
  async function fetchAllRepos(reposUrl, onProgress = null) {
    const allRepos = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${reposUrl}?per_page=100&page=${page}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const repos = await response.json();
        
        if (repos.length === 0) {
          hasMore = false;
        } else {
          allRepos.push(...repos);
          if (onProgress) onProgress(allRepos.length);
          page++;
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        hasMore = false;
      }
    }
    
    return allRepos;
  }
  
  async function fetchTopRepos(reposUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`${reposUrl}?sort=created&direction=desc&per_page=5`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Failed to fetch repositories');
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        return null;
      }
      return null;
    }
  }
  
  return { fetchUser, fetchAllRepos, fetchTopRepos };
})();