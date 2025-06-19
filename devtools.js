let retrievalInterval;
let retrieving = false;

function tryGetGame() {
  const code = `(() => {
    const emojiTable = document.querySelector('emoji-table');
    if (emojiTable && emojiTable.game) {
      console.log('Retrieved game object:', emojiTable.game);
      window.game = emojiTable.game;
      return true;
    }
    return false;
  })()`;

  chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
    if (!isException && result) {
      clearInterval(retrievalInterval);
      retrieving = false;
    }
  });
}

function startRetrieval() {
  if (retrieving) return;
  retrieving = true;
  tryGetGame();
  retrievalInterval = setInterval(tryGetGame, 1000);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'retrieve-game') {
    startRetrieval();
  }
});
