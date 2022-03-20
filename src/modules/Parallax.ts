import { debounce, adaptive } from '../utils';

interface IScrollParallax {
  init: () => void;
  terminate: () => void;
}

function Parallax(
  container: Element | null | undefined,
): IScrollParallax {
  const parallaxElements = container?.querySelectorAll('[data-parallax]');
  function listener(
    event: Event,
    element: Element,
    direction: string | null,
    value: number,
  ) {
    let v = value;
    if (event instanceof WheelEvent) {
      if (container) {
        v += container.scrollTop * 0.05;
        element.setAttribute('style', `--translate-${direction}: ${v}px`);
      }
    }
  }
  function changeValueByScroll(element: Element, direction: string | null) {
    const value = 0;
    container?.addEventListener(
      'wheel',
      (event) => debounce(listener(event, element, direction, value), 75),
      true,
    );
  }
  function terminate() {
    parallaxElements?.forEach((element) => {
      if (!element) return;
      const direction = element.getAttribute('data-parallax-direction');
      container?.removeEventListener(
        'wheel',
        (event) => listener(event, element, direction, 0),
      );
    });
  }
  function init() {
    parallaxElements?.forEach((element) => {
      if (!element) return;
      const direction = element.getAttribute('data-parallax-direction');
      element.setAttribute('style', `--translate-${direction}: 0px`);
      changeValueByScroll(element, direction);
    });
  }
  function main() {
    adaptive(
      init,
      terminate,
    )();
  }
  return {
    init: main,
    terminate,
  };
}

export default Parallax;
