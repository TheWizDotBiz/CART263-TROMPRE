


var NewBall;
var Ball2;

var BallArray = [];
var ballCount = 50;

var AltBallArray = [];


function setup() {
  createCanvas(400, 400);
  NewBall = new Particle(10);
  Ball2 = new Particle(25);
  for(var i = 0; i < ballCount; i++){
    BallArray[i] = new Particle(random(10, 50));
    AltBallArray[i] = new AltParticle(random(10, 50));
  }
}

function draw() {
  background(220);
  NewBall.display();
  NewBall.move();
  Ball2.display();
  Ball2.move();

  for(var i = 0; i < BallArray.length; i++){
    BallArray[i].display();
    
   // BallArray[i].move();
  }

  for(var j = 0; j < AltBallArray.length; j++){
    AltBallArray[j].display();
  }
}

function keyPressed(){
  BallArray.push(new Particle(random(10, 50)));
  AltBallArray.push(new AltParticle(random(10, 50)));
}

function mousePressed(){
  for(var i = 0; i  < BallArray.length; i++){
    //check ballarray
    if(mouseX >= BallArray[i].x - BallArray[i].width / 2 && mouseX <= BallArray[i].x + BallArray[i].width / 2 && mouseY >= BallArray[i].y - BallArray[i].width / 2 && mouseY <= BallArray[i].y + BallArray[i].width / 2){
      //DELETE THE FUCKER
      BallArray.splice(i, 1);
    }
  }

  for(var j = 0; j < AltBallArray.length; j++){
    if(mouseX >= AltBallArray[j].x - AltBallArray[j].width / 2 && mouseX <= AltBallArray[j].x + AltBallArray[j].width / 2 && mouseY >= AltBallArray[j].y - AltBallArray[j].width / 2 && mouseY <= AltBallArray[j].y + AltBallArray[j].width / 2){
      //DELETE THE FUCKER
      AltBallArray.splice(j, 1);
    }
  }
}

class Particle{ //set up properties and method of a class
  constructor(width){ //set up properties of class object, these are ran *once* when the object is instantiated
    this.x = random(0, 400);
    this.y = random(0, 400);
    this.width = width;
    this.speed = 0.001;
    this.lifetime = 0;
  }

  display(){
    this.lifetime += deltaTime * 0.01;
    noStroke();
    fill(this.x + this.lifetime, this.y + this.lifetime, this.width + this.lifetime, random(190, 200));
    ellipse(this.x, this.y, this.width);

    this.x += random((mouseX * this.speed * deltaTime) * -1, (mouseX * this.speed * deltaTime));
    this.y += random((mouseY * this.speed * deltaTime) * -1, (mouseY * this.speed * deltaTime));
    //this.x += random(-1, 1);
   // this.y += random(-1, 1);

   //bounce off walls
    if(this.x > 400 - this.width / 2){
      this.x -= this.width / 2;
    }

    if(this.x < 0 + this.width / 2){
      this.x += this.width / 2;
    }

    if(this.y > 400 - this.width / 2){
      this.y -= this.width / 2;
    }

    if(this.y < 0 + this.width / 2){
      this.y += this.width / 2;
    }
  }

  move(){
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
 
}

class AltParticle{
  constructor(width){
    this.x = random(0, 400);
    this.y = random(0, 400);
    this.width = width;
    this.speed = 0.001;
    this.lifetime = 0;
  }

  display(){
    this.lifetime += deltaTime * 0.01;
    noStroke();
    fill(this.width + this.lifetime, this.x + this.lifetime, this.y + this.lifetime, random(190, 200));
    ellipse(this.x, this.y, this.width);

    this.x += random(((mouseX - 400) * this.speed * deltaTime) * -1, ((mouseX - 400) * this.speed * deltaTime));
    this.y += random(((mouseY - 400) * this.speed * deltaTime) * -1, ((mouseY - 400) * this.speed * deltaTime));

    //bounce off walls
    if(this.x > 400 - this.width / 2){
      this.x -= this.width / 2;
    }

    if(this.x < 0 + this.width / 2){
      this.x += this.width / 2;
    }

    if(this.y > 400 - this.width / 2){
      this.y -= this.width / 2;
    }

    if(this.y < 0 + this.width / 2){
      this.y += this.width / 2;
    }
  }
}