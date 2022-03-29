import { debounce } from '../utils';

interface IPopup {
  init: () => void;
}
function Popup(): IPopup {
  let timerAddClassActive: ReturnType<typeof setTimeout>;

  function getPositionPopup(event: Event, popup: Element) {
    let top = 0;
    let left = 0;
    if (event instanceof MouseEvent) {
      top = event.pageY;
      left = event.pageX;
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
    }

    return `--offset-y: ${top}px; --offset-x: ${left}px`;
  }
  function setPositionPopup(event: Event, popup: Element) {
    popup.setAttribute('style', getPositionPopup(event, popup));
    window.addEventListener(
      'resize',
      debounce(() => {
        popup.setAttribute('style', getPositionPopup(event, popup));
      }, 10),
    );
  }
  function createPopup(event: Event, text: string | null) {
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

    setPositionPopup(event, popup);
  }

  async function hide(popup: Element | null) {
    clearTimeout(timerAddClassActive);
    if (popup?.classList.contains('popup--active')) {
      popup?.classList.remove('popup--active');
    }
    popup?.remove();
  }

  function show(event: Event, button: Element) {
    const text = button.getAttribute('data-popup-text');
    if (text) {
      createPopup(event, text);
    }
  }

  function init() {
    const buttons = document.querySelectorAll('[data-popup-button]');
    if (buttons) {
      buttons.forEach((button) => {
        button.addEventListener('mouseenter', (event) => {
          event.stopPropagation();
          show(event, button);
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
