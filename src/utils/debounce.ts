function debounce(func: any, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line func-names
  return function (...args: any) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export default debounce;
