Refactor my GitHub battle app into modular files:
- Split into 7 separate JS files:
  * api.service.js (all fetch calls with timeouts)
  * formatter.util.js (dates, stars, HTML escape)
  * calculator.util.js (battle math logic)
  * renderer.ui.js (all HTML generation)
  * storage.service.js (localStorage cache)
  * app.controller.js (main logic)
  * main.js (event listeners only)
- Add 5-minute cache with localStorage
- Add background refresh on cached data
- Add 8-10 second timeout on all API calls
- Update HTML to load all 7 scripts in correct order
