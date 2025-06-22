(function() {
  if (document.getElementById('ofio-overlay')) return; // Don't inject twice
  let overlayEl;

  // Fetch the HTML
  fetch(chrome.runtime.getURL('overlay.html'))
    .then(res => res.text())
    .then(html => {
      const overlay = document.createElement('div');
      overlay.id = 'ofio-overlay';
      overlayEl = overlay;
      overlay.style = `
        position: fixed;
        left: 40%;
        top: 10px;
        z-index: 100;
        background: rgba(17, 24, 39, 0.6);
        padding: 0.5rem;
        border-radius: 0.5rem;
        backdrop-filter: blur(12px);
      `;
      overlay.innerHTML = html;

      overlay.className = 'flex flex-col gap-2';

      document.body.appendChild(overlay);

      // Add event listeners after injection
      overlay.querySelector('#overlay-retrieve')?.addEventListener('click', () => {
        // Ask devtools to try retrieving the game object
        chrome.runtime.sendMessage({ type: 'retrieve-game' });
        console.log("BUTTON: retrieving game state");
      });
      overlay.querySelector('#overlay-attack-free-land')?.addEventListener('click', () => {
        // Ask devtools to send an attack with a null target
        chrome.runtime.sendMessage({ type: 'attack-free-land', targetID: null, troops: null });
        console.log("BUTTON: sending free land attack");
      });


      // Tab logic after overlay injection
      const tabBtns = overlay.querySelectorAll('.ofio-tab-btn');
      const tabContents = overlay.querySelectorAll('.ofio-tab-content');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          tabContents.forEach(div => {
            div.style.display = div.id === `tab-${btn.dataset.tab}` ? '' : 'none';
          });
        });
      });


    });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'metrics-update' && overlayEl) {
      const popSpan = overlayEl.querySelector('#overlay-pop');
      const troopsSpan = overlayEl.querySelector('#overlay-troops');
      const workersSpan = overlayEl.querySelector('#overlay-workers');
      const capSpan = overlayEl.querySelector('#overlay-cap');
      const goldSpan = overlayEl.querySelector('#overlay-gold');
      const tilesSpan = overlayEl.querySelector('#overlay-tiles');
      const tickSpan = overlayEl.querySelector('#overlay-tick');
      if (popSpan) { popSpan.textContent = msg.pop; }
      if (troopsSpan) { troopsSpan.textContent = msg.troops; }
      if (workersSpan) { workersSpan.textContent = msg.workers; }
      if (capSpan) { capSpan.textContent = msg.cap; }
      if (goldSpan) { goldSpan.textContent = msg.gold; }
      if (tilesSpan) { tilesSpan.textContent = msg.tiles; }
      if (tickSpan) { tickSpan.textContent = msg.tick; }
    }
  });

})();
