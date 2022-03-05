import './styles/index.scss';
import ScrollContainer from './modules/ScrollContainer';
import debounce from './utils/debounce';

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
  const scrollApp = ScrollContainer(scrollContainer, true);

  function listener(event: WheelEvent) {
    const element = document.querySelector(window.location.hash);
    if (scrollContainer && element) {
      // do smth
      console.log(event.deltaY);
    }
  }

  const main = () => {
    scrollApp.initScroll('horizontal');

    if (`#${NAME_SLIDES.USING}` === window.location.hash) {
      scrollApp.changeScrollDirection('vertical');
    }

    scrollContainer?.addEventListener(
      'wheel',
      (event) => debounce(listener(event), 500),
      { passive: false },
    );
  };

  return {
    render: main,
  };
}

const app = App();
app.render();
