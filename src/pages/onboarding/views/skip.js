import { define, html, store, router } from 'hybrids';

import Form from '../store/form.js';

async function submit(host, event) {
  event.preventDefault();

  await store.submit(host.form);
  window.close();
}

export default define({
  [router.connect]: { dialog: true },
  tag: 'gh-onboarding-skip-dialog',
  form: store(Form, { draft: true }),
  content: () =>
    html`
      <gh-onboarding-dialog>
        <ui-text slot="header" type="headline-m" color="white">
          Are you sure you want to skip enabling Ghostery?
        </ui-text>
        <ui-text type="body-s">
          Ghostery is stopping trackers in their tracks and preventing you from
          being profiled and your personal information sold to data brokers for
          their own profit.
        </ui-text>
        <ui-text type="body-s">
          With Ghostery enabled you instantly browser the web safer, faster and
          with less annoying ads.
        </ui-text>
        <gh-onboarding-button type="outline" slot="footer">
          <a href="${router.backUrl()}">Back</a>
        </gh-onboarding-button>
        <gh-onboarding-button type="outline" slot="footer">
          <button onclick="${submit}">Continue</button>
        </gh-onboarding-button>
      </gh-onboarding-dialog>
    `,
});
