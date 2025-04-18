import { EventBus } from '../EventBus';
import { Scene, Math } from 'phaser';

export class CameraController {
  constructor (scene, mapWidth, mapHeight, minZoom = 0.5, maxZoom = 2)
  {
    this.scene = scene
    this.camera = scene.cameras.main
    this.mapWidth = mapWidth
    this.mapHeight = mapHeight
    this.minZoom = minZoom
    this.maxZoom = maxZoom
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.movementSpeed = 4; // Скорость перемещения
    this.movement = { x: 0, y: 0 };

    // Клавиши
    this.keyW = null;
    this.keyA = null;
    this.keyS = null;
    this.keyD = null;
    this.setupInputHandlers()
    this.setupEdgeMovement()
    this.setupKeyboardControl()
  }
  setupInputHandlers() {
    const scene = this.scene
    const camera = this.camera

    scene.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      const targetZoom = camera.zoom + deltaY * 0.005;
      console.log(camera.zoom, targetZoom)
      const newZoom = Math.Clamp(targetZoom, this.minZoom, this.maxZoom)
      scene.tweens.add({
        targets: this.camera,
        zoom: newZoom,
        duration: 200,
        ease: 'Linear'
      })
    })
  }

  setupEdgeMovement() {
    const edgeThreshold = 0.1
    const edgeSpeed = 2
    const scene = this.scene
    const camera = this.camera
    scene.input.on("pointmove", (pointer) => {
      const { witdh, height } = scene.scale
      const x = pointer.x
      const y = pointer.y
      let dx = 0
      let dy = 0
      // проверяем рядом ли край по горизонтали
      if(x < witdh * edgeThreshold) {
        dx = -edgeSpeed
      } else if (x > witdh * (1 - edgeThreshold)) {
        dx = edgeSpeed
      }
      // проверяем рядом ли край по вертикали
      if (y < height * edgeThreshold) {
        dy = -edgeSpeed
      } else if (y > height * (1 - edgeThreshold)) {
        dy = edgeSpeed
      }

      const newScrollX = camera.scrollX + dx
      const newScrollY = camera.scrollY + dy

      camera.scrollX = Math.Clamp(
        newScrollX,
        0,
        this.mapWidth - camera.witdh * camera.zoom
      )

      camera.scrollY = Math.Clamp(
        newScrollY,
        0,
        this.mapHeight - camera.height * camera.zoom
      )
    })
  }
  setupKeyboardControl() {
    this.keyW = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.keyA = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.keyS = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.keyD = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
  }

  updateMovement() {
    this.movement.x = 0;
    this.movement.y = 0;

    if (this.keyA.isDown) {
      this.movement.x = -1;
    }
    if (this.keyD.isDown) {
      this.movement.x = 1;
    }
    if (this.keyW.isDown) {
      this.movement.y = -1;
    }
    if (this.keyS.isDown) {
      this.movement.y = 1;
    }
  }

  updateCamera() {
    this.updateMovement();

    const { movementSpeed, movement, camera } = this;
    const dx = -movement.x * movementSpeed;
    const dy = -movement.y * movementSpeed;

    const newScrollX = camera.scrollX + dx;
    const newScrollY = camera.scrollY + dy;

    // Пересчитываем максимальные значения скрола на каждом кадре
    const maxWidthScroll = this.mapWidth - (camera.width * camera.zoom);
    const maxHeightScroll = this.mapHeight - (camera.height * camera.zoom);

    // Ограничение перемещения
    camera.scrollX = Phaser.Math.Clamp(
      newScrollX,
      0,
      maxWidthScroll
    );
    camera.scrollY = Phaser.Math.Clamp(
      newScrollY,
      0,
      maxHeightScroll
    );

    console.log("ScrollX:", camera.scrollX);
    console.log("MaxWidthScroll:", maxWidthScroll);
    console.log("ScrollY:", camera.scrollY);
    console.log("MaxHeightScroll:", maxHeightScroll);
  }
}