/**
CanYouFireballIt
Thomas Rompre
calculates how many of a certain monster you can kill with a fireball!

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";


/**
Description of preload
*/

let datasheet; //this is your csv file
//column 12 for dex score maybye 13 actually
//column6 for hp
//column 0 for name
//column 4 for size THEY ARE STRINGS
var monsterGroup = [];


//wizard stats
var intelligence = 10;
var Level = 5;
var SpellSaveDC = 0;
var fireballDiceCount = 0;

//art assets
var MonsterImages = [];
var CurrentImageID;
var ImageCount = 510;
var ImageRenderBuffer = 150;
var backgroundImage;

//fireball hit text;
var FireballDamageDealt;
var PassedSaves;
var CreaturesKilled;

//fireball projectile tracker;
var projectileList = [];
var explosionList = [];
var smokeList = [];
function preload() {
    datasheet = loadTable("js/dnd_monsters.csv", "csv", "header");
    for(var i = 0; i < ImageCount; i++){
        //MonsterImages[i] = loadImage('assets/images/' + i + '.png');
        MonsterImages[i] = loadImage('assets/dcss/image (' + (i + 1) + ').png')
    }
    backgroundImage = loadImage('assets/images/glade.jpg');
}


/**
Description of setup
*/
function setup() {
    angleMode(DEGREES);
    createCanvas(1000, 750);
   // background(50);
    imageMode(CENTER);
    
    SpellSaveDC = CalculateSpellSaveDC();
    fireballDiceCount = CalculateFireballDiceCount();
   // print(SpellSaveDC);
   // print(diceRoll(1, 20, 3));
   // print(CalculateDexMod(17));
    //print(datasheet.getRowCount());
    //print(datasheet.getString(15, 0));
   // print(datasheet.get(15, 6));
   GenerateMonsters(diceRoll(diceRoll(1, 4, 0), 20, 0));
}


/**
Description of draw()
*/
function draw() {
    clear();
    //background(50);
    image(backgroundImage, width/2, height/2, 1000, 750);
    //renderMonsters();
    renderMonsters();
    renderText();
    for(var i = 0; i < projectileList.length; i++){
        projectileList[i].render();
        if(projectileList[i].lerpPos >= 1){
            fireballHit(projectileList[i].diceCount, projectileList[i].DC);
            //explosionList.push(new explosionParticle(width/2, height/2, 255, 140, projectileList[i].diceCount * 20, projectileList[i].diceCount));
            explosionList.push(new newExplosionParticle(projectileList[i].diceCount * 10));
            projectileList.splice(i, 1);
        }
    }

    for(var k = 0; k < smokeList.length; k++){
        if(smokeList[k].y <= 0){
            smokeList.splice(k, i);
        }else{
            smokeList[k].move();
        }
    }

    for(var j = 0; j < explosionList.length; j++){
        if(explosionList[j].r <= 0 && explosionList[j].g <= 0){
            explosionList.splice(j, 1);
        }else{
            explosionList[j].explode();
        }
    }

    
}

//keyboard input
function keyPressed(){
    if(keyCode == 32){ //spacebar
       // fireballHit();
       projectileList.push(new newFireballProjectile());
       print(projectileList);
    }

    if(keyCode == 82){
        GenerateMonsters(diceRoll(diceRoll(1, 4, 0), 20, 0));
    }

    if(keyCode == 38){ //uparrow
        if(Level < 20){
            Level++;
            SpellSaveDC = CalculateSpellSaveDC();
            fireballDiceCount = CalculateFireballDiceCount();
        }
    }

    if(keyCode == 40){// downarrow
        if(Level > 5){
            Level--;
            SpellSaveDC = CalculateSpellSaveDC();
            fireballDiceCount = CalculateFireballDiceCount();
        }
    }

    if(keyCode == 39){ //rightarrow
        if(intelligence < 20){
            intelligence++;
            SpellSaveDC = CalculateSpellSaveDC();
            fireballDiceCount = CalculateFireballDiceCount();
        }
    }

    if(keyCode == 37){//leftarrow
        if(intelligence > 3){
            intelligence--;
            SpellSaveDC = CalculateSpellSaveDC();
            fireballDiceCount = CalculateFireballDiceCount();
        }
    }
}

function renderMonsters(){
    if(monsterGroup.length > 0){
        for(var i = 0; i < monsterGroup.length; i++){
            push();
            imageMode(CENTER);
            angleMode(DEGREES);
           // var randX = random((width / 2) - ImageRenderBuffer, (width / 2) + ImageRenderBuffer);
           // var randY = random((height / 2) - ImageRenderBuffer, (height / 2) + ImageRenderBuffer);
           var ThisX;
           var ThisY;
          //  image(MonsterImages[1], randX, randY, 32, 32);
            if(monsterGroup[i].hp < 1){
                
               // translate(monsterGroup[i].x, monsterGroup[i].y);
                translate(monsterGroup[i].x, monsterGroup[i].y);
                rotate(90);
                ThisX = 0;
                ThisY = 0;
                //translate(monsterGroup[i].x * -1, monsterGroup[i].y * -1);
                //translate(0, 0);
                //rotate(-180);
            }else{
                monsterGroup[i].wander();
                ThisX = monsterGroup[i].x;
                ThisY = monsterGroup[i].y;
            }
            image(MonsterImages[CurrentImageID], ThisX, ThisY, 32 * monsterGroup[i].size, 32 * monsterGroup[i].size);
            pop();
        }
    }
}

