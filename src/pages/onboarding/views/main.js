import { define, html, msg, router, store } from 'hybrids';

import Form from '../store/form.js';
import blockage from '../illustrations/blockage.js';

import Whotracksme from './whotracksme.js';
import Privacy from './privacy.js';
import Skip from './skip.js';

export async function submit(host, event) {
  event.preventDefault();

  await store.submit(host.form);

  const tab = await chrome.tabs.getCurrent();
  chrome.tabs.remove([tab.id]);
}

export default define({
  [router.connect]: { stack: [Skip, Whotracksme, Privacy] },
  tag: 'gh-onboarding-main-view',
  form: store(Form, { draft: true }),
  render: ({ form }) => html`
    <header>
      <div id="welcome">
        <ui-text type="body-s">Welcome to</ui-text>
        <ui-icon name="logo-full"></ui-icon>
      </div>
      <svg
        id="slogan"
        width="117"
        height="40"
        viewBox="0 0 117 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="2" height="40" fill="white" />
        <path
          d="M13.2422 15.2969L15.0625 5.625H16.2656L16.625 7.125L14.6719 17H13.3672L13.2422 15.2969ZM12.6172 5.625L14.0859 15.3203L13.8359 17H12.3984L10.3594 5.625H12.6172ZM17.9453 15.2812L19.4062 5.625H21.6562L19.6328 17H18.1875L17.9453 15.2812ZM16.9609 5.625L18.7969 15.3516L18.6484 17H17.3438L15.3984 7.10938L15.7656 5.625H16.9609ZM29.4453 15.1094V17H24.5V15.1094H29.4453ZM25.2109 5.625V17H22.9219V5.625H25.2109ZM28.7812 10.2344V12.0703H24.5V10.2344H28.7812ZM29.4297 5.625V7.52344H24.5V5.625H29.4297ZM35.2812 5.625H37.2891L39.6094 13.4062L41.9219 5.625H43.6953L40.4609 17H38.75L35.2812 5.625ZM34.4688 5.625H36.3828L36.6797 13.125V17H34.4688V5.625ZM42.8203 5.625H44.7422V17H42.5391V13.125L42.8203 5.625ZM50.8672 7.65625L48.4219 17H46.0078L49.5625 5.625H51.0703L50.8672 7.65625ZM52.7969 17L50.3359 7.65625L50.1094 5.625H51.6406L55.2266 17H52.7969ZM52.8828 12.7578V14.6562H47.75V12.7578H52.8828ZM58.6016 5.625V17H56.3125V5.625H58.6016ZM64.25 5.625L60.5625 11.2734L58.3047 14.0859L57.8672 11.7969L59.3281 9.35938L61.4688 5.625H64.25ZM61.6094 17L59.125 11.7734L60.8047 10.2891L64.3047 17H61.6094ZM71.6953 15.1094V17H66.75V15.1094H71.6953ZM67.4609 5.625V17H65.1719V5.625H67.4609ZM71.0312 10.2344V12.0703H66.75V10.2344H71.0312ZM71.6797 5.625V7.52344H66.75V5.625H71.6797ZM14.7969 28.9922H12.4688V27.0938H14.7969C15.1198 27.0938 15.3828 27.0208 15.5859 26.875C15.7943 26.7292 15.9453 26.5286 16.0391 26.2734C16.1328 26.013 16.1797 25.7214 16.1797 25.3984C16.1797 25.0703 16.1302 24.7656 16.0312 24.4844C15.9375 24.1979 15.7891 23.9661 15.5859 23.7891C15.388 23.612 15.125 23.5234 14.7969 23.5234H13.2031V33H10.9219V21.625H14.7969C15.5625 21.625 16.2214 21.7865 16.7734 22.1094C17.3255 22.4323 17.7474 22.8776 18.0391 23.4453C18.3359 24.0078 18.4844 24.6536 18.4844 25.3828C18.4844 26.1172 18.3359 26.7552 18.0391 27.2969C17.7474 27.8333 17.3255 28.25 16.7734 28.5469C16.2214 28.8438 15.5625 28.9922 14.7969 28.9922ZM20.0234 21.625H23.6719C24.4323 21.625 25.0807 21.7552 25.6172 22.0156C26.1536 22.276 26.5651 22.6615 26.8516 23.1719C27.138 23.6823 27.2812 24.3125 27.2812 25.0625C27.2812 25.6771 27.1979 26.2031 27.0312 26.6406C26.8646 27.0729 26.6276 27.4349 26.3203 27.7266C26.013 28.013 25.6458 28.2422 25.2188 28.4141L24.5234 28.8281H21.5625L21.5547 26.9297H23.6094C23.9219 26.9297 24.1797 26.862 24.3828 26.7266C24.5911 26.5859 24.7448 26.3906 24.8438 26.1406C24.9479 25.8854 25 25.5885 25 25.25C25 24.8906 24.9531 24.5833 24.8594 24.3281C24.7708 24.0677 24.6276 23.8698 24.4297 23.7344C24.237 23.5938 23.9844 23.5234 23.6719 23.5234H22.3125V33H20.0234V21.625ZM25.1875 33L23.1016 27.9297L25.5 27.9219L27.6328 32.8906V33H25.1875ZM31.25 21.625V33H28.9766V21.625H31.25ZM36.7422 30.5703L38.8984 21.625H41.3672L38.0703 33H36.4062L36.7422 30.5703ZM34.8984 21.625L37.0469 30.5703L37.3984 33H35.7266L32.4531 21.625H34.8984ZM45.9766 23.6562L43.5312 33H41.1172L44.6719 21.625H46.1797L45.9766 23.6562ZM47.9062 33L45.4453 23.6562L45.2188 21.625H46.75L50.3359 33H47.9062ZM47.9922 28.7578V30.6562H42.8594V28.7578H47.9922ZM56.6719 29.2109H58.9453C58.9141 30.0651 58.7422 30.7865 58.4297 31.375C58.1172 31.9583 57.6719 32.401 57.0938 32.7031C56.5208 33.0052 55.8281 33.1562 55.0156 33.1562C54.3854 33.1562 53.8255 33.0521 53.3359 32.8438C52.8464 32.6302 52.4297 32.3177 52.0859 31.9062C51.7422 31.4948 51.4818 30.987 51.3047 30.3828C51.1328 29.7734 51.0469 29.0729 51.0469 28.2812V26.3516C51.0469 25.5599 51.138 24.8594 51.3203 24.25C51.5078 23.6406 51.7734 23.1302 52.1172 22.7188C52.4661 22.3021 52.8854 21.9896 53.375 21.7812C53.8698 21.5677 54.4271 21.4609 55.0469 21.4609C55.875 21.4609 56.5677 21.6172 57.125 21.9297C57.6823 22.2422 58.112 22.6979 58.4141 23.2969C58.7214 23.8906 58.9062 24.6172 58.9688 25.4766H56.6875C56.6719 24.9349 56.6094 24.5104 56.5 24.2031C56.3958 23.8906 56.2292 23.6719 56 23.5469C55.7708 23.4167 55.4531 23.3516 55.0469 23.3516C54.7448 23.3516 54.4844 23.4062 54.2656 23.5156C54.0469 23.6198 53.8672 23.7891 53.7266 24.0234C53.5859 24.2578 53.4818 24.5651 53.4141 24.9453C53.3516 25.3255 53.3203 25.7891 53.3203 26.3359V28.2812C53.3203 28.8177 53.349 29.276 53.4062 29.6562C53.4635 30.0312 53.5547 30.3385 53.6797 30.5781C53.8047 30.8177 53.974 30.9922 54.1875 31.1016C54.4062 31.2109 54.6823 31.2656 55.0156 31.2656C55.401 31.2656 55.7109 31.2083 55.9453 31.0938C56.1849 30.9792 56.362 30.7734 56.4766 30.4766C56.5911 30.1797 56.6562 29.7578 56.6719 29.2109ZM62.0625 21.625L63.7969 26.75L65.5156 21.625H68.0078L64.9453 28.8672V33H62.6406V28.8672L59.5781 21.625H62.0625ZM79.2734 31.1094V33H74.3281V31.1094H79.2734ZM75.0391 21.625V33H72.75V21.625H75.0391ZM78.6094 26.2344V28.0703H74.3281V26.2344H78.6094ZM79.2578 21.625V23.5234H74.3281V21.625H79.2578ZM84.7266 23.6562L82.2812 33H79.8672L83.4219 21.625H84.9297L84.7266 23.6562ZM86.6562 33L84.1953 23.6562L83.9688 21.625H85.5L89.0859 33H86.6562ZM86.7422 28.7578V30.6562H81.6094V28.7578H86.7422ZM94.9844 30.0078C94.9844 29.8047 94.9661 29.6198 94.9297 29.4531C94.8932 29.2865 94.8151 29.1328 94.6953 28.9922C94.5807 28.8516 94.4115 28.7109 94.1875 28.5703C93.9688 28.4297 93.6823 28.2839 93.3281 28.1328C92.9062 27.9557 92.4974 27.7682 92.1016 27.5703C91.7057 27.3672 91.349 27.1328 91.0312 26.8672C90.7135 26.6016 90.4609 26.2891 90.2734 25.9297C90.0911 25.5651 90 25.138 90 24.6484C90 24.1693 90.0859 23.7344 90.2578 23.3438C90.4349 22.9531 90.6849 22.6198 91.0078 22.3438C91.3307 22.0625 91.7083 21.8464 92.1406 21.6953C92.5781 21.5443 93.0651 21.4688 93.6016 21.4688C94.3307 21.4688 94.9609 21.6198 95.4922 21.9219C96.0286 22.224 96.4427 22.638 96.7344 23.1641C97.0312 23.6901 97.1797 24.2943 97.1797 24.9766H94.8984C94.8984 24.6536 94.8516 24.3698 94.7578 24.125C94.6693 23.875 94.526 23.6797 94.3281 23.5391C94.1302 23.3984 93.875 23.3281 93.5625 23.3281C93.2708 23.3281 93.0286 23.388 92.8359 23.5078C92.6484 23.6224 92.5078 23.7812 92.4141 23.9844C92.3255 24.1823 92.2812 24.4062 92.2812 24.6562C92.2812 24.8438 92.3255 25.013 92.4141 25.1641C92.5078 25.3099 92.6354 25.4427 92.7969 25.5625C92.9583 25.6771 93.1484 25.7891 93.3672 25.8984C93.5911 26.0078 93.8359 26.1146 94.1016 26.2188C94.6172 26.4219 95.0729 26.6458 95.4688 26.8906C95.8646 27.1302 96.1953 27.401 96.4609 27.7031C96.7266 28 96.9271 28.3359 97.0625 28.7109C97.1979 29.0859 97.2656 29.513 97.2656 29.9922C97.2656 30.4661 97.1823 30.8984 97.0156 31.2891C96.8542 31.6745 96.6172 32.0078 96.3047 32.2891C95.9922 32.5651 95.6146 32.7786 95.1719 32.9297C94.7344 33.0807 94.2448 33.1562 93.7031 33.1562C93.1771 33.1562 92.6797 33.0833 92.2109 32.9375C91.7422 32.7865 91.3281 32.5599 90.9688 32.2578C90.6146 31.9505 90.3359 31.5625 90.1328 31.0938C89.9297 30.6198 89.8281 30.0599 89.8281 29.4141H92.1172C92.1172 29.7578 92.151 30.0521 92.2188 30.2969C92.2865 30.5365 92.3906 30.7292 92.5312 30.875C92.6719 31.0156 92.8438 31.1224 93.0469 31.1953C93.2552 31.263 93.4922 31.2969 93.7578 31.2969C94.0599 31.2969 94.2995 31.2396 94.4766 31.125C94.6589 31.0104 94.7891 30.8568 94.8672 30.6641C94.9453 30.4714 94.9844 30.2526 94.9844 30.0078ZM100.5 21.625L102.234 26.75L103.953 21.625H106.445L103.383 28.8672V33H101.078V28.8672L98.0156 21.625H100.5ZM105.773 31.8828C105.773 31.5391 105.888 31.2526 106.117 31.0234C106.346 30.7891 106.656 30.6719 107.047 30.6719C107.438 30.6719 107.747 30.7891 107.977 31.0234C108.206 31.2526 108.32 31.5391 108.32 31.8828C108.32 32.2266 108.206 32.513 107.977 32.7422C107.747 32.9714 107.438 33.0859 107.047 33.0859C106.656 33.0859 106.346 32.9714 106.117 32.7422C105.888 32.513 105.773 32.2266 105.773 31.8828Z"
          fill="white"
        />
      </svg>
    </header>
    <form onsubmit="${submit}">
      <div id="form">
        <div id="illustration">${blockage}</div>
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
      ${form.protection
        ? html`
            <section id="accept-terms">
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
            </section>
          `
        : html`
            <section id="skip">
              <gh-onboarding-button type="secondary">
                <a href="${router.url(Skip)}">Skip</a>
              </gh-onboarding-button>
            </section>
          `}
    </form>
  `.css`
    :host {
      display: flex;
      flex-flow: column;
      align-items: space-between;
      min-width: 375px;
      background: var(--ui-color-gray-800);
      color: var(--ui-color-white);
      --gh-onboarding-main-padding: 24px;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: var(--ui-color-primary-500);
    }

    #welcome {
      padding-top: 12px;
      position: relative;
    }

    #welcome ui-text{
      position: absolute;
      left: 46px;
      top: 0px;
    }

    #form {
      box-sizing: border-box;
      padding: var(--gh-onboarding-main-padding);
      background: var(--ui-color-gray-700);
    }

    #form section {
      padding: 20px;
      border: 2px solid var(--ui-color-gray-800);
    }

    #illustration {
      display: none;
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
      padding: var(--gh-onboarding-main-padding);
    }

    #accept-terms {
      display: grid;
      gap: 24px;
      margin-top: 8px;
      padding: var(--gh-onboarding-main-padding);
      background: var(--ui-color-gray-700);
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
      :host {
        flex-flow: row;
        --gh-onboarding-main-padding: 40px;
      }

      header {
        width: 360px;
        flex-flow: column;
        padding: 64px 0;
      }

      #slogan {
        width: 227px;
        height: 64px;
      }

      form {
        display: flex;
        flex-flow: column;
        align-items: center;
        flex-grow: 1;
        padding: var(--gh-onboarding-main-padding);
        background: url('data:image/png;base64,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');
      }

      #form, #accept-terms {
        box-sizing: border-box;
        width: 100%;
        max-width: 640px;
        box-shadow: 30px 60px 160px rgba(0, 0, 0, 0.4);
        border-radius: 16px;
      }

      #illustration {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }

      #skip {
        flex: 1;
        width: 100%;
        max-width: 640px;
        align-items: flex-end;
        padding: var(--gh-onboarding-main-padding) 0 0;
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
