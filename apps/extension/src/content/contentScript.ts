import { detectBusinessFromPage } from './adapters';

// Injects the [Audit Business with LocalRank] button into the page
function injectAuditTrigger() {
  if (document.getElementById('localrank-audit-trigger-btn')) return;

  const data = detectBusinessFromPage();
  if (!data || !data.name) return;

  const container = document.createElement('div');
  container.id = 'localrank-audit-trigger-btn';
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  const button = document.createElement('button');
  button.innerHTML = `
    <span style="display:flex; align-items:center; gap:8px; font-weight:700; font-size:13px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 11 3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      Audit Business with LocalRank
    </span>
  `;
  button.style.cssText = `
    background: #4f46e5;
    color: #ffffff;
    border: none;
    border-radius: 9999px;
    padding: 10px 18px;
    cursor: pointer;
    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
    transition: all 0.2s ease;
  `;

  button.onmouseenter = () => (button.style.background = '#4338ca');
  button.onmouseleave = () => (button.style.background = '#4f46e5');

  button.onclick = () => {
    // Store detected business in chrome.storage and request sidepanel open
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ detectedBusiness: data }, () => {
        chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL', data });
      });
    } else {
      window.open(`http://localhost:3000/audits?name=${encodeURIComponent(data.name)}`, '_blank');
    }
  };

  container.appendChild(button);
  document.body.appendChild(container);
}

// Observe DOM updates for dynamic Maps and Search navigation
const observer = new MutationObserver(() => {
  injectAuditTrigger();
});

observer.observe(document.body, { childList: true, subtree: true });
setTimeout(injectAuditTrigger, 1500);

// Message listener for popup/background queries
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'GET_DETECTED_BUSINESS') {
      const data = detectBusinessFromPage();
      sendResponse({ data });
    }
  });
}
