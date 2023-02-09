//Particles with emotion: Just Needs to Calm Down
//Thomas Rompre 2023/01/26

var canvasHeight;
var cavnasWidth;
var time = 0;

//eyebrows
var eyebrowLength = 200;
var eyebrowWidth = 25;
var eyebrowOffset = 150;
var eyebrowRotate = -25;
"use strict";
var eyebrowRight;
var eyebrowLeft;

//sweat beads;
var testSweatBead;
var SweatBeads = [];
var initBeadCount = 100;

//microphone for interactivity
var mic;
var sweatDropTimer = 0;
var sweatDropTimerLimit = 0.01;

//aritifical background
bckThisCircle = 0;
bckCircleCount = 25;
bckCircleList = [bckCircleCount];

//pattern backgorund
var ColorPattern = [];
var ColorCount = 3;
var colorIndex = 0;
var colorTimer = 0;
var colorTimerLimit = 250; //this is in milliseconds

//Ripples
var RippleList = [];


function setup(){
    
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    rectMode(CENTER);
    testSweatBead = new sweatBead(random(0.05, 0.5), mouseX, mouseY);
    for(var i = 0;i < initBeadCount; i++){
        SweatBeads[i] = new sweatBead(random(0.05, 0.5), mouseX, mouseY);
    }
    for(var j = 0; j < ColorCount; j++){
      ColorPattern[j] = color(0, 0, 0);
    }
    mic = new p5.AudioIn();
    mic.start();
}

function draw(){
    //print(mic.getLevel()); returns values from 0 to 1, based on volume input of microphone
    background(0, 0, 0);
    translate(0, 0); //sets the origin to the top left corner, it akes it so sweatbeads dont follow the character
   // newDrawArtificialBackground();
  // drawPatternBackground();
 // ManualBackground();
  AnimateRipples();
    //render sweat here
    testSweatBead.newDisplay();  
    for(var i = 0; i < SweatBeads.length; i++){
        SweatBeads[i].newDisplay();  
    } 
    verifySweatOutOfBounds(); 
    translate(mouseX, mouseY);//THIS SETS THE ORIGIN POINT OF THE CANVAS TO THE MOUSE POSITION EVERY FRAME! MEANS THAT 0, 0 RETURNS MOUSEPOS, MIGHT BE A TERRIBLE IDEA. its used for making the eyebrows follow the mouse, mostly.
    eyeBrows();
    
   // eyebrowRight.display();
    //eyebrowLeft.display();

    adjustSweatCount();
    time += deltaTime * 100; //this is mostly used to make the eyebrows shake, might wanna create another timer for the sweat drops n shit
}

function eyeBrows(){ //renders and makes the eyebrows shake
    push();
    noStroke();
    fill(255, 255, 255, 255);
    //left
    
    //print(sin(time));   
    rotate(eyebrowRotate);
    rect(0 - eyebrowOffset + sin(time) * (initBeadCount / 10), 75, eyebrowLength, eyebrowWidth);
    //right
    rotate((eyebrowRotate * 2) * -1);
    rect(0 + eyebrowOffset + sin(time) * (initBeadCount / 10), 75, eyebrowLength, eyebrowWidth)

    //rotate reset?
    resetMatrix();
    pop();
}

function verifySweatOutOfBounds(){ //deletes sweatbeads and creates new ones if they fall out of bounds
    for(var i = 0; i < SweatBeads.length; i++){
        if(SweatBeads[i].y1 >= height){
            SweatBeads.splice(i, 1);
            //SweatBeads.push(new sweatBead(random(0.05, 0.5)));
        }
    }

    if(SweatBeads.length < initBeadCount){
        SweatBeads.push(new sweatBead(random(0.05, 0.5), mouseX, mouseY));
    }
}

function adjustSweatCount(){ //this makes the amount of sweat bead drop off over time to simulate it calming down, or increases it when you scream at it. also affects how much the eyebrows shake
    var vol = mic.getLevel();
   // print("volume received is " + vol);
  //print(initBeadCount);
    if(vol >= 0.05){
        print("adding sweat");
        initBeadCount++;
        AddRipple();
    }else if(initBeadCount > 0){
        sweatDropTimer += deltaTime;
        if(sweatDropTimer >= sweatDropTimerLimit * 1000 && initBeadCount >= 11){
            //print("dropping a sweat");
            initBeadCount--;
            sweatDropTimer = 0;
        }
    }else{
        initBeadCount = 0;
    }
}

class sweatBead{ //a line with two coordiantes for the start and end, a length (distance between two points) and some variable to make it rotate and fall downwards.
    constructor(length, posX, posY){ //posX and posY being mouseX and mouseY
        var init = random(-100, 100) + mouseX;
        var initY = random(-50, 50) + mouseY;
        this.speed = 0.01;
        this.x1 = init; //these are set around 0 and not mouseX and stuff becuase of the eyebrow thing and the translate mousepos stuff making it so the origin of the canvas is the same as the mouse position
        this.x2 = init;
        this.y1 = initY;
        this.y2 = initY;
        this.length = length; //how long you want the sweatbead to be
        this.lifetime = 0; //time in ms of sweatbead's lifetime, affects things like detaching itself from the origin and color
       // this.timeLimit = random(0.1, 1);
        this.str = random(10, 25); //the str at which it is flung out horizontally
        this.initStr = this.str;
        this.falloff = 1; //falloff for the horizontal fling
        this.dir = round(random(-1, 2)); //which direction will it fling towards
       
        if(this.dir > 0){
            this.dir = 1;
        }else{
            this.dir = -1;
        }
        //print(this.dir);
        //print("start x is "  + this.x1 + "start y is " + this.y1);
    }

