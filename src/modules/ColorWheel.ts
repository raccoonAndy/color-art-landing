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

  function imageSmoothing(
    quality: 'high' | 'low' | 'medium' = 'high',
    enabled: boolean = true,
  ) {
    if (!ctx) return;
    ctx.imageSmoothingEnabled = enabled;
    ctx.imageSmoothingQuality = quality;
  }

  function drawColorCircle(
    x: number,
    y: number,
    radius: number,
    opacity?: number,
    black: boolean = false,
  ) {
    if (!ctx) return;
    for (let angle = 0; angle < 360; angle += 5) {
      const startAngle = ((angle - 4) * Math.PI) / 180;
      const endAngle = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = black ? 'hsl(0, 0%, 0%)' : `hsla(${angle}, 100%, 50%, ${opacity || 1})`;
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

  function getColor() {
    if (!canvasColorWheel) return;

    canvasColorWheel.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      const canvasRect = canvasColorWheel?.getBoundingClientRect();
      if (!canvasRect) return null;

      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;
      const imgData = ctx?.getImageData(x, y, dpr, dpr);
      const red = imgData?.data[0];
      const green = imgData?.data[1];
      const blue = imgData?.data[2];
      // const blue = imgData?.data[0];

      console.log(red, green, blue);

      return true;
    });
  }

  function drawColorWheel() {
    if (!canvasColorWheel || !wrapperColorWheel) return;
    wrapperColorWheel?.setAttribute('style', 'display: flex !important');

    const canvasRect = canvasColorWheel.getBoundingClientRect();

    if (!canvasRect) return;

    canvasColorWheel.width = canvasRect.width * dpr;
    canvasColorWheel.height = canvasRect.height * dpr;

    const radius = canvasColorWheel.width / 2;
    const x = canvasColorWheel.width / 2;
    const y = canvasColorWheel.height / 2;

    imageSmoothing();
    drawColorCircle(x, y, radius);
    cutCenter(x, y, radius);
  }

  function hideModalColorWheel(closeButton?: Element | null, callback?: any) {
    const modalOverlay = document.querySelector('.color-wheel-modal__overlay');
    // eslint-disable-next-line max-len
    const closeModalButton = closeButton || document.querySelector('[data-color-wheel-button="close"]');
    closeModalButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      clearTimeout(timerShowModal);
      if (!modalOverlay) return;
      if (event.currentTarget === closeModalButton) {
        modalOverlay.classList.remove('isActive');
        canvasColorWheel?.classList.remove('inModal');
        timerHideModal = setTimeout(() => {
          modalOverlay.remove();
        }, 500);
      }
      callback();
    });
  }

  function showModalColorWheel(openButton?: Element | null, callback?: any) {
    clearTimeout(timerHideModal);
    // eslint-disable-next-line max-len
    const openModalButton = openButton || document.querySelector('[data-color-wheel-button="open"]');
    openModalButton?.addEventListener('click', () => {
      const modalOverlay = document.createElement('div');
      // eslint-disable-next-line max-len
      const template: HTMLTemplateElement | null = document.querySelector('#color-wheel-modal');
      if (!template) return;
      modalOverlay.classList.add('color-wheel-modal__overlay');
      canvasColorWheel?.classList.add('inModal');
      document.body.appendChild(modalOverlay);
      const contentTemplate = template.content.cloneNode(true);
      modalOverlay.appendChild(contentTemplate);

      timerShowModal = setTimeout(() => {
        modalOverlay.classList.add('isActive');
      }, 100);
      callback();
    });
  }

  function init() {
    if (!wrapperColorWheel) return;

    drawColorWheel();
    getColor();
  }

  return {
    render: init,
    openAdjustment: showModalColorWheel,
    closeAdjustment: hideModalColorWheel,
  };
}

export default ColorWheel;
