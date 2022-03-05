import debounce from '../utils/debounce';
import ScrollObserver from './ScrollObserver';

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
      workingContainer.scrollLeft += event.deltaY;
    }
  }
  function addScrollHorizontalListener() {
    workingContainer?.addEventListener('wheel', scrollHorizontalListener, { passive: false });
  }
  function removeScrollHorizontalListener() {
    workingContainer?.removeEventListener('wheel', scrollHorizontalListener);
  }
  function initScrollHorizontal() {
    let isMobile = window.innerWidth < 768;
    if (!isMobile) {
      addScrollHorizontalListener();
    }
    window.addEventListener(
      'resize',
      debounce(() => {
        isMobile = window.innerWidth < 768;
        if (isMobile) removeScrollHorizontalListener();
        else addScrollHorizontalListener();
      }, 500),
    );
  }
  function initScrollVertical() {
    removeScrollHorizontalListener();
  }
  function setLocationHash() {
    const children = workingContainer?.children;
    if (children) {
      const options = {
        root: workingContainer,
        rootMargin: '0px',
        threshold: [0.8, 1.0],
      };
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
  function initializationScroll(orientation: string = 'horizontal'): void {
    if (orientation === 'horizontal') {
      initScrollHorizontal();
    } else {
      initScrollVertical();
    }
  }
  function main(orientation?: string) {
    initializationScroll(orientation || 'horizontal');

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
