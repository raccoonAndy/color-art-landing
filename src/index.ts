import App from './App';

// styles
import './styles/index.scss';

function main() {
  const app = App();
  app.loadingImages();
  app.render();
  app.scroll();
}

main();
