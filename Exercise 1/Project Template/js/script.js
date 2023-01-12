/**
PONG
Thomas Rompre

Its pong.
the emperor protects.
*/

"use strict";
//Canvas
var canvasHeight = 1000;
var canvasWidth = 1000;
//Paddles
var RedPosY = canvasWidth / 2;
var BluePosY = canvasWidth / 2;
var PaddleBuffer = 50; //this is the horizontal difference between the edge of the canvas and the player paddles
var PaddleWidth = 10;
var PaddleHeight = 150;
var PaddleSpeed = 1;
//Ball
var ballX = canvasWidth / 2;
var ballY = canvasHeight / 2;
var ballW = 25;
var ballDirX;
var ballDirY;
var ballSpeed = 0.5;
//score
var BlueScore = 0;
var RedScore = 0;
/**
Description of preload
*/
function preload() {
   
    
    
}


/**
Description of setup
*/
function setup() {
    createCanvas(canvasHeight, canvasWidth); //i probably mixed these two up but whatever its a square
    background(0, 0, 0); //black
    rectMode(CENTER);
    spawnBall();
}


/**
Description of draw()
*/
function draw() {
    background(0, 0, 0); //black
    drawPaddles();
    drawBall();
    drawScore();

    //BLUE CONTROL
    if(keyIsDown(87)){ //W
        //console.log("W");
        if(BluePosY > PaddleHeight / 2){ 
            BluePosY -= PaddleSpeed * deltaTime;
        }
        
    }

    if(keyIsDown(83)){//S
        if(BluePosY < canvasHeight - PaddleHeight / 2){
            BluePosY += PaddleSpeed * deltaTime;
        }
        
    } 

    //RED CONTROL
    if(keyIsDown(UP_ARROW)){
        if(RedPosY > PaddleHeight / 2){
            RedPosY -= PaddleSpeed * deltaTime;
        }
    }
    if(keyIsDown(DOWN_ARROW)){
        if(RedPosY < canvasHeight - PaddleHeight / 2){
            RedPosY += PaddleSpeed * deltaTime;
        }
    }
}

function drawPaddles(){
    //draw blue paddle (left)
    fill(0, 0, 255);
    rect(PaddleBuffer, BluePosY, PaddleWidth, PaddleHeight);

    //draw red paddle (right);
    fill(255, 0, 0);
    rect(canvasWidth - PaddleBuffer, RedPosY, PaddleWidth, PaddleHeight);

}

function drawBall(){
    fill(255, 255, 255);
    //circle(ballX, ballY, ballW);
    square(ballX, ballY, ballW);

    //move ball
    ballX += ballDirX * deltaTime;
    ballY += ballDirY * deltaTime;

    //should probably add collision detection here, check if the Y stuff collides n all lol.
    //check collision blue (left)
    if(ballX - ballW / 2 <= PaddleBuffer + PaddleWidth / 2){
        if(ballY < BluePosY + PaddleHeight / 2 && ballY > BluePosY - PaddleHeight / 2){
            if(ballDirX < 0){ //checks that ball is heading left
                ballDirX = ballDirX * -1;
                ballDirY = (ballY - BluePosY) * (ballSpeed / 100);
            }
        }
    }

    //check collision right (red)
    if(ballX + ballW / 2 >= (canvasWidth - PaddleBuffer) - PaddleWidth / 2){
        if(ballY < RedPosY + PaddleHeight / 2 && ballY > RedPosY - PaddleHeight / 2){
            if(ballDirX > 0){
                ballDirX = ballDirX * -1;
                ballDirY = (ballY - RedPosY) * (ballSpeed / 100);
            }
        }
    }

    //check top collision
    if(ballY <= ballW / 2){
        if(ballDirY < 0){
            ballDirY = ballDirY * -1;
        }
    }
    //check bottom collision
    if(ballY >= canvasHeight - (ballW / 2)){
        if(ballDirY > 0){
            ballDirY = ballDirY * -1;
        }
    }

    //check if scores on blue (lelft)
    if(ballX <= 0){
        console.log("red scores!");
        RedScore++;
        spawnBall();
        checkIfWin();
    }
    //check if scores on red (right)
    if(ballX >= canvasWidth){
        console.log("blue scores!");
        BlueScore++;
        spawnBall();
        checkIfWin();
    }
    
}

function spawnBall(){
    var rand = random(-1, 1);
    if(rand > 0){
        ballDirX = ballSpeed;
    }else{
        ballDirX = ballSpeed * -1;
    }
    //ballDirX = random(ballSpeed * -1, ballSpeed);
    ballDirY = random(ballSpeed * -1, ballSpeed);
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
}

function drawScore(){
    var theText = BlueScore + " - " + RedScore;
    if(BlueScore >= 10){
        theText = "BLUE WINS";
    }
    if(RedScore >= 10){
        theText = "RED WINS";
    }
    fill(255, 255, 255);
    textSize(32);
    text(theText, canvasWidth / 2, 100, 100, 100);
}

function checkIfWin(){
    //blue
    if(BlueScore >= 10 || RedScore >= 10){
        spawnBall();
        ballDirX = 0;
        ballDirY = 0;
    }
    
}
