let qTotal = 5; //col
let rTotal = 5; //row
let imageW = 80;
let imageH = 70; 
let scale = 1.8;
let lScale = 1.7;
let sScale = 1;
let hexW = imageW * scale;
let hexH = imageH * scale;
let hexSide = hexW / 2;
//hexagon
let depth = 3;
let boardType = 'hex';

let gameTime = 120;

let scoreBase = 10;

let clearSelected = false;
let allowPowerUp = true;

let dropFrame = 6;
let dropShowMax = 2;
let dropMaxAllowed = 5;
let dropExistCount = 0;
let dropsTotalMade = 0;

let allowRover = false;
let roverFrame = 7;
let roverShowMax = 3;
let roverMaxAllowed = 5;
let roverExistCount = 0;
let roverTotalMade = 0;
