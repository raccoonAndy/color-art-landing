/**
 * scrolling the app container,
 * if children slides of container have attribute 'id',
 * add the window location a hash with 'id' of slide.
 */
function ScrollObserver(func?: (entry: IntersectionObserverEntry) => void) {
  return function (options: object, elements: HTMLCollection | HTMLElement | null) {
    const context = this;
    const opt = options || {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        func?.apply(context, [entry]);
      });
    }, opt);
    if (elements) {
      if (elements instanceof HTMLCollection) {
        Array.from(elements)?.forEach((element: Element) => observer.observe(element));
      } else {
        observer.observe(elements);
      }
    }
  };
}

export default ScrollObserver;
