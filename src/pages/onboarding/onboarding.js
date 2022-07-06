import { define, html, router } from 'hybrids';
import Main from './views/main.js';

export default define({
  tag: 'gh-onboarding',
  views: router(Main),
  content: ({ views }) =>
    html`${views}`.css`
      html, body {
        height: 100%;
        background: var(--ui-color-gray-800);
      }

      gh-onboarding {
        display: grid;
        grid: 1fr / 1fr;
        min-height: 100%;
      }
    `,
});
