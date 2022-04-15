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

import { store } from 'hybrids';

const UPDATE_ACTION_NAME = 'updateOptions';

export function isUpdateOptionsMessage(message) {
  return message?.action === UPDATE_ACTION_NAME;
}

export const DNR_IDS = chrome.runtime
  .getManifest()
  .declarative_net_request.rule_resources.map((r) => r.id);

const Options = {
  trackerWheelDisabled: false,
  wtmSerpReport: true,
  dnr: DNR_IDS.reduce((all, rule) => ({ ...all, [rule]: false }), {}),
  [store.connect]: {
    async get() {
      const { options = {} } = await chrome.storage.local.get(['options']);

      const enabledRulesetIds =
        await chrome.declarativeNetRequest.getEnabledRulesets();

      // Not yet saved, use values from the manifest.
      if (!options.dnr) {
        options.dnr = enabledRulesetIds.reduce((dnr, type) => {
          dnr[type] = true;
          return dnr;
        }, {});
      } else {
        // Ensure that DNR rulesets are equal to those from options.
        // eg. when web extension updates, the rulesets are reset
        // to the value from the manifest.
        Object.keys(options.dnr).forEach((rule) => {
          const enabled = options.dnr[rule];
          if (enabled !== enabledRulesetIds.includes(rule)) {
            chrome.declarativeNetRequest.updateEnabledRulesets({
              [enabled ? 'enableRulesetIds' : 'disableRulesetIds']: [rule],
            });
          }
        });
      }

      return options;
    },
    async set(_, options, keys) {
      const prevOptions = await this.get();

      options = {
        ...options,
        ...Object.fromEntries(keys.map((key) => [key, options[key]])),
      };

      // Update declarativeNetRequest rulesets
      if (keys.includes('dnr')) {
        DNR_IDS.forEach((rule) => {
          const enabled = options.dnr[rule];
          if (enabled !== prevOptions.dnr[rule]) {
            chrome.declarativeNetRequest.updateEnabledRulesets({
              [enabled ? 'enableRulesetIds' : 'disableRulesetIds']: [rule],
            });
          }
        });
      }

      // Save options to the local storage
      await chrome.storage.local.set({ options });

      // Send update message to another contexts (background page / panel / options)
      chrome.runtime.sendMessage({
        action: UPDATE_ACTION_NAME,
      });

      return options;
    },
  },
};

export default Options;

chrome.runtime.onMessage.addListener((message) => {
  if (isUpdateOptionsMessage(message)) {
    store.clear(Options, false);
    store.get(Options);
  }

  return false;
});
