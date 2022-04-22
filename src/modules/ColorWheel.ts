interface IColorWheel {
  render: () => void;
}

function ColorWheel(): IColorWheel | null {
  const canvasColorWheel: HTMLCanvasElement | null = document.querySelector('#color-wheel');
  function draw() {
    const dpr = window.devicePixelRatio || 1;
    if (canvasColorWheel) {
      const ctx = canvasColorWheel.getContext('2d');
      const rect = canvasColorWheel.getBoundingClientRect();
      canvasColorWheel.width = rect.width * dpr;
      canvasColorWheel.height = rect.height * dpr;
      const radius = canvasColorWheel.width / 2;
      const x = canvasColorWheel.width / 2;
      const y = canvasColorWheel.height / 2;
      if (ctx) {
        // ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        for (let angle = 0; angle <= 360; angle += 5) {
          const startAngle = ((angle - 4) * Math.PI) / 180;
          const endAngle = (angle * Math.PI) / 180;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.arc(x, y, radius, startAngle, endAngle);
          ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
          ctx.fill();
          ctx.closePath();
        }
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius / 4, (-2 * Math.PI) / 180, (360 * Math.PI) / 180);
        ctx.clip();
        ctx.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
        ctx.closePath();
      }
    }
  }
  return {
    render: draw,
  };
}

export default ColorWheel;
