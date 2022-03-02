const optimizedResize = (function optimized(): any {
  let running = false;
  const callbacks: any[] = [];

  function runCallbacks() {
    callbacks?.forEach((callback) => {
      callback();
    });

    running = true;
  }

  function resize() {
    if (!running) {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }
  }

  function addCallbacks(callback: any) {
    if (callback) {
      callbacks.push(callback);
    }
  }

  return {
    add(callback: any) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallbacks(callback);
    },
  };
}());

export default optimizedResize;
