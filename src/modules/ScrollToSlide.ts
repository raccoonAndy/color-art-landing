import { debounce } from '../utils';

interface IScrollToSlide {
  initAnimationScroll: () => void;
}

function ScrollToSlide(container: HTMLElement | null): IScrollToSlide {
  function handleScrollAnimation(element: Element | null | undefined) {
    let myReq: number = 0;
    let start: number | null = null;
    let target: number = 0;
    let pos = 0;
    const firstPos = container?.scrollLeft || 0;
    target = element?.getBoundingClientRect().left || 0;

    const scrollAnimation = (timestamp: number) => {
      if (!start) {
        start = timestamp || new Date().getTime();
      }
      const elapsed = timestamp - start;
      const progress = elapsed / 600;

      const inOutQuad = (n: number) => 0.5 * (1 - Math.cos(Math.PI * n));

      const easeInPercentage = +inOutQuad(progress).toFixed(2);

      if (target === 0) {
        pos = firstPos - firstPos * easeInPercentage;
      } else {
        pos = firstPos + target * easeInPercentage;
      }

      container?.scrollTo(pos, 0);
      if (
        (target === 0 && pos <= 0)
        || (target === 0 && pos === firstPos + target)
        || (target > 0 && pos >= firstPos + target)
        || (target < 0 && pos <= firstPos + target)
      ) {
        cancelAnimationFrame(myReq);
        pos = 0;
      } else {
        myReq = window.requestAnimationFrame(scrollAnimation);
      }
    };
    myReq = window.requestAnimationFrame(scrollAnimation);
  }
  function scrollToElement(event: WheelEvent) {
    const activeSlide = container?.querySelector('[data-slide-active="true"]');
    const nextSibling = activeSlide?.nextElementSibling;
    const prevSibling = activeSlide?.previousElementSibling;

    if (activeSlide?.getAttribute('data-scroll') !== 'vertical') {
      event.preventDefault();
      if (event.deltaY > 0) handleScrollAnimation(nextSibling);
      else handleScrollAnimation(prevSibling);
    } else {
      const heightElement = activeSlide.scrollHeight - activeSlide.clientHeight;
      const isBottom = Math.floor(activeSlide.scrollTop) === heightElement;
      if (event.deltaY < 0 && activeSlide.scrollTop === 0) {
        handleScrollAnimation(prevSibling);
      } else if (isBottom && event.deltaY > 0) {
        handleScrollAnimation(nextSibling);
      }
    }
  }
  function init() {
    container?.addEventListener('wheel', (event) => debounce(scrollToElement(event), 1000), {
      passive: false,
    });
  }
  return {
    initAnimationScroll: init,
  };
}

export default ScrollToSlide;
