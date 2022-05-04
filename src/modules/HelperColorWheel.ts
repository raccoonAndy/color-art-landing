interface IHelperColorWheel {
  drawPrimaries: (
    angle: number,
    startAngle: number,
    endAngle: number,
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
  ) {
    const countSelectedColors = showSecondaries ? 6 : 3;
    // gap between two selected color
    const gap = (COUNT_LINES / countSelectedColors) * SETTINGS_COLOR_WHEEL.WIDTH;

    const initHue = hue || 0;
    const valuesHue = [];

    for (let i = 0; i < countSelectedColors; i += 1) {
      const value = (initHue + gap * i) >= 360 ? (initHue + gap * i) - 360 : (initHue + gap * i);
      valuesHue.push(value);
    }

    // select secondaries colors
    if (showSecondaries) {
      if (angle === valuesHue[1]
        || angle === valuesHue[3]
        || angle === valuesHue[5]
      ) {
        ctxArc(x, y, radius, angle, startAngle, endAngle);
      }
    }

    // select primaries colors
    if (angle === valuesHue[0]
      || angle === valuesHue[showSecondaries ? 2 : 1]
      || angle === valuesHue[showSecondaries ? 4 : 2]) {
      ctxArc(x, y, radius + SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle);
    }

    // other colors
    ctxArc(x, y, radius - SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle, 0.8);
  }
  return {
    drawPrimaries,
    ctxArc,
  };
}

export default HelperColorWheel;
