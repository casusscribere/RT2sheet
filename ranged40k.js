/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria.
 * 
 * The following commands is used:
 * !ranged40k   
**/

//Rolls a d100 and calculates the success or fail results to the chat window.
var ranged40kNamespace = ranged40kNamespace || {};

ranged40kNamespace.rollResult = function(token, attribute, modifier, range, shotsel, single, semi, full, numdice, dice, dmg, pen) {
    var roll = randomInteger(100);
    var modTarget = 0;
    var degOfSuc =0;
    var numhits = 100;
    var error=false;
    var errortext="ERROR: INVALID FIRING MODE";
    var hit=true;
    var output='';
    var semicalc=0;
    var boundmod=0;
    

    //Add firing mode modifier
    if(shotsel == 0){
        //If the user selected Standard Attack
        boundmod = 10;
        
    } else if (shotsel == 1){
        //If the user selected Semi-Auto
        boundmod = 0;
    } else if (shotsel == 2){
        //If the user selected Full-Auto
        boundmod = -10;
    }
    else{
        error=true;
    }
    
    
    
    //Add Range calculation modifier
    if(range==0){
        //Melee range
    } else if (range==1){
        //Point-Blank range
        boundmod = parseInt(boundmod)+parseInt(30);
    } else if (range==2){
        //Short Range
        boundmod = parseInt(boundmod)+parseInt(10);
    } else if (range==3){
        //Normal Range
        boundmod = parseInt(boundmod)+parseInt(0);
    } else if (range==4){
        //Long Range
        boundmod = parseInt(boundmod)+parseInt(-10);
    } else if (range==5){
        //Extreme Range
        boundmod = parseInt(boundmod)+parseInt(-30);
    }
    
    
    
    //Add the fire selection bonus to the modifier
    boundmod = parseInt(boundmod) + parseInt(modifier);
    
    
    
    //insert upper and lower bounds for modifiers
    if(boundmod>=60){
        boundmod=60;
    }
    else if (boundmod <=-60){
        boundmod=-60;
    }
    else{
        boundmod += 0;
    }
    
    
    
    //Sum the Check + bound modifier
    modTarget = parseInt(attribute) + parseInt(boundmod);
    
    
    
    //Calculate Degrees of Success
    if(roll <= modTarget) {
        degOfSuc = (Math.floor(modTarget/10) - Math.floor(roll/10)) + 1;
        output2 = '<span style="color:green">' + token + ' succeeds by <B>' + degOfSuc + ' degree(s)</B>.</span> ';
        hit=true;
    }
    else {
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output2 = '<span style="color:red">' + token + ' fails by <B>' + degOfSuc + ' degree(s)</B></span>. ';
        numhits=0;
        hit=false;
    }
    
    
    
    //Determine # of damage rolls required
    semicalc = Math.floor((degOfSuc -1)/2)+1;
    if(shotsel == 0 && hit==true && error==false){
        //If the user selected Standard Attack
        if(single ==='S'){
            numhits = 1;     
        } else{
            error=true;
            numhits=0;
        }
    } else if (shotsel == 1 && hit==true && error==false){
        //If the user selected Semi-Auto
        if(parseInt(semi)==0){
            numhits = 0;
            error=true;
        }
        else if(semicalc < semi)
        {
            numhits = semicalc;
        }
        else {
            numhits = parseInt(semi);
        }
    } else if (shotsel == 2 && hit==true && error==false){
        //If the user selected Full-Auto
        if(parseInt(full)==0){
            numhits = 0;
            error=true;
        }
        else if(degOfSuc < full)
        {
            numhits = degOfSuc;
        }
        else {
            numhits = parseInt(full);
        }
        
    }else {
        numhits = 0;
    }
    
    
    
    //Return output
    if(error==true){
      output = errortext; 
    }
    else {
        output ="!power {{--format|skill --titlefontshadow|none --name|"+token+" --leftsub| Check "+modTarget+" --rightsub| Roll "+roll+" --Effect:|"+output2+" --Damage:#"+numhits+"|[["+parseInt(numdice)+"d"+parseInt(dice)+"+"+parseInt(dmg)+"]] }}"
    }
    //var output ="!power {{--format|skill --titlefontshadow|none --name|"+token+" --leftsub|Check "+modTarget+" --rightsub| Roll "+roll+" --Effect|"+output2+" }}"
    return output;
}




/** Trims a string **/
ranged40kNamespace.trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}
