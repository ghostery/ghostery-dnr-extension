import { define, html, router } from 'hybrids';

export default define({
  [router.connect]: { dialog: true },
  tag: 'gh-onboarding-whotracksme-dialog',
  content: () =>
    html`
      <gh-onboarding-dialog>
        <ui-text slot="header" type="headline-m" color="white">
          What is whotracks.me?
        </ui-text>
        <ui-text type="body-s">
          WhoTracks.me, operated by Ghostery, is the most comprehensive global
          resource on trackers, bringing transparency to web tracking.
        </ui-text>
        <ui-text type="body-s">
          It exists thanks to micro-contributions of every Ghostery user who
          chooses to send tracker information to whotracks.me. The tracker input
          enables Ghostery to provide real-time intel on trackers and protection
          to the entire Ghostery user community.
        </ui-text>
        <ui-text type="body-s">
          More information on
          <a href="https://whotracks.me" target="_blank">WhoTracks.Me</a>
        </ui-text>

        <gh-onboarding-button slot="footer">
          <a href="${router.backUrl()}">Done</a>
        </gh-onboarding-button>
      </gh-onboarding-dialog>
    `,
});
