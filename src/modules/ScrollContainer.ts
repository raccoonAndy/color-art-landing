import debounce from '../utils/debounce';
import LocationHashObserver from './LocationHashObserver';

interface IScrollContainer {
  init: () => void;
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
  function setLocationHash() {
    const children = workingContainer?.children;
    if (children) {
      const slidesObserver = LocationHashObserver(
        workingContainer,
        0.99,
      );
      slidesObserver.setLocationHash(children);
    }
  }
  function scrollToElementByHash(hash: string) {
    const element = container?.querySelector(hash);
    if (workingContainer && element) {
      workingContainer.scrollLeft = element.getBoundingClientRect().left;
    }
  }
  function main() {
    initScrollHorizontal();
    if (window.location.hash) {
      scrollToElementByHash(window.location.hash);
    }
    if (addLocationHash) {
      setLocationHash();
    }
  }

  return {
    init: main,
  };
}

export default ScrollContainer;
