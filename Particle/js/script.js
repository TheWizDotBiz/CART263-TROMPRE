/**
Particles with Emotion: Just needs to calm down
Thomas Rompré
Blessed be the Omnissiah

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

let LineList = []; //this is an array taht will contain all active line objects
var LinesPerFrame = 60;

var canvasHeight;
var canvasWidth;

var originX;
var originY;

var dingDong;
/**
Description of preload
*/
function preload() {
    canvasHeight = displayHeight;
    canvasWidth = displayWidth;
}


/**
Description of setup
*/
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    originX = width / 2;
    originY = height / 2;
   // dingDong = new Line();
}


/**
Description of draw()
*/
function draw() {
    background(0, 0, 0);
   // dingDong.Move();
   for(var l = 0; l < LinesPerFrame; l++){
    LineList.push(new Line());
   }
  
    for(var i = 0; i < LineList.length; i++){
        LineList[i].Move();
        if(LineList[i].x1 >= canvasWidth || LineList[i].x1 <= 0 || LineList[i].y1 >= canvasHeight || LineList[i].y1 <= 0){
            LineList.splice(i, 1);
        }
    }
    //new Line().Move;
}


class Line{
    constructor(x1, x2, y1, y2, xSpeed, ySpeed, length){
        //x1 and y1 is the origin point of the line
        //x2 and y2 is the endpoint;
        this.x1 = mouseX;
        this.x2 = mouseX;
        this.y1 = mouseY;
        this.y2 = mouseY;
        //This changes the x and y 2 values until the length is reached
        this.xSpeed = random(-1, 1);
        this.ySpeed = random(-1, 1);
        //once the distance between point 1 and 2 is reached or surpassed, point 1 is moved as well, creating a lazer-like effect.
        this.length = 100;
    }

    Move(){
        this.x2 += this.xSpeed * deltaTime;
        this.y2 += this.ySpeed * deltaTime;
        if(dist(this.x1, this.y1, this.x2, this.y2) >= this.length){
            this.x1 += this.xSpeed * deltaTime;
            this.y1 += this.ySpeed * deltaTime;
        }
        stroke(255, 0, 0);
        strokeWeight(1);
        line(this.x1, this.y1, this.x2, this.y2);
        print(this.x2);
    }

    //should add a jitter function here, jittery stuff might represent anxiety or something
    //what about a face madeof lines that follows the mouse cursor? then make it jitter i suppose lol.
}