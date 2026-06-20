// ========== App Controller Module ==========
const AppController = (function(api, calculator, renderer, storage) {
  let container = null;
  let battleButton = null;
  
  function init() {
    container = document.getElementById('cardContainer');
    battleButton = document.getElementById('battleButton');
    storage.clearExpiredCache();
  }
  
  async function handleSingleSearch(username) {
    if (!username) {
      container.innerHTML = renderer.renderError('missing-players', 'Please type a GitHub username to search.');
      return;
    }
    
    const cachedData = storage.getFromCache(`user_${username.toLowerCase()}`);
    if (cachedData) {
      container.innerHTML = renderer.renderSingleProfile(cachedData.user, cachedData.repos);
      fetchSingleUserInBackground(username);
      return;
    }
    
    container.innerHTML = renderer.renderLoading('single');
    
    try {
      const userData = await api.fetchUser(username);
      const repos = await api.fetchTopRepos(userData.repos_url);
      
      storage.saveToCache(`user_${username.toLowerCase()}`, { user: userData, repos: repos });
      container.innerHTML = renderer.renderSingleProfile(userData, repos);
    } catch (error) {
      let errorType = 'default';
      if (error.status === 404) errorType = 'not-found';
      else if (error.isNetworkError) errorType = 'network';
      
      container.innerHTML = renderer.renderError(errorType, error.message, username);
    }
  }
  
  async function fetchSingleUserInBackground(username) {
    try {
      const userData = await api.fetchUser(username);
      const repos = await api.fetchTopRepos(userData.repos_url);
      storage.saveToCache(`user_${username.toLowerCase()}`, { user: userData, repos: repos });
      
      if (container.innerHTML.includes(username)) {
        container.innerHTML = renderer.renderSingleProfile(userData, repos);
      }
    } catch {
      console.warn('Background update faild:',error);
    }
  }
  
  async function handleBattle(player1, player2) {
    if (!player1 || !player2) {
      container.innerHTML = renderer.renderError('missing-players');
      return;
    }
    
    if (player1.toLowerCase() === player2.toLowerCase()) {
      container.innerHTML = renderer.renderError('same-user');
      return;
    }
    
    const cached1 = storage.getFromCache(`user_${player1.toLowerCase()}`);
    const cached2 = storage.getFromCache(`user_${player2.toLowerCase()}`);
    
    if (cached1 && cached2) {
      processBattleWithData(cached1.user, cached2.user);
      fetchBattleInBackground(player1, player2);
      return;
    }
    
    container.innerHTML = renderer.renderLoading('battle');
    if (battleButton) battleButton.disabled = true;
    
    try {
      const [userData1, userData2] = await Promise.all([
        api.fetchUser(player1),
        api.fetchUser(player2)
      ]);
      
      storage.saveToCache(`user_${player1.toLowerCase()}`, { user: userData1, repos: null });
      storage.saveToCache(`user_${player2.toLowerCase()}`, { user: userData2, repos: null });
      
      await processBattleWithData(userData1, userData2);
      
    } catch (error) {
      let errorType = 'default';
      if (error.status === 404) errorType = 'not-found';
      else if (error.isNetworkError) errorType = 'network';
      
      container.innerHTML = renderer.renderError(errorType, error.message);
    } finally {
      if (battleButton) {
        battleButton.disabled = false;
        battleButton.textContent = '⚔️ Start Battle!';
      }
    }
  }
  
  async function processBattleWithData(userData1, userData2) {
    const [repos1, repos2] = await Promise.all([
      api.fetchAllRepos(userData1.repos_url),
      api.fetchAllRepos(userData2.repos_url)
    ]);
    
    const stars1 = calculator.calculateTotalStars(repos1);
    const stars2 = calculator.calculateTotalStars(repos2);
    
    const { winner, loser, winnerStars, loserStars } = calculator.determineWinner(
      userData1, userData2, stars1, stars2
    );
    
    const winnerRepos = (winner === userData1) ? repos1.length : repos2.length;
    const loserRepos = (loser === userData1) ? repos1.length : repos2.length;
    const isDrawResult = calculator.isDraw(stars1, stars2);
    
    container.innerHTML = renderer.renderBattleResults(
      winner, loser, winnerStars, loserStars, winnerRepos, loserRepos, isDrawResult
    );
  }
  
  async function fetchBattleInBackground(player1, player2) {
    try {
      const [userData1, userData2] = await Promise.all([
        api.fetchUser(player1),
        api.fetchUser(player2)
      ]);
      
      const [repos1, repos2] = await Promise.all([
        api.fetchAllRepos(userData1.repos_url),
        api.fetchAllRepos(userData2.repos_url)
      ]);
      
      storage.saveToCache(`user_${player1.toLowerCase()}`, { user: userData1, repos: repos1 });
      storage.saveToCache(`user_${player2.toLowerCase()}`, { user: userData2, repos: repos2 });
      
      const stars1 = calculator.calculateTotalStars(repos1);
      const stars2 = calculator.calculateTotalStars(repos2);
      const { winner, loser, winnerStars, loserStars } = calculator.determineWinner(
        userData1, userData2, stars1, stars2
      );
      
      container.innerHTML = renderer.renderBattleResults(
        winner, loser, winnerStars, loserStars, repos1.length, repos2.length, stars1 === stars2
      );
    } catch {
      // Silent background update fail
    }
  }
  
  return {
    init,
    handleSingleSearch,
    handleBattle
  };
})(APIService, BattleCalculator, UIRenderer, StorageService);
