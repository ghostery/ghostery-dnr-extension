import { define, html, router } from 'hybrids';

export default define({
  [router.connect]: { dialog: true },
  tag: 'gh-onboarding-privacy-dialog',
  content: () =>
    html`
      <gh-onboarding-dialog>
        <ui-text slot="header" type="headline-m" color="white">
          WhoTracks.Me Privacy Policy
        </ui-text>
        <gh-onboarding-button slot="footer">
          <a href="${router.backUrl()}">Done</a>
        </gh-onboarding-button>
      </gh-onboarding-dialog>
    `,
});
