import Battle from "./Battle";

interface CombatantConfig {
  id?: string;
  assets: {
    avatar: string;
    inGameImg: string;
  };
  hp: number;
  maxHP: number;
  xp: number;
  maxXp: number;
  name: string;
  level: number;
  actions: any[];
  status: null | string;
  team: string;
}

class Combatant {
  battle: Battle;
  hubElement: HTMLElement | null = null;
  id?: string;

  // Combatant index
  assets: {
    avatar: string;
    inGameImg: string;
  };
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  name: string;
  level: number;
  actions: any[];
  status: null | string;
  team: string;

  constructor(config: CombatantConfig, battle: Battle) {
    this.battle = battle;
    this.id = config.id;

    // Combatant Configuration
    this.name = config.name;
    this.hp = config.hp;
    this.maxHp = config.maxHP;
    this.xp = config.xp;
    this.maxXp = config.maxXp;
    this.level = config.level;
    this.actions = config.actions;
    this.status = config.status;
    this.team = config.team;
    this.assets = config.assets;
  }

  createElement() {
    this.hubElement = document.createElement("div");
    this.hubElement.classList.add("combatant");
    this.hubElement.setAttribute("data-combatant", this.id as string);
    this.hubElement.setAttribute("data-team", this.team);
    this.hubElement.innerHTML = `
    <p class="combatant_name">${this.name}</p>
    <p class="combatant_level"></p>
    <div class="combatant_character_crop">
        <img class="combatant_character" alt=${this.name}" src="${this.assets.avatar}"/>
    </div>
    <svg viewBox="0 0 26 3" class="combatant_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71"/>
        <rect x=0 y=0 width="0%" height=2 fill="#3ef126"/>
    </svg>
    <svg viewBox="0 0 26 2" class="combatant_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a"/>
        <rect x=0 y=0 width="0%" height=2 fill="#ffc934"/>
    </svg>
    <p class="combattant_status"></p>
    `;
  }

  init(container: HTMLElement) {
    this.createElement();
    if (this.hubElement) container.appendChild(this.hubElement);
  }
}

export default Combatant;
