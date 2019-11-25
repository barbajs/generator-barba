<% if (origin === 'npm') { -%>
import barba from '@barba/core';
<% } -%>
<% if (origin === 'cdn') { -%>
const { barba } = window;
<% } -%>

import transition from './transitions/<%= lib %>';

document.addEventListener('DOMContentLoaded', () => {
  // Global hooks for animation.
  barba.hooks.before(() => {
    barba.wrapper.classList.add('is-animating');
  });
  barba.hooks.after(() => {
    barba.wrapper.classList.remove('is-animating');
  });

  // Init.
  barba.init({
    debug: true,
    transitions: [transition],
  });
});
