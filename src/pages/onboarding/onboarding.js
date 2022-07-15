import { define, html, store } from 'hybrids';
import Options, { DNR_RULES_LIST } from '/store/options';

function updateOptions() {
  store.set(Options, {
    dnrRules: DNR_RULES_LIST.reduce(
      (all, rule) => ({ ...all, [rule]: true }),
      {},
    ),
    terms: true,
  });
}

export default define({
  tag: 'gh-onboarding',
  content: () =>
    html`<ui-onboarding onsuccess="${updateOptions}"></ui-onboarding>`,
});
