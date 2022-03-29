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
import { handleContentMessage } from '@cliqz/autoconsent';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const result = handleContentMessage(message, false);
  console.log(message, result);
  if (result !== null) {
    sendResponse(result);
  }
});

chrome.runtime.sendMessage({
  type: 'frame',
  url: window.location.href,
});
