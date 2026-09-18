// Service Worker for Chrome Extension (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('LocalRank Audit Extension installed.');
  // Set default panel behavior to open on action click if supported
  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'OPEN_SIDEPANEL' && sender.tab?.id) {
    if (chrome.sidePanel?.open) {
      chrome.sidePanel.open({ tabId: sender.tab.id }).catch(() => {});
    }
    sendResponse({ success: true });
  }
  return true;
});
