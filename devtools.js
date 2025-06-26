let retrievalInterval;
let metricsInterval;
let retrieving = false;

function tryGetGame() {
  const code = `(() => {
    const controlPanel = document.querySelector('control-panel');
    if (controlPanel && controlPanel.game && controlPanel.eventBus) {
      console.log('Retrieved game object:', controlPanel.game);
      console.log('Retrieved event bus:', controlPanel.eventBus);
      window.controlPanel = controlPanel;
      window.game = controlPanel.game;
      window.bus = controlPanel.eventBus;
      window.playerActions = window.playerActions || {}
      return true;
    }
    return false;
  })()`;

  chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
    if (!isException && result) {
      clearInterval(retrievalInterval);
      retrieving = false;
      startMetrics();
      findAttackEvent();
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
    try {
      const player = window.game._myPlayer

      const pop = player.population().toString();
      const troops = player.troops().toString();
      const workers = player.workers().toString();
      const cap = Math.round(window.game.config().maxPopulation(player)).toString();
      const gold = player.gold().toString();
      const tiles = player.data?.tilesOwned.toString();
      const tick = window.game.ticks().toString();

      return { pop, troops, workers, cap, gold, tiles, tick };
    } catch (err) {
      return { error: err.message || 'Unknown error in eval code' };
    }
  })()`;

  chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
    if (isException || result?.error) {
      console.error("sendMetrics: Failed to retrieve metrics.", result?.error || isException);
      chrome.runtime.sendMessage({
        type: 'metrics-error',
        error: result?.error || 'Unknown error',
        tabId: chrome.devtools.inspectedWindow.tabId
      });
      return;
    }

    chrome.runtime.sendMessage({
      type: 'metrics-update',
      pop: result.pop,
      troops: result.troops,
      workers: result.workers,
      cap: result.cap,
      gold: result.gold,
      tiles: result.tiles,
      tick: result.tick,
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  });
}

function startMetrics() {
  if (metricsInterval) return;
  sendMetrics();
  metricsInterval = setInterval(sendMetrics, 100);
}

function findAttackEvent() {
  const code = `(() => {
    for (const [key, value] of window.bus.listeners.entries()) {
      if (value.toString().includes("SendAttackIntent")) {
          window.playerActions.AttackEvent = key;
          console.log("FOUND ATTACK EVENT CONSTRUCTOR ON EVENTBUS:",key);
          break;
      }
    }
  })()`;

  chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
    if (!isException) {
      console.log("FOUND ATTACK EVENT CONSTRUCTOR ON EVENTBUS")
    }
  });
}

function sendAttackEvent(targetID, troops) {
  const code = `(() => {
    if (window.playerActions.AttackEvent) {
      const adjTroops = (${JSON.stringify(troops)} !== null)
        ? ${JSON.stringify(troops)}
        : (window.controlPanel?.attackRatio * window.controlPanel?._troops);
      const evt = new window.playerActions.AttackEvent(${JSON.stringify(targetID)}, adjTroops);
      window.bus.emit(evt);
      console.log("AttackEvent emitted with:", evt);
    } else {
      console.log("COULD NOT EMIT ATTACK EVENT:");
    }
  })()`;

  chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
    if (!isException) {
      console.log("SENT ATTACK EVENT - TARGET:", targetID, "TROOPS:", troops);
    }
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.type) {
    case 'retrieve-game':
      startRetrieval();
      break;
    case 'attack-free-land':
      sendAttackEvent(msg.targetID, msg.troops);
      break;
  }
});
