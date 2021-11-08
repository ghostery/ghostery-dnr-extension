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

// TODO: This is incomplete. While it prevents the normal "ping" tracking
// request, stopping the Beacon tracking ("https://www.google.com/gen_204"
// requests) is the real challenge.
//
// Monkey patching the browser API seems to be the only solution.
// At least, it has been demonstrated to work, for instance:
// https://github.com/Rob--W/dont-track-me-google/blob/abffd08f6e0d6eacd42b3ff0ccda1b6838788949/contentscript.js#L336
function safeLinkClick(event) {
  const link = findTopLink(event.target);
  if (!link) {
    return;
  }

  link.removeAttribute('ping');
  event.stopImmediatePropagation();

  window.location = link.href;
}

document.addEventListener('click', safeLinkClick, true);
//document.addEventListener('mousedown', safeLinkClick, true);
//document.addEventListener('touchstart', safeLinkClick, true);
