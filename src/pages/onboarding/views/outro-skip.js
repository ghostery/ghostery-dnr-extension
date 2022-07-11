import { define, html } from 'hybrids';

import sleep from '../illustrations/sleep.js';

export default define({
  tag: 'gh-onboarding-outro-skip-view',
  content: () => html`
    <gh-onboarding-card>
      <div slot="illustration">${sleep}</div>
      <ui-text type="display-xl">
        You chose to skip enabling Ghostery!
      </ui-text>
      <ui-text type="body-xl">
        The Ghostery Browser Extension is installed in your browser but Ghosty
        is taking a light nap.
      </ui-text>
      <gh-onboarding-card type="highlight">
        <ui-text type="body-xl">
          You can change your mind anytime and enable Ghostery to start tracking
          the trackers for you in Ghostery settings.
        </ui-text>
      </gh-onboarding-card>
    </gh-onboarding-card>
  `,
});
