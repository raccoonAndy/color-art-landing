import ScrollObserver from './ScrollObserver';
import { adaptive } from '../utils';
import { SCROLL_ORIENTATION } from '../settings/_env';

export interface IScrollContainer {
  initScroll: (orientation?: string) => void;
  changeScrollDirection: (orientation: string) => void;
}

function ScrollContainer(
  container: HTMLElement | null,
  addLocationHash: boolean,
): IScrollContainer {
  const workingContainer = container;

  function scrollHorizontalListener(event: WheelEvent) {
    event.preventDefault();
    if (workingContainer) {
      workingContainer.scrollLeft += event.deltaY * 0.3;
    }
  }
  function addScrollHorizontalListener() {
    workingContainer?.addEventListener('wheel', scrollHorizontalListener, { passive: false });
  }
  function removeScrollHorizontalListener() {
    workingContainer?.removeEventListener('wheel', scrollHorizontalListener);
  }
  function initScrollHorizontal() {
    adaptive(
      addScrollHorizontalListener,
      removeScrollHorizontalListener,
    )();
  }
  function initScrollVertical() {
    removeScrollHorizontalListener();
  }
  function getOptionsForScrollObserver() {
    return adaptive(
      () => ({
        root: workingContainer,
        rootMargin: '0px',
        threshold: [0.8, 1.0],
      }),
      () => ({
        root: null,
        rootMargin: '0px',
        threshold: 0.8,
      }),
    )();
  }
  function setLocationHash() {
    const children = workingContainer?.children;
    if (children) {
      const options = getOptionsForScrollObserver();
      ScrollObserver((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          const hash = entry.target.id;
          if (hash) {
            window.history.pushState(null, '', `#${hash}`);
          }
        }
      })(options, children);
    }
  }
  function scrollToElementByHash(hash: string) {
    const element = container?.querySelector(hash);
    if (workingContainer && element) {
      workingContainer.scrollLeft = element.getBoundingClientRect().left;
    }
  }
  function initializationScroll(orientation: string): void {
    if (orientation === SCROLL_ORIENTATION.HORIZONTAL) {
      initScrollHorizontal();
    } else {
      initScrollVertical();
    }
  }
  function main(orientation?: string) {
    initializationScroll(orientation || SCROLL_ORIENTATION.HORIZONTAL);

    if (window.location.hash) {
      scrollToElementByHash(window.location.hash);
    }
    if (addLocationHash) {
      setLocationHash();
    }
  }

  return {
    initScroll: main,
    changeScrollDirection: initializationScroll,
  };
}

export default ScrollContainer;
