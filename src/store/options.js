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

export const DNR_RULES_LIST = chrome.runtime
  .getManifest()
  .declarative_net_request.rule_resources.map((r) => r.id);

const UPDATE_OPTIONS_ACTION_NAME = 'updateOptions';

const Options = {
  dnrRules: DNR_RULES_LIST.reduce(
    (all, rule) => ({ ...all, [rule]: true }),
    {},
  ),
  trackerWheelDisabled: false,
  wtmSerpReport: true,
  version: '',
  [store.connect]: {
    async get() {
      const { options = {} } = await chrome.storage.local.get(['options']);
      return options;
    },
    async set(_, options) {
      await chrome.storage.local.set({ options });

      // Send update message to another contexts (background page / panel / options)
      await chrome.runtime.sendMessage({
        action: UPDATE_OPTIONS_ACTION_NAME,
        options,
      });

      return options;
    },
    async observe(id, options) {
      // Ensure that DNR rulesets are equal to those from options.
      // eg. when web extension updates, the rulesets are reset
      // to the value from the manifest.

      const enabledRulesetIds =
        await chrome.declarativeNetRequest.getEnabledRulesets();

      const enableRulesetIds = [];
      const disableRulesetIds = [];

      DNR_RULES_LIST.forEach((rule) => {
        const enabled = options.dnrRules[rule];
        if (enabledRulesetIds.includes(rule) !== enabled) {
          (enabled ? enableRulesetIds : disableRulesetIds).push(rule);
        }
      });

      if (enableRulesetIds.length || disableRulesetIds.length) {
        chrome.declarativeNetRequest.updateEnabledRulesets({
          enableRulesetIds,
          disableRulesetIds,
        });
      }
    },
  },
};

export default Options;

const observers = new Set();
export async function observe(property, fn) {
  let value;
  const wrapperFn = (options) => {
    if (value === undefined || options[property] !== value) {
      value = options[property];
      fn(value);
    }
  };

  observers.add(wrapperFn);

  // Run for the first time with the current options
  const options = await store.resolve(store.get(Options));
  wrapperFn(options);

  // Return unobserve function
  return () => {
    observers.delete(wrapperFn);
  };
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === UPDATE_OPTIONS_ACTION_NAME) {
    const options = store.get(Options);

    if (!store.pending(options)) {
      store.clear(options, false);
      store.get(Options);
    }

    observers.forEach((observer) => observer(msg.options));
  }

  return false;
});
