import './styles/index.scss';
// import ScrollObserver from './modules/ScrollObserver';
import ScrollContainer from './modules/ScrollContainer';

interface IApp {
  render: () => void
}

const NAME_SLIDES = {
  HOME: 'home',
  COLOR: 'color',
  USING: 'using',
  END: 'end',
};

function App(): IApp {
  const scrollContainer = document.getElementById('app');
  const main = () => {
    const scrollApp = ScrollContainer(scrollContainer, true);
    scrollApp.init();
    let orientation: string = 'horizontal';
    if (`#${NAME_SLIDES.USING}` === window.location.hash) {
      orientation = 'vertical';
    }
    scrollApp.addScroll(orientation);

    /*
    const slides = scrollContainer?.children;
    if (slides) {
      const options = {
        root: scrollContainer,
        rootMargin: '0px',
        threshold: 0.99,
      };
      ScrollObserver((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === NAME_SLIDES.USING) {
            orientation = 'vertical';
            scrollApp.addScroll(orientation);
          }
        }
      })(options, slides);
    }
    */
  };

  return {
    render: main,
  };
}

const app = App();
app.render();
