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
  const app = document.getElementById('app');
  const scrollContainer = ScrollContainer(app, true);

  function listener(event: WheelEvent) {
    const element = document.querySelector(window.location.hash);
    if (app && element) {
      // do smth
      console.log(event.deltaY);
    }
  }

  const main = () => {
    scrollContainer.initScroll('horizontal');

    if (`#${NAME_SLIDES.USING}` === window.location.hash) {
      scrollContainer.changeScrollDirection('vertical');
    }

    app?.addEventListener(
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
