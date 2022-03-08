interface ITooltip {
  init: () => void;
}

function Tooltip(): ITooltip {
  function init() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips?.forEach((tooltip) => {
      const count: number = parseInt(
        tooltip.getAttribute('data-tooltip-count') || '1',
        10,
      );
      for (let i = 0; i < count; i += 1) {
        const pointer = document.createElement('div');
        pointer.classList.add('painting-pointer');
        tooltip.appendChild(pointer);
      }
    });
  }
  return {
    init,
  };
}

export default Tooltip;
