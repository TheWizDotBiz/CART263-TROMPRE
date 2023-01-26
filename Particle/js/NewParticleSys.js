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
var initBeadCount = 20;

function preload(){
    
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    rectMode(CENTER);
    eyebrowRight = new eyebrow("right");
    eyebrowLeft = new eyebrow("left");
    testSweatBead = new sweatBead(random(0.05, 0.5));
    for(var i = 0;i < initBeadCount; i++){
        SweatBeads[i] = new sweatBead(random(0.05, 0.5));
    }
    
}

function draw(){
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
    time += deltaTime * 100; //this is mostly used to make the eyebrows shake, might wanna create another timer for the sweat drops n shit
}

function eyeBrows(){
    push();
    noStroke();
    fill(255, 255, 255, 255);
    //left
    
    //print(sin(time));   
    rotate(eyebrowRotate);
    rect(0 - eyebrowOffset + sin(time) * 5, 0, eyebrowLength, eyebrowWidth);
    //right
    rotate((eyebrowRotate * 2) * -1);
    rect(0 + eyebrowOffset + sin(time) * 5, 0, eyebrowLength, eyebrowWidth)

    pop();
}

function verifySweatOutOfBounds(){
    for(var i = 0; i < SweatBeads.length; i++){
        if(SweatBeads[i].y1 >= height){
            SweatBeads.splice(i, 1);
            //SweatBeads.push(new sweatBead(random(0.05, 0.5)));
        }
    }

    if(SweatBeads.length < initBeadCount){
        SweatBeads.push(new sweatBead(random(0.05, 0.5)));
    }
}

class sweatBead{ //a line with two coordiantes for the start and end, a length (distance between two points) and some variable to make it rotate and fall downwards.
    constructor(length){
        this.speed = 0.01;
        this.x1 = mouseX;
        this.x2 = mouseX;
        this.y1 = mouseY;
        this.y2 = mouseY;
        this.length = length;
        this.lifetime = 0;
       // this.timeLimit = random(0.1, 1);
        this.str = random(10, 25);
        this.initStr = this.str;
        this.falloff = 1;
        this.dir = round(random(-1, 1));
    }

    newDisplay(){
        print(mouseX);
        stroke(0, 255, 0, 255);
        strokeWeight(1);
        this.lifetime += deltaTime;
        if(this.str != 0){
            if(this.dir = 1){
                this.str -= this.falloff;
                if(this.str < 0){
                    this.str = 0;
                }
            }else{
                this.str += this.falloff;
                if(this.str > 0){
                    this.str = 0;
                }
            }
        }
        this.x2 += this.str * this.dir;
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

    display(){
        stroke(0, 255, 0, 255);
        strokeWeight(5);
        this.lifetime += deltaTime * this.speed;
        this.x2 += log(this.lifetime);
        this.y2 += this.speed - (1 - log(this.lifetime));
        if(dist(this.x1, this.x2) >= this.length){
            this.x1 += log(this.lifetime);
            this.y1 += this.speed - (1 - log(this.lifetime));
        }
        //print(this.x2);
        line(this.x1, this.y1, this.x2, this.y2);


        
    }
}

//this is deprecated, bask in the glory of it's bit-ridden corpse.
class eyebrow{
    constructor(side){
        this.side = side;
        if(this.side = "left"){
            this.rotation = eyebrowRotate
            this.x = mouseX - eyebrowOffset;
        }else{
            this.rotation = (eyebrowRotate * 2) * -1;
            this.x = mouseX + eyebrowOffset;
        }
       // this.x = mouseX;
        this.y = mouseY;
        this.length = eyebrowLength;
        this.width = eyebrowWidth;
        this.shakes = 0;
        
       
    }

    display(){
        fill(255, 255, 255, 255);
        translate(mouseX, mouseY);
        rotate(this.rotation)
        this.shakes += sin(deltaTime);
        if(this.side == "left"){
            this.x = mouseX - eyebrowRotate + this.shakes;
        }else{
            this.x = mouseX + eyebrowRotate + this.shakes;
        }
        this.y = mouseY;
        rect(this.x, this.y, this.length, this.width);
    }
}