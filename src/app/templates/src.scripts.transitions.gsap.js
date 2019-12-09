<% if (ext === 'ts') { -%>
import { ITransitionData } from '@barba/core'
<% } -%>
import gsap from 'gsap'

const duration = 1

export default {
  async leave({ current }<% if (ext === 'ts') { -%>: ITransitionData<% } -%>) {
    await gsap.to(current.container, {
      duration,
      opacity: 0,
      ease: 'power4.easeIn',
    }).then(<% if (ext === 'ts') { -%>() => {}<% } -%>)
  },

  async enter({ current, next }<% if (ext === 'ts') { -%>: ITransitionData<% } -%>) {
    current.container.remove()

    // DEV: previously (v2), working without `set` step (from: 0)
    gsap.set(next.container, {opacity: 0})

    await gsap.to(next.container, {
      duration,
      opacity: 1,
      ease: 'power4.easeOut',
    }).then(<% if (ext === 'ts') { -%>() => {}<% } -%>)
  },
}
