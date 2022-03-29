let game;
let gameOptions = {}
//square 

window.onload = function() {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x000000,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 850,
      height: 1440
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: gameOptions.gameGravity
        }
      }
    },
    scene: [preloadGame, start, playGame]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {

  }
  create() {
    this.colors = [0xa8324e, 0x32a85a, 0x326ba8, 0xa86432, 0xa232a8]
    this.tally = {v0: 0, v1: 0, v2: 0, v3: 0, v4: 0, v5: 0, drop: 0, rover: 0}
   
    this.hexagons = [];
    this.idMap = [];
    this.hexagonsExtras = [];
    this.idMapExtras = [];
    
    this.selected = [];
    this.word = '';
    this.wordScore = 0;
    this.totalWordScore = 0;
    this.coinCount = 0;
    this.scoreBuffer = 0;
    this.foundWords = [];
    this.newWord = false;
    this.start = true;
    this.toalcleared = 0;
    this.six = 0;
    this.dragging = false;
    if(boardType == 'hex'){
      this.qStart = -depth;
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(425, 720));
      var hexes = makeHexagonalShape(depth);
      var hexesExtras = makeHexagonalShape(depth);
    } else if(boardType == 'rect'){
      this.qStart = 0;
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(100, 300));
      var hexes = makeRectangularShape(0, qTotal, 0, rTotal, ODD)
      var hexesExtras = makeRectangularShape(0, qTotal, 0, rTotal, ODD)
    } else if (boardType == 'triUp') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(100, 60));
      var hexes = makeUpTriangularShape(7);
      var hexesExtras = makeUpTriangularShape(7);
    } else if (boardType == 'triDown') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(100, 250));
      var hexes = makeDownTriangularShape(7);
	  var hexesExtras = makeDownTriangularShape(7);
    } else if(boardType == 'rhom'){
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(100, 230));
      var hexes = makeRhombusShape(7, 7)
	  var hexesExtras = makeRhombusShape(7, 7)
    }
    
    // 

    this.drawGrid(hexes);
    this.drawGridExtras(hexesExtras);
    //  this.cameras.main.startFollow(this.hero, true, 0, 0.5, 0, - (game.config.height / 2 - game.config.height * gameOptions.firstPlatformPosition));
    // this.input.on("pointerdown", this.destroyPlatform, this);
    this.input.on('pointerdown', this.down, this);
    this.input.on('pointermove', this.move, this);
    this.input.on('pointerup', this.up, this);

   // var gg = hex_neighbor(Hex(0, 0, 0), 5);
   // console.log(gg)

    // console.log(this.cube_to_axial(Hex(0,-2,2)))
    this.wordText = this.add.bitmapText(game.config.width / 2, 72, 'lato', '---', 95).setOrigin(.5).setTint(0xffffff).setAlpha(1);
    this.scoreText = this.add.bitmapText(50, 75, 'lato', '0', 70).setOrigin(0,.5).setTint(0xffffff).setAlpha(1);
    this.totalScoreText = this.add.bitmapText(800, 75, 'lato', '0', 70).setOrigin(1,.5).setTint(0xd9d904).setAlpha(1);
   
   this.wordBar = this.add.image(game.config.width / 2, 130, 'platform').setOrigin(.5,0).setTint(0xC64136);
   this.wordBar.displayHeight = 7;
   this.wordBar.displayWidth = 0;
   
    this.outcomeText = this.add.bitmapText(50, 135, 'lato', '', 40).setOrigin(0,.5).setTint(0xd9d9d7).setAlpha(1);
