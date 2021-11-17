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

// Overwrite the sendBeacon API that the Google SERP uses to
// send tracking events ("gen_204" requests). On Chrome, blocking
// through block lists works but not on Safari.
//
// Without reliable block lists, it is not possible to prevent the
// request once it has been registered. Therefore, fallback to another
// method, start earlier and prevent the registration. Monkey patching
// the browser API works but it is crucial/ that the patching code is
// done before the page first calls the API.
//
// The technique originates from Rob Wu. The code to monkey patch
// has been taken from his "dont-track-me-google" extension (released
// unter MIT license):
// https://github.com/Rob--W/dont-track-me-google/blob/abffd08f6e0d6eacd42b3ff0ccda1b6838788949/contentscript.js#L342
//
// Note that for Manifest V3 compatibility, extracting it to a separate
// file is forced (see https://stackoverflow.com/a/9517879/783510).
function patchBeaconApi() {
  var navProto = window.Navigator.prototype;
  var navProtoSendBeacon = navProto.sendBeacon;
  if (!navProtoSendBeacon) {
      return;
  }
  var sendBeacon = Function.prototype.apply.bind(navProtoSendBeacon);

  // Blocks the following:
  //   gen_204
  //   /gen_204
  //   https://www.google.com/gen_204
  var isTrackingUrl = RegExp.prototype.test.bind(
      /^(?:(?:https?:\/\/[^\/]+)?\/)?gen_204(?:[?#]|$)/);

  navProto.sendBeacon = function(url, data) {
      if (isTrackingUrl(url)) {
        console.debug('blocked beacon request:', url);

        // Lie that the data has been transmitted to avoid fallbacks.
        return true;
      }
      return sendBeacon(this, arguments);
  };

  var CustomEvent = window.CustomEvent;
  var currentScript = document.currentScript;
  var dispatchEvent = currentScript.dispatchEvent.bind(currentScript);
  var getScriptAttribute = currentScript.getAttribute.bind(currentScript);
}

patchBeaconApi();
