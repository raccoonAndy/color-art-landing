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
  drawTone: (angle: number,
    startAngle: number,
    endAngle: number,
    tone: number | undefined,
  ) => void;
  drawSaturated: (angle: number,
    startAngle: number,
    endAngle: number,
    saturated: number | undefined,
  ) => void;
  drawOpacity: (angle: number,
    startAngle: number,
    endAngle: number,
    opacity: number | undefined,
  ) => void;
  ctxArc: (
    arcX: number,
    arcY: number,
    arcRadius: number,
    arcAngle: number,
    arcStartAngle: number,
    arcEndAngle: number,
    arcOpacity?: number,
    arcSaturated?: number,
  ) => void;
  addInputsListeners: (id: string, callback?: any) => void;
  removeInputsListeners: (callback?: any) => void;
}
export const SETTINGS_COLOR_WHEEL = {
  GAP: 3,
  WIDTH: 5,
  PADDING: 15,
  ADD_LENGTH: 10,
};
function HelperColorWheel(
  ctx: CanvasRenderingContext2D | null,
  hue: number | undefined,
  x: number,
  y: number,
  radius: number,
): IHelperColorWheel | null {
  const COUNT_LINES = 360 / SETTINGS_COLOR_WHEEL.WIDTH;
  let registerSliderListener: any;
  let registerSwitchListener: any;

  function ctxArc(
    arcX: number,
    arcY: number,
    arcRadius: number,
    arcAngle: number,
    arcStartAngle: number,
    arcEndAngle: number,
    arcOpacity: number = 1,
    arcSaturated: number = 100,
    arcTone: number = 50,
  ) {
    if (!ctx) return;
    ctx.arc(arcX, arcY, arcRadius, arcStartAngle, arcEndAngle);
    ctx.fillStyle = `hsla(${arcAngle}, ${arcSaturated}%, ${arcTone}%, ${arcOpacity})`;
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
    let saturatedPrimaries = 100;
    let saturatedSecondaries = 100;

    if (showSecondaries) {
      opacityPrimaries = 0.8;
      saturatedPrimaries = 80;
    }

    if (showSecondaries && showTertiaries) {
      opacityPrimaries = 0.8;
      opacitySecondaries = 0.8;
      saturatedPrimaries = 80;
      saturatedSecondaries = 80;
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

    let addedLengthPrimary = SETTINGS_COLOR_WHEEL.ADD_LENGTH;
    let addedLengthSecondary = SETTINGS_COLOR_WHEEL.ADD_LENGTH - 10;
    const addedLengthOthers = SETTINGS_COLOR_WHEEL.ADD_LENGTH * 3;
    const addedLengthTertiary = SETTINGS_COLOR_WHEEL.ADD_LENGTH;

    if (showSecondaries && !showTertiaries) {
      addedLengthPrimary = SETTINGS_COLOR_WHEEL.ADD_LENGTH * 3 * -1;
    }

    if (showSecondaries && showTertiaries) {
      addedLengthPrimary = SETTINGS_COLOR_WHEEL.ADD_LENGTH * 3 * -1;
      addedLengthSecondary = SETTINGS_COLOR_WHEEL.ADD_LENGTH * 3 * -1;
    }

    // select tertiaries colors
    if (showTertiaries && showSecondaries) {
      if (isTertiariesColors) {
        ctxArc(x, y, radius + addedLengthTertiary, angle, startAngle, endAngle);
      }
    }
    // select secondaries colors
    if (showSecondaries) {
      if (isSecondariesColors) {
        // eslint-disable-next-line max-len
        ctxArc(x, y, radius + addedLengthSecondary, angle, startAngle, endAngle, opacitySecondaries, saturatedSecondaries);
      }
    }
    // select primaries colors
    if (isPrimariesColors) {
      // eslint-disable-next-line max-len
      ctxArc(x, y, radius + addedLengthPrimary, angle, startAngle, endAngle, opacityPrimaries, saturatedPrimaries);
    }

    // other colors
    if (!isPrimariesColors && !isSecondariesColors && !isTertiariesColors) {
      // eslint-disable-next-line max-len
      ctxArc(x, y, radius - addedLengthOthers, angle, startAngle, endAngle, 0.3, 100, 34);
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
      ctxArc(x, y, radius - SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle, 0.3, 100, 34);
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
      ctxArc(x, y, radius - SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle, 0.3, 100, 34);
    }
  }

  function drawTone(
    angle: number,
    startAngle: number,
    endAngle: number,
    tone: number | undefined,
  ) {
    ctxArc(x, y, radius, angle, startAngle, endAngle, 1, 100, tone);
  }

  function drawSaturated(
    angle: number,
    startAngle: number,
    endAngle: number,
    saturated: number | undefined,
  ) {
    ctxArc(x, y, radius, angle, startAngle, endAngle, 1, saturated);
  }

  function drawOpacity(
    angle: number,
    startAngle: number,
    endAngle: number,
    opacity: number | undefined,
  ) {
    ctxArc(x, y, radius, angle, startAngle, endAngle, (opacity || opacity === 0) ? (opacity / 100) : 1);
  }

  function handleSliderListener(event: Event, id: string, callback?: any) {
    event.stopPropagation();
    const element = event.target as HTMLInputElement;
    const containerValue = element.previousElementSibling;
    const value = parseInt(element.value, 10);
    const min = parseInt(element.min, 10);
    const max = parseInt(element.max, 10);
    const percentages = (100 * (value - min)) / (max - min);
    containerValue?.setAttribute('data-slider-value', `${element.value}%`);
    // eslint-disable-next-line max-len
    element.style.background = `linear-gradient(90deg, var(--primary) ${percentages}%, var(--bg-range-slider-default) ${percentages}%)`;
    callback(id, 0, value);
  }

  function handleSwitchListener(event: Event, id: string, callback?: any) {
    event.stopPropagation();
    const element = event.target as HTMLInputElement;

    if (element.type !== 'range') {
      if (element.checked) {
        callback(element.value, 0);
      } else {
        callback(id, 0);
      }
    }
  }

  function bindSwitchListener(id: string, callback?: any) {
    return function (event: Event) {
      const context = this;
      handleSwitchListener.apply(context, [event, id, callback]);
    };
  }

  function bindSliderListener(id: string, callback?: any) {
    return function (event: Event) {
      const context = this;
      handleSliderListener.apply(context, [event, id, callback]);
    };
  }

  function addInputsListeners(id: string, callback?: any) {
    const inputs = document.querySelectorAll(`input[name="color-wheel-${id}"]`);
    if (!inputs) return;
    inputs.forEach((input) => {
      registerSliderListener = bindSliderListener.bind(input, id, callback)();
      registerSwitchListener = bindSwitchListener.bind(input, id, callback)();
      input.addEventListener('input', registerSliderListener);
      input.addEventListener('change', registerSwitchListener);
    });
  }

  function removeInputsListeners(callback?: any) {
    const inputs = document.querySelectorAll('input[name*="color-wheel"]');
    if (!inputs) return;
    inputs.forEach((input) => {
      input.removeEventListener('input', registerSliderListener);
      input.removeEventListener('change', registerSwitchListener);
    });
    callback();
  }
  return {
    drawPrimaries,
    drawComplementaries,
    drawTemperature,
    drawTone,
    drawSaturated,
    drawOpacity,
    addInputsListeners,
    removeInputsListeners,
    ctxArc,
  };
}

export default HelperColorWheel;
