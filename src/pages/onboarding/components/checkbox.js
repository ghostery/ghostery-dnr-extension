import { define, html } from 'hybrids';

function setupChecked(host, event) {
  const slot = event.target;
  const elements = slot.assignedNodes();

  host.checked = elements[0].checked;
}

function updateChecked(host, event) {
  host.checked = event.target.checked;
}

export default define({
  tag: 'gh-onboarding-checkbox',
  checked: false,
  render: ({ checked }) => html`
    <div onchange=${updateChecked}>
      <slot onslotchange="${setupChecked}"></slot>
    </div>
    <ui-icon name="check" hidden="${!checked}"></ui-icon>
  `.css`
    :host {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
    }

    ::slotted(input) {
      position: absolute;
      inset: 0;
      appearance: none;
      box-sizing: border-box;
      background: var(--ui-color-gray-800);
      border: 2px solid var(--ui-color-primary-500);
      box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.3);
      border-radius: 22px;
      padding: 0;
      margin: 0;
    }

    :host([checked]) ::slotted(input) {
      border-color: transparent;
      box-shadow: none;
      background: var(--ui-color-primary-500);
    }

    ui-icon {
      z-index: 1;
    }
  `,
});
