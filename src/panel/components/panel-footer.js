import { svg, html, define } from '/hybrids.js';
import { t } from '../utils/i18n.js';

const heart = svg`
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
`;

define({
  tag: "panel-footer",
  content: () => html`
    <footer>
      <a href="mailto:support@ghostery.com?body=PLEASE%20INCLUDE%20A%20DESCRIPTION%20AND%20A%20PICTURE%20OF%20THE%20ISSUE%20YOU%20ARE%20EXPERIENCING&subject=Broken Page Report">
        ${t('panel_menu_report_broken_site')}
      </a>
      <span class="dot">&middot;</span>
      <a href="https://www.ghostery.com/submit-a-tracker">${t('panel_menu_submit_tracker')}</a>
      <a href="https://www.ghostery.com/" class="subscribe">${heart} <span>${t('subscribe')}</span></a>
    </footer>
  `,
});