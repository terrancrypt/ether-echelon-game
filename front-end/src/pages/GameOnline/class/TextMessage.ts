import KeyPressListener from "./KeyPressListener";

interface TextMessageConfig {
  text: string;
  onComplete: () => void;
}

class TextMessage {
  text: string | undefined;
  onComplete: () => void;
  element: HTMLElement | null;
  actionListener: KeyPressListener | null;

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
        <p class="text-message_text">${this.text}</p>
        <button class="text-message_button">Next
        <span>[Enter]</span>
        </button>
      `;

    this.element.querySelector("button")?.addEventListener("click", () => {
      // Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener?.unbind();
      this.done();
    });
  }

  done() {
    this.element?.remove();
    this.onComplete();
  }

  init(container: Element): void {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);
    }
  }
}

export default TextMessage;
