try {
  // The following import must be in sync with the
  // background scripts in the Safari manifest
  // (see ../xcode/Shared (Extension)/specific/manifest.json)
  importScripts('../vendor/tldts/index.umd.min.js'); // exports `tldts`
  importScripts('../vendor/@cliqz/adblocker/adblocker.umd.min.js'); // exports `adblocker`
  importScripts('../common/lodash-debounce.js');
  importScripts('./adblocker.js');
  importScripts('./storage.js');
  importScripts('./tab-stats.js');
  importScripts('../common/tracker-wheel.js');
} catch (e) {
  // on Safari those have to be imported from manifest.json
}

function getTrackerFromUrl(url) {
  try {
    const { domain } = tldts.parse(url);
    const trackerId = storage.get('tracker_domains')[domain];
    const tracker = storage.get('trackers')[trackerId];
    tracker.category = storage.get('categories')[tracker.category_id];

    // TODO: sometimes the information is missing
    const { name, description } = storage.get('companies')[trackerId] || {};
    tracker.companyName = name;
    tracker.companyDescription = description;
    return tracker;
  } catch (e) {
    return null;
  }
}

// Refreshing the tracker wheel:
// * Immediately draw it when the first data comes in
// * After that, switch to debounced mode
let updateIcon = updateIconNow;

function updateIconNow(tabId, stats) {
  console.log('called');
  (chrome.browserAction || chrome.action).setIcon({
    tabId,
    imageData: offscreenImageData(128, stats.trackers.map(t => t.category)),
  });
  resetUpdateIcon();
}

function resetUpdateIcon() {
  // effect: refresh 250ms after the last event, but force a refresh every second
  updateIcon = _.debounce((...args) => {
    updateIconNow(...args);
  }, 250, {
    maxWait: 1000,
  });
}

chrome.webNavigation.onBeforeNavigate.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0) {
    return;
  }
  const { domain } = tldts.parse(url);
  tabStats.set(tabId, { domain, trackers: [], loadTime: 0 });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  tabStats.delete(tabId);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "dnrUpdate") {
    updateAdblockerEngineStatuses();
    return;
  }

  if (sender.tab === undefined) {
    throw new Error('required "sender.tab" information is not available');
  }

  if (sender.tab.id === undefined) {
    throw new Error('required "sender.tab.id" information is not available');
  }

  if (sender.frameId === undefined) {
    throw new Error('required "sender.frameId" information is not available');
  }

  const tabId = sender.tab.id;

  if (msg.action === "updateTabStats") {
    const stats = tabStats.get(tabId);
    const urls = msg.args[0].urls;
    if (msg.args[0].loadTime && sender.frameId === 0) {
      stats.loadTime = msg.args[0].loadTime;
    }
    if (urls) {
      urls.forEach(url => {
        const tracker = getTrackerFromUrl(url);
        if (tracker) {
          stats.trackers.push(tracker);
        }
      });
    }
    tabStats.set(tabId, stats);
    updateIcon(tabId, stats);
    return;
  }

  adblockerOnMessage(msg, sender, sendResponse);
});
