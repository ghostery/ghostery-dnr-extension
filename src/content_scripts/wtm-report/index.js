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

function closePopups() {
  [...document.querySelectorAll('.wtm-popup-iframe')].forEach(popup => {
    popup.parentElement.removeChild(popup);
  });
}

function renderPopup(container, stats) {
  closePopups()

  const iframe = document.createElement('iframe');
  iframe.classList.add('wtm-popup-iframe');
  iframe.setAttribute('src', chrome.runtime.getURL(`wtm-report/index.html?domain=${stats.domain}`));

  container.appendChild(iframe);
}

function renderWheel(anchor, stats) {
  const parent = anchor.parentElement;
  parent.style.position = 'relative';
  const threeDotsElement = parent.querySelector('div[jsslot] div[aria-haspopup]');

  const container = document.createElement('div');
  container.classList.add('wtm-tracker-wheel-container');
  container.style.left = threeDotsElement.getBoundingClientRect().right - parent.getBoundingClientRect().left + 'px';
  container.addEventListener('click', (ev) => {
    renderPopup(container, stats);
    ev.preventDefault();
    return false;
  });

  const label = document.createElement('label');
  label.innerText = stats.length;

  const canvas = document.createElement('canvas');
  canvas.classList.add('wtm-tracker-wheel');
  canvas.setAttribute('width', '22px');
  canvas.setAttribute('height', '22px');
  const ctx = canvas.getContext('2d');
  WTMTrackerWheel.draw(ctx, stats);

  container.appendChild(canvas);
  container.appendChild(label);
  parent.appendChild(container);
}

const elements = [...window.document.querySelectorAll('#main div.g div.yuRUbf > a')];
const links = elements.map(x => x.href);

chrome.runtime.sendMessage({ action: 'getWTMReport', links }, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Could not retrieve WTM information on URLs', chrome.runtime.lastError);
    return;
  }

  elements.forEach((elem, i) => {
    if (response.wtmStats[i]) {
      renderWheel(elem, response.wtmStats[i].stats);
    }
  });
});

window.addEventListener('message', (message) => {
  if (message.origin + '/' !== chrome.runtime.getURL('/')) {
    return;
  }

  if (message.data === 'WTMReportClosePopups') {
    closePopups();
    return;
  }
});
