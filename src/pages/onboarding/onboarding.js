import { define, html, router } from 'hybrids';

import Main from './views/main.js';
import OutroSkip from './views/outro-skip.js';
import OutroSuccess from './views/outro-success.js';

export default define({
  tag: 'gh-onboarding',
  views: router([Main, OutroSuccess, OutroSkip]),
  content: ({ views }) => html`
    <gh-onboarding-layout>${views}</gh-onboarding-layout>
  `.css`
    html, body {
      background: var(--ui-color-gray-800);
    }

    html, body, gh-onboarding, gh-onboarding-layout {
      height: 100%;
    }

    gh-onboarding {
      display: block;
    }
  `,
});
