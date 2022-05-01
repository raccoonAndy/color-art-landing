import { ADJUSTMENT_BUTTONS } from './AdjustmentColorWheel';

interface ISettingsAdjustmentColorWheel {
  redrawColorWheel: (adjustmentName: string, callback?: any) => void;
}
function SettingsAdjustmentColorWheel(): ISettingsAdjustmentColorWheel | null {
  function drawPrimarySecondaryColors(callback: any) {
    let checked = 0;
    const checkboxesPrimarySecondary = document.querySelectorAll(
      '#color-wheel-primary, #color-wheel-secondary',
    ) as NodeListOf<HTMLInputElement>;

    function redrawCheckedCheckbox() {
      checkboxesPrimarySecondary?.forEach((checkbox: HTMLInputElement) => {
        if (checkbox.checked) {
          callback(checkbox.value);
        }
      });
    }
    checkboxesPrimarySecondary?.forEach((checkbox: HTMLInputElement) => {
      if (checkbox.checked) {
        checked += 1;
        if (checked === 2) {
          callback(ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY);
        } else {
          callback(checkbox.value);
        }
      }
      checkbox.addEventListener('change', (event) => {
        const item = event.target as HTMLInputElement;
        if (item.checked) {
          checked += 1;
          callback(item.value);
          if (checked === 2) {
            callback(ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY);
          }
        } else {
          checked -= 1;
          redrawCheckedCheckbox();
          if (checked === 0) {
            callback();
          }
        }
      });
    });
  }

  function drawTertiaryColors(callback: any) {
    callback(ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY);
    const checkboxTertiary = document.querySelector('#color-wheel-tertiary') as HTMLInputElement;
    const label = document.querySelector('#color-wheel-tertiary-label');

    if (!checkboxTertiary || !label) return;

    if (checkboxTertiary.checked) {
      callback(ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY_TERTIARY);
      label.innerHTML = 'Hide';
    }

    checkboxTertiary.addEventListener('change', (event) => {
      const item = event.target as HTMLInputElement;
      if (item.checked) {
        callback(ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY_TERTIARY);
        label.innerHTML = 'Hide';
      } else {
        callback(ADJUSTMENT_BUTTONS.PRIMARY_SECONDARY);
        label.innerHTML = 'Show';
      }
    });
  }

  function drawTemperatureColors(callback: any) {
    const radiosTemperature = document.querySelectorAll(
      '#color-wheel-warm, #color-wheel-cool',
    ) as NodeListOf<HTMLInputElement>;
    radiosTemperature?.forEach((radio: HTMLInputElement) => {
      if (radio.checked) {
        callback(radio.value);
      }
      radio.addEventListener('change', (event) => {
        const item = event.target as HTMLInputElement;
        if (item.checked) {
          callback(item.value);
        }
      });
    });
  }

  function redrawColorWheel(adjustmentName: string, callback?: any) {
    callback();
    switch (adjustmentName) {
      case ADJUSTMENT_BUTTONS.PRIMARY:
        drawPrimarySecondaryColors(callback);
        break;
      case ADJUSTMENT_BUTTONS.TERTIARY:
        drawTertiaryColors(callback);
        break;
      case ADJUSTMENT_BUTTONS.TEMPERATURE:
        drawTemperatureColors(callback);
        break;
      default:
        break;
    }
  }
  return {
    redrawColorWheel,
  };
}

export default SettingsAdjustmentColorWheel;
