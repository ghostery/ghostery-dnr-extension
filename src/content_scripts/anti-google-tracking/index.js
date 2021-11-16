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

function findTopLink(elem) {
  while (elem && !elem.href) {
    elem = elem.parentElement;
  }
  return elem;
}

function safeLinkClick(event) {
  const link = findTopLink(event.target);
  if (!link) {
    return;
  }

  link.removeAttribute('ping');
  link.removeAttribute('onmousedown');
  event.stopImmediatePropagation();

  try {
    const directUrl = new URL(link.href).searchParams.get('url');
    if (directUrl) {
      window.location = directUrl;
    }
  } catch (e) {
    console.error(e);
  }
}

function linkCleaner(event) {
    const link = findTopLink(event.target);
    if (!link) {
      return;
    }

    link.removeAttribute('ping');
    try {
      const directUrl = new URL(link.href).searchParams.get('url');
      if (directUrl) {
        console.debug('linkCleaner changed:', link.href, '->', directUrl);
        link.href = directUrl;
      }
    } catch (e) {
      console.error(e);
    }
}

// Break out of the "isolated world" provided by the content script
// (https://developer.chrome.com/docs/extensions/mv3/content_scripts/#isolated_world).
//
// This implementation is compatible with Manifest V3. It has been adopted
// from https://stackoverflow.com/a/9517879/783510. Depending on the browser,
// The code needs to be shipped as part of the extension in a separate script,
// which must be listed in the manifest in the "web_accessible_resources" section.
function runScriptInHostPage(scriptName) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(scriptName);
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

function preventBeaconBasedTracking() {
  if (chrome.runtime.getManifest().manifest_version == 2) {
    // Compatibility with Manifest V2 (relevant for Safari):
    const script = document.createElement('script');
    script.textContent = '(' + patchBeaconApi + ')()';
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } else {
    runScriptInHostPage('content_scripts/anti-google-tracking/prevent-beacon-api-tracking.js');
  }
}

preventBeaconBasedTracking();
document.addEventListener('click', safeLinkClick, true);
document.addEventListener('onmousedown', linkCleaner, true);
document.addEventListener('touchstart', linkCleaner, true);
