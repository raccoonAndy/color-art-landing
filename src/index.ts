import ScrollContainer from './modules/ScrollContainer';
import ScrollObserver from './modules/ScrollObserver';
import ScrollParallax from './modules/ScrollParallax';
import ArrowNextSlide from './modules/ArrowNextSlide';
import Popup from './modules/Popup';
import { debounce } from './utils';
import { NAME_SLIDES, SCROLL_ORIENTATION } from './settings/_env';

// styles
import './styles/index.scss';

interface IApp {
  render: () => void;
}

function App(): IApp {
  const app = document.getElementById('app');
  const children = app?.children;
  const scrollContainer = ScrollContainer(app, true);

  function scrollVerticalListener(event: WheelEvent, element: Element | null | undefined) {
    if (element) {
      const heightElement = element.scrollHeight - element.clientHeight;
      const isBottom = Math.floor(element.scrollTop) === heightElement;
      if ((event.deltaY < 0 && element.scrollTop === 0) || (event.deltaY > 0 && isBottom)) {
        if (isBottom && event.deltaY < 0) {
          scrollContainer.changeScrollDirection(SCROLL_ORIENTATION.VERTICAL);
        } else {
          scrollContainer.changeScrollDirection(SCROLL_ORIENTATION.HORIZONTAL);
        }
      }
    }
  }

  function changeDirection(target: string) {
    const element = app?.querySelector(`#${target}`);
    if (target === NAME_SLIDES.USING) {
      ScrollParallax(element).init();
      scrollContainer.changeScrollDirection(SCROLL_ORIENTATION.VERTICAL);
      app?.addEventListener(
        'wheel',
        (event) => debounce(scrollVerticalListener(event, element), 75),
        true,
      );
    }
  }

  function initImagesLoader() {
    const pictures = app?.querySelectorAll('picture');
    pictures?.forEach((picture) => {
      picture.classList.add('isLoading');
      const img = picture.querySelector('img');
      if (img) {
        img.onload = () => {
          if (img?.complete) {
            picture.classList.remove('isLoading');
          }
        };
      }
    });
  }

  function initControlScrollDirection() {
    if (children) {
      const options = {
        root: app,
        rootMargin: '0px',
        threshold: [0.98, 1.0],
      };
      ScrollObserver((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          changeDirection(entry.target.id);
        }
      })(options, children);
    }
  }

  const init = () => {
    const arrowNextSlide = ArrowNextSlide(app);
    arrowNextSlide.animate();

    const popup = Popup();
    popup.init();

    scrollContainer.initScroll(SCROLL_ORIENTATION.HORIZONTAL);

    if (`#${NAME_SLIDES.USING}` === window.location.hash) {
      scrollContainer.changeScrollDirection(SCROLL_ORIENTATION.VERTICAL);
      const slide = app?.querySelector(window.location.hash);
      if (slide) {
        ScrollParallax(slide).init();
      }
    }

    if (`#${NAME_SLIDES.END}` === window.location.hash) {
      const element = app?.querySelector(`#${NAME_SLIDES.USING}`);
      if (element) {
        const bottom = element.scrollHeight - element.clientHeight;
        element.scrollTo(0, bottom);
      }
    }
    initControlScrollDirection();
    initImagesLoader();
  };

  return {
    render: init,
  };
}

const app = App();
app.render();
