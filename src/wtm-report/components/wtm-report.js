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

import { html, define } from '/hybrids.js';
import '../../ui/components/wtm-stats/index.js';
import { t } from '../../common/i18n.js';
import { externalLink, close } from '../../ui/icons.js';

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
        ${t('statistical_report')} ${externalLink}
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

    .svg-button {
      color: white;
      background: none;
      border: 0;
      cursor: pointer;
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
