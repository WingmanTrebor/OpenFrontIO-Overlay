(function() {
  if (document.getElementById('ofio-overlay')) return; // Don't inject twice

  // Fetch the HTML
  fetch(chrome.runtime.getURL('overlay.html'))
    .then(res => res.text())
    .then(html => {
      const overlay = document.createElement('div');
      overlay.id = 'ofio-overlay';
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
        console.log('Retrieve Game State from overlay');
        const emojiTable = document.querySelector('emoji-table');
        console.log('emojiTable:', emojiTable);

        // Defensive: check for existence and property
        if (emojiTable) {
          // Log all property keys (to see if game is there)
          console.log('emojiTable keys:', Object.keys(emojiTable));
          // Try logging game property directly
          console.log('emojiTable.game:', emojiTable.game);

          window.game = emojiTable.game;
          if (window.game) {
            console.log('Game object:', window.game);
          } else {
            console.log('Could not find game object on <emoji-table>');
          }
        } else {
          console.log('Could not find <emoji-table> element.');
        }
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

})();