import App from './App';

// styles
import './styles/index.scss';

function initApp() {
  const app = App();
  app.loadingImages();
  app.render();
  app.scroll();
}

function doneLoading() {
  const progress = document.getElementById('progress');
  const overlay = document.getElementById('loader');
  if (overlay) {
    // overlay.style.opacity = '0';
    setTimeout(() => {
      // overlay.style.display = 'none';
    }, 1200);
  }
  if (progress && !progress.classList.contains('isAnimate')) {
    progress.classList.add('isAnimate');
  }
  initApp();
}

function loader() {
  const progressStat = document.getElementById('progress__stat');
  const heightProgressStat = progressStat?.clientHeight || 0;
  const img = document.images;
  const tot = img.length;
  let c = 0;
  if (tot === 0) return doneLoading();
  document.body.setAttribute(
    'style',
    `--translate-progress-stat: ${heightProgressStat * tot * -1}px`,
  );

  for (let i = 0; i < tot; i += 1) {
    const span = document.createElement('span');
    if (progressStat) {
      progressStat.appendChild(span);
    }
  }

  const spans = document.querySelectorAll('#progress__stat > span:not(:first-child)');

  function imgLoaded() {
    c += 1;
    const percents = (((100 / tot) * c) << 0).toString().split('');
    for (let i = 0; i < percents.length; i += 1) {
      if (spans[c - 1]) {
        const span = document.createElement('span');
        span.innerHTML = `${percents[i]}`;
        spans[c - 1].appendChild(span);
      }
    }
    if (c === tot) return doneLoading();
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

document.addEventListener('DOMContentLoaded', loader, false);
