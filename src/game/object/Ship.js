import Phaser from "phaser";
import { EventBus } from "../EventBus";

class Ship extends Phaser.GameObjects.Sprite {
  constructor(scene, spawnX, spawnY, id) {
    super(scene, spawnX, spawnY, "ship");
    this.scene = scene;
    this.id = id;
    this.width = 152;
    this.height = 160;
    this.isLanding = false;
    this.targetLandingArea = null;
    this.initListiner()
    // Физика
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setAllowRotation(true);
  
    this.setOrigin(0.5, 0.5);

    
    this.speed = 200;
    this.acceleration = 5;
    this.rotationSpeed = 0.5;
    this.dragFactor = 0.99;

    // Физика (без изменения существующих свойств)
    this.body.setDrag(this.dragFactor);
    this.body.setDamping(true);
    this.body.setAngularDrag(50);
    this.initListiner();
    this.requestDock();
    scene.add.existing(this);
     // Создаем эмиттер частиц
    this.flameEmitter = scene.add.particles(0, 0, 'engine_flame', {
        color: [0xff6600, 0xff0000], // Диапазон цветов
        scale: { start: 1.0, end: 0 }, // Начинаем с большего размера
        alpha: { start: 1, end: 0 },   // Плавное исчезновение
        blendMode: 'ADD',              // Режим наложения
        lifespan: 500,                 // Время жизни частицы (мс)
        speed: { min: 50, max: 150 },  // Разброс скорости
        angle: { min: -160, max: -200 },// Вылет назад (корректируйте под ваш спрайт)
        frequency: 40,                 // Частота появления
        follow: this,                  // Привязка к кораблю
        followOffset: { x: -50, y: 0 } // Смещение от центра
    });
    this.flameEmitter.stop(); // Изначально выключен
    
    // Для отладки
    this.flameEmitter.setDepth(1); // Поверх других объектов
    this.flameEmitter.setBlendMode(Phaser.BlendModes.ADD);
    this.flameEmitter.setAlpha(0.8, 0);
    
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

  update() {
    if (!this.targetLandingArea) return;

    const dx = this.targetLandingArea.x - this.x;
    const dy = this.targetLandingArea.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 1. Определяем фазу посадки (используем обратную логику)
    const landingStartDistance = 150;
    const isApproaching = distance > landingStartDistance;
    const isLandingPhase = !isApproaching;

    // 2. Расчет углов
    const targetAngle = Math.atan2(dy, dx);
    const flyingRotation = targetAngle + Math.PI / 2; // Обычный полет
    const landingRotation = Math.PI / 0.5; // Вертикально вверх
    let desiredRotation = isLandingPhase ? landingRotation : flyingRotation;

    // 3. Плавный поворот с разной скоростью
    const rotationSpeed = isLandingPhase 
        ? this.rotationSpeed * 0.05 // Медленнее при посадке
        : this.rotationSpeed * 0.1;  // Быстрее в полете

    this.rotation = Phaser.Math.Angle.RotateTo(
        this.rotation,
        desiredRotation,
        rotationSpeed
    );

    // 4. Управление скоростью (инвертированная логика)
    const maxSpeed = this.speed * (isApproaching ? 1 : distance / landingStartDistance);
    const currentSpeed = Math.sqrt(this.body.velocity.x**2 + this.body.velocity.y**2);
    const acceleration = isApproaching ? this.acceleration : this.acceleration * 2;

    if (currentSpeed < maxSpeed) {
        const velocityX = Math.cos(targetAngle) * acceleration * 0.1;
        const velocityY = Math.sin(targetAngle) * acceleration * 0.1;
        this.body.velocity.x += velocityX;
        this.body.velocity.y += velocityY;
    }

    // 5. Гарантированное торможение при посадке
    if (isLandingPhase) {
        this.body.velocity.scale(0.95);
    }

    // 6. Финишная остановка
    if (distance < 30) {
        this.body.setVelocity(0);
        this.rotation = landingRotation; // Фиксируем вертикальное положение
        this.isLanding = false;
        this.targetLandingArea = null;
        EventBus.emit("ship-docked", this);
    }

    const isMoving = this.body.velocity.length() > 10;
    const isVisible = this.flameEmitter.visible;
    
    if (isMoving) {
      if (!isVisible) {
          this.flameEmitter.start();
          this.flameEmitter.setVisible(true);
      }
      
      // Корректировка позиции с учетом поворота
      const offsetX = -Math.cos(this.rotation) * 50;
      const offsetY = -Math.sin(this.rotation) * 50;
      this.flameEmitter.followOffset.set(offsetX, offsetY);
      
      // Настройка интенсивности по скорости
      const speedFactor = Phaser.Math.Clamp(this.body.velocity.length() / this.speed, 0.3, 1.5);
      this.flameEmitter.setQuantity(2 * speedFactor);
    } 
    else if (isVisible) {
      this.flameEmitter.stop();
      this.flameEmitter.setVisible(false);
    }
  }
}

export default Ship;