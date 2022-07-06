import { store } from 'hybrids';

import Options, { DNR_RULES_LIST } from '/store/options.js';

export default {
  protection: false,
  terms: store.value(false, (val, _, { protection }) => val || !protection),
  [store.connect]: {
    get: () => ({}),
    set: async (id, values) => {
      await store.set(Options, {
        dnrRules: DNR_RULES_LIST.reduce(
          (all, rule) => ({ ...all, [rule]: values.protection }),
          {},
        ),
        onboarding: true,
      });

      return values;
    },
  },
};
