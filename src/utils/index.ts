import { BREAKPOINTS } from '../settings/_env';

export const debounce = (func: any, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line func-names
  return function (...args: any) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

export const throttle = (func: any, limit: number) => {
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

export const throttleLastCall = (func: any, limit: number) => {
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

export const adaptive = (funcDesktop: any, funcMobile?: any) => {
  let isMobile = window.innerWidth < BREAKPOINTS.SM;
  // eslint-disable-next-line consistent-return
  return function (...args: any) {
    const context = this;
    window.addEventListener(
      'resize',
      debounce(() => {
        isMobile = window.innerWidth < BREAKPOINTS.SM;
        if (isMobile) return funcMobile?.apply(context, args);
        return funcDesktop.apply(context, args);
      }, 500),
    );
    if (!isMobile) {
      return funcDesktop.apply(context, args);
    }
  };
};

export const templates = Object.create(null, {
  load: {
    async value(fileName: string) {
      // fetch and parse template as string
      let template: Response | string | HTMLTemplateElement | null = await fetch(fileName);
      template = await template.text();
      template = new DOMParser()
        .parseFromString(template, 'text/html')
        .querySelector('template');
      if (!template) throw new TypeError('No template element found');
      return template;
    },
  },
});
