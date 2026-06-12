// ========== Main App Entry Point ==========
(function() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('usernameInput');
  const modeToggle = document.getElementById('modeToggle');
  const modeIndicator = document.getElementById('modeIndicator');
  const singleSearchSection = document.getElementById('singleSearchSection');
  const battleSection = document.getElementById('battleSection');
  const player1Input = document.getElementById('player1Input');
  const player2Input = document.getElementById('player2Input');
  const battleButton = document.getElementById('battleButton');
  const container = document.getElementById('cardContainer');
  
  let isBattleMode = false;
  
  AppController.init();
  
  function toggleBattleMode() {
    isBattleMode = !isBattleMode;
    
    if (isBattleMode) {
      modeToggle.classList.add('active');
      modeIndicator.textContent = 'ON';
      singleSearchSection.style.display = 'none';
      battleSection.style.display = 'flex';
      container.innerHTML = UIRenderer.renderIdleState('battle');
    } else {
      modeToggle.classList.remove('active');
      modeIndicator.textContent = 'OFF';
      singleSearchSection.style.display = 'flex';
      battleSection.style.display = 'none';
      container.innerHTML = UIRenderer.renderIdleState('single');
      player1Input.value = '';
      player2Input.value = '';
    }
  }
  
  // Event Listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    AppController.handleSingleSearch(input.value.trim());
  });
  
  modeToggle.addEventListener('click', toggleBattleMode);
  
  battleButton.addEventListener('click', () => {
    AppController.handleBattle(
      player1Input.value.trim(),
      player2Input.value.trim()
    );
  });
  
  // Hint tags
  document.querySelectorAll('.hint-tag').forEach(hint => {
    hint.addEventListener('click', (e) => {
      input.value = e.target.textContent.trim();
      AppController.handleSingleSearch(input.value.trim());
    });
  });
})();