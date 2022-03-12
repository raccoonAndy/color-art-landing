import { debounce } from '../utils';

interface IPopup {
  init: () => void;
}
function Popup(): IPopup {
  let timerAddClassActive: ReturnType<typeof setTimeout>;

  function getPositionPopup(button: Element, popup: Element) {
    let { top, left } = button.getBoundingClientRect();
    if (top + popup.clientHeight > window.innerHeight) {
      top -= popup.clientHeight - 10;
      if (top < 0) {
        top = 0;
      }
    }
    if (left + popup.clientWidth > window.innerWidth) {
      left -= popup.clientWidth - 10;
      if (left < 0) {
        left = 0;
      }
    }
    return `--popup-top: ${top}px; --popup-left: ${left}px`;
  }
  function setPositionPopup(button: Element, popup: Element) {
    popup.setAttribute('style', getPositionPopup(button, popup));
    window.addEventListener(
      'resize',
      debounce(() => {
        popup.setAttribute('style', getPositionPopup(button, popup));
      }, 10),
    );
  }
  function createPopup(button: Element, text: string | null) {
    const popup = document.createElement('aside');
    popup.classList.add('popup');
    popup.setAttribute('role', 'note');
    popup.id = 'popup';
    if (text) {
      popup.innerHTML = `<p>${text}</p>`;
    }
    document.body.appendChild(popup);

    timerAddClassActive = setTimeout(() => {
      if (!popup.classList.contains('popup--active')) {
        popup.classList.add('popup--active');
      }
    }, 200);

    setPositionPopup(button, popup);
  }

  async function hide(popup: Element | null) {
    clearTimeout(timerAddClassActive);

    const promise = new Promise((resolve) => {
      if (popup?.classList.contains('popup--active')) {
        popup?.classList.remove('popup--active');
      }
      setTimeout(() => {
        resolve('isRemovedClassActive');
      }, 300);
    });
    promise.then((successMessage) => {
      if (successMessage === 'isRemovedClassActive') {
        popup?.remove();
      }
    });
  }

  function show(button: Element) {
    const text = button.getAttribute('data-popup-text');
    if (text) {
      createPopup(button, text);
    }
  }

  function init() {
    const buttons = document.querySelectorAll('[data-popup-button]');
    if (buttons) {
      buttons.forEach((button) => {
        button.addEventListener('mouseenter', (event) => {
          event.stopPropagation();
          show(button);
        });
        button.addEventListener('mouseleave', (event) => {
          const popup = document.querySelector('#popup');
          if (event instanceof MouseEvent) {
            if (event.relatedTarget !== popup) {
              hide(popup);
            } else {
              popup?.addEventListener('mouseleave', () => {
                hide(popup);
              });
            }
          }
        });
      });
    }
  }

  return {
    init,
  };
}

export default Popup;
