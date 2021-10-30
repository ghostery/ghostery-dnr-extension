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

import { html, define, store } from '/hybrids.js';
import Stats from '../store/stats.js';
import Settings from '../store/settings.js';

define({
  tag: "ghostery-panel",
  settings: store(Settings),
  stats: store(Stats),
  content: ({ stats, settings }) => html`
    <panel-header domain=${store.ready(stats) ? stats.domain : ''}></panel-header>
    <panel-body
      stats=${stats}
      settings=${settings}
    ></panel-body>
    <panel-footer></panel-footer>
  `,
});
