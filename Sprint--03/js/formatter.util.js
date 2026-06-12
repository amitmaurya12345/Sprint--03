// ========== Data Formatter Module ==========
const DataFormatter = (function() {
  function formatDate(isoString) {
    if (!isoString) return 'Unknown';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Unknown';
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch {
      return 'Unknown';
    }
  }
  
  function formatJoinDate(isoString) {
    const formattedDate = formatDate(isoString);
    return formattedDate !== 'Unknown' ? `Joined ${formattedDate}` : 'Unknown';
  }
  
  function formatStars(count) {
    return count.toLocaleString();
  }
  
  function formatRepositoryCount(count) {
    return `📦 ${count} ${count === 1 ? 'repository' : 'repositories'}`;
  }
  
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  function getUserDisplayName(userData) {
    return (userData.name && userData.name.trim() !== '') ? userData.name : userData.login;
  }
  
  return {
    formatDate,
    formatJoinDate,
    formatStars,
    formatRepositoryCount,
    escapeHTML,
    getUserDisplayName
  };
})();