function renderText(){
    //monster names
    //clean up name
    var init = monsterGroup[0].name;
    var init = init.replace("-", " ");
    //count living monsters;
    var livingCreatures = 0;
    for(var i = 0; i < monsterGroup.length; i++){
        if(monsterGroup[i].hp > 0){
            livingCreatures++;
        }
    }
    var NameText = "A group of " + livingCreatures + " " + init + "s appear!";
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER);
    fill(255, 255, 255);
    text(NameText, width/2, 50);

    //Wizard stats
    text("You are a level " + Level + " Wizard with an intelligence score of " + intelligence, width/2, height - 100);
    text("Your Spell Save DC is " + SpellSaveDC + " and your fireball deals " + fireballDiceCount + "d6 fire damage.", width/2, height - 50);
    textSize(16);
    text("Use the arrow keys to adjust your level and intelligence score, press space to fire and R to get new enemies", width/2, height - 25);

    //Fireball Effects Info
    if(FireballDamageDealt != null){
        textSize(16);
        fill(255, 140, 0); //orange
        text("Fireball dealt " + FireballDamageDealt + " damage!", width / 2, 75);
        text(PassedSaves + " creatures made their saving throw for half damage", width / 2, 100);
        text(CreaturesKilled + " were killed", width / 2, 125);
    }
}

function diceRoll(dicecount, dicesize, modifier){ //this simulates polyhedral dicerolls, i made this for a previous project last semester for CART 211
    var total = 0;
    for(var i = 0; i < dicecount; i++){
      var value = (Math.random() * dicesize) + 1;
      value = Math.floor(value);
      total += value;
    }
    total += modifier;
    console.log("diceroll " + dicecount + "d" + dicesize + " +" + modifier  + " result is " + total);
    return total;
}

function CalculateDexMod(dexScore){ //returns the dexterity modifier of a specific dexterity score, this is used when a monster makes a dexterity saving throw against the wizard's fireball
   // print("calculating dex mod of " + dexScore);
   if(dexScore == "" || dexScore == null){
    dexScore = 10;
   }
    var total;
    total = Math.floor((dexScore - 10) / 2);
    print("dex mod of " + dexScore + " is " + total);
    return total;
}

function CalculateSpellSaveDC(){ // calculates the spell save DC of of the wizard slinging a fireball at these bad boys
    var total;
    total =  8 + (Math.floor((intelligence - 10) / 2)); //8 + intelligence modifier
    var PB;
    switch(Level){ //determine proficiency bonus
        case 5:
        case 6:
        case 7:
        case 8:
        PB = 3;
        break;

        case 9:
        case 10:
        case 11:
        case 12:
        PB = 4;
        break;

        case 13:
        case 14:
        case 15:
        case 16:
        PB = 5;
        break;

        case 17:
        case 18:
        case 19:
        case 20:
        PB = 6;
        break;
    }
    total += PB; //add proficiency bonus to spell save dc
    print("spell save dc is " + total);
    return total;
}

function CalculateFireballDiceCount(){ //calculates the highest possible amount of d6's to roll for a fireball's damage, this is based off a wizard's level.
    var count;
    switch(Level){ //this is an archaic ass way to do this but whatever it works and its better than a massive chain of if/else statements.
        case 5:
        case 6:
        count = 8;
        break;
        case 7:
        case 8:
        count = 9;
        break;
        case 9:
        case 10:
        count = 10;
        break;
        case 11:
        case 12:
        count = 11;
        break;
        case 13:
        case 14:
        count = 12;
        break;
        case 15:
        case 16:
        count = 13;
        break;
        case 17:
        case 18:
        case 19:
        case 20:
        count = 14;
        break;
    }
    return count;
}

function GenerateMonsters(monsterCount){ //cleans up the monstegroup array and fills it with a certain number of monsters, randomly picked from the CSV, all of the same type
    //monsterGroup = []; //empty the current monstergroup;
    //clear array
    //monsterGroup.length = 0;
    monsterGroup.splice(0, monsterGroup.length);
    var monsterID = diceRoll(1, datasheet.getRowCount(), 0);
   // print('monsterID is ' + monsterID);
    for(var i = 0; i < monsterCount; i++){
       monsterGroup.push(new Monster(datasheet.get(monsterID, 0), datasheet.get(monsterID, 6), datasheet.get(monsterID, 12), datasheet.get(monsterID, 4)));
      // print('adding new monster ' + monsterGroup[i].name);
    }
    CurrentImageID = Math.floor(random(0, ImageCount));
   // print(monsterGroup);
  //  renderMonsters();
}

