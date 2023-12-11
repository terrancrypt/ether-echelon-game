import KeyPressListener from "./KeyPressListener";
import RevelingText from "./RevealingText";

interface TextMessageConfig {
  text: string;
  onComplete: () => void;
}

class TextMessage {
  text: string | undefined;
  onComplete: () => void;
  element: HTMLElement | null;
  actionListener: KeyPressListener | null;
  revealingText?: RevelingText;

  constructor({ text, onComplete }: TextMessageConfig) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
    this.actionListener = null;
  }

  createElement(): void {
    // Create the element
    this.element = document.createElement("div");
    this.element.classList.add("text-message");

    this.element.innerHTML = `
        <p class="text-message_text"></p>
        <button class="text-message_button">Next [Enter]</button>
      `;

    // Init the type writer effect
    this.revealingText = new RevelingText({
      element: this.element.querySelector(".text-message_text"),
      text: this.text,
    });

    this.element.querySelector("button")?.addEventListener("click", () => {
      // Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText?.isDone) {
      this.element?.remove();
      this.actionListener?.unbind();
      this.onComplete();
    }
    {
      this.revealingText?.warpToDone();
    }
  }

  init(container: Element): void {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
      this.revealingText?.init();
    }
  }
}

export default TextMessage;
