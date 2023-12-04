class SceneTransition {
  element: HTMLElement | null;

  constructor() {
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("scene-transition");
  }

  fadeOut() {
    this.element?.classList.add("fade-out");
    this.element?.addEventListener(
      "animationend",
      () => {
        this.element?.remove();
      },
      { once: true }
    );
  }

  init(container: HTMLElement, callback: () => void) {
    this.createElement();
    if (this.element) container.appendChild(this.element);
    this.element?.addEventListener(
      "animationend",
      () => {
        callback();
      },
      { once: true }
    );
  }
}

export default SceneTransition;
