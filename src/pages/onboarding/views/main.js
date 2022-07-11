import { define, html, msg, router, store } from 'hybrids';

import Form from '../store/form.js';
import blockage from '../illustrations/blockage.js';

import Whotracksme from './whotracksme.js';
import Privacy from './privacy.js';
import Skip from './skip.js';
import OutroSuccess from './outro-success.js';

export async function submit(host, event) {
  router.resolve(event, store.submit(host.form));
}

export default define({
  [router.connect]: { stack: [Skip, Whotracksme, Privacy] },
  tag: 'gh-onboarding-main-view',
  form: store(Form, { draft: true }),
  render: ({ form }) => html`
    <form onsubmit="${submit}" action="${router.url(OutroSuccess)}">
      <gh-onboarding-card type="full-desktop" id="form">
        <div slot="illustration">${blockage}</div>
        <div>
          <section id="protection">
            <ui-text type="display-xl">Enable Ghostery to get started</ui-text>
            <label id="protection-input">
              <ui-text type="display-m">
                ${form.protection
                  ? html`Ghostery enabled`
                  : html`Ghostery disabled`}
              </ui-text>
              <gh-onboarding-toggle>
                <input
                  type="checkbox"
                  checked="${form.protection}"
                  onchange="${html.set(form, 'protection')}"
                />
              </gh-onboarding-toggle>
            </label>
          </section>
          <section id="info" class="${{ protection: form.protection }}">
            <div>
              <ui-icon name="tracking"></ui-icon>
              <ui-text type="headline-s">Trackers</ui-text>
              <ui-text type="display-s" class="badge">
                ${form.protection ? html`Blocked` : html`Unblocked`}
              </ui-text>
            </div>
            <div>
              <ui-icon name="ads"></ui-icon>
              <ui-text type="headline-s">Ads</ui-text>
              <ui-text type="display-s" class="badge">
                ${form.protection ? html`Blocked` : html`Unblocked`}
              </ui-text>
            </div>
            <div>
              <ui-icon name="annoyances"></ui-icon>
              <ui-text type="headline-s">All Popups</ui-text>
              <ui-text type="display-s" class="badge">
                ${form.protection ? html`Blocked` : html`Unblocked`}
              </ui-text>
            </div>
          </section>
        </div>
      </gh-onboarding-card>
      ${form.protection
        ? html`
            <gh-onboarding-card>
              <div id="accept-terms">
                <label id="terms-input">
                  <gh-onboarding-checkbox>
                    <input
                      type="checkbox"
                      checked="${form.terms}"
                      onchange="${html.set(form, 'terms')}"
                    />
                  </gh-onboarding-checkbox>

                  <ui-text type="display-m">Accept terms</ui-text>

                  <ui-text type="body-m" color="gray-300">
                    ${msg.html`I agree to send non-personal information to <a href="${router.url(
                      Whotracksme,
                    )}">WhoTracks.Me</a> and I accept the Ghostery <a href="${router.url(
                      Privacy,
                    )}">Privacy Policy</a>`}
                  </ui-text>
                </label>
                ${form.terms &&
                html`<gh-onboarding-button>
                  <button type="submit">
                    <ui-icon name="ghosty"></ui-icon> All set! go with ghosty!
                  </button>
                </gh-onboarding-button> `}
              </div>
            </gh-onboarding-card>
          `
        : html`
            <gh-onboarding-card id="skip" type="transparent">
              <gh-onboarding-button type="secondary">
                <a href="${router.url(Skip)}">Skip</a>
              </gh-onboarding-button>
            </gh-onboarding-card>
          `}
    </form>
  `.css`
    :host {
      display: grid;
      grid: 1fr / 1fr;
      flex-grow: 1;
    }

    form {
      display: flex;
      flex-flow: column;
      gap: 8px;
    }

    #form section {
      padding: 20px;
      border: 2px solid var(--ui-color-gray-800);
    }

    #protection {
      display: grid;
      gap: 16px;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
    }

    #protection-input {
      display: grid;
      align-items: center;
      grid: 1fr / 1fr min-content;
    }

    #info {
      border-top: none;
      border-radius: 0 0 8px 8px;
      background: var(--ui-color-gray-800);
    }

    #info div {
      display: grid;
      gap: 0 16px;
      grid-template-columns: max-content 1fr min-content;
      align-items: center;
      border-bottom: 1px solid var(--ui-color-gray-700);
      padding: 12px 0;
    }

    #info div:first-child {
      padding-top: 0;
    }

    #info div:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    #info .badge {
      background: var(--ui-color-error-400);
      padding: 4px;
      border-radius: 4px;
      font-size: 16px;
      line-height: 16px;
    }

    #info.protection .badge {
      background: var(--ui-color-success-500);
    }

    #skip {
      display: flex;
      justify-content: end;
    }

    #accept-terms {
      display: grid;
      gap: 24px;
    }

    #terms-input {
      display: grid;
      gap: 4px 16px;
      align-items: start;
      grid: min-content min-content / min-content 1fr;
    }

    #terms-input gh-onboarding-checkbox {
      grid-row: 1 / 3;
    }

    @media screen and (min-width: 992px) {
      #illustration {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }

      #skip {
        flex: 1;
        align-items: flex-end;
        padding: var(--gh-onboarding-layout-padding) 0 0;
      }

      #accept-terms gh-onboarding-button {
        justify-self: flex-end;
      }

      #terms-input {
        column-gap: 24px;
      }
    }
  `,
});