this.wordsFoundText = this.add.bitmapText(game.config.width / 2, 135, 'lato', '', 40).setOrigin(.5,.5).setTint(0xd9d9d7).setAlpha(1);

    this.coinText = this.add.bitmapText(800, 1325, 'lato', '0', 70).setOrigin(1,.5).setTint(0xd9d9d7).setAlpha(1);
    this.coinIcon = this.add.image(750, 1325, 'coin').setOrigin(1,.5).setAlpha(1).setScale(2.2);

	this.timeBarBack = this.add.image(0, game.config.height, 'platform').setOrigin(0,1).setTint(0xcccccc);
    this.timeBarBack.displayWidth = 600;
    this.timeBarBack.displayHeight = 50;

    this.timeBar = this.add.image(0, game.config.height, 'platform').setOrigin(0,1).setTint(0x337722);
    this.timeBar.displayWidth = 600;
    this.timeBar.displayHeight = 50;
    

    this.button1 = this.add.image(105, 1325,'hex').setInteractive();
    this.button1.on('pointerdown', function(){
      this.addAll();
	  var doSpecial = true;
	  var single = false;
      this.clearSelected(single, doSpecial);
    },this);
    this.button2 = this.add.image(190, 1325,'hex').setInteractive();
    this.button2.on('pointerdown', function(){
      this.initialTime += 60;
    },this);
	// 2:30 in seconds
    this.initialTimeTotal = gameTime;
	this.initialTime = gameTime;
	
    this.timerText = this.add.bitmapText(775, game.config.height, 'lato', this.formatTime(this.initialTime), 60).setOrigin(1,1);

    // Each 1000 ms call onEvent
    var timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

	
  }


formatTime(seconds){
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}