    newDisplay(){
        //print(mouseX);
        //stroke('#00FFFF');
        stroke(0, 255 - this.lifetime / 3,  255 - this.lifetime / 3);
        strokeWeight(1);
        this.lifetime += deltaTime;
        if(this.str != 0){
                this.str -= this.falloff;
                if(this.str < 0){
                    this.str = 0;
                }
        }
        //print("with dir " + this.dir +  " we are moving by " + this.str * this.dir);
        this.x2 += this.str * this.dir + (random(-10,10));
        this.y2 += this.initStr - this.str;
        //print(this.lifetime / 1000 + " " + this.length)
        if(this.lifetime / 1000 >= this.length){
           // print("DING DING DING");
            this.x1 = lerp(this.x1, this.x2, 0.1);
            this.y1 = lerp(this.y1, this.y2, 0.1);
           // this.x1 += this.str * this.dir;
            //this.y1 += this.initStr - this.str;
        }
        line(this.x1, this.y1, this.x2, this.y2);
       // print(this.x2 + " " + this.y2);
    }
}
/*//these suck
function drawArtificialBackground(){
    for(var i = 0; i < width / 25; i++){
        noStroke();
        fill(initBeadCount * 2.5 - i, 0, 0);
        circle(width / 2, height / 2, width - (i * 25));
    }

}

function newDrawArtificialBackground(){
    bckCircleList[bckThisCircle] = mic.getLevel();
    noStroke();
    for(var i = 0; i < bckCircleList.length; i++){
        if(bckCircleList[i] != null){
            fill(bckCircleList[i] * 2.5, 0, 0);
            circle(width / 2, height / 2, width - (i * 25));
        }
    }
    bckThisCircle++;
    if(bckThisCircle > bckCircleCount){
        bckThisCircle = 0;
    }
}*/

//these use the p5.pattern library
//https://openprocessing.org/sketch/1278485 for tutorial
//this causes a LOT of lag, might narrow it down to 2 shades of red that fade to black or something
//could also just make a set PATTERNCOLOR array, swap around the position of the values and modify the R by initBeadCount, i think.
//ADD A TIMER, make it re-render every second or so, every frame makes it shit itself and slows down to a crawl after like 10 seconds or so
function drawPatternBackground(){ //This is actually deprecated too lmao
    //pattern(PTN.checked(20))
  /*
    if(initBeadCount % 2 > 0 || initBeadCount <= 10){
      ColorPattern[colorIndex] = color(0, 0, 0);
    }else{
      ColorPattern[colorIndex] = color(initBeadCount, 0, 0);
    }*/
    colorTimer += deltaTime;
    if(colorTimer >= colorTimerLimit){
      //cycle values;
      var zeroColorHolder = color('black');
      for(var i = 0; i < ColorCount; i++){
        if(i == 0){
          zeroColorHolder = lerpColor(color('black'), color('orange'), mic.getLevel());
        }else{
          ColorPattern[i] = ColorPattern[i - 1];
        }
      }
      ColorPattern[0] = zeroColorHolder;
      //reset
      colorTimer = 0;
    }
    pattern(PTN.stripeCircle(20));
    var PATTERNCOLOR = [color(255, 0, 0), color(0, 0, 0), color(0, 255, 0)];
    patternColors(ColorPattern);
    rectPattern(width / 2, height / 2, width, height)
  /*
    colorIndex++;
    if(colorIndex >= ColorCount){
        colorIndex = 0;
    }*/
  //console.log(ColorPattern);
}

var manualCircleCount = 10;
var manualCircleColors = [];

function ManualBackground(){ //this is deprecated
  colorTimer += deltaTime;
  if(colorTimer >= colorTimerLimit){
    var zeroPosColor = color('black');
    for(var i = 0; i < manualCircleCount; i++){ //set and cycle color array
      if(i == 0){
        zeroPosColor = lerpColor(color('black'), color('orange'), mic.getLevel());
      }else{
        manualCircleColors[i] = manualCircleColors[i - 1];
      }
    }
    
    manualCircleColors[0] = zeroPosColor;
    
    colorTimer = 0;
  }
  
  for(var j = 0; j < manualCircleCount; j++){ //draw circles
      if(manualCircleColors[j] == null){ //init proofing
        manualCircleColors[j] = color('black');
      }
      noStroke();
      fill(manualCircleColors[j]);
      circle(width/2, height/2, width - (j * 100));
    }
  
}
//All of the following is relevant
class Ripple{
  constructor(level){
    this.radius = 1;
    this.speed = 1;
    this.StrokeSize = level * 20;
    this.lifetime = 0;
    this.conversion = level; //receives the mic GetLevel value and uses it for the lerpColor
  }
  
  GrowAndDraw(){
    this.radius += this.speed * deltaTime;
   // this.StrokeSize += this.speed * deltaTime;
    //this.lifetime += this.speed * deltaTime;
    fill(0, 0, 0, 0);
    strokeWeight(this.StrokeSize);
    stroke(lerpColor(color('red'), color('yellow'), this.conversion));
    circle(width/2, height/2, this.radius);
  }
}

function AnimateRipples(){
  if(RippleList.length > 0){
    for(var i = 0; i < RippleList.length; i++){
      RippleList[i].GrowAndDraw();
      if(RippleList[i].radius >= width * 1.5){
        RippleList.splice(i, 1);
      }
    }
  }
}

function AddRipple(){
  var vol = mic.getLevel();
  RippleList.push(new Ripple(vol));
}

