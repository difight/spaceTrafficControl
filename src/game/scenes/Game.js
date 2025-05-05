import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { CameraController } from '../object/CameraController';
import { LandingArea } from '../object/LandingArea';
import Ship from '../object/Ship';

export class Game extends Scene
{
    constructor ()
    {
      super('Game')
      this.mapWidth = 2000
      this.mapHeight = 2000
      this.minZoom = 1
      this.maxZoom = 3
      this.cameraController = null
      this.emptyAreas = []
      this.busyAreas = []
      this.ships = []
    }

    create ()
    {

      this.mapBackground = this.add.image(0, 0, 'background').setOrigin(0)
      this.mapBackground.displayWidth = this.mapWidth
      this.mapBackground.displayHeight = this.mapHeight

      this.camera = this.cameras.main
      this.camera.setBounds(0, 0, this.mapWidth, this.mapHeight)
      this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight); // Например, 5000x5000
      this.camera.setZoom(1)

      this.cameraController = new CameraController(
        this,
        this.mapWidth,
        this.mapHeight,
        this.minZoom,
        this.maxZoom
      )

      this.physics.world.setBoundsCollision(true);
      this.areas =  [
        new LandingArea(this, 500, 500,'area1'),
        new LandingArea(this, 500, 800,'area2')
      ]
      this.ship = new Ship(this, 200, 200, 'ship1')
      
      EventBus.emit('current-scene-ready', this);
      
    }

    update() {
      this.cameraController.updateCamera() // Вызов обновления камеры
      if (this.ship) {
        this.ship.update()
      }
    }
}
