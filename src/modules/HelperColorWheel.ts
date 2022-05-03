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
  ) {
    const countSelectedColors = 3;
    const gapRedGreen = (COUNT_LINES / countSelectedColors - 1) * SETTINGS_COLOR_WHEEL.WIDTH;
    // eslint-disable-next-line max-len
    const gapGreenBlue = (((COUNT_LINES / countSelectedColors) * 2) - 1) * SETTINGS_COLOR_WHEEL.WIDTH;

    const initHue = hue || 0;

    const red = initHue >= 360 ? initHue - 360 : initHue;
    const green = (initHue + gapRedGreen) >= 360
      ? (initHue + gapRedGreen) - 360
      : (initHue + gapRedGreen);
    const blue = (initHue + gapGreenBlue) >= 360
      ? (initHue + gapGreenBlue) - 360
      : (initHue + gapGreenBlue);

    if (angle === red || angle === green || angle === blue) {
      ctxArc(x, y, radius + SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle);
    }
    ctxArc(x, y, radius - SETTINGS_COLOR_WHEEL.ADD_LENGTH, angle, startAngle, endAngle, 0.8);
  }
  return {
    drawPrimaries,
    ctxArc,
  };
}

export default HelperColorWheel;
