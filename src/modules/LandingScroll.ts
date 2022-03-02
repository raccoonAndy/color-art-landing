import optimizedResize from '../utils/optimizedResize';

function LandingScroll(): any {
  let translateX = 0;
  const slides = document.querySelectorAll('.page');
  const slide = document.querySelector('.page');

  const getTranslateX = (
    event: WheelEvent,
    maxTranslateX: number,
    x: number,
  ) => new Promise((resolve) => {
    setTimeout(() => {
      const direction = event.deltaY > 0 ? 'up' : 'down';
      if (direction === 'up') {
        x += slide?.clientWidth || 0;
      } else {
        x -= slide?.clientWidth || 0;
      }
      if (x < 0) {
        x = 0;
      } else if (x > maxTranslateX) {
        x = maxTranslateX;
      }
      resolve(x);
    }, 500);
  });

  const getTranslate = async (event: WheelEvent, maxTranslateX: number) => {
    const x = await getTranslateX(event, maxTranslateX, translateX);
    if (typeof x === 'number') {
      translateX = x;
      return x * -1;
    }

    return 0;
  };

  const setStyleTransformSlides = (
    event: WheelEvent,
    maxTranslateX: number,
  ) => {
    getTranslate(event, maxTranslateX).then((x) => {
      Array.from(slides).forEach((element) => {
        if (element) {
          element.setAttribute(
            'style',
            `transform: translateX(${x}px)`,
          );
        }
      });
    });
  };

  const getEndPointScroll = (countSlides: number): number => {
    const slideWidth = slide?.clientWidth || 0;
    const endPoint = slideWidth * (countSlides - 1);
    return endPoint;
  };

  const main = (): void => {
    let endPointScroll = getEndPointScroll(slides.length);
    window.addEventListener(
      'wheel',
      (event) => setStyleTransformSlides(event, endPointScroll),
    );
    window.removeEventListener(
      'wheel',
      (event) => setStyleTransformSlides(event, endPointScroll),
    );
    optimizedResize.add((): void => {
      endPointScroll = getEndPointScroll(slides.length);
    });
  };

  return {
    init: main,
  };
}

export default LandingScroll;
