import './styles/index.scss';
import ScrollContainer from './modules/ScrollContainer';

interface IApp {
  render: () => void
}

function App(): IApp {
  const scrollContainer = document.getElementById('app');
  const main = () => {
    const scrollApp = ScrollContainer(scrollContainer, true);
    scrollApp.init();
  };

  return {
    render: main,
  };
}

const app = App();
app.render();