onEvent ()
{
    this.initialTime -= 1; // One second
    this.timeBar.displayWidth = 600 * (this.initialTime / this.initialTimeTotal)
	if(this.initialTime == 0){
		this.scene.start("start");
	}
	if(this.initialTime < 16){
		this.timeBar.setTint(0xC64136);
	} else {
		this.timeBar.setTint(0x337722);
	}
    this.timerText.setText(this.formatTime(this.initialTime));
}


  update() {
    
    if (this.scoreBuffer > 0) {
      this.incrementScore();
      this.scoreBuffer--;
    }

  }

  incrementScore() {
    this.totalWordScore += 1;
    this.totalScoreText.setText(this.totalWordScore);
  }
  
  down(e) {
    this.dragging = true;
    var hex = pixel_to_hex(this.flat, Point(e.x, e.y));
    //this.getValue(hex) == dropFrame || this.getValue(hex) == roverFrame
    if (!this.inMap(hex) || this.inChain(hex)) { return }
    var hexagon = this.getHexObjectByHex(hex);
    hexagon.image.setAlpha(.6);
    hexagon.image.setScale(sScale);
    this.scoreText.setText('0')
    this.chainValue = hexagon.value;
    this.word += hexagon.letter;
    this.wordScore += hexagon.letterValue * scoreBase;
    this.scoreText.setText(this.wordScore)
    this.wordText.setText(this.word)

    this.selected.push(makeID(hex));
  }
  move(e) {
    var hex = pixel_to_hex(this.flat, Point(e.x, e.y));

    if (!this.inMap(hex) || this.inChain(makeID(hex))) { return }
   // if (this.isNeighborOf(hex, this.selected[this.selected.length - 1]) && this.getValue(hex) != dropFrame && this.getValue(hex) != roverFrame) {
    if (this.isNeighborOf(hex, this.selected[this.selected.length - 1])){
      var hexagon = this.getHexObjectByHex(hex);
      hexagon.image.setAlpha(.6);
      hexagon.image.setScale(sScale);
      this.word += hexagon.letter;
      this.wordScore += hexagon.letterValue * scoreBase;
      this.scoreText.setText(this.wordScore)
      this.wordText.setText(this.word)
      this.selected.push(makeID(hex));
	  this.wordsFoundText.setText('');
      this.wordBar.displayWidth = 35 * this.selected.length;
    }
  }
  up(e) {
    if (this.selected.length < 2 && this.selected.length > 0) {
      var temp = this.getHexObjectByID(this.selected[0])
      temp.image.setAlpha(1)
      temp.image.setScale(lScale);

      this.selected = [];
      this.word = '';
      this.wordScore = 0;
      return

    }
    this.dragging = false;
    this.wordCheck();
    var single = false;
	this.doScore(single);
	
    this.clearSelected(single);
	this.selected = [];
  }
  wordCheck(){
    if (this.foundWords.indexOf(this.word) > -1) {
      
      this.wordScore = 0;
      this.scoreText.setText(this.wordScore)
      this.wordBar.displayWidth = 0;
      this.outcomeText.setText('already found');
		this.word = '';
    } else if (this.cache.text.get('dictionary').indexOf(' ' + this.word + ' ') > -1 && this.word.length > 1) {
      this.foundWords.push(this.word);
      this.newWord = true;
      this.wordBar.displayWidth = 0;
      this.wordsFoundText.setText(this.foundWords.length + ' words found')
      
    } else {
      console.log('not a word');
      this.outcomeText.setText('not a word');
      this.wordScore = 0;
      this.scoreText.setText(this.wordScore);
	  this.word = '';
	  this.wordBar.displayWidth = 0;
    }
  }
  doScore(single){
	var bonus2 = false;
    var bonus3 = false;
    var bonus6 = false;
    if (this.selected.length > 1 || single) {
      for (var s = 0; s < this.selected.length; s++) {
        var hex = this.getHexObjectByID(this.selected[s]);
        var hexExtra = this.getHexObjectByIDExtras(this.selected[s]);
        if(hexExtra.value == 2){
          bonus2 = true;
        } else if(hexExtra.value == 3){
          bonus3 = true;
        }
        if(this.newWord){
          if (hexExtra.powerUp == 1) {
            this.collectPU(1, hexExtra.id);
          } else if (hexExtra.powerUp == 2) {
            this.collectPU(2, hexExtra.id);
          }
        }
        hex.image.setAlpha(1)
        hex.image.setScale(lScale);
      }
      
    }
    if(this.selected.length > 5){
        bonus6 = true;
        this.six += 1;
      }
    if(this.newWord){
      
      if(bonus6){
        var mult = 6;
        this.outcomeText.setText('x6 BONUS');
      } else if(bonus3){
        var mult = 3;
        this.outcomeText.setText('x3');
      } else if(bonus2){
        var mult = 2;
        this.outcomeText.setText('x2');
      } else {
        var mult = 1;
        this.outcomeText.setText('x1');
      }
      this.wordScore *= mult;
    }

    this.scoreText.setText(this.wordScore)
    this.scoreBuffer = this.wordScore;
    

  }

  clearSelected(single, doSpecial) {
	 if (clearSelected && this.newWord || doSpecial) {
		if (this.selected.length > 1 || single) {
		  
		  var total = this.selected.length
		  //this.totalclearedText.setText(this.toalcleared)
		  var num = 0;
		  for (var s = 0; s < this.selected.length; s++) {
			var hex = this.getHexObjectByID(this.selected[s]);
		  
			
			hex.isFull = false;
			this.doTally(hex.value);
			//	hex.image.setY(1200)
			var tween = this.tweens.add({
			  targets: hex.image,
			  // x: 425,
			  y: -200,
			  alpha: 0,
			  duration: 100,
			  onCompleteScope: this,
			  onComplete: function() {
				num++
				if (num == total) {
				  //this.replenish();
				  this.makeFall();
				}
			  
			  }
			});

		  }
		  

		} else{
		  
		}
     }

	this.word = '';
    this.wordScore = 0;
    this.newWord = false;
    this.selected = [];
	 
  }

