/**
 * scrolling the app container,
 * if children slides of container have attribute 'id',
 * add the window location a hash with 'id' of slide.
 */
function ScrollObserver(func?: (entry: IntersectionObserverEntry) => void) {
  return function (options: object, slides: HTMLCollection | NodeListOf<HTMLPictureElement>) {
    const context = this;
    const opt = options || {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    const observer = new IntersectionObserver((
      entries: IntersectionObserverEntry[],
    ): void => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        func?.apply(context, [entry]);
      });
    }, opt);
    if (slides.length) {
      Array.from(slides)?.forEach((slide: Element) => observer.observe(slide));
    }
  };
}

export default ScrollObserver;
