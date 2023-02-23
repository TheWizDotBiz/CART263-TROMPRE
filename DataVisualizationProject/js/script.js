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
//column 12 for dex score
//column6 for hp
//column 0 for name
//column 4 for size THEY ARE STRINGS
var monsterGroup = [];


//wizard stats
var intelligence = 10;
var Level = 5;
var SpellSaveDC = 0;
function preload() {
    datasheet = loadTable("js/dnd_monsters.csv", "csv", "header");
}


/**
Description of setup
*/
function setup() {
    SpellSaveDC = CalculateSpellSaveDC();
    print(SpellSaveDC);
    print(diceRoll(1, 20, 3));
    print(CalculateDexMod(17));
    //print(datasheet.getRowCount());
    //print(datasheet.getString(15, 0));
   // print(datasheet.get(15, 6));
   GenerateMonsters(diceRoll(1, 20, 0));
}


/**
Description of draw()
*/
function draw() {

}

function diceRoll(dicecount, dicesize, modifier){ //this simulates polyhedral dicerolls, i made this function for a previous project last semester
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

function CalculateDexMod(dexScore){ //returns the dexterity modifier of a specific dexterity score
    var total;
    total = Math.floor((dexScore - 10) / 2);
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
    monsterGroup = []; //empty the current monstergroup;
    var monsterID = diceRoll(1, datasheet.getRowCount(), 0);
    print('monsterID is ' + monsterID);
    for(var i = 0; i < monsterCount; i++){
       monsterGroup.push(new Monster(datasheet.get(monsterID, 0), datasheet.get(monsterID, 6), datasheet.get(monsterID, 12), datasheet.get(monsterID, 4)));
       
    }
    print(monsterGroup);
}

class Monster{
    constructor(name, hp, dex, size){
        this.name = name;
        this.hp = hp;
        this.dexmod = CalculateDexMod(dex);
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

    makeDexSave(){ //monster makes a dexterity saving throw against the wizard's spell save DC
        var result;
        var roll = diceRoll(1, 20, this.dexmod);
        if(roll >= SpellSaveDC){
            result = true;
        }else{
            result = false;
        }
        return result;
    }

}

