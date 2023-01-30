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
var sweatDropTimerLimit = 0.1;


function setup(){
    mic = new p5.AudioIn();
    mic.start();
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    rectMode(CENTER);
    eyebrowRight = new eyebrow("right");
    eyebrowLeft = new eyebrow("left");
    testSweatBead = new sweatBead(random(0.05, 0.5), mouseX, mouseY);
    for(var i = 0;i < initBeadCount; i++){
        SweatBeads[i] = new sweatBead(random(0.05, 0.5), mouseX, mouseY);
    }
    
}

function draw(){
    //print(mic.getLevel()); returns values from 0 to 1, based on volume input of microphone
    background(0, 0, 0);
    translate(mouseX, mouseY); //THIS SETS THE ORIGIN POINT OF THE CANVAS TO THE MOUSE POSITION EVERY FRAME! MEANS THAT 0, 0 RETURNS MOUSEPOS, MIGHT BE A TERRIBLE IDEA
    //render sweat here
    ///testSweatBead.display();
    testSweatBead.newDisplay();  
    for(var i = 0; i < SweatBeads.length; i++){
        SweatBeads[i].newDisplay();  
    } 
    verifySweatOutOfBounds(); 
    
    eyeBrows();
    
   // eyebrowRight.display();
    //eyebrowLeft.display();

    adjustSweatCount();
    time += deltaTime * 100; //this is mostly used to make the eyebrows shake, might wanna create another timer for the sweat drops n shit
}

function eyeBrows(){ //renders and makes the eyebrows shake
    push();
    noStroke();
    fill(0, 0, 0, 255);
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
    if(vol >= 0.1){
        print("adding sweat");
        initBeadCount++;
    }else if(initBeadCount > 0){
        sweatDropTimer += deltaTime;
        if(sweatDropTimer >= sweatDropTimerLimit * 1000 && initBeadCount >= 11){
            print("dropping a sweat");
            initBeadCount--;
            sweatDropTimer = 0;
        }
    }else{
        initBeadCount = 0;
    }
}

class sweatBead{ //a line with two coordiantes for the start and end, a length (distance between two points) and some variable to make it rotate and fall downwards.
    constructor(length, posX, posY){ //posX and posY being mouseX and mouseY
        var init = random(-100, 100);
        var initY = random(-50, 50);
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