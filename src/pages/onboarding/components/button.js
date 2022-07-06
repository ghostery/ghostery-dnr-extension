import { define, html } from 'hybrids';

export default define({
  tag: 'gh-onboarding-button',
  type: '',
  render: () => html`
    <ui-text type="button-m" color="white"><slot></slot></ui-text>
  `.css`
    :host {
      display: grid;
      grid: 1fr / 1fr;
      height: 48px;
      background: var(--ui-color-primary-500);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
      border-radius: 24px;
    }

    :host([type="outline"]) {
      background: var(--ui-color-gray-700);
      height: 44px;
      border: 2px solid var(--ui-color-gray-600);
    }

    :host([type="secondary"]) {
      background: var(--ui-color-gray-700);
    }

    ::slotted(*) {
      display: grid;
      grid-auto-flow: column;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      place-items: center;
      appearance: none;
      border: none;
      padding: 0px 24px;
      margin: 0;
      color: inherit;
      font: inherit;
      text-transform: inherit;
      background: none;
    }
  `,
});
