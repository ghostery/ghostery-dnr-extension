import { define, html, router } from 'hybrids';

const PRIVACY_POLICY_URL =
  'https://ghostery.com/privacy/ghostery-plans-and-products-privacy-policy';

function scrollToAnchor(host, event) {
  let anchor = event.target;
  while (anchor && !anchor.href) {
    anchor = anchor.parentElement;
  }

  if (anchor && anchor.host === window.location.host && anchor.hash) {
    event.preventDefault();
    event.stopPropagation();

    const target = host.shadowRoot.getElementById(anchor.hash.substr(1));
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export default define({
  [router.connect]: { dialog: true },
  tag: 'gh-onboarding-privacy-dialog',
  policy: () =>
    fetch(`${PRIVACY_POLICY_URL}?embed=true`).then((res) => {
      if (res.ok) return res.text();
      throw new Error('Failed to load privacy policy');
    }),
  render: ({ policy }) =>
    html`
      <gh-onboarding-dialog>
        <ui-text slot="header" type="headline-m" color="white">
          Ghostery Privacy Policy
        </ui-text>
        <ui-text type="label-m" color="white">
          We are dedicated to your privacy.
        </ui-text>
        <ui-text type="body-s">
          Transparency is the pillar upon which Ghostery is built. We tell you
          as often as we can what information we collect, why we collect it, and
          how we use that information. This is an ongoing, never-ending effort
          and striking the right balance between comprehensiveness and
          simplicity requires constant review and communication.
        </ui-text>
        <ui-text type="body-s">
          We only collect personal data about you if you complete and submit a
          form where you provide that information and request something from us
          or create an account. For more information on what information we
          collect and how we use it, read our privacy statements that can be
          found below.
        </ui-text>
        <ui-text type="body-s">
          Contact us at
          <a href="mailto:privacy@ghostery.com" translate="no">
            privacy@ghostery.com
          </a>
        </ui-text>
        <div>
          ${html.resolve(
            policy
              .then(
                (policy) =>
                  html`<div
                    id="policy"
                    onclick="${scrollToAnchor}"
                    innerHTML="${policy}"
                  ></div>`,
              )
              .catch(
                () =>
                  html`<ui-text type="body-s">Full text of the privacy policy is available at: <a href="${PRIVACY_POLICY_URL}" target="_blank">${PRIVACY_POLICY_URL}</a></div>`,
              ),
          )}
        </div>
        <gh-onboarding-button slot="footer">
          <a href="${router.backUrl()}">Done</a>
        </gh-onboarding-button>
      </gh-onboarding-dialog>
    `.css`
      :host { color: var(--ui-color-gray-300); }

      #policy { min-height: 100vh; }
      #policy h3, #policy .side-menu .cap { font: var(--ui-font-headline-s); font-weight: 400; color: var(--ui-color-white); margin: 16px 0; }
      #policy .side-menu .cap { font: var(--ui-font-headline-m); }
      #policy ul { list-style: none; padding: 0; margin: 16px 0; }
      #policy ul li { font: var(--ui-font-body-s); margin: 0; }
      #policy ul li a { text-decoration: none }
      #policy p { font: var(--ui-font-body-s); margin: 16px 0; }
      #policy a { color: var(--ui-color-white); }

      #policy .breadcrumb, #policy h2, #policy ul li.child { display: none }
    `,
});
