import { templates } from '../utils';
import AdjustmentColorWheel, { ADJUSTMENT_BUTTONS } from './AdjustmentColorWheel';
import SettingsAdjustmentColorWheel from './SettingsAdjustmentColorWheel';

interface IColorWheel {
  render: () => void;
  openAdjustment: (openButton?: Element | null, callback?: any) => void;
  closeAdjustment: (closeButton?: Element | null, callback?: any) => void;
}

function ColorWheel(): IColorWheel | null {
  const dpr = window.devicePixelRatio || 1;
  let timerShowModal: ReturnType<typeof setTimeout>;
  let timerHideModal: ReturnType<typeof setTimeout>;
  const canvasColorWheel: HTMLCanvasElement | null = document.querySelector('#color-wheel');
  const wrapperColorWheel = document.querySelector('[data-color-wheel]');

  if (!canvasColorWheel) return null;

  const ctx = canvasColorWheel.getContext('2d');
  const adjustmentColorWheel = AdjustmentColorWheel(ctx);

  function imageSmoothing(
    quality: 'high' | 'low' | 'medium' = 'high',
    enabled: boolean = true,
  ) {
    if (!ctx) return;
    ctx.imageSmoothingEnabled = enabled;
    ctx.imageSmoothingQuality = quality;
  }

  function ctxArc(
    adjustmentName: string | undefined,
    angle: number,
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) {
    if (!ctx) return;
    switch (adjustmentName) {
      case 'primary': {
        adjustmentColorWheel?.redrawColorWheel('primary', angle, x, y, radius, startAngle, endAngle);
        break;
      }
      case 'secondary': {
        adjustmentColorWheel?.redrawColorWheel('secondary', angle, x, y, radius, startAngle, endAngle);
        break;
      }
      case 'tertiary': {
        adjustmentColorWheel?.redrawColorWheel('tertiary', angle, x, y, radius, startAngle, endAngle);
        break;
      }
      case ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY: {
        adjustmentColorWheel?.redrawColorWheel(
          ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY,
          angle,
          x,
          y,
          radius,
          startAngle,
          endAngle,
        );
        break;
      }
      case ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY_TERTIARY: {
        adjustmentColorWheel?.redrawColorWheel(
          ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY_TERTIARY,
          angle,
          x,
          y,
          radius,
          startAngle,
          endAngle,
        );
        break;
      }
      case 'complementary_blue':
      case ADJUSTMENT_BUTTONS.COMPLEMENTARY: {
        adjustmentColorWheel?.redrawColorWheel(
          'complementary_blue',
          angle,
          x,
          y,
          radius,
          startAngle,
          endAngle,
        );
        break;
      }
      case 'warm':
      case ADJUSTMENT_BUTTONS.TEMPERATURE: {
        adjustmentColorWheel?.redrawColorWheel('warm', angle, x, y, radius, startAngle, endAngle);
        break;
      }
      case 'cool': {
        adjustmentColorWheel?.redrawColorWheel('cool', angle, x, y, radius, startAngle, endAngle);
        break;
      }
      default:
        ctx.arc(x, y, radius, startAngle, endAngle);
    }
  }

  function drawColorCircle(
    adjustmentName: string | undefined,
    x: number,
    y: number,
    radius: number,
  ) {
    if (!ctx) return;
    for (let angle = 0; angle < 360; angle += 5) {
      const startAngle = ((angle + 72 - 4) * Math.PI) / 180;
      const endAngle = ((angle + 72) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctxArc(adjustmentName, angle, x, y, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsla(${angle}, 100%, 50%, 1)`;
      ctx.fill();
    }
  }

  function cutCenter(x: number, y: number, radius: number) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius / 4, (-2 * Math.PI) / 180, (360 * Math.PI) / 180);
    ctx.clip();
    ctx.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
    ctx.closePath();
  }

  function drawColorWheel(adjustmentName?: string) {
    if (!canvasColorWheel || !wrapperColorWheel) return;
    const padding = 15;
    wrapperColorWheel?.setAttribute('style', 'display: flex !important');

    const canvasRect = canvasColorWheel.getBoundingClientRect();

    if (!canvasRect) return;

    canvasColorWheel.width = canvasRect.width * dpr;
    canvasColorWheel.height = canvasRect.height * dpr;

    const radius = canvasColorWheel.width / 2 - padding;
    const x = canvasColorWheel.width / 2;
    const y = canvasColorWheel.height / 2;

    imageSmoothing();
    drawColorCircle(adjustmentName, x, y, radius);
    cutCenter(x, y, radius);
  }

  function resetColorWheel() {
    drawColorWheel();
  }

  function hideModalColorWheel(closeButton?: Element | null, callback?: any) {
    const modalOverlay = document.querySelector('.color-wheel-modal__overlay');
    // eslint-disable-next-line max-len
    const closeModalButton = closeButton || document.querySelector('[data-color-wheel-button="close"]');
    closeModalButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      clearTimeout(timerShowModal);
      if (!modalOverlay) return;
      canvasColorWheel?.classList.add('fadeOut');
      canvasColorWheel?.classList.remove('fadeIn');
      if (event.currentTarget === closeModalButton) {
        modalOverlay.classList.remove('isActive');
        timerHideModal = setTimeout(() => {
          canvasColorWheel?.classList.remove('fadeOut');
          canvasColorWheel?.classList.remove('inModal');
          modalOverlay.remove();
          resetColorWheel();
        }, 500);
      }
      callback();
    });
  }

  function showModalColorWheel(openButton?: Element | null, callback?: any) {
    clearTimeout(timerHideModal);
    const openModalButton = openButton || document.querySelector('[data-color-wheel-button="open"]');
    openModalButton?.addEventListener('click', () => {
      const modalOverlay = document.createElement('div');
      modalOverlay.classList.add('color-wheel-modal__overlay');
      canvasColorWheel?.classList.add('fadeIn');
      document.body.appendChild(modalOverlay);
      const getTemplate = templates.load('./_templateColorWheel.html');
      getTemplate
        .then((data: HTMLTemplateElement | null) => {
          if (!data) return;
          const contentTemplate = data.content.cloneNode(true);
          modalOverlay.appendChild(contentTemplate);
        })
        .then(() => {
          timerShowModal = setTimeout(() => {
            modalOverlay.classList.add('isActive');
          }, 100);
          setTimeout(() => {
            canvasColorWheel?.classList.add('inModal');
          }, 500);
          adjustmentColorWheel?.onClickButton((adjustmentName: string) => {
            const setting = SettingsAdjustmentColorWheel();
            setting?.redrawColorWheel(adjustmentName, drawColorWheel);
          });
          callback();
        });
    });
  }

  function init() {
    if (!wrapperColorWheel) return;
    drawColorWheel();
  }

  return {
    render: init,
    openAdjustment: showModalColorWheel,
    closeAdjustment: hideModalColorWheel,
  };
}

export default ColorWheel;
