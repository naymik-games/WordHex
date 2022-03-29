class start extends Phaser.Scene {
  constructor() {
    super("start");
  }
  preload() {
  
	 
	
  }
  create() {
	  this.scoreText = this.add.bitmapText(game.config.width /2, 100, 'lato', 'WordHex', 100).setOrigin(.5,.5).setTint(0xffffff).setAlpha(1);
      this.playText = this.add.bitmapText(game.config.width /2, 500, 'lato', '[PLAY]', 70).setOrigin(.5,.5).setTint(0xffffff).setAlpha(1).setInteractive();
	  this.playText.on('pointerdown',function(){
		  this.scene.start("PlayGame");
	  }, this);
    //this.scene.start("PlayGame");

  }
}