function fireballHit(dice, dc){
    var damage = diceRoll(dice, 6, 0); //roll damage for fireball;
    var saves = 0;
    var kills = 0;
    for(var i = 0; i < monsterGroup.length; i++){
        if(monsterGroup[i].hp > 0){
            if(monsterGroup[i].makeDexSave(dc)){
                print("monster takes half damage");
                monsterGroup[i].hp -= Math.floor(damage / 2);
                saves++;
            }else{
                print("monster takes full damage");
                monsterGroup[i].hp -= damage;
            }

            if(monsterGroup[i].hp < 1){ //if creature is killed this way
                kills++;
            }
        }
    }
    FireballDamageDealt = damage;
    PassedSaves = saves;
    CreaturesKilled = kills;
}

class Monster{
    constructor(name, hp, dex, size){
        this.x = random((width / 2) - ImageRenderBuffer, (width / 2) + ImageRenderBuffer);
        this.y = random((height / 2) - ImageRenderBuffer, (height / 2) + ImageRenderBuffer);
        this.name = name;
        this.hp = hp;
        this.dexmod = CalculateDexMod(dex);
        //this.graphicID = diceRoll(1, MonsterImages - 1); 
        switch(size){ //this is how many 5ft squares the monster occupies, so check how many monster fit within the fireball
            case "Tiny":
            this.size = 0.5;
            break;
            case "Small":
            this.size = 1;
            break;
            case "Medium":
            this.size = 1;
            break;
            case "Large":
            this.size = 4;
            break;
            case "Huge":
            this.size = 9;
            break;
            case "Gargantuan":
            this.size = 16;
            break;
            default:
                print('size of ' + this.name + ' is erroneous');
                break;
        }
        
    }

    makeDexSave(dc){ //monster makes a dexterity saving throw against the wizard's spell save DC
        var result;
        var roll = diceRoll(1, 20, this.dexmod);
        if(roll >= dc){
            result = true;
        }else{
            result = false;
        }
        return result;
    }

    wander(){
        this.x += random(-1, 1);
        this.y += random(-1, 1);
    }

}

class newFireballProjectile{
    constructor(){
        this.x = random(0, width);
        this.y = height - 50;
        this.diceCount = fireballDiceCount;
        this.DC = SpellSaveDC;
        this.size = fireballDiceCount * 5;
        this.speed = 0.002;
        this.lerpPos = 0;
        this.sputterArray = [];
    }

    render(){
        //increase position
        this.lerpPos += this.speed * deltaTime;
        //this.speed -= 0.0005
        //move;
        var posx = lerp(this.x, width/2, this.lerpPos);
        var posy = lerp(this.y, height/2, this.lerpPos);

        //add and draw sputters;
        this.sputterArray.push(new sputter(posx, posy, random(200, 255), random(100, 140), this.size / random(1, 4)));
        for(var i = 0; i < this.sputterArray.length; i++){
            if(this.sputterArray[i].lifetime >= 1000){
                this.sputterArray.splice(i, 1);
            }else{
                this.sputterArray[i].wander();
            }
        }

        //draw projectile
        noStroke();
        fill(255, 140, 0);
        circle(posx, posy, this.size);
    }
}

class sputter{
    constructor(x, y, r, g, s){
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.s = s;
        this.lifetime = 0;
    }

    wander(){
        this.x += random(-10, 10);
        this.y += random(-10, 10);
        this.lifetime += deltaTime;
        noStroke();
        fill(this.r, this.g, 0);
        circle(this.x, this.y, this.s);
    }
}


class newExplosionParticle{
    constructor(amount){
      //  this.x = random((width/2) - 200, (width/2) + 200);
       // this.y = random((height/2) -200, (height/2) + 200);
        //this.s = random(20, 150);
        this.r = 255;
        this.g = 140
        this.degradation = 1;
        this.count = amount;
    }

    explode(){
        //adjust size n color
        this.r -= this.degradation * deltaTime;
        this.g -= this.degradation * deltaTime;
        //this.x
        noStroke();
        for(var i = 0; i < this.count; i++){
            var posx = random((width/2) - (i * 5), (width/2) + (i * 5));
            var posy = random((height/2) - (i * 5), (height/2) + (i * 5));
            var size = random(20, 150);
            
           // var sizeH = random(20, 150);
            var r = random(this.r - 50, this.r + 50);
            var g = random(this.g - 30, this.g + 30);
            fill(r, g, 0);
            ellipse(posx, posy, size, size);
            smokeList.push(new smoke(posx, posy));
        }
    }
}

//might also wanna create smoke objects
class smoke{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.s = random(1, 25);
        this.shade = random(0, 40);
        this.wigglestrength = random(0.2, 2);
        this.speed = random(0.1, 1);
        this.lifetime = 0
    }

    move(){
        this.lifetime += deltaTime;
        //this.x *= sin(this.lifetime) * deltaTime;
        this.x = this.x + (sin(this.lifetime) * this.wigglestrength);
        this.y -= this.speed * deltaTime;
        noStroke();
        fill(this.shade, this.shade, this.shade, this.shade * (this.wigglestrength * 10));
        circle(this.x, this.y, this.s);
    }
}


