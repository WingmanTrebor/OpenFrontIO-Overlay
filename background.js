chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'metrics-update' && typeof msg.tabId === 'number') {
    chrome.tabs.sendMessage(msg.tabId, msg);
  }
});
