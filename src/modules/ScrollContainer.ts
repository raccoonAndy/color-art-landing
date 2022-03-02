interface IScroll {
  init: () => void
}

function ScrollContainer(scrollElement: HTMLElement | null): IScroll {
  const main = (): void => {
    scrollElement?.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        if (scrollElement) {
          scrollElement.scrollLeft += event.deltaY;
        }
      },
      { passive: false },
    );
  };

  return {
    init: main,
  };
}

export default ScrollContainer;
