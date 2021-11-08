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

function renderWheel(domElem, wtmStats) {
  // TODO: UI
  const span = document.createElement('span');
  span.appendChild(document.createTextNode(`<renderHook(${JSON.stringify(wtmStats)})>`));
  domElem.appendChild(span);
}

window.addEventListener('load', () => {
  const elements = [...window.document.querySelectorAll('#main div.g div.yuRUbf > a')];
  const links = elements.map(x => x.href);

  chrome.runtime.sendMessage({ action: 'queryWTMStats', links }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Could not retrieve WTM information on URLs', chrome.runtime.lastError);
      return;
    }

    elements.forEach((elem, i) => {
      if (response.wtmStats[i]) {
        renderWheel(elem, response.wtmStats[i]);
      }
    });

    console.log('Got response:', response);
  });
});
