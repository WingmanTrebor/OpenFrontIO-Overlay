(function() {
  const existing = document.getElementById('ofio-overlay');
  if (existing) return; // avoid injecting twice

  const overlay = document.createElement('div');
  overlay.id = 'ofio-overlay';
  overlay.innerHTML = `
    <div id="ofio-metrics">
      <p>Health: <span id="overlay-health">--</span></p>
      <p>Score: <span id="overlay-score">--</span></p>
      <p>Level: <span id="overlay-level">--</span></p>
    </div>
    <button id="overlay-retrieve">Retrieve Game State</button>
  `;

  const gameRoot = document.querySelector('#game-container') || document.body;
  gameRoot.appendChild(overlay);

  document.getElementById('overlay-retrieve').addEventListener('click', () => {
    // Placeholder for retrieving game state
    console.log('Retrieve Game State from overlay');
  });
})();