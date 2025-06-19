let retrievalInterval;
let metricsInterval;
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
      startMetrics();
    }
  });
}

function startRetrieval() {
  if (retrieving) return;
  retrieving = true;
  tryGetGame();
  retrievalInterval = setInterval(tryGetGame, 1000);
}

function sendMetrics() {
  const code = `(() => {
    if (window.game && window.game._myPlayer && window.game._myPlayer.data) {
      return {
        pop: window.game._myPlayer.data.population,
        gold: window.game._myPlayer.data.gold
      };
    }
    return null;
  })()`;

  chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
    if (!isException && result) {
      chrome.runtime.sendMessage({
        type: 'metrics-update',
        pop: result.pop,
        gold: result.gold
      });
    }
  });
}

function startMetrics() {
  if (metricsInterval) return;
  sendMetrics();
  metricsInterval = setInterval(sendMetrics, 200);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'retrieve-game') {
    startRetrieval();
  }
});
