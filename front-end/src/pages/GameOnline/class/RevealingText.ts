interface RevelingTextConfig {
  element: HTMLElement | null;
  text?: string;
  speed?: number;
}

interface CharacterElement {
  span: HTMLElement;
  delayAfter: number;
}

class RevelingText {
  element: HTMLElement | null;
  text?: string;
  speed: number;
  timeout: NodeJS.Timeout | null;
  isDone: boolean;

  constructor(config: RevelingTextConfig) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 70;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list: CharacterElement[]) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    if (this.timeout) clearTimeout(this.timeout);
    this.isDone = true;
    this.element?.querySelectorAll("span").forEach((s) => {
      s.classList.add("revealed");
    });
  }

  init() {
    let characters: CharacterElement[] = [];
    this.text?.split("").forEach((character) => {
      // Create each span, add to element in DOM
      let span = document.createElement("span");
      span.textContent = character;
      this.element?.appendChild(span);

      // Add this span to our internal state Array
      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed,
      });
    });

    this.revealOneCharacter(characters);
  }
}

export default RevelingText;
