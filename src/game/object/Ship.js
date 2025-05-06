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
  
    this.setOrigin(0.5, 0.5);

    this.rotationSpeed = 0.5;      // Скорость поворота (меньше = плавнее)
    this.enginePower = 80;           // Сила ускорения
    this.dragFactor = 0.95;          // Инерция (0.9-0.99 для "космоса")
    this.brakingDistance = 150;      // Дистанция торможения

    // Физика (без изменения существующих свойств)
    this.body.setDrag(this.dragFactor);
    this.body.setAngularDrag(50);
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
    //const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetLandingArea.x, this.targetLandingArea.y);

    //// Целевой угол (радианы)
    //const targetAngle = Math.atan2(dy, dx); // Угол к цели
    //const correctedAngle = Phaser.Math.Angle.Wrap(targetAngle + Math.PI / 2); 
    //this.setRotation(correctedAngle); // Прямое вращение спрайта

    // Целевой угол (радианы)
    const targetAngle = Math.atan2(dy, dx); // Угол к цели
    const correctedAngle = Phaser.Math.Angle.Wrap(targetAngle + Math.PI / 2); 
    this.setRotation(correctedAngle); // Прямое вращение спрайта

    //// Движение к цели
    //this.body.setVelocity(
    //  Math.cos(targetAngle) * this.speed,
    //  Math.sin(targetAngle) * this.speed
    //);

    //const angleToTarget = Phaser.Math.Angle.Between(
    //  this.x, this.y, this.targetLandingArea.x, this.targetLandingArea.y
    //);

    // 1. Плавный поворот
    //const deltaAngle = Phaser.Math.Angle.Wrap(angleToTarget - this.rotation);
    //this.body.setAngularVelocity(correctedAngle * this.rotationSpeed * 100);

    //// 2. Умное ускорение с инерцией
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetLandingArea.x, this.targetLandingArea.y);
    //const isClose = distance < this.brakingDistance;
    //const thrust = isClose 
    //    ? this.enginePower * (distance / this.brakingDistance) // Плавное торможение
    //    : this.enginePower;

    //const velocityX = Math.cos(this.rotation) * thrust;
    //const velocityY = Math.sin(this.rotation) * thrust;
    //this.body.setVelocity(velocityX, velocityY);

    // Остановка при достижении
    if (distance < 45) {
      this.body.setVelocity(0);
      this.isLanding = false;
      this.targetLandingArea = null;
      EventBus.emit("ship-docked", this);
    }
  
    
  }
}

export default Ship;