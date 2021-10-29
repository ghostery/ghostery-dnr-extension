import { html, define, store, dispatch } from '/hybrids.js';
import { toggleBlocking } from '../store/settings.js';
import { toggles } from '../../common/rulesets.js';
import { sortCategories } from '../utils/categories.js';

function toggleDetailedView(host) {
  dispatch(host, 'toggle-detailed-view');
}

define({
  tag: "simple-view",
  settings: null,
  stats: null,
  canvas: ({ stats }) => {
    const el = document.createElement("canvas");
    el.setAttribute('height', 180);
    el.setAttribute('width', 180);

    const context = el.getContext('2d');

    const categories = store.ready(stats)
      ? stats.trackers.map(t => t.category)
      : ['unknown'];
    draw(context, categories);

    // return element
    return el;
  },
  content: ({ settings, stats, canvas }) => html`
    <main>

      <h1>Privacy protection on this site</h1>

      <section class="toggles">
        ${store.pending(settings) && `Loading...`}

        ${store.ready(settings) && html`
          ${toggles.map((toggle) => html`
            <button
              onclick=${() => toggleBlocking(toggle)}
              class=${{ disabled: !settings.blockingStatus[toggle]}}
            >
              <label>${toggle}</label>
            </button>
          `)}
        `}
      </section>

      <section class="stats">
        <main>
          ${canvas}
          <strong>${store.ready(stats) ? stats.trackers.length : 0}</strong>
        </main>

        <aside>
          <ul>
            ${store.ready(stats) && html`
              ${sortCategories(Object.keys(stats.byCategory)).map((category) => html`
                <li class="category">
                  <category-bullet category=${category} size=${8}></category-bullet>
                  <label>${category}</label>
                  <strong>${stats.byCategory[category].count}</strong>
                </li>
              `)}
            `}
          </ul>
        </aside>
      </section>

      <section class="buttons">
        <a href="https://www.whotracks.me/websites/${store.ready(stats) ? stats.domain : ''}.html" target="_blank">Statistics report</a>
        <a onclick="${toggleDetailedView}">Tracker list</a>
      </section>

      <section>
        <p>Load time: ${store.ready(stats) ? `${Math.round(stats.loadTime)}ms` : html`&nbsp;`}</p>
      </section>

    </main>
  `,
});