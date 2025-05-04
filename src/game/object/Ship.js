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
  
    // Целевой угол
    const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.targetLandingArea.x, this.targetLandingArea.y);
    this.body.rotation = targetAngle;
  
    // Замедление при приближении
    const speed = distance < 100 ? this.speed * (distance / 100) : this.speed;
  
    // Движение к цели
    this.body.setVelocity(
      Math.cos(targetAngle) * speed,
      Math.sin(targetAngle) * speed
    );
  
    // Остановка при достижении
    if (distance < 20) {
      this.body.setVelocity(0);
      this.isLanding = false;
      this.targetLandingArea = null;
      EventBus.emit("ship-docked", this);
    }
  
    // Трение
    this.body.velocity.x *= this.friction;
    this.body.velocity.y *= this.friction;
  
    // Отладка
    console.log(`Корабль ${this.id}: 
      dx: ${dx}, dy: ${dy}
      targetAngle: ${targetAngle}
      velocity: ${this.body.velocity.x}, ${this.body.velocity.y}
      distance: ${distance}
    `);
  }
}

export default Ship;