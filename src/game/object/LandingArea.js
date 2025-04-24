import Phaser from "phaser";

export class LandingArea extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height) {
    super(scene, x, y)

    this.scene = scene
    this.width = width
    this.height = height
    this.backgound = scene.add.image(-this.width / 2, -this.height / 2, 'landingAreaEmpty')
    this.backgound.setOrigin(0, 0)
    this.backgound.displayWidth = width
    this.backgound.displayHeight = height
    this.busy = false

    this.add(this.backgound)

    // Отладочная рамка (красная)
    //const debugOutline = scene.add.graphics();
    //debugOutline.lineStyle(2, 0xff0000, 1);
    //debugOutline.strokeRect(
    //  -this.width / 2, // Левый верхний угол
    //  -this.height / 2, // Левый верхний угол
    //  this.width,
    //  this.height
    //);
    //this.add(debugOutline);


    this.setInteractive()
    this.on("pointerdown", this.handleClick, this);
    this.setPosition(x, y)
    scene.add.existing(this)
  }

  handleClick() {
    window.globalDebug.log(`Зона парковки клик`)
    this.busy = !this.busy
    this.changeBg()
  }
  changeBg() {
    if (this.busy) {
      this.backgound.setTexture("landingAreaBisy");
    } else {
      this.backgound.setTexture("landingAreaEmpty");
    }
  }
}