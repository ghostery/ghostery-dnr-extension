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

import { html, define, svg } from '/hybrids.js';
import '../../ui/components/wtm-stats/index.js';

const close = svg`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
`;

const domain = new URLSearchParams(window.location.search).get('domain');

const Stats = new Promise((resolve, reject) => {
  chrome.runtime.sendMessage({ action: 'getWTMReport', links: [`https://${domain}`] }, (response) => {
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError);
      return;
    }
    resolve(response.wtmStats[0]);
  });
});

function requestClose() {
  window.parent.postMessage("WTMReportClosePopups", "*");
}

define({
  tag: "wtm-report",
  domain: () => {
    return html.resolve(Stats.then(stats => stats.domain));
  },
  render: () => html`
    <header>
      <a
        target="_blank"
        href="https://www.ghostery.com"
      >
        <img src="/images/logo.svg" />
      </a>
      <span class="domain-name">
        ${html.resolve(Stats.then(stats => stats.domain))}
      </span>
      <button class="svg-button" onclick="${requestClose}">
        ${close}
      </button>
    </header>
    <main>
    ${html.resolve(Stats.then(stats => html`
      <wtm-stats categories=${stats.stats}></wtm-stats>
    `))}
    </main>

    <section class="buttons">
      ${html.resolve(Stats.then(stats => html`
      <a
        target="_blank"
        href="https://whotracks.me/websites/${stats.domain}.html"
      >
        Statistical report ›
      </a>
      `))}
    </section>
  `.css`
    :host {
      height: 100%;
      background-color: #F8F8F8;
      display: block;
      margin: 0 auto;
    }
    header {
      background: var(--ghostery);
      color: white;
      padding: 10px 0px;
    }

    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 10px;
      margin-top: 10px;
    }

    .buttons a {
      color: var(--deep-blue);
      padding: 10px 17px;
      flex: 1;
      text-align: center;
      cursor: pointer;
      text-decoration: none;
      background: #FFFFFF;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
      border-radius: 7.4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
  `,
});
