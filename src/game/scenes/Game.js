import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { CameraController } from '../object/CameraController';

export class Game extends Scene
{
    constructor ()
    {
      super('Game')
      this.mapWidth = 2000
      this.mapHeight = 2000
      this.minZoom = 0.2
      this.maxZoom = 2
      this.cameraController = null;
    }

    create ()
    {
      //this.cameras.main.setBackgroundColor('green')

      this.mapBackground = this.add.image(0, 0, 'background').setOrigin(0)
      this.mapBackground.displayWidth = this.mapWidth
      this.mapBackground.displayHeight = this.mapHeight

      this.camera = this.cameras.main
      this.camera.setBounds(0, 0, this.mapWidth, this.mapHeight)
      this.camera.setZoom(1)

      this.cameraController = new CameraController(
        this,
        this.mapWidth,
        this.mapHeight,
        this.minZoom,
        this.maxZoom
      )
      
      EventBus.emit('current-scene-ready', this);
    }

    update() {
      this.cameraController.updateCamera(); // Вызов обновления камеры
    }
}
