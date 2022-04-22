import App from './App';

// styles
import './styles/index.scss';

function initApp() {
  const app = App();
  app.preload();
  app.render();
  app.scroll();
  app.addColorWheel();
}

initApp();
