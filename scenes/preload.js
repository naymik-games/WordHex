class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/sprites/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/sprites/particle.png");
    }




    this.load.image("hero", "assets/hero.png");
    this.load.image("platform", "assets/platform.png");
    this.load.text('dictionary', 'assets/dictionary-plural.txt');

    // this.load.image("hexflat", "assets/flathex.png");
    this.load.image("hex", "assets/flathex.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("time", "assets/time.png");
    this.load.bitmapFont('lato', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');
    /*  this.load.spritesheet("hexflat_", "assets/hextilesflat.png", {
       frameWidth: 80,
       frameHeight: 70
     }); */
    this.load.spritesheet("hexflat", "assets/hexletters.png", {
      frameWidth: 80,
      frameHeight: 70
    });
    this.load.spritesheet("icons", "assets/icons.png", {
      frameWidth: 80,
      frameHeight: 80
    });
  }
  create() {
    this.scene.start("start");

  }
}