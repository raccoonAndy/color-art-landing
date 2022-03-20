import Parallax from './modules/Parallax';
import ArrowNextSlide from './modules/ArrowNextSlide';
import ScrollToSlide from './modules/ScrollToSlide';
import Popup from './modules/Popup';
import { NAME_SLIDES } from './settings/_env';
import { adaptive } from './utils';

// styles
import './styles/index.scss';

interface IApp {
  render: () => void;
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

  const init = () => {
    initImagesLoader();

    const arrowNextSlide = ArrowNextSlide(app);
    arrowNextSlide.animate();

    const popup = Popup();
    popup.init();

    const parallax = Parallax(app?.querySelector(`#${NAME_SLIDES.USING}`));
    parallax.init();

    const scrollSlide = ScrollToSlide(app);
    scrollSlide.setLocationHash();

    adaptive(
      scrollSlide.addAnimationScroll,
      scrollSlide.removeAnimationScroll,
    )();

    // scroll to bottom slide (id="using"),
    // if at first init slide is "end"
    if (`#${NAME_SLIDES.END}` === window.location.hash) {
      const element = app?.querySelector(`#${NAME_SLIDES.USING}`);
      if (element) {
        const bottom = element.scrollHeight - element.clientHeight;
        element.scrollTo(0, bottom);
      }
    }

    // at first init, scroll to active slide by location hash
    if (window.location.hash) {
      scrollToSlideByHash(window.location.hash);
    }
  };

  return {
    render: init,
  };
}

const app = App();
app.render();
