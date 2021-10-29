import { store } from '/hybrids.js';
import { rulesetIds, toggles, getRulesetType } from '../../common/rulesets.js';

const Settings = {
  blockingStatus: toggles.reduce((all, toggle) => ({ ...all, [toggle]: false }), {}),
  [store.connect] : {
    get: async () => {
      const enabledRulesetIds = await chrome.declarativeNetRequest.getEnabledRulesets();
      const enabledRulesetTypes = enabledRulesetIds.map(getRulesetType);
      const settings = {
        blockingStatus: {},
      };
      enabledRulesetTypes.forEach(type => {
        settings.blockingStatus[type] = true;
      });
      return settings;
    },
    set: (_, settings) => settings,
  },
};

export async function toggleBlocking(type) {
  const settings = store.get(Settings);
  const rulesetId = rulesetIds.find(r => r.startsWith(type));
  const currentStatus = settings.blockingStatus[type];

  store.set(Settings, {
    ...settings,
    blockingStatus: {
      ...settings.blockingStatus,
      [type]: !currentStatus
    }
  });

  await chrome.declarativeNetRequest.updateEnabledRulesets({
    [currentStatus ? 'disableRulesetIds' : 'enableRulesetIds']: [rulesetId],
  });
  await chrome.runtime.sendMessage({ action: 'dnrUpdate' });
}

export default Settings;