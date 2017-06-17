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
    //var roll = 94;
    var modTarget = 0;
    var degOfSuc =0;
    var numhits = 100;
    var error=false;
    var errortext="ERROR: GENERIC";
    var hit=true;
    var jam=false;
    var output='';
    var semicalc=0;
    var boundmod=0;
    var i=0;
    var dmgstring='';
    var temp=0;
    var temp2=0;
    var substring='';
    

    //Add firing mode modifier & check for Jams
    if(shotsel == 0){
        //If the user selected Standard Attack
        if(roll>=96){
            jam=true;
        }
        else{
            boundmod = 10;
        }
        
    } else if (shotsel == 1){
        //If the user selected Semi-Auto
        if(roll>=94){
            jam=true;
        }
        else{
            boundmod = 0;
        }
    } else if (shotsel == 2){
        //If the user selected Full-Auto
        if(roll>=94){
            jam=true;
        }
        else{
            boundmod = -10;
        }
    }
    else{
        error=true;
        errortext="ERROR: Invalid Shot Selection primary"
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
    } else{
        error=true;
        errortext="ERROR: Invalid Range Selection"
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
    if(roll <= modTarget && jam==false) {
        degOfSuc = (Math.floor(modTarget/10) - Math.floor(roll/10)) + 1;
        output2 = '<span style="color:green">' + token + ' hits with <B>' + degOfSuc + ' degree(s)</B>.</span> ';
        hit=true;
    }
    else if(roll > modTarget && jam==false){
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output2 = '<span style="color:red">' + token + ' misses by <B>' + degOfSuc + ' degree(s)</B></span>. ';
        numhits=0;
        hit=false;
    } else if (jam==true){
        output2 = '<span style="color:red">' + token + ' jams his weapon! </span>. ';
        numhits=0;
        hit=false;
        
    } else{
        error=true;
        errortext="ERROR: Failed DoS Calculation"
    }
    
    
    
    //Determine # of damage rolls required
    semicalc = Math.floor((degOfSuc -1)/2)+1;
    if(shotsel == 0 && hit==true && error==false){
        //If the user selected Standard Attack
        if(single ==='S'){
            numhits = 1;     
        } else{
            error=true;
            errortext="ERROR: INVALID FIRING MODE";
            numhits=0;
        }
    } else if (shotsel == 1 && hit==true && error==false){
        //If the user selected Semi-Auto
        if(parseInt(semi)==0){
            numhits = 0;
            error=true;
            errortext="ERROR: INVALID FIRING MODE";
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
            errortext="ERROR: INVALID FIRING MODE";
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
    
    
    
    //Determine Initial Hit Location
    temp = Math.floor(roll/10); //Store 10s place
    temp2 = roll - temp*10;     //Store 1s place
    temp = temp2*10+temp;       //swap 10s and 1s place
    //temp = 90;
    if(temp <= 10) {
        var hitloc = ["Head","Head","Left Arm","Body","Right Arm","Body","Body","Body","Body","Body"];
    } else if(10 < temp && temp <= 20){
        var hitloc = ["Right Arm","Right Arm","Body","Head","Body","Left Arm","Left Arm","Left Arm","Left Arm","Left Arm"];
    } else if(20 < temp && temp <= 30){
        var hitloc = ["Left Arm","Left Arm","Body","Head","Body","Right Arm","Right Arm","Right Arm","Right Arm","Right Arm"];
    } else if(30 < temp && temp <= 70){
        var hitloc = ["Body","Body","Right Arm","Head","Left Arm","Body","Body","Body","Body","Body"];
    } else if(70 < temp && temp <= 85){
        var hitloc = ["Right Leg","Right Leg","Body","Right Arm","Head","Body","Body","Body","Body","Body"];
    } else if(85 < temp && temp <= 100){
        var hitloc = ["Left Leg","Left Leg","Body","Left Arm","Head","Body","Body","Body","Body","Body"];
    } else{
        error=true;
        errortext="ERROR: BAD HIT LOCATION";
    }
    
    
    
    //Compute Damage substring
    for(i=1; i <=numhits; i++){
    dmgstring = dmgstring + " --Damage: *"+i+"|[[ [$Dmg"+i+"] "+parseInt(numdice)+"d"+parseInt(dice)+"+"+parseInt(dmg)+"]] Pen "+parseInt(pen)+" to the "+hitloc[i];
    //dmgstring = dmgstring + " --Damage: *"+i+"|[[ [$Dmg"+i+"] 3d10d1 +5 ]] Pen "+parseInt(pen)+" to the "+hitloc[i];
    dmgstring = dmgstring + " --?? $Dmg"+i+".tens > 0 ?? Righteous Fury: *"+i+"| [[1d5]] critical damage to the "+hitloc[i];
    }
    
    
    
    //Return output
    if(error==true){
      output = errortext; 
    }
    else {
        //output ="!power {{--format|skill --titlefontshadow|none --name|"+token+" --leftsub| Check "+modTarget+" --rightsub| Roll "+roll+" --Effect:|"+output2+" --Damage:#"+numhits+"|[[ [$Dmg] "+parseInt(numdice)+"d"+parseInt(dice)+"+"+parseInt(dmg)+"]] --?? $Dmg.base == "+parseInt(dice)+" ?? Critical Hit:| Add [[1d8]] slashing damage }}";
        //output ="!power {{--format|skill --titlefontshadow|none --name|"+token+" --leftsub|Check "+modTarget+" --rightsub| Roll "+roll+" --Roll:| [! "+roll+" !] vs [! "+modTarget+" !] --Result:|"+output2+dmgstring+"}}"
        output ="!power {{--format|ranged --titlefontshadow|none --name|"+token+" --leftsub| Ballistic Skill Check  --rightsub| My Weapon --Roll:| [! "+roll+" !] vs [! "+modTarget+" !] --Result:|"+output2+dmgstring+"}}"
    }
    return output;
}




/** Trims a string **/
ranged40kNamespace.trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}
