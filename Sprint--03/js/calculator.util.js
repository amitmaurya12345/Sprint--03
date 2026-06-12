// ========== Battle Calculator Module ==========
const BattleCalculator = (function() {
  function calculateTotalStars(repos) {
    return repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
  }
  
  function determineWinner(player1Data, player2Data, stars1, stars2) {
    if (stars1 >= stars2) {
      return {
        winner: player1Data,
        loser: player2Data,
        winnerStars: stars1,
        loserStars: stars2
      };
    }
    return {
      winner: player2Data,
      loser: player1Data,
      winnerStars: stars2,
      loserStars: stars1
    };
  }
  
  function isDraw(stars1, stars2) {
    return stars1 === stars2;
  }
  
  return { calculateTotalStars, determineWinner, isDraw };
})();