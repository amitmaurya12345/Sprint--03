// ========== UI Renderer Module ==========
const UIRenderer = (function(formatter) {
  function renderIdleState(mode) {
    if (mode === 'battle') {
      return `
        <div class="idle-state">
          <div class="idle-icon">⚔️</div>
          <div>Enter two usernames and start the battle!</div>
        </div>
      `;
    }
    return `
      <div class="idle-state">
        <div class="idle-icon">🐙</div>
        <div>Search for a GitHub user</div>
      </div>
    `;
  }
  
  function renderLoading(loadingType) {
    if (loadingType === 'battle') {
      return `
        <div class="loading-state">
          <div class="spinner"></div>
          <span>⚔️ Battle in progress...</span>
          <span style="font-size: 0.8rem; color: #8b949e;">Fetching both profiles & calculating stars</span>
        </div>
      `;
    }
    return `
      <div class="loading-state">
        <div class="spinner"></div>
        <span>Loading profile...</span>
      </div>
    `;
  }
  
  function renderError(errorType, message, username = '') {
    const errors = {
      'missing-players': {
        icon: '⚠️',
        title: 'Missing Players',
        message: 'Please enter both GitHub usernames to battle!'
      },
      'same-user': {
        icon: '🤦',
        title: 'Same User!',
        message: 'You can\'t battle the same user against themselves!'
      },
      'not-found': {
        icon: '🚫',
        title: 'User Not Found',
        message: username ? `"${formatter.escapeHTML(username)}" does not match any GitHub user.` : 'One or both users don\'t exist.'
      },
      'network': {
        icon: '🌐',
        title: 'Network Error',
        message: 'Please check your internet connection and try again.'
      },
      'default': {
        icon: '⚠️',
        title: 'Error',
        message: message || 'Something went wrong. Please try again.'
      }
    };
    
    const error = errors[errorType] || errors.default;
    
    return `
      <div class="error-state">
        <div class="error-icon">${error.icon}</div>
        <div class="error-title">${error.title}</div>
        <div class="error-message">${formatter.escapeHTML(error.message)}</div>
      </div>
    `;
  }
  
  function renderSingleProfile(userData, repos) {
    const displayName = formatter.getUserDisplayName(userData);
    const joinDate = formatter.formatJoinDate(userData.created_at);
    
    const profileHTML = `
      <div class="profile-card">
        <img 
          src="${formatter.escapeHTML(userData.avatar_url)}" 
          alt="${formatter.escapeHTML(displayName)}'s avatar" 
          class="avatar"
          loading="lazy"
        />
        <h2 class="user-name">${formatter.escapeHTML(displayName)}</h2>
        ${userData.bio ? `<p class="bio">${formatter.escapeHTML(userData.bio)}</p>` : ''}
        <div class="meta-info">
          <span class="join-date">📅 ${formatter.escapeHTML(joinDate)}</span>
        </div>
        <a href="${formatter.escapeHTML(userData.html_url)}" target="_blank" rel="noopener noreferrer" class="portfolio-link">
          🌐 GitHub Profile
        </a>
      </div>
    `;
    
    const reposHTML = renderReposList(repos);
    return profileHTML + reposHTML;
  }
  
  function renderReposList(repos) {
    if (!repos || repos.length === 0) {
      return `
        <div class="repos-section">
          <div class="repos-title">📦 Top Repositories</div>
          <div class="repos-empty">No public repositories found</div>
        </div>
      `;
    }
    
    const reposHTML = repos.map(repo => `
      <li class="repo-item">
        <div>
          <a href="${formatter.escapeHTML(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-link">
            📁 ${formatter.escapeHTML(repo.name)}
          </a>
          ${repo.language ? `<span class="repo-language">${formatter.escapeHTML(repo.language)}</span>` : ''}
        </div>
        <span class="repo-date">${formatter.formatDate(repo.created_at)}</span>
      </li>
    `).join('');
    
    return `
      <div class="repos-section">
        <div class="repos-title">📦 Top Repositories</div>
        <ul class="repos-list">${reposHTML}</ul>
      </div>
    `;
  }
  
  function renderBattleResults(winnerData, loserData, winnerStars, loserStars, winnerRepos, loserRepos, isDraw) {
    const winnerName = formatter.getUserDisplayName(winnerData);
    const loserName = formatter.getUserDisplayName(loserData);
    
    return `
      <div class="battle-results">
        <div class="battle-result-card winner">
          <div class="battle-result-header">
            <span class="winner-badge">${isDraw ? '🤝 TIE' : '🏆 WINNER'}</span>
          </div>
          <img src="${formatter.escapeHTML(winnerData.avatar_url)}" alt="${formatter.escapeHTML(winnerName)}" class="battle-avatar" loading="lazy" />
          <div class="battle-name">${formatter.escapeHTML(winnerName)}</div>
          <div class="stars-count">⭐ ${formatter.formatStars(winnerStars)}</div>
          <div class="battle-repos-count">${formatter.formatRepositoryCount(winnerRepos)}</div>
          <a href="${formatter.escapeHTML(winnerData.html_url)}" target="_blank" rel="noopener noreferrer" class="portfolio-link">🌐 View Profile</a>
        </div>
        
        <div style="text-align: center; font-size: 1.5rem; font-weight: 900; color: #f0883e;">⚡ VS ⚡</div>
        
        <div class="battle-result-card loser">
          <div class="battle-result-header">
            <span class="loser-badge">${isDraw ? '🤝 TIE' : '💀 LOSER'}</span>
          </div>
          <img src="${formatter.escapeHTML(loserData.avatar_url)}" alt="${formatter.escapeHTML(loserName)}" class="battle-avatar" loading="lazy" />
          <div class="battle-name">${formatter.escapeHTML(loserName)}</div>
          <div class="stars-count">⭐ ${formatter.formatStars(loserStars)}</div>
          <div class="battle-repos-count">${formatter.formatRepositoryCount(loserRepos)}</div>
          <a href="${formatter.escapeHTML(loserData.html_url)}" target="_blank" rel="noopener noreferrer" class="portfolio-link">🌐 View Profile</a>
        </div>
        
        <div style="text-align: center; padding: 0.8rem; background: #161b22; border-radius: 0.8rem; border: 1px solid #30363d;">
          <span style="color: #c9d1d9; font-size: 0.9rem;">
            ⭐ Difference: <strong style="color: #f0883e;">${formatter.formatStars(Math.abs(winnerStars - loserStars))} stars</strong>
          </span>
        </div>
      </div>
    `;
  }
  
  return {
    renderIdleState,
    renderLoading,
    renderError,
    renderSingleProfile,
    renderBattleResults
  };
})(DataFormatter);