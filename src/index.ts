import ScrollObserver from './modules/ScrollObserver';
import ScrollParallax from './modules/ScrollParallax';
import ArrowNextSlide from './modules/ArrowNextSlide';
import ScrollToSlide from './modules/ScrollToSlide';
import Popup from './modules/Popup';
import { NAME_SLIDES } from './settings/_env';

// styles
import './styles/index.scss';

interface IApp {
  render: () => void;
}

function App(): IApp {
  const app = document.getElementById('app');
  const children = app?.children;

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

  function scrollToSlideByHash(hash: string) {
    const slide = app?.querySelector(hash);
    if (app && slide) {
      app.scrollLeft = slide.getBoundingClientRect().left;
    }
  }

  function setLocationHash() {
    if (children) {
      const options = {
        root: app,
        rootMargin: '0px',
        threshold: [0.8, 1.0],
      };
      ScrollObserver((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          const hash = entry.target.id;
          if (hash) {
            window.history.pushState(null, '', `#${hash}`);
          }
        }
      })(options, children);
    }
  }

  function setActiveClass() {
    if (children) {
      const options = {
        root: app,
        rootMargin: '0px',
        threshold: [0.8, 1.0],
      };
      ScrollObserver((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-slide-active', 'true');
        } else {
          entry.target.setAttribute('data-slide-active', 'false');
        }
      })(options, children);
    }
  }

  const init = () => {
    initImagesLoader();

    const arrowNextSlide = ArrowNextSlide(app);
    arrowNextSlide.animate();

    const popup = Popup();
    popup.init();

    const parallax = ScrollParallax(app?.querySelector(`#${NAME_SLIDES.USING}`));
    parallax.init();

    const scrollSlide = ScrollToSlide(app);
    scrollSlide.initAnimationScroll();

    if (`#${NAME_SLIDES.END}` === window.location.hash) {
      const element = app?.querySelector(`#${NAME_SLIDES.USING}`);
      if (element) {
        const bottom = element.scrollHeight - element.clientHeight;
        element.scrollTo(0, bottom);
      }
    }

    // init slide
    if (window.location.hash) {
      scrollToSlideByHash(window.location.hash);
    }

    setLocationHash();
    setActiveClass();
  };

  return {
    render: init,
  };
}

const app = App();
app.render();
