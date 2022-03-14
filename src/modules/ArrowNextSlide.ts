import ScrollObserver from './ScrollObserver';

interface IArrowNextSlide {
  animate: () => void;
}

function ArrowNextSlide(container: HTMLElement | null): IArrowNextSlide {
  function animate() {
    const options = {
      root: container,
      rootMargin: '0px',
      threshold: 1.0,
    };
    const arrow = document.getElementById('arrow-next-slide');
    ScrollObserver((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        arrow?.classList.add('isAnimate');
      }
    })(options, arrow);
  }

  return {
    animate,
  };
}

export default ArrowNextSlide;
