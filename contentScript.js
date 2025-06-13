(function() {
  const existing = document.getElementById('ofio-overlay');
  if (existing) return; // avoid injecting twice

  const overlay = document.createElement('div');
  overlay.id = 'ofio-overlay';
  document.body.appendChild(overlay);
  fetch(chrome.runtime.getURL('overlay.html'))
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('ofio-overlay').innerHTML = data;
    });


  document.getElementById('overlay-retrieve').addEventListener('click', () => {
    // Placeholder for retrieving game state
    console.log('Retrieve Game State from overlay');
  });
})();