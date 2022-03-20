/**
 * scrolling the app container,
 * if children slides of container have attribute 'id',
 * add the window location a hash with 'id' of slide.
 */
type TypeElements = HTMLCollection | NodeListOf<Element> | undefined;
type TypeElement = HTMLElement | SVGElement | null;
function ScrollObserver(func?: (entry: IntersectionObserverEntry) => void) {
  return function (options: object, elements: TypeElements | TypeElement) {
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
      if (elements instanceof HTMLElement || elements instanceof SVGElement) {
        observer.observe(elements);
      } else {
        Array.from(elements)?.forEach((element: Element) => observer.observe(element));
      }
    }
  };
}

export default ScrollObserver;
