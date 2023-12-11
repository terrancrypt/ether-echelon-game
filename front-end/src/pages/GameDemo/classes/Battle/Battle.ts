import { beastsData } from "../../../../data/beasts";
import Combatant from "./Combatant";

class Battle {
  element: HTMLElement | null;
  combatants: {
    [key: string]: Combatant;
  };

  constructor() {
    this.element = null;

    this.combatants = {
      player: new Combatant(
        {
          ...beastsData["Axolot"],
          team: "player",
          hp: 50,
          maxHP: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
          actions: [],
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...beastsData["Bamboo"],
          team: "enemy",
          hp: 50,
          maxHP: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
          actions: [],
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...beastsData["RedButterfly"],
          team: "enemy",
          hp: 50,
          maxHP: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
          actions: [],
        },
        this
      ),
    };
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("battle");
    this.element.innerHTML = `
    <div class="battle_player">
      <img src="${`images/Characters/AdventureGirl/AdventurerGirlSpriteSheet.png`}" atl="player" /> 
     
    </div>
    <div class="battle_enemy">
      <img src="${`images/Characters/Nurse/NurseSpriteSheet.png`}" atl="enemy" /> 
    </div>
    `;
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.element) {
      container.appendChild(this.element);

      Object.keys(this.combatants).forEach((key) => {
        let combatant = this.combatants[key];
        combatant.id = key;
        if (this.element) combatant.init(this.element);
      });
    }
  }
}

export default Battle;
