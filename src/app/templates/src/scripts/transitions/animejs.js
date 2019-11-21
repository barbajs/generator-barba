import anime from 'animejs';

const duration = 1000;

export default {
  leave({ current }) {
    const { container: targets } = current;

    return anime({
      targets,
      opacity: {
        value: [1, 0],
        duration,
      },
      easing: 'easeInQuart',
    }).finished;
  },

  enter({ current, next }) {
    const { container: targets } = next;

    current.container.remove();

    return anime({
      targets,
      opacity: {
        value: [0, 1],
        duration,
      },
      easing: 'easeOutQuart',
    }).finished;
  },
};
