class Value {
  constructor(scene) {
    this.scene = scene;

    //var text = this.add.text(screen.x, screen.y, i + ',' + j, {fontSize:30}).setOrigin(0,1);
    
    this.value = this.getValue();
    this.letter = this.makeLetter(this.value);
    this.letterValue = this.makePointValue(this.value);
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
  makeValue() {

    // this.tileLettersValues = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10, 1, 1, 1, 1];
   //,o,n,,h,
 this.lettersWeight_ =
[
    ['a', 8.167],
	['b', 1.492],
	['c', 2.782],
	['d', 4.253],
	['e', 12.702],
	['f', 2.228],
	['g', 2.015],
	['h', 6.094],
    ['i', 6.966],
    ['j', 0.153],
	['k', 0.772],
	['l', 4.025],
	['m', 2.406],
	['n', 6.769],
    ['o', 7.507],
    ['p', 1.929],
    ['q', 0.095],
	['r', 5.987],
    ['s', 6.327],
    ['t', 9.056],
    ['u', 2.758],
    ['v', 0.978],
	['w', 2.306],
    ['x', 0.150],
    ['y', 1.974],
    ['z', 0.074]
];
this.lettersWeight =
[
    ['a', 8.4966],
	['b', 2.0720],
	['c', 4.5388],
	['d', 3.3844],
	['e', 11.1607],
	['f', 1.8121],
	['g', 2.4705],
	['h', 3.0034],
    ['i', 7.5448],
    ['j', 0.1965],
	['k', 1.1016],
	['l', 5.4893],
	['m', 3.0129],
	['n', 6.6544],
    ['o', 7.1635],
    ['p', 3.1671],
    ['q', 0.1965],
	['r', 7.5809],
    ['s', 5.7351],
    ['t', 6.9509],
    ['u', 3.6308],
    ['v', 1.0074],
	['w', 1.2899],
    ['x', 0.2902],
    ['y', 1.7779],
    ['z', 0.2722]
];

this.lettersWeight___ =
[
    ['a', 5.8462],
	['b', 3.8462],
	['c', 3.8462],
	['d', 3.8462],
	['e', 6.6924],
	['f', 3.8462],
	['g', 3.0000],
	['h', 3.8462],
    ['i', 3.8462],
    ['j', 3.8462],
	['k', 3.8462],
	['l', 3.8462],
	['m', 3.8462],
	['n', 4.7284],
    ['o', 5.8462],
    ['p', 3.8462],
    ['q', 1.0000],
	['r', 4.8462],
    ['s', 6.6924],
    ['t', 4.8462],
    ['u', 3.8462],
    ['v', 2.8462],
	['w', 2.8462],
    ['x', 1.8462],
    ['y', 2.8462],
    ['z', 1.0000]
];

    this.tileLetters = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
      'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
      'w', 'x', 'y', 'z', 'e', 'a', 'r', 's', 'i', 't', 'o', 'n', 'h'
    ];
    
      var tileLetter = this.tileLetters[Phaser.Math.Between(0, this.tileLetters.length - 1)];
      var wLetter = this.getRandomLetter();
 
    var letterPosition = this.tileLetters.indexOf(wLetter);
 
    //console.log(tileLetter);
    //return tileLetter;
    return letterPosition;

  }
  makeLetter(value) {

    this.tileLetters = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
      'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
      'w', 'x', 'y', 'z', 'e', 'a', 'r', 's', 'i', 't', 'o', 'n', 'h'
    ];
    return this.tileLetters[value];
    
  }
  makePointValue(value) {
    this.tileLettersValues = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    return this.tileLettersValues[value];
  }

  
getRandomLetter() {
  let total = 0;
  for (let i = 0; i < this.lettersWeight.length; ++i) {
    total += this.lettersWeight[i][1];
  }

  const threshold = Math.random() * total;

  total = 0;
  for (let i = 0; i < this.lettersWeight.length - 1; ++i) {
    // Add the weight to our running total.
    total += this.lettersWeight[i][1];

    // If this value falls within the threshold, we're done!
    if (total >= threshold) {
      return this.lettersWeight[i][0];
    }
  }
}
 /* else if(rand2 > 95 && roverExistCount < roverShowMax && roverTotalMade < roverMaxAllowed){
      roverExistCount++;
      roverTotalMade++;
      rand = roverFrame;
    }*/
}
