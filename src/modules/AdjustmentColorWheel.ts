import { VALUE_HUE_COLOR } from '../settings/_env';

export const ADJUSTMENT_BUTTONS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  PRIMARY_SECONDARY: 'primary_secondary',
  TERTIARY: 'tertiary',
  COMPLEMENTARY: 'complementary',
  TEMPERATURE: 'temperature',
  SATURATED: 'saturated',
  TONE: 'tone',
  OPACITY: 'opacity',
};

interface IAdjustmentColorWheel {
  draw: (
    adjustmentName: string,
    angle: number,
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => void;
  renderTitleAndDescription: (
    activeButton: Element | null,
    title: string,
    callback?: any
  ) => void;
  onClickButton: (callback?: any) => void;
}

function AdjustmentColorWheel(
  ctx: CanvasRenderingContext2D | null,
): IAdjustmentColorWheel | null {
  function redraw(
    adjustmentName: string,
    angle: number,
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) {
    if (!ctx) return;
    let condition: boolean = false;
    const activeLength = 15;
    switch (adjustmentName) {
      case 'primary':
        condition = angle === VALUE_HUE_COLOR.LIGHT_RED
        || angle === VALUE_HUE_COLOR.YELLOW
        || angle === VALUE_HUE_COLOR.BLUE;
        break;
      case 'secondary': {
        condition = angle === VALUE_HUE_COLOR.ORANGE
        || angle === VALUE_HUE_COLOR.GREEN
        || angle === VALUE_HUE_COLOR.PURPLE;
        break;
      }
      case ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY: {
        condition = angle === VALUE_HUE_COLOR.LIGHT_RED
        || angle === VALUE_HUE_COLOR.YELLOW
        || angle === VALUE_HUE_COLOR.BLUE
        || angle === VALUE_HUE_COLOR.ORANGE
        || angle === VALUE_HUE_COLOR.GREEN
        || angle === VALUE_HUE_COLOR.PURPLE;
        break;
      }
      case 'complementary_blue': {
        condition = angle === VALUE_HUE_COLOR.DARK_ORANGE || angle === VALUE_HUE_COLOR.BLUE;
        break;
      }
      case 'warm': {
        condition = (angle >= VALUE_HUE_COLOR.RED && angle < VALUE_HUE_COLOR.TEAL)
        || angle >= VALUE_HUE_COLOR.LIGHT_RED;
        break;
      }
      case 'cool': {
        condition = angle > VALUE_HUE_COLOR.TEAL && angle < VALUE_HUE_COLOR.LIGHT_RED;
        break;
      }
      default:
        break;
    }
    if (condition) {
      ctx.arc(x, y, radius + activeLength, startAngle, endAngle);
    } else {
      ctx.arc(x, y, radius - activeLength, startAngle, endAngle);
    }
  }

  async function removeActiveClasses(elements: NodeListOf<Element> | null) {
    if (!elements) return;

    await elements.forEach((element: Element) => {
      const item = element as HTMLElement;
      if (item.classList.contains('isActive')) {
        item.classList.remove('isActive');
      }
    });
  }

  async function getTitleAndDescription(button: Element | null) {
    await (function () {
      const adjustmentTitle = button?.getAttribute('data-color-wheel-adjustment-title');
      const adjustmentDescription = button?.getAttribute(
        'data-color-wheel-adjustment-description',
      );

      if (adjustmentTitle || adjustmentDescription) {
        const containerTitle = document.querySelector('#color-wheel-title');
        const containerDescription = document.querySelector('#color-wheel-description');
        if (containerTitle && adjustmentTitle) {
          containerTitle.innerHTML = adjustmentTitle;
        }
        if (containerDescription && adjustmentDescription) {
          containerDescription.innerHTML = adjustmentDescription;
        }
      }
    }());
  }

  function renderTitleAndDescription(
    activeButton: Element | null,
    title: string,
    callback?: any,
  ) {
    const siblingsButtons = document.querySelectorAll(
      `[data-color-wheel-adjustment-name]:not([data-color-wheel-adjustment-name="${title}"]),
      #color-wheel-modal__description`,
    );
    const wrapperDescription = document.querySelector('#color-wheel-modal__description');
    removeActiveClasses(siblingsButtons).then(() => {
      activeButton?.classList.add('isActive');
      const ms = wrapperDescription?.classList.contains('isActive') ? 0 : 200;
      setTimeout(() => {
        getTitleAndDescription(activeButton).then(() => {
          wrapperDescription?.classList.add('isActive');
        });
      }, ms);
    });
    callback();
  }
  function renderSettingsComponent(adjustmentName: string) {
    const settings = document.querySelectorAll('.color-wheel-modal__adjustment--setting');
    removeActiveClasses(settings).then(() => {
      const setting = document.getElementById(`color-wheel-setting-${adjustmentName}`);
      if (!setting) return;
      setting.classList.add('isActive');
    });
  }
  function onClickButton(callback?: any) {
    Object.values(ADJUSTMENT_BUTTONS).forEach((adjustmentName) => {
      const button = document.querySelector(
        `[data-color-wheel-adjustment-name="${adjustmentName}"]`,
      );
      button?.addEventListener('click', (event) => {
        event.stopPropagation();
        const activeButton = event.currentTarget as Element;
        renderTitleAndDescription(activeButton, adjustmentName, () => callback(adjustmentName));
        renderSettingsComponent(adjustmentName);
      });
    });
  }
  return {
    onClickButton,
    renderTitleAndDescription,
    draw: redraw,
  };
}

export default AdjustmentColorWheel;
