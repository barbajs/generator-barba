import gsap from 'gsap';

const duration = 1;

export default {
  async leave({ current }) {
    await gsap.to(current.container, {
      duration,
      opacity: 0,
      ease: 'power4.easeIn',
    }).then();
  },

  async enter({ current, next }) {
    current.container.remove();

    // DEV: previously (v2), working without `set` step (from: 0)
    gsap.set(next.container, {opacity: 0});

    await gsap.to(next.container, {
      duration,
      opacity: 1,
      ease: 'power4.easeOut',
    }).then();
  },
};
