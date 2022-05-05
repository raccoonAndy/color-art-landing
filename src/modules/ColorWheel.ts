import { templates, debounce } from '../utils';
import { BREAKPOINTS } from '../settings/_env';
import AdjustmentColorWheel, { ADJUSTMENT_BUTTONS } from './AdjustmentColorWheel';
import HelperColorWheel, { SETTINGS_COLOR_WHEEL, IHelperColorWheel } from './HelperColorWheel';

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
  const adjustmentColorWheel = AdjustmentColorWheel();
  let helperColorWheel: IHelperColorWheel | null;

  function imageSmoothing(
    quality: 'high' | 'low' | 'medium' = 'high',
    enabled: boolean = true,
  ) {
    if (!ctx) return;
    ctx.imageSmoothingEnabled = enabled;
    ctx.imageSmoothingQuality = quality;
  }

  function drawCircle(
    adjustmentName: string | undefined,
    hue: number | undefined,
    extra: number | undefined,
    x: number,
    y: number,
    radius: number,
  ) {
    if (!ctx) return;
    helperColorWheel = HelperColorWheel(ctx, hue, x, y, radius);
    for (let angle = 0; angle < 360; angle += SETTINGS_COLOR_WHEEL.WIDTH) {
      const deltaStart = SETTINGS_COLOR_WHEEL.GAP + SETTINGS_COLOR_WHEEL.WIDTH - 1;
      const startAngle = ((angle - deltaStart) * Math.PI) / 180;
      const endAngle = ((angle - SETTINGS_COLOR_WHEEL.GAP) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(x, y);
      switch (adjustmentName) {
        case ADJUSTMENT_BUTTONS.PRIMARY: {
          helperColorWheel?.drawPrimaries(angle, startAngle, endAngle);
          break;
        }
        case ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY: {
          helperColorWheel?.drawPrimaries(angle, startAngle, endAngle, true);
          break;
        }
        case ADJUSTMENT_BUTTONS.TERTIARY: {
          helperColorWheel?.drawPrimaries(angle, startAngle, endAngle, true, true);
          break;
        }
        case ADJUSTMENT_BUTTONS.COOL:
          helperColorWheel?.drawTemperature(angle, startAngle, endAngle, true);
          break;
        case ADJUSTMENT_BUTTONS.WARM:
        case ADJUSTMENT_BUTTONS.TEMPERATURE: {
          helperColorWheel?.drawTemperature(angle, startAngle, endAngle);
          break;
        }
        case ADJUSTMENT_BUTTONS.COMPLEMENTARY: {
          helperColorWheel?.drawComplementaries(angle, startAngle, endAngle);
          break;
        }
        case ADJUSTMENT_BUTTONS.TONE: {
          helperColorWheel?.drawTone(angle, startAngle, endAngle, extra);
          break;
        }
        case ADJUSTMENT_BUTTONS.SATURATED: {
          helperColorWheel?.drawSaturated(angle, startAngle, endAngle, extra);
          break;
        }
        case ADJUSTMENT_BUTTONS.OPACITY: {
          helperColorWheel?.drawOpacity(angle, startAngle, endAngle, extra);
          break;
        }
        default:
          helperColorWheel?.ctxArc(x, y, radius, angle, startAngle, endAngle);
          break;
      }
      ctx.closePath();
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

  function drawColorWheel(adjustmentName?: string, hue?: number, extra?: number) {
    if (!canvasColorWheel || !wrapperColorWheel) return;
    wrapperColorWheel?.setAttribute('style', 'display: flex !important');

    const canvasRect = canvasColorWheel.getBoundingClientRect();

    if (!canvasRect) return;

    canvasColorWheel.width = canvasRect.width * dpr;
    canvasColorWheel.height = canvasRect.height * dpr;

    const radius = canvasColorWheel.width / 2 - SETTINGS_COLOR_WHEEL.PADDING;
    const x = canvasColorWheel.width / 2;
    const y = canvasColorWheel.height / 2;

    imageSmoothing();
    drawCircle(adjustmentName, hue, extra, x, y, radius);
    cutCenter(x, y, radius);
  }

  function resetColorWheel() {
    drawColorWheel();
  }

  function handleClickOnCanvas(event: MouseEvent, adjustmentName?: string) {
    event.stopPropagation();
    const target = event.target as HTMLCanvasElement | null;
    if (!target) return;
    const rectTarget = target.getBoundingClientRect();
    if (!rectTarget) return;

    const x0 = (rectTarget.width * dpr) / 4;
    const y0 = (rectTarget.height * dpr) / 4;
    const x1 = event.clientX - rectTarget.left;
    const y1 = event.clientY - rectTarget.top;

    const rad = Math.atan2(y1 - y0, x1 - x0);
    let angle = Math.floor(rad * (180 / Math.PI));
    let diff = 0.746;
    if (angle >= -180 && angle <= -5) {
      angle = 360 + angle === 360 ? 0 : 360 + angle;
      diff = 0.726;
    }
    const hue = (Math.floor(((angle * diff) / 360) * 100) + 1) * 5;
    drawColorWheel(adjustmentName, hue);
  }

  function handleChangesColorWheel(adjustmentName: string) {
    canvasColorWheel?.addEventListener(
      'click',
      (event) => handleClickOnCanvas(event, adjustmentName),
    );
    helperColorWheel?.addInputsListeners(adjustmentName, (
      name: string,
      hue: number,
      extra: number,
    ) => {
      drawColorWheel(name, hue, extra);
      canvasColorWheel?.addEventListener(
        'click',
        (event) => handleClickOnCanvas(event, name),
      );
    });
  }

  function initColorWheel(adjustmentName: string) {
    const caption = document.querySelector('#color-wheel-modal__caption');
    if (adjustmentName === ADJUSTMENT_BUTTONS.PRIMARY
      || adjustmentName === ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY
      || adjustmentName === ADJUSTMENT_BUTTONS.TERTIARY
      || adjustmentName === ADJUSTMENT_BUTTONS.COMPLEMENTARY) {
      caption?.classList.add('isActive');
    } else {
      caption?.classList.remove('isActive');
    }
    drawColorWheel(adjustmentName, 0);
    const inputs = document.querySelectorAll(`input[name="color-wheel-${adjustmentName}"]`);
    inputs?.forEach((input: Element) => {
      const item = input as HTMLInputElement;
      if (item.checked) {
        drawColorWheel(item.value);
      } else if (item.type === 'range') {
        drawColorWheel(adjustmentName, 0, parseInt(item.value, 10));
      }
    });

    handleChangesColorWheel(adjustmentName);
  }

  function destroyModal(modalOverlay: Element | null, callback?: any) {
    clearTimeout(timerShowModal);
    if (!modalOverlay) return;
    canvasColorWheel?.addEventListener('click', resetColorWheel);
    canvasColorWheel?.classList.add('fadeOut');
    canvasColorWheel?.classList.remove('fadeIn');
    modalOverlay.classList.remove('isActive');
    timerHideModal = setTimeout(() => {
      canvasColorWheel?.classList.remove('fadeOut');
      canvasColorWheel?.classList.remove('inModal');
      modalOverlay.remove();
      resetColorWheel();
    }, 500);
    callback();
    helperColorWheel?.removeInputsListeners();
    adjustmentColorWheel?.removeClickListener();
  }

  function hideModalColorWheel(closeButton?: Element | null, callback?: any, isAuto: boolean = false) {
    const modalOverlay = document.querySelector('.color-wheel-modal__overlay');
    // eslint-disable-next-line max-len
    const closeModalButton = closeButton || document.querySelector('[data-color-wheel-button="close"]');
    if (isAuto) destroyModal(modalOverlay);
    closeModalButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.currentTarget === closeModalButton) {
        destroyModal(modalOverlay, callback);
      }
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
          adjustmentColorWheel?.addClickListener((adjustmentName: string) => {
            initColorWheel(adjustmentName);
          });
          callback();
        });
    });
  }

  function init() {
    if (!wrapperColorWheel) return;
    drawColorWheel();
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth < BREAKPOINTS.SM) {
        hideModalColorWheel(null, null, true);
      }
    }, 300));
  }

  return {
    render: init,
    openAdjustment: showModalColorWheel,
    closeAdjustment: hideModalColorWheel,
  };
}

export default ColorWheel;
