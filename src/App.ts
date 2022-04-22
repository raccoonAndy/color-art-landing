import Parallax from './modules/Parallax';
import ArrowNextSlide from './modules/ArrowNextSlide';
import ScrollToSlide from './modules/ScrollToSlide';
import Popup from './modules/Popup';
import ColorWheel from './modules/ColorWheel';
import { BREAKPOINTS, NAME_SLIDES } from './settings/_env';
import { adaptive, debounce } from './utils';

interface IApp {
  preload: () => void;
  render: () => void;
  scroll: () => void;
  addColorWheel: () => void;
  preloadImages: () => void;
}

function App(): IApp {
  const app = document.getElementById('app');

  function hidePreloader() {
    const overlay = document.getElementById('loader');
    if (overlay && app) {
      overlay.style.opacity = '0';
      app.style.opacity = '1';
      document.body.classList.remove('isLoading');
      app.classList.add('active');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1500);
    }
  }

  function finishedLoading() {
    const progress = document.getElementById('progress');
    setTimeout(() => {
      hidePreloader();
    }, 2000);
    if (progress && !progress.classList.contains('isAnimate')) {
      progress.classList.add('isAnimate');
    }
  }

  function startLoading() {
    const progressStat = document.getElementById('progress__stat');
    if (!progressStat) return false;
    const img = document.images;
    const tot = img.length;
    let c = 0;
    if (tot === 0) return finishedLoading();
    progressStat.setAttribute('style', `--images-count: ${tot}`);

    for (let i = 0; i < tot; i += 1) {
      const span = document.createElement('span');
      progressStat.appendChild(span);
    }
    const spans = document.querySelectorAll('#progress__stat > span:not(:first-child)');

    function imgLoaded() {
      c += 1;
      const percentage = ((100 / tot) * c) << 0;
      const percents = percentage.toString().split('');
      const countAdditionalSpan = percentage < 100 ? 1 : percentage < 10 ? 2 : -1;
      for (let i = 0; i < countAdditionalSpan; i += 1) {
        const span = document.createElement('span');
        span.innerHTML = '&nbsp;';
        if (spans[c - 1]) spans[c - 1].appendChild(span);
      }
      for (let i = 0; i < percents.length; i += 1) {
        if (spans[c - 1]) {
          const span = document.createElement('span');
          span.innerHTML = `${percents[i]}`;
          spans[c - 1].appendChild(span);
        }
      }
      if (c === tot) return finishedLoading();
      return true;
    }

    for (let i = 0; i < tot; i += 1) {
      const tImg = new Image();
      tImg.onload = imgLoaded;
      tImg.onerror = imgLoaded;
      tImg.src = img[i].src;
    }

    return false;
  }

  function initPreload() {
    document.addEventListener('DOMContentLoaded', startLoading, false);
  }

  function initImagesLoader() {
    const pictures = app?.querySelectorAll('picture');
    pictures?.forEach((picture) => {
      picture.classList.add('isLoading');
      const img = picture.querySelector('img');
      if (img) {
        img.addEventListener('load', () => {
          if (img?.complete) {
            picture.classList.remove('isLoading');
          }
        });
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

  function addColorWheel() {
    const colorWheel = ColorWheel();

    colorWheel?.render();
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
    preload: initPreload,
    render: init,
    scroll: initScroll,
    addColorWheel,
    preloadImages: initImagesLoader,
  };
}

export default App;
