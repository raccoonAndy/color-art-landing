export const throttle = (func: () => void, limit: number) => {
  let inThrottling: boolean;
  // eslint-disable-next-line func-names
  return function (...args: any) {
    const context = this;
    if (!inThrottling) {
      func.apply(context, args);
      inThrottling = true;
      setTimeout(() => {
        inThrottling = false;
      }, limit);
    }
  };
};

export const throttleLastCall = (func: () => void, limit: number) => {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRun: number;
  // eslint-disable-next-line func-names
  return function (...args: any) {
    const context = this;
    if (!lastRun) {
      func.apply(context, args);
      lastRun = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRun >= limit) {
          func.apply(context, args);
          lastRun = Date.now();
        }
      }, limit - (Date.now() - lastRun));
    }
  };
};
