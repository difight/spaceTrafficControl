import Phaser from "phaser";
import { EventBus } from "../EventBus";

class Ship extends Phaser.GameObjects.Sprite {
  constructor(scene, spawnX, spawnY, id) {
    super(scene, spawnX, spawnY, "ship");
    this.scene = scene;
    this.id = id;
    this.width = 152;
    this.height = 160;
    this.speed = 400;
    this.turn_speed = 1;
    this.friction = 0.98;
    this.isLanding = false;
    this.targetLandingArea = null;
    this.initListiner()
    // Физика
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setAllowRotation(true);
  
    this.setOrigin(0.5);
    this.initListiner();
    this.requestDock();
    scene.add.existing(this);
  }

  initListiner() {
    EventBus.on("docking-permitted", (request) => {
      console.log(`Разрешение для ${this.id} от ${request.zone.id}`);
      this.permittedDocking(request);
    });
  }

  handleClick() {
    window.globalDebug.log(`Корабль клик`)
    EventBus.emit("ship-info", { id: this.id, x: this.x, y: this.y })
  }

  requestDock() {
    console.log(`Запрос от ${this.id}`)
    EventBus.emit("dock-request", { ship: this, position: { x: this.x, y: this.y } })
  }

  permittedDocking({ zone, ship }) {
    if (this.id === ship.id) {
      this.targetLandingArea = zone.getLandingPosition()
      this.isLanding = true
      zone.changeBusy()

    }
  }

  // Обновление позиции и поворота
  update() {
    if (!this.targetLandingArea) return;

    const dx = this.targetLandingArea.x - this.x;
    const dy = this.targetLandingArea.y - this.y;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetLandingArea.x, this.targetLandingArea.y);

    // Целевой угол (радианы)
    const targetAngle = Math.atan2(dy, dx);
    const currentAngle = this.body.rotation;

    // Поворот
    const deltaAngle = Phaser.Math.Angle.Wrap(targetAngle - currentAngle);
    if (Math.abs(deltaAngle) > 0.1) {
      const turnDirection = Math.sign(deltaAngle);
      this.body.angularVelocity = turnDirection * 100; // Скорость поворота
    } else {
      this.body.angularVelocity = 0;
      this.body.setVelocity(
        Math.cos(currentAngle) * this.speed,
        Math.sin(currentAngle) * this.speed
      );
    }

    // Остановка при достижении
    if (distance < 50) {
      this.body.setVelocity(0);
      this.isLanding = false;
      this.targetLandingArea = null;
      EventBus.emit("ship-docked", this);
    }
  }
}

export default Ship;