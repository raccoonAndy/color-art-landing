import Parallax from './modules/Parallax';
import ArrowNextSlide from './modules/ArrowNextSlide';
import ScrollToSlide from './modules/ScrollToSlide';
import Popup from './modules/Popup';
import { BREAKPOINTS, NAME_SLIDES } from './settings/_env';
import { adaptive, debounce } from './utils';

interface IApp {
  render: () => void;
  scroll: () => void;
  loadingImages: () => void;
}

function App(): IApp {
  const app = document.getElementById('app');

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

  function initScroll() {
    const scrollSlide = ScrollToSlide(app);
    scrollSlide.addLocationHash();

    adaptive(scrollSlide.addAnimationScroll, scrollSlide.removeAnimationScroll)();

    // scroll to bottom slide (id="using"),
    // if at first init slide is "end"
    if (`#${NAME_SLIDES.END}` === window.location.hash) {
      const usingSlide = app?.querySelector(`#${NAME_SLIDES.USING}`);
      if (usingSlide) {
        const bottom = usingSlide.scrollHeight - usingSlide.clientHeight;
        usingSlide.scrollTo(0, bottom);
      }
    }

    // at first init, scroll to active slide by location hash
    if (window.location.hash) {
      scrollToSlideByHash(window.location.hash);
    }
    if (window.innerWidth > BREAKPOINTS.SM) {
      window.addEventListener(
        'resize',
        debounce(() => {
          if (window.innerWidth > BREAKPOINTS.SM) {
            const activeSlide = app?.querySelector(window.location.hash);
            activeSlide?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100),
      );
    }
  }

  function init() {
    const arrowNextSlide = ArrowNextSlide(app);
    arrowNextSlide.animate();

    const popup = Popup();
    popup.init();

    const parallax = Parallax(app?.querySelector(`#${NAME_SLIDES.USING}`));
    parallax.init();
  }

  return {
    render: init,
    scroll: initScroll,
    loadingImages: initImagesLoader,
  };
}

export default App;
