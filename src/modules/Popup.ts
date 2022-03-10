import { debounce } from '../utils';

interface IPopup {
  init: () => void;
}
function Popup(): IPopup {
  function createWrapperPopup(element: Element) {
    const wrapperPopup = document.createElement('div');
    wrapperPopup.classList.add('popup-wrapper');
    wrapperPopup.addEventListener('click', (event) => {
      if (event.target === wrapperPopup) {
        element.setAttribute('aria-pressed', 'false');
        document.body.removeAttribute('style');
        wrapperPopup.remove();
      }
    }, false);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(wrapperPopup);

    return wrapperPopup;
  }
  function getPositionPopup(element: Element, popup: Element) {
    let { top, left } = element.getBoundingClientRect();
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
  function setPositionPopup(element: Element, popup: Element) {
    popup.setAttribute('style', getPositionPopup(element, popup));
    window.addEventListener('resize', debounce(() => {
      popup.setAttribute('style', getPositionPopup(element, popup));
    }, 10));
  }
  function createPopup(element: Element, text: string | null) {
    const wrapperPopup = createWrapperPopup(element);
    const popup = document.createElement('aside');
    popup.classList.add('popup');
    popup.setAttribute('role', 'note');
    popup.id = 'popup';
    if (text) {
      popup.innerHTML = `<p>${text}</p>`;
    }

    if (!popup.classList.contains('popup--active')) {
      popup.classList.add('popup--active');
    }

    wrapperPopup.appendChild(popup);
    setPositionPopup(element, popup);
  }
  function show(element: Element) {
    element.setAttribute('aria-pressed', 'true');
    const text = element.getAttribute('data-popup-text');
    if (text) {
      createPopup(element, text);
    }
  }

  function handlePopup(event: Event, element: Element) {
    event.stopPropagation();
    if (element.getAttribute('aria-pressed') !== 'true') {
      show(element);
    }
  }

  function init() {
    const buttons = document.querySelectorAll('[data-popup-button]');
    if (buttons) {
      buttons.forEach((button) => {
        button.addEventListener('click', (event) => handlePopup(event, button));
      });
    }
  }

  return {
    init,
  };
}

export default Popup;