collectPU(type, hexid){
  var tile = this.getHexObjectByIDExtras(hexid);
  var tween = this.tweens.add({
    targets: tile.image,
    y: '-= 700',
    duration: 500,
    angle: 360,
    onCompleteScope: this,
    onComplete: function(){
      tile.image.destroy();
      tile.isFull = false;
      tile.powerUp = 0;
    }
  });
  if(tile.powerUp == 1){
    this.coinCount += 1;
    this.coinText.setText(this.coinCount)
  }
  if(tile.powerUp == 2){
    this.initialTime += 15;
  }
}

  makeFall() {
    var count = 0;
    var results = [];
    for (var h = this.hexagons.length - 1; h > -1; h--) {
      if (this.hexagons[h].isFull) {
        var num = this.holesBelow(this.hexagons[h].hex.q, this.hexagons[h].hex.r);
        if (num > 0) {
          var newq = this.hexagons[h].hex.q;
          var newr = this.hexagons[h].hex.r + num;
          var news = -newq - newr;
          var tohex = { q: newq, r: newr, s: news }
          var tile2 = this.getHexObjectByHex(tohex);

          //  this.hexagons[h].image.setY(this.hexagons[h].image.y + 105 * num);

          var tween = this.tweens.add({
            targets: this.hexagons[h].image,
            // x: 425,
            y: this.hexagons[h].image.y + hexH * num,
            duration: 500,
            onCompleteScope: this,
            onComplete: function() {
              count++
              if (count == num) {

              }

            }
          })
          this.swapValues(this.hexagons[h], tile2)

          // 
        }
      }
    }
    this.refill();

  }

  refill() {
    var totalEmpty = this.countEmpty();
    var count = 0;
    for (var h = this.hexagons.length - 1; h > -1; h--) {
      if (!this.hexagons[h].isFull) {
        var rand = new Value(this);
        this.hexagons[h].image.setFrame(rand.value);
        this.hexagons[h].value = rand.value;
        this.hexagons[h].letter = rand.letter;
        this.hexagons[h].isFull = true;
        var screen = hex_to_pixel(this.flat, this.hexagons[h].hex);

        //	hex.image.setY(1200)
        this.hexagons[h].image.setAlpha(1)
        this.hexagons[h].image.setScale(lScale)
        //	this.cleared.push(hex.image);
        //	hex.image = null
        var tween = this.tweens.add({
          targets: this.hexagons[h].image,
          x: screen.x,
          y: screen.y,
          duration: 500,
          onCompleteScope: this,
          onComplete: function() {
            //hex.image = null
            count++;
            if(count == totalEmpty){
              this.scanForDrop();
              
            }
          }
        })

      }
    }
    
  }
