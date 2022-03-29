import ScrollObserver from './ScrollObserver';
import { ACTIVE_CLASS_NAME } from '../settings/_env';

interface IScrollToSlide {
  addAnimationScroll: () => void;
  removeAnimationScroll: () => void;
  addLocationHash: () => void;
}

function ScrollToSlide(container: HTMLElement | null): IScrollToSlide {
  const children = container?.querySelectorAll('[data-slide]');
  let scrolling: any;

  function scrollAnimation(element: Element | null | undefined) {
    let myReq: number = 0;
    let start: number | null = null;
    let target: number = 0;
    let pos = 0;
    const firstPos = container?.scrollLeft || 0;
    target = element?.getBoundingClientRect().left || 0;

    const animateScroll = (timestamp: number) => {
      if (!start) {
        start = timestamp || new Date().getTime();
      }
      const elapsed = timestamp - start;
      const progress = elapsed / 800;

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
        myReq = window.requestAnimationFrame(animateScroll);
      }
    };
    myReq = window.requestAnimationFrame(animateScroll);
  }

  async function scrollToElement(event: WheelEvent) {
    if (!scrolling) {
      const activeSlide = container?.querySelector(`.${ACTIVE_CLASS_NAME}`);
      if (!activeSlide) return;

      const nextSibling = activeSlide?.nextElementSibling;
      const prevSibling = activeSlide?.previousElementSibling;
      if (activeSlide?.getAttribute('data-scroll-orientation') !== 'vertical') {
        event.preventDefault();
        if (event.deltaY > 0) scrollAnimation(nextSibling);
        else scrollAnimation(prevSibling);
      } else {
        const heightElement = activeSlide.scrollHeight - activeSlide.clientHeight;
        const isBottom = Math.floor(activeSlide.scrollTop) === heightElement;
        if (event.deltaY < 0 && activeSlide.scrollTop === 0) {
          scrollAnimation(prevSibling);
        } else if (isBottom && event.deltaY > 0) {
          scrollAnimation(nextSibling);
        }
      }
    }
    clearTimeout(scrolling);
    scrolling = setTimeout(() => {
      scrolling = undefined;
    }, 100);
  }

  function handleActiveClassName() {
    if (children) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: [0.8, 1.0],
      };
      ScrollObserver((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(ACTIVE_CLASS_NAME);
        } else {
          entry.target.classList.remove(ACTIVE_CLASS_NAME);
        }
      })(options, children);
    }
  }

  function setLocationHash() {
    if (children) {
      const options = {
        root: container,
        rootMargin: '0px',
        threshold: [0.8, 1.0],
      };
      ScrollObserver((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          const hash = entry.target.getAttribute('data-slide');
          if (hash) {
            window.history.pushState(null, '', `#${hash}`);
          }
        }
      })(options, children);
    }
  }

  function init() {
    handleActiveClassName();
    container?.addEventListener('wheel', scrollToElement, {
      passive: false,
    });
  }

  function terminate() {
    container?.removeEventListener('wheel', scrollToElement);
  }

  return {
    addAnimationScroll: init,
    removeAnimationScroll: terminate,
    addLocationHash: setLocationHash,
  };
}

export default ScrollToSlide;
