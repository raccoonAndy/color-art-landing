import './styles/index.scss';
import ScrollContainer from './modules/ScrollContainer';

interface IApp {
  render: () => void
}

function App(): IApp {
  const scrollContainer = document.getElementById('app');
  const slides = document.querySelectorAll('#app > .slide');
  const main = () => {
    ScrollContainer(scrollContainer, slides).init();
  };

  return {
    render: main,
  };
}

const app = App();
app.render();
