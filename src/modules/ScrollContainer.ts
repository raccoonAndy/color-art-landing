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
  addScrollListener: () => void,
  removeScrollListener: () => void,
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
          if (NAME_SLIDES.USING === hash) {
            removeScrollListener();
          } else {
            addScrollListener();
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
    if (!isMobile && !isVerticalScroll) {
      addScrollHorizontalListener();
    }
    window.addEventListener(
      'resize',
      debounce(() => {
        isMobile = window.innerWidth < 768;
        if (isMobile && isVerticalScroll) removeScrollHorizontalListener();
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
    if (`#${NAME_SLIDES.USING}` !== window.location.hash && !isVerticalScroll) {
      setScrollHorizontal(isMobile);
    } else {
      removeScrollHorizontalListener();
    }
    if (children) {
      const hashObserver = HashObserver(
        container,
        0.99,
        addScrollHorizontalListener,
        removeScrollHorizontalListener,
      );
      hashObserver.setHash(children);
    }
  }

  return {
    init,
  };
}

export default ScrollContainer;
