interface IRouteObserver {
  setHash: (targets: NodeListOf<Element>) => void;
}

/**
 * scrolling the app container,
 * if children slides of container have attribute 'id',
 * add the window location a hash with 'id' of slide.
 */
function HashObserver(
  root: HTMLElement | null,
  threshold: number = 0.5,
): IRouteObserver {
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
): void {
  let isMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 768;
  });
  if (!isMobile) {
    container?.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        if (container) {
          container.scrollLeft += event.deltaY;
        }
      },
      { passive: false },
    );
  }
  if (children) {
    const hashObserver = HashObserver(container, 0.99);
    hashObserver.setHash(children);
  }
}

export default ScrollContainer;
