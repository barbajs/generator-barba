/**
 * Import resources
 */

import '../styles/app.scss'

<% if (ext === 'ts') { -%>
function importAll(r: any) {
  return r.keys().map(r)
}

importAll((require as any).context('../images/', false, /\.(png|jpe?g|svg)$/))
<% } -%>
<% if (ext === 'js') { -%>
function importAll(r) {
  return r.keys().map(r)
}

importAll(require.context('../images/', false, /\.(png|jpe?g|svg)$/))
<% } -%>

<% if (origin === 'npm') { -%>
import barba from '@barba/core'
<% } -%>
<% if (origin === 'cdn') { -%>
const { barba } = window<% if (ext === 'ts') { -%> as any<% } -%>
<% } -%>

import transition from './transitions/<%= lib %>'

document.addEventListener('DOMContentLoaded', () => {
  // Global hooks for animation.
  barba.hooks.before(() => {
    barba.wrapper.classList.add('is-animating')
  })
  barba.hooks.after(() => {
    barba.wrapper.classList.remove('is-animating')
  })

  // Init.
  barba.init({
    debug: true,
    transitions: [transition],
  })
})
