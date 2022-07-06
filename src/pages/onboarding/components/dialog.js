import { define, html } from 'hybrids';

export default define({
  tag: 'gh-onboarding-dialog',
  render: () => html`
    <div id="dialog">
      <div id="content">
        <header><slot name="header"></slot></header>
        <slot></slot>
      </div>
      <footer><slot name="footer"></slot></footer>
    </div>
  `.css`
    :host {
      background: rgba(32, 34, 37, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      --gh-onboarding-dialog-spacing: 20px;
      padding: var(--gh-onboarding-dialog-spacing);
    }

    #dialog {
      display: flex;
      position: relative;
      box-sizing: border-box;
      background: var(--ui-color-gray-700);
      border-radius: 8px;
      width: 100%;
      max-width: 600px;
      max-height: 100%;
    }

    #content {
      display: grid;
      grid-auto-rows: min-content;
      gap: 16px;
      overflow-y: auto;
      max-height: 100%;
      padding: var(--gh-onboarding-dialog-spacing) var(--gh-onboarding-dialog-spacing) calc(var(--gh-onboarding-dialog-spacing) + 80px);
    }

    footer {
      z-index: 1;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 var(--gh-onboarding-dialog-spacing) var(--gh-onboarding-dialog-spacing);
      display: flex;
      gap: 16px;
      justify-content: stretch;
      margin-top: 24px;
    }

    footer::before {
      z-index: 0;
      content: '';
      display: block;
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: linear-gradient(0deg, var(--ui-color-gray-700) 0%, rgba(47, 49, 54, 0) 100%);
    }

    footer ::slotted(*) {
      position: relative;
      z-index: 2;
      flex: 1;
    }

    @media screen and (min-width: 768px) {
      :host {
        --gh-onboarding-dialog-spacing: 40px;
      }

      #dialog {
        box-shadow: 30px 60px 160px rgba(0, 0, 0, 0.4);
      }

      footer {
        justify-content: flex-end;
      }

      footer ::slotted(*) {
        flex: 0;
      }
    }
  `,
});
