import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
      super('Boot');
    }

    preload ()
    {
      //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
      //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
      this.load.image('background', 'assets/bg.png');
      this.load.image('landingAreaEmpty', 'assets/landingAreaEmpty.png');
      this.load.image('landingAreaBisy', 'assets/landingAreaBisy.png');
      this.load.image('ship', 'assets/ship.png');
      this.textures.generate('engine_flame', {
        data: ['•'], // Простой точечный паттерн
        pixelWidth: 32,
        palette: [0xff0000, 0xff8800, 0xffff00] // Градиент от красного к желтому
      });
    }

    create ()
    {
      this.scene.start('Preloader');
    }
}
