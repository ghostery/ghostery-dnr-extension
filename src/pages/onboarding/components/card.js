import { define, html } from 'hybrids';

export default define({
  tag: 'gh-onboarding-card',
  type: '',
  render: () => html`
    <div id="illustration"><slot name="illustration"></slot></div>
    <slot></slot>
  `.css`
    :host {
      display: grid;
      grid-gap: 16px;
      box-sizing: border-box;
      padding: var(--gh-onboarding-layout-padding);
      background: var(--ui-color-gray-700);
    }

    :host([type="transparent"]) {
      background: none;
      box-shadow: none;
    }

    :host([type="highlight"]) {
      padding: 16px;
      background: var(--ui-color-gray-800);
      border-radius: 8px;
      box-shadow: none;
    }

    :host([type="highlight"]) #illustration {
      display: none;
    }

    #illustration {
      display: flex;
      justify-content: center;
    }

    @media screen and (max-width: 991px) {
      :host([type="full-desktop"]) #illustration {
        display: none;
      }
    }
  
    @media screen and (min-width: 992px) {
      :host {
        box-sizing: border-box;
        width: 100%;
        max-width: 640px;
        box-shadow: 30px 60px 160px rgba(0, 0, 0, 0.4);
        border-radius: 16px;
      }
      
      :host([type="highlight"]) {
        margin-top: 24px;
      }

      #illustration ::slotted(*) {
        margin-bottom: 24px;
      }
    }
  `,
});
