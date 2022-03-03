import debounce from '../utils/debounce';

const NAME_SLIDES = {
  HOME: 'home',
  COLOR: 'color',
  USING: 'using',
};

interface IHashObserver {
  setHash: (targets: NodeListOf<Element>) => void;
}
interface IScrollContainer {
  init: () => void;
}

/**
 * scrolling the app container,
 * if children slides of container have attribute 'id',
 * add the window location a hash with 'id' of slide.
 */
function HashObserver(
  root: HTMLElement | null,
  threshold: number,
): IHashObserver {
  const options = {
    root,
    rootMargin: '0px',
    threshold,
  };
  const observer = new IntersectionObserver(
    (
      entries: IntersectionObserverEntry[],
      // observer: IntersectionObserver,
    ): void => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          const hash = entry.target.id;
          if (hash) {
            window.location.hash = hash;
          }
        }
      });
    },
    options,
  );

  return {
    setHash(targets: NodeListOf<Element>) {
      targets?.forEach((target: Element) => observer.observe(target));
    },
  };
}

function ScrollContainer(
  container: HTMLElement | null,
  children?: NodeListOf<Element>,
): IScrollContainer {
  let isVerticalScroll = false;
  function scrollListener(event: WheelEvent) {
    event.preventDefault();
    if (container) {
      container.scrollLeft += event.deltaY;
    }
  }
  function addScrollHorizontalListener() {
    container?.addEventListener('wheel', scrollListener, { passive: false });
  }
  function removeScrollHorizontalListener() {
    isVerticalScroll = true;
    container?.removeEventListener('wheel', scrollListener);
  }
  function setScrollHorizontal(isMobile: boolean) {
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
  function init() {
    const isMobile = window.innerWidth < 768;
    if (container && window.location.hash) {
      const element = container?.querySelector(window.location.hash);
      if (element) {
        container.scrollLeft = element.getBoundingClientRect().left;
      }
    }
    setScrollHorizontal(isMobile);
    if (children) {
      const hashObserver = HashObserver(
        container,
        0.99,
      );
      hashObserver.setHash(children);
    }
  }

  return {
    init,
  };
}

export default ScrollContainer;
