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

import { html, define, property } from '/hybrids.js';

function toggleDetailedView(host) {
  host.showDetailedView = !host.showDetailedView;
}

const IS_SIMPLE_VIEW_DEFAULT = true;

define({
  tag: "panel-body",
  settings: null,
  stats: null,
  domain: '',
  showDetailedView: {
    get: (_host, value) => {
      if (typeof value === "undefined") {
        return !IS_SIMPLE_VIEW_DEFAULT;
      }
      return value;
    },
    set: (host, value) => {
      if (value) {
        const simpleView = host.querySelector('simple-view');
        const detailedView = host.querySelector('detailed-view');
        detailedView.style.width = `${simpleView.clientWidth}px`;
        detailedView.style.height = `${simpleView.clientHeight}px`;
      }
      return value;
    }
  },
  content: ({ domain, settings, stats, showDetailedView}) => html`
    <simple-view
      domain=${domain}
      settings=${settings}
      stats=${stats}
      style=${{
        display: showDetailedView ? 'none' : 'block',
      }}
      ontoggle-detailed-view="${toggleDetailedView}"
    ></simple-view>
    <detailed-view
      stats=${stats}
      style=${{
        display: !showDetailedView ? 'none' : 'block',
      }}
      ontoggle-detailed-view="${toggleDetailedView}"
    ></detailed-view>
  `,
});
