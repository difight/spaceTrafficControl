import Phaser from "phaser";

class Ship extends Phaser.GameObjects.Sprite {
  constructor(scene, parkingZone, spawnX, spawnY) {
    super(scene, spawnX, spawnY, "ship");
    this.scene = scene;
    this.parkingZone = parkingZone;
    this.setOrigin(0.5);
    this.setCollideWorldBounds(true);
    this.speed = 100;
    this.docking = false;
    this.waiting = false;

    // Добавляем в физику
    scene.physics.add.existing(this);

    // Двигатели
    this.engineFlame = scene.add.particles("engine_flame");
    this.engineEmitter = this.engineFlame.createEmitter({
      speed: 0,
      scale: { start: 0.5, end: 0 },
      lifespan: 500
    });
  }

  // Обновление позиции
  update() {
    // Плавный поворот к цели
    const target = this.docking
      ? this.parkingZone.getLandingPosition()
      : { x: 1500, y: 1000 };
  
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const targetAngle = Math.atan2(dy, dx);
  
    // Плавный поворот
    const deltaAngle = targetAngle - Phaser.Math.DegToRad(this.angle);
    this.angle += Phaser.Math.RadToDeg(deltaAngle * 0.1);
  
    // Движение
    this.setVelocity(
      Math.cos(targetAngle) * this.speed,
      Math.sin(targetAngle) * this.speed
    );
  }

  // Движение к зоне ожидания
  startApproach() {
    this.moveTo(1500, 1000); // Координаты зоны ожидания
    this.activateEngines();
  }

  // Движение к месту стыковки
  moveToLandingPosition() {
    const target = this.parkingZone.getLandingPosition();
    this.moveTo(target.x, target.y);
  }

  // Основной метод движения
  moveTo(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const angle = Math.atan2(dy, dx);
    
    this.setAngle(angle * (180 / Math.PI));
    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }

  // Включение двигателей
  activateEngines() {
    this.engineEmitter.setActive(true);
    this.engineEmitter.startFollow(this);
  }

  // Выключение двигателей
  deactivateEngines() {
    this.engineEmitter.setActive(false);
    this.engineEmitter.clear();
  }
}

export default Ship;