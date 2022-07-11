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
                  html`<ui-text type="body-s">For more information read our full <a href="${PRIVACY_POLICY_URL}" target="_blank">privacy policy</a>.</div>`,
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
