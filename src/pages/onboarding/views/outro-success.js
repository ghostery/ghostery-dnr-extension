import { define, html, msg } from 'hybrids';
import protection from '../illustrations/protection.js';

const FAQ_URL = 'https://www.ghostery.com/faq';

export default define({
  tag: 'gh-onboarding-outro-success-view',
  content: () => html`
    <gh-onboarding-card>
      <div slot="illustration">${protection}</div>
      <ui-text type="display-xl"> You're all set, Ghosterian! </ui-text>
      <ui-text type="body-xl">
        Ghostery is set up to stop trackers in their tracks and protect your
        privacy while browsing!
      </ui-text>
      <gh-onboarding-card type="highlight">
        <ui-text type="body-xl"> Any questions? Anytime! </ui-text>
        <ui-text color="gray-300">
          ${msg.html`Check out <a href="${FAQ_URL}" target="_blank">FAQs</a> or drop us a line at <a href="mailto:support@ghostery.com">support@ghostery.com</a>. We'll be more than happy to talk to you!`}
        </ui-text>
      </gh-onboarding-card>
    </gh-onboarding-card>
  `,
});
