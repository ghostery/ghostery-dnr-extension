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
import AutoConsent from '@cliqz/autoconsent';

const config = { autoOptOut: true };

const consent = new AutoConsent(chrome, (tabId, message, options) => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, options, resolve);
  });
});

(async function loadRules() {
  const res = await fetch(
    chrome.runtime.getURL('node_modules/@cliqz/autoconsent/rules/rules.json'),
  );
  const rules = await res.json();
  Object.keys(rules.consentomatic).forEach((name) => {
    consent.addConsentomaticCMP(name, rules.consentomatic[name]);
  });
  rules.autoconsent.forEach((rule) => {
    consent.addCMP(rule);
  });
})();

chrome.webNavigation.onCommitted.addListener(
  (details) => {
    if (details.frameId === 0) {
      consent.removeTab(details.tabId);
    }
  },
  {
    url: [{ schemes: ['http', 'https'] }],
  },
);

chrome.runtime.onMessage.addListener(({ type }, sender) => {
  consent.onFrame({
    tabId: sender.tab.id,
    frameId: sender.frameId,
    url: sender.url,
  });
  if (type === 'frame' && sender.frameId === 0) {
    if (config.autoOptOut) {
      (async () => {
        const cmp = await consent.checkTab(sender.tab.id);
        await cmp.checked;

        if (cmp.getCMPName() !== null && (await cmp.isPopupOpen())) {
          await cmp.doOptOut();
        }
      })();
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  consent.tabCmps.delete(tabId);
});
