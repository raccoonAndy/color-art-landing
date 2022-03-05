interface ILocationHashObserver {
  setLocationHash: (targets: HTMLCollection) => void;
}
/**
 * scrolling the app container,
 * if children slides of container have attribute 'id',
 * add the window location a hash with 'id' of slide.
 */
function LocationHashObserver(
  root: HTMLElement | null,
  threshold: number,
): ILocationHashObserver {
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
    setLocationHash(slides: HTMLCollection) {
      Array.from(slides)?.forEach((slide: Element) => observer.observe(slide));
    },
  };
}

export default LocationHashObserver;
