/**
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2017-present Ghostery GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

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
  importScripts('./wtm-report.js');
  importScripts('../common/wtm-tracker-wheel.js');
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


let options = {};

async function updateOptions() {
  const storage = await chrome.storage.local.get(['options']);
  options = storage.options || {};
}

updateOptions();

// Refreshing the tracker wheel:
// * Immediately draw it when the first data comes in
// * After that, switch to debounced mode
//
// "immediate mode" will also be reentered after navigation events.
let updateIcon = updateIconNow;

function updateIconNow(tabId, stats) {
  const categories = stats.trackers.map(t => t.category);
  const imageData = WTMTrackerWheel.offscreenImageData(128, categories);
  (chrome.browserAction || chrome.action).setIcon({
    tabId,
    imageData,
  });
  resetUpdateIconDebounceMode();
}

function resetUpdateIconImmediateMode() {
  if (updateIcon && updateIcon.cancel) {
    updateIcon.cancel();
  }
  updateIcon = updateIconNow;
}

function resetUpdateIconDebounceMode() {
  if (updateIcon && updateIcon.cancel) {
    updateIcon.cancel();
  }

  // effect: refresh 250ms after the last event, but force a refresh every second
  updateIcon = _.debounce((...args) => {
    updateIconNow(...args);
  }, 250, {
    maxWait: 1000,
  });
}

// When a navigation event happens, we need to reset the tracker stats.
// In contrast, we do not reset the stats for redirects.
chrome.webNavigation.onBeforeNavigate.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0) {
    return;
  }
  console.debug('Navigated to', url);
  const { domain } = tldts.parse(url);
  tabStats.set({ tabId, url }, { domain, trackers: [], loadTime: 0 });
  resetUpdateIconImmediateMode();
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Implementation detail: the API does not provide us the URL
  // of the closed tab. Fortunately, we map only the tabId while
  // the url is only used for the checksum. As we only use the
  // checksum for read operations, we can pass any non-undefined
  // value for the url.
  tabStats.delete({ tabId, url: null });
});

// We have to keep track of redirects, as otherwise the logic
// to match stats by tabId+URL would break once the URL changes.
// That is why we need to migrate the stats after each redirect
// to avoid checksum errors.
chrome.webRequest.onBeforeRedirect.addListener(({ tabId, frameId, url, redirectUrl }) => {
  if (frameId !== 0) {
    return;
  }
  console.debug('onBeforeRedirect:', url, '->', redirectUrl, ' in tabId:', tabId);
  const oldResults = tabStats.get({ tabId, url });
  if (oldResults) {
    tabStats.set({ tabId, url: redirectUrl }, oldResults);
  }
}, { urls: ['<all_urls>'], types: ['main_frame'] });

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "dnrUpdate") {
    updateAdblockerEngineStatuses();
    return false;
  }
  if (msg.action === "getTabStats") {
    const { tabId, url } = msg.args;
    const stats = tabStats.get({ tabId, url });
    sendResponse(stats);
    return false;
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

  if (msg.action === "updateOptions") {
    updateOptions();
    return false;
  }

  if (msg.action === "updateCurrentTabStats") {
    const stats = tabStats.get({ tabId, url: sender.url });
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
    tabStats.set({ tabId, url: sender.url }, stats);

    if (!options.trackerWheelDisabled) {
      // TODO: tracker stats can be empty (e.g. https://www.whotracks.me/).
      // If we render the icon, it will be empty. The if-guard has the
      // effect that in most cases, you will see Ghosty as the icon.
      // For the moment, that looks better then an empty icon. :-)
      if (stats.trackers.length > 0) {
        updateIcon(tabId, stats);
      }
    }

    return false;
  }

  if (tryWTMReportOnMessageHandler(msg, sender, sendResponse)) {
    return false;
  }

  adblockerOnMessage(msg, sender, sendResponse);
  return false;
});
