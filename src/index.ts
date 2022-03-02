import './styles/index.scss';
import LandingScroll from './modules/LandingScroll';

function App(): any {
  const main = () => {
    LandingScroll().init();
  };

  return {
    render: main,
  };
}

const app = App();
app.render();
