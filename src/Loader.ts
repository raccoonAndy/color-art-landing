class Loader {
  isDesktop: boolean;

  allImages: NodeListOf<HTMLImageElement>;

  constructor() {
    this.isDesktop = window.innerWidth > 1024;
    this.allImages = document.querySelectorAll('img');
    Loader.createLoader();
  }

  static createLoader() {
    window.addEventListener('load', () => {
      Loader.onLoaded();
    });
  }

  static onLoaded() {
    return new Promise(() => {
      const $preloader = document.querySelector('#preloader');
      const $app = document.querySelector('#app');
      $preloader?.classList.add('hide');
      $app?.classList.remove('hide');
    });
  }
}

export default Loader;
