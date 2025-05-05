import Phaser from "phaser";
import { EventBus } from "../EventBus";

export class LandingArea extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, id) {
    super(scene, x, y, 'landingAreaEmpty');
    this.scene = scene;
    this.width = 195;
    this.height = 201;
    this.id = id;
    this.busy = false;

    // Создаем фон зоны
    this.setOrigin(0.5, 0.5)

    // Интерактивность
    this.setInteractive();
    this.on("pointerdown", this.handleClick, this);
    this.setPosition(x, y); 
    scene.add.existing(this);

    // Подписка на запросы
    EventBus.on("dock-request", (request) => {
      this.checkAvailability(request);
    });
  }

  checkAvailability(request) {
    console.log(`Проверка доступности для зоны ${this.id}`);
    const distance = Phaser.Math.Distance.Between(
      request.position.x,
      request.position.y,
      this.x,
      this.y
    );

    if (!this.busy && distance < 1000) {
      console.log(`Разрешено стыковка для корабля ${request.ship.id}`);
      // Отправляем событие через 100ms для симуляции асинхронности
      setTimeout(() => {
        EventBus.emit("docking-permitted", { zone: this, ship: request.ship });
      }, 100);
    }
  }

  handleClick() {
    window.globalDebug.log(`Клик по зоне ${this.id}`);
    this.changeBusy();
  }

  changeBusy() {
    this.busy = !this.busy;
    this.setTexture(this.busy ? "landingAreaBusy" : "landingAreaEmpty");
  }

  getLandingPosition() {
    return {
      x: this.x + this.width / 2, // Центр зоны
      y: this.y + this.height / 2
    };
  }
}