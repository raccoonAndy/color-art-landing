export const ADJUSTMENT_BUTTONS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  PRIMARY_SECONDARY: 'primary_secondary',
  COMPLEMENTARY: 'complementary',
  TEMPERATURE: 'temperature',
  WARM: 'warm',
  COOL: 'cool',
  SATURATED: 'saturated',
  TONE: 'tone',
  OPACITY: 'opacity',
};

interface IAdjustmentColorWheel {
  renderTitleAndDescription: (
    activeButton: Element | null,
    title: string,
    callback?: any
  ) => void;
  onClickButton: (callback?: any) => void;
}

function AdjustmentColorWheel(): IAdjustmentColorWheel | null {
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
        if (!activeButton.classList.contains('isActive')) {
          renderTitleAndDescription(activeButton, adjustmentName, () => callback(adjustmentName));
          renderSettingsComponent(adjustmentName);
        }
      });
    });
  }
  return {
    onClickButton,
    renderTitleAndDescription,
  };
}

export default AdjustmentColorWheel;