addAllColumn(){
  for (var h = 0; h < this.hexagons.length; h++) {
      if (this.hexagons[h].hex.q == this.qStart) {
        this.selected.push(this.hexagons[h].id)
      }
  }
}
addAllValue(value){
  for (var h = 0; h < this.hexagons.length; h++) {
      if (this.hexagons[h].value == value && !this.inChain(this.hexagons[h].hexid)) {
        this.selected.push(this.hexagons[h].id)
      }
  }
}
addAll(){
  for (var h = 0; h < this.hexagons.length; h++) {
      
        this.selected.push(this.hexagons[h].id)
      
  }
}
scanForDrop(){
  var single = false;
  for (var h = 0; h < this.hexagons.length; h++) {
      if (this.hexagons[h].value == dropFrame && this.atBottom(this.hexagons[h].hex)) {
        this.hexagons[h].image.setAlpha(.5)
        this.selected.push(makeID(this.hexagons[h].hex))
        var single = true
      }
    }
    if(single){
      this.clearSelected(single);
      console.log('drop')
    } else {
      console.log('done')
      if(allowRover){this.moveRover();}
    }
    
}
moveRover(){
  for (var h = 0; h < this.hexagons.length; h++) {
      if (this.hexagons[h].value == roverFrame ) {
        
        
        //this.selected.push(makeID(this.hexagons[h].hex))
      }
  }
}
getRandomRoverNeighbor(hex){
  var rand = Phaser.Math.Between(0, 5);
  var nei = hex_neighbor(hex, rand);
  if(this.checkRoverNeighbor(nei)){
    return true;
  } else {
    this.getRandomRoverNeighbor(hex)
  }
}
checkRoverNeighbor(hex){
  var nei = this.getHexObjectByHex(hex);
  if(nei.value == dropFrame || nei.value == roverFrame || !this.inMap(nei)){
    return false;
  } else {
    return true;
  }
  
}
atBottom(hex){
  var gg = hex_neighbor(hex, 5);
  if(!this.inMap(gg)){
    return true
  }
}
countEmpty(){
  var count = 0;
  for (var h = this.hexagons.length - 1; h > -1; h--) {
    if (!this.hexagons[h].isFull) {
      count++
    }
  }
  return count;
}
doTally(value){
  if(value == dropFrame){
    dropExistCount--;
    this.tally.drop += 1;
  } else if (value == roverFrame) {
    roverExistCount--;
    this.tally.rover += 1;
  } else if(value == 0){
    this.tally.v0 += 1;
  } else if(value == 1){
    this.tally.v1 += 1;
  } else if (value == 2) {
    this.tally.v2 += 1;
  } else if (value == 3) {
    this.tally.v3 += 1;
  } else if (value == 4) {
    this.tally.v4 += 1;
  } else if (value == 5) {
    this.tally.v5 += 1;
  }
}
addAllValue(value){
  for (var h = 0; h < this.hexagons.length; h++) {
      if (this.hexagons[h].value == value && !this.inChain(this.hexagons[h].hexid)) {
        this.selected.push(this.hexagons[h].id)
      }
    }
}

  /*	
  	
  	*/
  holesBelow(q, r) {
    var count = 0;
    for (var h = 0; h < this.hexagons.length; h++) {
      if (this.hexagons[h].isFull == false && this.hexagons[h].hex.q == q && this.hexagons[h].hex.r > r) {
        count++
      }
    }

    return count
  }
  swapValues(one, two) {
    two.isFull = true
    one.isFull = false;
    var temp = two.image;
    two.image = one.image;
    one.image = temp;
    var tempv = two.value;
    two.value = one.value;
    one.value = tempv;
    var templ = two.letter;
    two.letter = one.letter;
    one.letter = tempv;
    var tempp = two.letterValue;
    two.letterValue = one.letterValue;
    one.letterValue = tempv;
  }
  cube_to_axial(cube) {
    var q = cube.q
    var r = cube.r
    return { q: q, r: r }

  }
  getValue(hex) {
    var tile = this.getHexObjectByHex(hex);
    return tile.value;
  }
  inChain(hex) {
    return this.selected.indexOf(hex) > -1;
  }
  isNeighborOf(hex1, hex2) {
    var h2 = this.getHexObjectByID(hex2)
    var temp = hex_distance(hex1, h2.hex);
    if (temp == 1) {
      return true
    } else {
      return false
    }

  }
  drawGridExtras(hexesExtras) {


    for (var i = 0; i < hexesExtras.length; i++) {
      var center = hex_to_pixel(this.flat, hexesExtras[i]);
      
        var hexObject = {
            hex: hexesExtras[i],
            image: null,
            value: 0,
            strength: 0,
			      powerUp: 0,
            id: makeID(hexesExtras[i]),
            isFull: false,
      }
    
      this.hexagonsExtras.push(hexObject)
      this.idMapExtras.push(makeID(hexesExtras[i]));
      
    }
    var randA = this.getRandomEmpty(6);
	  var randB = this.getRandomEmpty(6);
   // console.log(JSON.stringify(randA))
    for(var r = 0; r < randA.length; r++){
      
          var tile = this.getHexObjectByIDExtras(randA[r].id)
          var center = hex_to_pixel(this.flat,tile.hex)
          var image = this.add.image(center.x, center.y, "hex").setScale(scale).setAlpha(.2);

          tile.value = this.makeBonus();
          if(tile.value == 3){
            image.setTint(0xff0000);
          } else if(tile.value == 2){
            image.setTint(0x00ff00);
          }
        tile.image = image;
        tile.strength = 3;
        
      
    }
	for(var r = 0; r < randB.length; r++){
      
          var tile = this.getHexObjectByIDExtras(randB[r].id)
          var center = hex_to_pixel(this.flat,tile.hex)
          //var image = this.add.image(center.x + 20, center.y - 17, "hex").setScale(1).setAlpha(1);

          tile.powerUp = this.makePowerUp();
          //1 = coin, 2=time
          if(tile.powerUp == 1){
            var image = this.add.image(center.x + 45, center.y - 30, "coin").setScale(1.8).setAlpha(1);
          } else if(tile.powerUp == 2) {
            var image = this.add.image(center.x + 45, center.y - 30, "time").setScale(1.8).setAlpha(1);
          }
        tile.image = image;
        tile.strength = 3;
       
      
    }
  }
  getRandomEmpty(n){
	  let result = [];
	  let x = 0;
	  do{
		var rand = Phaser.Math.Between(0,this.hexagonsExtras.length - 1);
		if(!this.hexagonsExtras[rand].isFull){
			this.hexagonsExtras[rand].isFull = true;
			result.push(this.hexagonsExtras[rand]);
			x++;
		} 
	  }while (x < n)
	  return result;
  }
  drawGrid(hexes) {

    const color = new Phaser.Display.Color();

    for (var i = 0; i < hexes.length; i++) {
      var center = hex_to_pixel(this.flat, hexes[i]);
      
      
      var value = new Value(this);
     // var letter = value.makeLetter(value);
      
      var image = this.add.image(center.x, center.y, "hexflat", value.value).setScale(lScale).setTint(0xbfae67);

      var coo = hexes[i].q + ',' + hexes[i].r + ',' + hexes[i].s;
      //this.cooText = this.add.bitmapText(center.x, center.y, 'lato', coo, 30).setOrigin(.5).setTint(0xff0000).setAlpha(1);
      this.makeGameGrid(hexes[i], image, value.value, value.letter, value.letterValue);
    }
    //this.addSpecial(roverFrame);
  }
  makeGameGrid(hex, image, value,letter, letterValue) {
    var hexObject = {
      hex: hex,
      image: image,
      value: value,
      id: makeID(hex),
      isFull: true,
      letter: letter,
      letterValue: letterValue
    }
    this.hexagons.push(hexObject)
    this.idMap.push(makeID(hex));
  }
  addSpecial(value){
   // var rand = Phaser.Math.Between(0, this.hexagons.length);
    var rand = this.getRandom(this.hexagons, 4);
    for(var r = 0; r < rand.length; r++){
       rand[r].image.setFrame(value);
       rand[r].value = value;
  }
    
    
    
    
    
  }
  makeBonus() {
    let bonus = 0;
    if (Phaser.Math.Between(1, 100) > 75) {
      bonus = 3;
    }  else {
      bonus = 2;
    }
    return bonus;
  }
    makePowerUp() {
    let bonus = 0;
    if (Phaser.Math.Between(1, 100) > 50) {
      bonus = 1;
    }  else {
      bonus = 2;
    }
    return bonus;
  }
 getRandom(arr, n) {
 
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
  
  getHexObjectByIDExtras(id) {
    var tempIndex = this.idMapExtras.indexOf(id);
    return this.hexagonsExtras[tempIndex];
  }
 
  
  //given cube coordinate object, return the hexagon object
  getHexObjectByHex(hex) {
    var findId = makeID(hex);
    var tempIndex = this.idMap.indexOf(findId);
    return this.hexagons[tempIndex];
  }
  getHexObjectByID(id) {

    var tempIndex = this.idMap.indexOf(id);
    return this.hexagons[tempIndex];
  }
  inMap(hex) {
    var findId = makeID(hex);
    if (this.idMap.indexOf(findId) > -1) {
      return true;
    } else {
      return false;
    }
  }
}
