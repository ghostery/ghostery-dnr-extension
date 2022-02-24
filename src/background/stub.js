// Dummy listeners are here to keep ensure background will be resumed.
// This has to be here as background/index.js is type=module which evals async
// so Safari and Chromium does not consider its listeners to be top-level
function noop() {}
chrome.runtime.onMessage.addListener(noop);
