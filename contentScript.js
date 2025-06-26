(async function () {
  if (document.getElementById('ofio-overlay')) return; // Don't inject twice
  let overlay;
  // Cached metric span elements
  let popSpan, troopsSpan, workersSpan, capSpan, goldSpan, tilesSpan, tickSpan;

  // Fetch the HTML
  const res = await fetch(chrome.runtime.getURL('overlay.html'));
  const html = await res.text();
  overlay = document.createElement('div');
  overlay.id = 'ofio-overlay';
  overlay.innerHTML = html;

  // Metric span references
  popSpan = overlay.querySelector('#overlay-pop');
  troopsSpan = overlay.querySelector('#overlay-troops');
  workersSpan = overlay.querySelector('#overlay-workers');
  capSpan = overlay.querySelector('#overlay-cap');
  goldSpan = overlay.querySelector('#overlay-gold');
  tilesSpan = overlay.querySelector('#overlay-tiles');
  tickSpan = overlay.querySelector('#overlay-tick');

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

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'metrics-update' && overlay) {
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