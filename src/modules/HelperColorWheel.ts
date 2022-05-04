export interface IHelperColorWheel {
  drawPrimaries: (
    angle: number,
    startAngle: number,
    endAngle: number,
    showSecondaries?: boolean,
    showTertiaries?: boolean,
  ) => void;
  drawComplementaries: (
    angle: number,
    startAngle: number,
    endAngle: number,
  ) => void;
  drawTemperature: (
    angle: number,
    startAngle: number,
    endAngle: number,
    isCool?: boolean,
  ) => void;
  ctxArc: (
    arcX: number,
    arcY: number,
    arcRadius: number,
    arcAngle: number,
    arcStartAngle: number,
    arcEndAngle: number,
    arcOpacity?: number,
  ) => void;
  handleInputs: (id: string, callback: any) => void;
  resetAllInputs: () => void;
}
export const SETTINGS_COLOR_WHEEL = {
  GAP: 3,
  WIDTH: 5,
  PADDING: 15,
  ADD_LENGTH: 15,
};
function HelperColorWheel(
  ctx: CanvasRenderingContext2D | null,
  hue: number | undefined,
  x: number,
  y: number,
  radius: number,
): IHelperColorWheel | null {
  const COUNT_LINES = 360 / SETTINGS_COLOR_WHEEL.WIDTH;
  function ctxArc(
    arcX: number,
    arcY: number,
    arcRadius: number,
    arcAngle: number,
    arcStartAngle: number,
    arcEndAngle: number,
    arcOpacity: number = 1,
  ) {
    if (!ctx) return;
    ctx.arc(arcX, arcY, arcRadius, arcStartAngle, arcEndAngle);
    ctx.fillStyle = `hsla(${arcAngle}, 100%, 50%, ${arcOpacity})`;
    ctx.fill();
  }
  function drawPrimaries(
    angle: number,
    startAngle: number,
    endAngle: number,
    showSecondaries?: boolean,
    showTertiaries?: boolean,
  ) {
    let countSelectedColors = 3;
    if (showSecondaries) {
      countSelectedColors = 6;
    }
    if (showSecondaries && showTertiaries) {
      countSelectedColors = 12;
    }
    // gap between two selected color
    const gap = (COUNT_LINES / countSelectedColors) * SETTINGS_COLOR_WHEEL.WIDTH;

    const initHue = hue || 0;
    const valuesHue = [];

    for (let i = 0; i < countSelectedColors; i += 1) {
      const value = (initHue + gap * i) >= 360 ? (initHue + gap * i) - 360 : (initHue + gap * i);
      valuesHue.push(value);
    }

    let opacityPrimaries = 1;
    let opacitySecondaries = 1;
    let opacityOthers = 0.6;

    if (showSecondaries) {
      opacityPrimaries = 0.8;
      opacityOthers = 0.6;
    }

    if (showSecondaries && showTertiaries) {
      opacityPrimaries = 0.6;
      opacitySecondaries = 0.6;
      opacityOthers = 0.6;
    }

    let indexPrimaryColor2 = 1;
    let indexPrimaryColor3 = 2;
    let indexSecondaryColor1 = 1;
    let indexSecondaryColor2 = 3;
    let indexSecondaryColor3 = 5;
    if (showSecondaries) {
      indexPrimaryColor2 = 2;
      indexPrimaryColor3 = 4;
    }
    if (showSecondaries && showTertiaries) {
      indexPrimaryColor2 = 4;
      indexPrimaryColor3 = 8;
      indexSecondaryColor1 = 2;
      indexSecondaryColor2 = 6;
      indexSecondaryColor3 = 10;
    }

    const isPrimariesColors = angle === valuesHue[0]
      || angle === valuesHue[indexPrimaryColor2]
      || angle === valuesHue[indexPrimaryColor3];
    const isSecondariesColors = angle === valuesHue[indexSecondaryColor1]
        || angle === valuesHue[indexSecondaryColor2]
        || angle === valuesHue[indexSecondaryColor3];
    const isTertiariesColors = angle === valuesHue[1]
        || angle === valuesHue[3]
        || angle === valuesHue[5]
        || angle === valuesHue[7]
        || angle === valuesHue[9]
        || angle === valuesHue[11];

    const addedLengthPrimary = SETTINGS_COLOR_WHEEL.ADD_LENGTH;
    const addedLengthSecondary = SETTINGS_COLOR_WHEEL.ADD_LENGTH - 10;
    const addedLengthOthers = SETTINGS_COLOR_WHEEL.ADD_LENGTH * 2;

    // select tertiaries colors
    if (showTertiaries && showSecondaries) {
      if (isTertiariesColors) {
        ctxArc(x, y, radius - SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle);
      }
    }
    // select secondaries colors
    if (showSecondaries) {
      if (isSecondariesColors) {
        ctxArc(x, y, radius + addedLengthSecondary, angle, startAngle, endAngle, opacitySecondaries);
      }
    }
    // select primaries colors
    if (isPrimariesColors) {
      // eslint-disable-next-line max-len
      ctxArc(x, y, radius + addedLengthPrimary, angle, startAngle, endAngle, opacityPrimaries);
    }

    // other colors
    if (!isPrimariesColors && !isSecondariesColors && !isTertiariesColors) {
      // eslint-disable-next-line max-len
      ctxArc(x, y, radius - addedLengthOthers, angle, startAngle, endAngle, opacityOthers);
    }
  }
  function drawComplementaries(
    angle: number,
    startAngle: number,
    endAngle: number,
  ) {
    const countSelectedColors = 2;
    // gap between two selected color
    const gap = (COUNT_LINES / countSelectedColors) * SETTINGS_COLOR_WHEEL.WIDTH;
    const initHue = hue || 0;

    const priority = initHue >= 360 ? initHue - 360 : initHue;
    const complementary = initHue + gap >= 360 ? (initHue + gap) - 360 : initHue + gap;

    const isComplementaries = angle === priority || angle === complementary;

    // select complementaries colors
    if (isComplementaries) {
      ctxArc(x, y, radius + SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle);
    } else {
      // other colors
      ctxArc(x, y, radius - SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle, 0.6);
    }
  }
  function drawTemperature(
    angle: number,
    startAngle: number,
    endAngle: number,
    isCool?: boolean,
  ) {
    let isTemperature = (angle >= 0 && angle <= 95) || (angle >= 275 && angle <= 360);
    if (isCool) {
      isTemperature = angle >= 95 && angle < 280;
    }

    if (isTemperature) {
      ctxArc(x, y, radius + SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle);
    }

    // other colors
    if (!isTemperature) {
      ctxArc(x, y, radius - SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle, 0.6);
    }
  }

  function resetAllInputs() {
    const inputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    inputs?.forEach((checkbox: Element) => {
      const item = checkbox as HTMLInputElement;
      item.checked = false;
    });
  }

  function handleInputs(id: string, callback: any) {
    const inputs = document.querySelectorAll(`input[name="color-wheel-${id}"]`);
    if (!inputs) return;
    inputs.forEach((input) => {
      input.addEventListener('change', (event) => {
        event.stopPropagation();
        const element = event.target as HTMLInputElement;

        if (element.checked) {
          callback(element.value);
        } else {
          callback(id);
        }
      });
    });
  }
  return {
    drawPrimaries,
    drawComplementaries,
    drawTemperature,
    handleInputs,
    resetAllInputs,
    ctxArc,
  };
}

export default HelperColorWheel;
