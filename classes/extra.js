class Extra {
  constructor(scene, hexesExtra) {
    this.scene = scene;

    
    this.value = this.getValue();
    this.letter = this.makeLetter(this.value);
    this.letterValue = this.makePointValue(this.value);
  }
  getRandomEmpty(){
	  var len = hexagonsExtras.length;
	  var rand = Phaser.Math.Between(0, len);
	  return this.hexagonsExtras[rand].isFull;
  }
  getValue(){
    /*var rand = Phaser.Math.Between(0, 25)
    var rand2 = Phaser.Math.Between(0, 100)
    if (rand2 > 95 && dropExistCount < dropShowMax && dropsTotalMade < dropMaxAllowed) {
      dropExistCount++;
      dropsTotalMade++;
      rand = dropFrame;
    } */
    var rand = this.makeValue();
    
    return rand
  }
  
  

}