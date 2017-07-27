/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria.
 * 
 * The following commands is used:
 * !ranged40k   
**/

var ranged40kNamespace = ranged40kNamespace || {};

ranged40kNamespace.rollResult = function(token, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type) {
    if (typeof token === 'undefined')       token       = 'generic';
    if (typeof attribute === 'undefined' || Number.isInteger(parseInt(attribute))==false)   attribute   = 0;
    if (typeof range === 'undefined' || Number.isInteger(parseInt(range))==false)           range       = 0;
    if (typeof shotsel === 'undefined' || Number.isInteger(parseInt(shotsel))==false)       shotsel     = 0;
    if (typeof single === 'undefined' || typeof single != 'string' )                        single      = '-';
    if (typeof semi === 'undefined' || typeof semi != 'string' )                            semi        = '-';
    if (typeof full === 'undefined' || typeof full != 'string' )                            full        = '-';
    if (typeof numdice === 'undefined' || Number.isInteger(parseInt(numdice))==false)       numdice     = 1;
    if (typeof dice === 'undefined' || Number.isInteger(parseInt(dice))==false)             dice        = 10;
    if (typeof dmg === 'undefined' || Number.isInteger(parseInt(dmg))==false)               dmg         = 0;
    if (typeof pen === 'undefined' || Number.isInteger(parseInt(pen))==false)               pen         = 0;
    if (typeof modifier === 'undefined' || Number.isInteger(parseInt(modifier))==false)     modifier    = 0;
    if (typeof special === 'undefined' || typeof special != 'string' )                      special     = '';
    if (typeof quality === 'undefined' || typeof quality != 'string' )                      quality     = 'common';
    if (typeof talents === 'undefined' || typeof talents != 'string' )                      talents     = '';
    if (typeof wpnname === 'undefined' || typeof wpnname != 'string' )                      wpnname     = 'generic';
    if (typeof type === 'undefined' || typeof type != 'string' )                            type        = 'unk';
    
    var roll = randomInteger(100);
    var i, j, k, cur, sub, temp, temp2; //loop control and temporary variables
    var error=false;
    var errortext="ERROR: GENERIC";
    var hit=true;
    var jam=false;
    var scatter=false;
    var spray=false;
    var jamthreshold=94;
    var semicalc=0;
    var fullcalc=0;
    var boundmod=0;
    var modTarget = 0;
    var degOfSuc =0;
    var numhits = 0;
    var scathits=0;
    var scatdir=randomInteger(8);
    var dmgroll=null;
    var prvdmg=0;
    var lowest=0;
    var prvrf=false;
    var prvjam=false;
    var output='';
    var dmgstring='';
    var dmgsubstring='';
    var dmgendstring='';
    var scatstring='';
    var qualstring='';
    var rfstring='';
    var talstring='';
    var specialArray = special.split('.');
    var talentArray = talents.split('.');
    var superUnreliable=false;
    var attributeArray = {
        "Accurate": false,
        "Balanced": false,
        "Blast": -1,
        "Concussive": -1,
        "Corrosive": false,
        "Crippling": -1,
        "Daemonbane": false,
        "Defensive": false,
        "Felling": -1,
        "Flame": false,
        "Flexible": false,
        "Force": false,
        "Graviton": false,
        "Hallucinogenic": -1,
        "Haywire": -1,
        "HaywireMod": 0,
        "Inaccurate": false,
        "Indirect": -1,
        "Lance": false,
        "Maximal": false,
        "Melta": false,
        "Overheats": false,
        "PowerField": false,
        "Primitive": -1,
        "Proven": -1,
        "RazorSharp": false,
        "Recharge": false,
        "Reliable": false,
        "Sanctified": false,
        "Scatter": false,
        "Shocking": false,
        "Smoke": -1,
        "Snare": -1,
        "Spray": false,
        "Storm": false,
        "Tainted": false,
        "Tearing": false,
        "Toxic": -1,
        "Twin-Linked": false,
        "Unbalanced": false,
        "Unreliable": false,
        "Unwieldy": false,
        "Vengeful": 10
    };
    var ttArray = {
        "assassinstrike": false,
        "blademaster": false,
        "brutalcharge": false,
        "deathdealer": false,
        "battlerage": false,
        "combatmaster": false,
        "counterattack": false,
        "crushingblow": false,
        "deathdealer": false,
        "devastatingassault": false,
        "disarm": false,
        "doudbleteam": false,
        "eyeofvengeance": false,
        "frenzy": false,
        "hammerblow": false,
        "hatred": false,
        "hipshooting": false,
        "independenttargeting": false,
        "inescapableattack": false,
        "killingstrike": false,
        "lightningattack": false,
        "marksman": false,
        "mightyshot": false,
        "nowheretohide": false,
        "precisionkiller": false,
        "preturnaturalspeed": false,
        "swiftattack": false,
        "takedown": false,
        "targetselection": false,
        "thundercharge": false,
        "weapontech": false,
        "whirlwindofdeath": false
    };   
    

    // Flags values in the special array to values in the attribute array
    for (i = 0, j = specialArray.length; i < j; i++) {
        specialArray[i] = specialArray[i].replace(/^\s+|\s+$/g, '');    //remove whitespace
        sub = specialArray[i].match(/\d/);                              //find any numbers in parentheses
        specialArray[i] = specialArray[i].replace(/\(([^)]+)\)/g, '');  //remove parentheses and anything inside
        cur = specialArray[i];                                          
        if(sub != null){                                                //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
            attributeArray[cur] = sub;
        } else {
            attributeArray[cur] = true;  
        }
    }

    // Flags values in the talent array to values in the tt array
    for (i = 0, j = talentArray.length; i < j; i++) {
        talentArray[i] = talentArray[i].replace(/^\s+|\s+$/g, '');    //remove whitespace
        sub = talentArray[i].match(/\d/);                              //find any numbers in parentheses
        talentArray[i] = talentArray[i].replace(/\(([^)]+)\)/g, '');  //remove parentheses and anything inside
        cur = talentArray[i];                                          
        if(sub != null){                                                //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
            ttArray[cur] = sub;
        } else {
            ttArray[cur] = true;  
        }
    }

    //Add firing mode modifier & set jam threshold
    if(shotsel == 0){
        //If the user selected Standard Attack
        jamthreshold = 96;
        boundmod = 10;
    } else if (shotsel == 1){
        //If the user selected Semi-Auto
        boundmod = 0;
        jamthreshold = 94;
    } else if (shotsel == 2){
        //If the user selected Full-Auto
        boundmod = -10;
        jamthreshold = 94;
    } else if (shotsel == 3 && attributeArray['Indirect'] > -1){
        //If the user selected Indirect Standard
        boundmod = 0;
        jamthreshold = 96;
    } else if (shotsel == 4 && attributeArray['Indirect'] > -1){
        //If the user selected Indirect Semi-Auto
        boundmod = -10;
        jamthreshold = 94;
    } else if (shotsel == 5 && attributeArray['Indirect'] > -1){
        //If the user selected Indirect Full-Auto
        boundmod = -20;
        jamthreshold = 94;
    } else if (shotsel == 6 && attributeArray['Maximal']==true){
        //If the user selected Maximal Standard
        boundmod = 10;
        jamthreshold = 96;
    } else if (shotsel == 7 && attributeArray['Maximal']==true){
        //If the user selected Maximal Semi-Auto
        boundmod = 0;
        jamthreshold = 94;
    } else if (shotsel == 8 && attributeArray['Maximal']==true){
        //If the user selected Maximal Full-Auto
        boundmod = -10;
        jamthreshold = 94;
    } else if (shotsel == 9 && ttArray['precisionkiller']==false){
        //If the user selected Called Shot w/o Precision Killer
        boundmod = -20;
        jamthreshold = 96;
    } else if (shotsel == 9 && ttArray['precisionkiller']==true){
        //If the user selected Called Shot w/ Precision Killer
        jamthreshold = 96;
    } else if (shotsel == 10 || shotsel==11){
        //If the user selected Semi or Full Supressive Fire
        boundmod = -20;
        jamthreshold= 94;
    } else{
        error=true;
        errortext="ERROR: Invalid Firing Mode Selection"
    }
    

    
    //Add Range calculation modifier
    if(range==0){boundmod = parseInt(boundmod)+0;}
    else if (range==1){boundmod = parseInt(boundmod)+parseInt(30);}
    else if (range==2){boundmod = parseInt(boundmod)+parseInt(10);}
    else if (range==3){boundmod = parseInt(boundmod)+parseInt(0);}
    else if (range==4 && ttArray['marksman']==false){boundmod = parseInt(boundmod)+parseInt(-10);}
    else if (range==4 && ttArray['marksman']==true){boundmod = parseInt(boundmod)+0;} 
    else if (range==5 && ttArray['marksman']==false){boundmod = parseInt(boundmod)+parseInt(-30);}
    else if (range==5 && ttArray['marksman']==true){boundmod = parseInt(boundmod)+0;} 
    else{
        error=true;
        errortext="ERROR: Invalid Range Selection"
    }
    
    //Adjust +hit if using a 'Scatter' weapon at Short or PB Range (not to be confused with the drift/scatter of area weapons)
    if(attributeArray['Scatter']==true && (range==1||range==2) ){boundmod = parseInt(boundmod)+parseInt(10);}
    //Adjust +hit if using a 'Twin-Linked' weapon
    if(attributeArray['Twin-Linked']==true){boundmod = parseInt(boundmod)+parseInt(20);}
    
    //Add the modifier to the fire selection and range bonuses
    boundmod = parseInt(boundmod) + parseInt(modifier);
    
    
    
    //insert upper and lower bounds for modifiers
    if(boundmod>=60){boundmod=60;}
    else if (boundmod <=-60){boundmod=-60;}
    
    
    
    //Sum the Check + bound modifier
    modTarget = parseInt(attribute) + parseInt(boundmod);
    
    //Adjust Weapon Jamming based on qualities and talents (only one of these will apply)
    
    if(quality=='poor' && attributeArray['Unreliable']==true){superUnreliable=true;}
    if(quality=='poor' && attributeArray['Unreliable']==false){attributeArray['Unreliable']=true;}
    if(quality=='good' && attributeArray['Unreliable']==false){attributeArray['Reliable']=true;}
    if(quality=='good' && attributeArray['Unreliable']==true){attributeArray['Unreliable']=false;}
    if(quality=="best"){attributeArray['Reliable']=true;}
    
    if(superUnreliable==true && attributeArray['Overheats']==false){jamthreshold=modTarget;}
    else if(attributeArray['Overheats']==true||quality=="best"){jamthreshold=999;}
    else if(attributeArray['Reliable']==true){jamthreshold=100;}
    else if(attributeArray['Unreliable']==true && quality!='poor'){jamthreshold=91;}
    
    //Calculate Hit/Miss/Jam & DoS/DoF
    if(attributeArray['Spray']==true){
        hit=true;
        jam=false;
    }else if(roll <= modTarget && roll <= jamthreshold) {
        degOfSuc = (Math.floor(modTarget/10) - Math.floor(roll/10)) + 1;
        output = '<span style="color:green">' + token + ' hits with <B>' + degOfSuc + ' degree(s)</B>.</span> ';
        hit=true;
        jam=false;
    } else if(roll > modTarget && roll <= jamthreshold ){
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output = '<span style="color:red">' + token + ' misses by <B>' + degOfSuc + ' degree(s)</B></span>. ';
        hit=false;
        jam=false;
    }else if (roll >= jamthreshold){
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output = '<span style="color:red">' + token + ' gets <B>' + degOfSuc + ' Degree(s) of Failure </B> and jams his weapon! </span>. ';
        hit=false;
        jam=true;
    } else{
        error=true;
        errortext="ERROR: Failed DoS Calculation"
    }
    
    
    
    //Adjust Weapon Dmg/Pen/RoF/Qualities based on qualities and talents
    //If Lance, Melta, or RazorSharp (only one applies):
    if(attributeArray['Lance'] == true) { pen=parseInt(pen)*degOfSuc;}
    if(attributeArray['Melta']==true && range<3)   {pen=parseInt(pen)*2;}
    if(attributeArray['RazorSharp'] == true && degOfSuc>=3)    {pen =parseInt(pen)*2;}
    //If firing on Maximal:
    if(attributeArray['Maximal']==true && (shotsel==6||shotsel==7||shotsel==8)){
        attributeArray['Recharge']=true;
        pen=parseInt(pen)+2;
        numdice=parseInt(numdice)+1;
        if(attributeArray['Blast']>-1)  {attributeArray['Blast']=parseInt(attributeArray['Blast'])+2;}
    }
    //If 'Scatter':
    if(attributeArray['Scatter']==true && range==1 )    {dmg=parseInt(dmg)+3;}
    else if(attributeArray['Scatter']==true && range>=3 )    {dmg=parseInt(dmg)-3;}
    //If 'Tearing':
    if(attributeArray['Tearing']==true){numdice=parseInt(numdice)+1;}
    //If 'Mighty Shot'
    if(ttArray['mightyshot']==true){
        sub=Math.floor(attribute/10);
        sub=Math.ceil(sub/2);
        dmg=parseInt(dmg)+parseInt(sub);
    }


    
    
    
    //Determine if weapon scatters/drifts (Indirect Fire, Blast, and Smoke)
    if( (shotsel == 3 && attributeArray['Indirect'] > -1)||(shotsel == 4 && attributeArray['Indirect'] > -1)||(shotsel == 5 && attributeArray['Indirect'] > -1)||(attributeArray['Blast'] > -1)||(attributeArray['Smoke'] > -1) ){
        scatter=true;
    }
    
    
   
    //Determine # of damage rolls required
    semicalc = Math.floor((degOfSuc -1)/2)+1;
    fullcalc= degOfSuc;
    if(attributeArray['Storm']==true){
        semicalc=semicalc*2;
        fullcalc=fullcalc*2;
    }
    
    if(attributeArray['Spray']==true){
        spray=true;
        if(shotsel==0 && single=='S'){
            numhits=1;            
        } else if (shotsel==1 && (semi==1||semi==2||semi==3||semi==4||semi==5||semi==6||semi==7||semi==8||semi==9||semi==10) ){
            numhits=semi;
        } else if (shotsel==2 && (full==1||full==2||full==3||full==4||full==5||full==6||full==7||full==8||full==9||full==10) ){
            numhits=full;
        } else{
            error=true;
            errortext="ERROR: INVALID FIRING MODE (spray)";
            numhits=0;
        }
    }
    else if( (shotsel == 0 || shotsel==3 || shotsel==6 || shotsel==9)&& hit==true && error==false ) {
        //If the user selected Standard Attack and hit
        if(single ==='S'){
            numhits = 1;     
        } else{
            error=true;
            errortext="ERROR: INVALID FIRING MODE (S)";
            numhits=0;
        }
    } else if ( (shotsel == 1 || shotsel==4 || shotsel==7 || shotsel==10) && hit==true && error==false ) {
        //If the user selected Semi-Auto and hit
        if(semi!=1 && semi!=2 && semi!=3 && semi!=4 && semi!=5 && semi!=6 && semi!=7 && semi!=8 && semi!=9&& semi!=10){
            numhits = 0;
            error=true;
            errortext="ERROR: INVALID FIRING MODE (semi)";
        }
        else if(semicalc < semi)
        {
            numhits = semicalc;
        }
        else {
            numhits = parseInt(semi);
        }
    } else if ( (shotsel == 2 || shotsel==5 || shotsel==8) && hit==true && error==false ){
        //If the user selected Full-Auto and hit
        if(full!=1 && full!=2 && full!=3 && full!=4 && full!=5 && full!=6 && full!=7 && full!=8 && full!=9&& full!=10){
            numhits = 0;
            error=true;
            errortext="ERROR: INVALID FIRING MODE (full)";
        }
        else if(fullcalc < full)
        {
            numhits = fullcalc;
        }
        else {
            numhits = parseInt(full);
        }
    } else if ( shotsel==11 && hit==true && error==false ){
        //If the user selected Full-Auto Suppressive Fire and hit
        if(full!=1 && full!=2 && full!=3 && full!=4 && full!=5 && full!=6 && full!=7 && full!=8 && full!=9&& full!=10){
            numhits = 0;
            error=true;
            errortext="ERROR: INVALID FIRING MODE (full)";
        }
        else if(semicalc < full)
        {
            numhits = semicalc;
        }
        else {
            numhits = parseInt(full);
        }
    }
    
    
    
    //Calculate # of Scatter Damage rolls required
    if(spray==true){scathits=0;}
    else if( (shotsel == 0 || shotsel==3 || shotsel==6 || shotsel==9) && scatter==true && jam==false && error==false){
        //if the user selected Single-shot and missed with a scattering weapon
        if(single ==='S'){
            scathits = 1-numhits;     
        } else{
            error=true;
            errortext="ERROR: INVALID FIRING MODE";
            numhits=0;
        }
    } else if( (shotsel==1||shotsel==4||shotsel==7||shotsel==10||shotsel==11) && scatter==true && jam==false && error==false){
        //If the user selected Semi-Auto and missed with a scattering weapon
        if(parseInt(semi)==0){
            numhits = 0;
            error=true;
            errortext="ERROR: INVALID FIRING MODE";
        }
        else {
            scathits = parseInt(semi)-numhits;
        }
    } else if( (shotsel == 2 || shotsel==5 || shotsel==8 ) && scatter==true && jam==false && error==false){
        //If the user selected Full-Auto and missed with a scattering weapon
        if(parseInt(full)==0){
            numhits = 0;
            error=true;
            errortext="ERROR: INVALID FIRING MODE";
        }
        else {
            scathits = parseInt(full)-numhits;
        }
    }
    
    //Add additional hits for a Twin-Linked weapon
    if(attributeArray['Twin-Linked']==true && degOfSuc>=2 && jam==false){
        numhits = numhits+1;
    }else if(attributeArray['Twin-Linked']==true && degOfSuc<2 && scatter==true && jam==false){
        scathits=scathits+1;
    }
    
    
    //Determine Initial Hit Location
    temp = Math.floor(roll/10); //Store 10s place
    temp2 = roll - temp*10;     //Store 1s place
    temp = temp2*10+temp;       //swap 10s and 1s place
    if(shotsel==9){var hitloc = ["chosen location", "chosen location", "chosen location"];}
    else if( (attributeArray['Blast']!=-1 && scathits!=0)||(scatter==true && attributeArray['Blast']==-1)||spray==true||attributeArray['Smoke']!=-1 ){var hitloc = ["Body","Body","Body","Body","Body","Body","Body","Body","Body","Body"];} 
    else if(temp <= 10) {var hitloc = ["Head","Head","Left Arm","Body","Right Arm","Body","Body","Body","Body","Body"];} 
    else if(10 < temp && temp <= 20){var hitloc = ["Right Arm","Right Arm","Body","Head","Body","Left Arm","Left Arm","Left Arm","Left Arm","Left Arm"];} 
    else if(20 < temp && temp <= 30){var hitloc = ["Left Arm","Left Arm","Body","Head","Body","Right Arm","Right Arm","Right Arm","Right Arm","Right Arm"];}
    else if(30 < temp && temp <= 70){var hitloc = ["Body","Body","Right Arm","Head","Left Arm","Body","Body","Body","Body","Body"];} 
    else if(70 < temp && temp <= 85){var hitloc = ["Right Leg","Right Leg","Body","Right Arm","Head","Body","Body","Body","Body","Body"];} 
    else if(85 < temp && temp <= 100){var hitloc = ["Left Leg","Left Leg","Body","Left Arm","Head","Body","Body","Body","Body","Body"];} 
    else{
        error=true;
        errortext="ERROR: BAD HIT LOCATION";
    }
    
    
    //format damage rolls
    cur=parseInt(numhits)+parseInt(scathits);
    if(attributeArray['Smoke'] != -1 ){dmgsubstring=" One hit on target ";}
    else if(attributeArray['Tearing']==true){dmgsubstring=parseInt(numdice)+"d"+parseInt(dice)+"d1cs>"+(parseInt(attributeArray['Vengeful']))+"cf0+"+parseInt(dmg)+" ]] <B> Pen "+parseInt(pen)+" </B>";}
    else if (attributeArray['Spray']==true){dmgsubstring=parseInt(numdice)+"d"+parseInt(dice)+"cs>"+(parseInt(attributeArray['Vengeful']))+"cf9+"+parseInt(dmg)+" ]] <B> Pen "+parseInt(pen)+" </B>";}
    else {dmgsubstring=parseInt(numdice)+"d"+parseInt(dice)+"cs>"+(parseInt(attributeArray['Vengeful']))+"cf0+"+parseInt(dmg)+" ]] <B> Pen "+parseInt(pen)+" </B>";}
    
    //Compute Damage string
    for(i=1; i <=cur; i++){
        
        //do separate calculations for proven/primitive, if necessary
        if(attributeArray['Proven']!=-1 || attributeArray['Primitive']!=-1){
            lowest=100;
            prvdmg='';
            prvrf=false;
            for(j=1; j <= numdice; j++){
                temp = randomInteger(parseInt(dice));
                if(temp>=attributeArray['Vengeful']){prvrf=true;}
                if(temp==9 && attributeArray['Spray']==true){prvjam=true;}
                if(attributeArray['Proven']!=-1 && temp<attributeArray['Proven']){temp=attributeArray['Proven'];}
                if(attributeArray['Primitive']!=-1 && temp>attributeArray['Primitive']){temp=attributeArray['Primitive'];}
                if(temp<lowest){lowest=temp;}
                prvdmg=prvdmg+temp+"+";
            }
            prvdmg=prvdmg+dmg;
            if(attributeArray['Tearing']==true){prvdmg=prvdmg+"-"+lowest;}
            dmgsubstring="[NH] 1d0+"+prvdmg+" ]] <B> Pen "+parseInt(pen)+" </B>";
        }
        
        //Add scatter/drift strings if necessary
        if(attributeArray['Indirect']!=-1 && (shotsel==3||shotsel==4||shotsel==5)){
            scatdir=randomInteger(8);
            if(scatdir==1){temp="NW";}
            else if(scatdir==2){temp="N";}
            else if(scatdir==3){temp="N";}
            else if(scatdir==4){temp="NE";}
            else if(scatdir==5){temp="W";}
            else if(scatdir==6){temp="E";}
            else if(scatdir==7){temp="SW";}
            else if(scatdir==8){temp="SE";}
            if(i<=numhits){dmgendstring="[[ [NH] 1d10-"+parseInt(sub)+"]] meter(s) "+temp;}
            else{dmgendstring="[[ [NH] "+attributeArray['Indirect']+"d10]] meter(s) "+temp;}
        } else if(i>numhits){
            scatdir=randomInteger(8);
            if(scatdir==1){temp="NW";}
            else if(scatdir==2){temp="N";}
            else if(scatdir==3){temp="N";}
            else if(scatdir==4){temp="NE";}
            else if(scatdir==5){temp="W";}
            else if(scatdir==6){temp="E";}
            else if(scatdir==7){temp="SW";}
            else if(scatdir==8){temp="SE";}
            dmgendstring="[[ [NH] 1d5]] meter(s) "+temp;
        } else{
            dmgendstring="to the "+hitloc[i];
        }
        if(attributeArray['Smoke']!=-1){dmgstring = dmgstring+ " --Smoke: *"+i+"|"+dmgsubstring;}
        else{dmgstring = dmgstring+ " --Damage: *"+i+"|[[ [$Dmg"+i+"] "+dmgsubstring+dmgendstring;}
        //Compute Jams for Spray Weapons
        if(attributeArray['Spray']==true && attributeArray['Reliable']==false && prvjam==true){dmgstring = dmgstring + " --^1Jam: *"+i+"| Your weapon jams! ";}
        else if(attributeArray['Spray']==true && attributeArray['Reliable']==false){dmgstring = dmgstring + " --?? $Dmg"+i+".nines > 0 ?? ^1Jam: *"+i+"| Your weapon jams! ";}
        //Compute and add RF
        rfstring = " $Dmg"+i+".tens > 0";
        if(attributeArray['Vengeful']<=9){rfstring =  rfstring + " OR $Dmg"+i+".nines > 0";}
        if(attributeArray['Vengeful']<=8){rfstring =  rfstring + " OR $Dmg"+i+".eights > 0";}
        if(attributeArray['Vengeful']<=7){rfstring =  rfstring + " OR $Dmg"+i+".sevens > 0";}
        if(attributeArray['Vengeful']<=6){rfstring =  rfstring + " OR $Dmg"+i+".sixes > 0";}
        if(attributeArray['Vengeful']<=5){rfstring =  rfstring + " OR $Dmg"+i+".fives > 0";}
        if(attributeArray['Vengeful']<=4){rfstring =  rfstring + " OR $Dmg"+i+".fours > 0";}
        if(attributeArray['Vengeful']<=3){rfstring =  rfstring + " OR $Dmg"+i+".threes > 0";}
        if(attributeArray['Vengeful']<=2){rfstring =  rfstring + " OR $Dmg"+i+".twos > 0";}
        if(attributeArray['Vengeful']<=1){rfstring =  rfstring + " OR $Dmg"+i+".ones > 0";}
        if(prvrf==true){dmgstring = dmgstring + " --!^1Righteous Fury: *"+i+"| [[ [NH] 1d5 ]] critical damage to the "+hitloc[i]+" ";}
        else{dmgstring = dmgstring + " --?? "+rfstring+" ?? !^1Righteous Fury: *"+i+"| [[ [NH] 1d5 ]] critical damage to the "+hitloc[i]+" ";}
        //Check for 'Accurate' quality
        if(attributeArray['Accurate']==true && shotsel == 0){
            if(degOfSuc == 3 || degOfSuc == 4){
                qualstring = qualstring + " --^1Accurate: *"+i+"| If benefitting from the Aim action on single shot, add [[ [$Acc"+i+"] [NH] 1d10 ]] damage";      
            } else if (degOfSuc >= 5){
                qualstring = qualstring  + " --^1Accurate: *"+i+"| If benefitting from the Aim action on single shot, add [[ [$Acc"+i+"] [NH] 2d10 ]] damage"; 
            }
        }
        //check for 'Corrosive' Quality
        if(attributeArray['Corrosive']==true){
                dmgstring = dmgstring  + " --!^1Corrosive: *"+i+"| [[ [$Cor"+i+"] [NH] 1d10 ]] dmg to "+hitloc[i]+" Armor ";
        }
    }
  
    //Add additional Weapon Modifiers/Firing Modes/Talents to the string
    //Check Suppressive Fire
    if(shotsel==10 && jam==false){
        qualstring = qualstring  + " --Suppressing: | User establishes a 30-degree kill zone. All targets in the area must make a Pinning test at -10. This attack deals damage to random targets in the kill zone.";  
    }
    if(shotsel==11 && jam==false){
        qualstring = qualstring  + " --Suppressing: | User establishes a 45-degree kill zone. All targets in the area must make a Pinning test at -20. This attack deals damage to random targets in the kill zone.";  
    }
    //Check for 'Blast' quality
    if(attributeArray['Blast'] != -1 && jam==false){
        qualstring = qualstring  + " --Blast: | Does damage to all targets within "+attributeArray['Blast']+" meters of the point hit; Scatters on miss";  
    } 
    //Check for Concussive quality
    if(attributeArray['Concussive'] != -1 && (hit==true||scatter==true)&& jam==false ){
        qualstring = qualstring  + " --Concussive: | Target(s) must make "+parseInt(numhits+scathits)+" Toughness test(s) at  -"+(10*attributeArray['Concussive'])+". If failed, the target is Stunned for 1 round per DoF";  
    }
    //Check for 'Corrosive' quality
    if(attributeArray['Corrosive']== true && (hit==true||scatter==true)&& jam==false){
        qualstring = qualstring  + " --Corrosive: *0| Armor damage is cumulative and permanent. Any damage done to Armor that reduces it below 0 AP (or if the target has no armor at that location) is dealt to the target directly, bypassing Toughness";  
    }
    //Check for Crippling quality
    if(attributeArray['Crippling'] != -1 && (hit==true||scatter==true)&& jam==false ){
        qualstring = qualstring  + " --Crippled: |[+Crippled] If Target takes at least 1 wound from this wpn he is considered Crippled until end of the encounter or healed fully. If a Crippled character takes more than a half action on his turn, he suffers "+attributeArray['Crippling']+" Rending damage, not reduced by A or T.";  
    }
    //Check for Daemonbane quality
    if(attributeArray['Daemonbane'] == true && (hit==true||scatter==true)&& jam==false ){
        qualstring = qualstring  + " --Daemonbane: | This weapon gains Vengeful(8) and ignores Toughness vs creatures with the Daemonic trait [NOT INCLUDED]";
    }
    //Check for Felling quality
    if(attributeArray['Felling'] != -1 && (hit==true||scatter==true)&& jam==false ){
        qualstring = qualstring  + " --Felling: | Target reduces their Unnatural Toughness by "+attributeArray['Felling']+" ";
    }
    //Check for Flame quality
    if(attributeArray['Flame'] == true && (hit==true||scatter==true)&& jam==false ){
        qualstring = qualstring  + " --Flame: | [+Fire] Target(s) hit must make an Agility test or be set on Fire ";
    }
    //Check for Graviton quality
    if(attributeArray['Graviton'] == true && (hit==true||scatter==true)&& jam==false ){
        qualstring = qualstring  + " --Graviton: | Target takes additional damage on every hit equal to his Armor Bonus ";
    }
    //check for 'Hallucinogenic' Quality
    if(attributeArray['Hallucinogenic'] !=-1 && jam==false){
        qualstring = qualstring  + " --Hallucinogenic: | [+Hallucinating] Target(s) hit must make Toughness tests at "+parseInt(-10*attributeArray['Hallucinogenic'])+" or else suffer this temporary delusion: ^^[[ [TXT] [$Tbl] 1t[hallucinogenic] ]] The effects last for 1 round, +1 per DoF.";
    }
    //check for 'Haywire' Quality
    if(attributeArray['Haywire']!=-1 && (hit==true || scatter==true) && jam==false ){
        temp2=randomInteger(10);
        temp2=parseInt(temp2)+parseInt(attributeArray['HaywireMod']);
        if(temp2==1||temp2==2){temp="<b>Insignificant:</b> No noticible effect";}
        else if(temp2==3||temp2==4){temp="<b>Minor Disruption:</b> All actions using tech take -10, PwrArm Mov-1";}
        else if(temp2==5||temp2==6){temp="<b>Major Disruption:</b> All actions using tech take -20, PwrArm Mov-3, Melee wpns function as Primitive";}
        else if(temp2==7||temp2==8){temp="<b>Dead Zone:</b> Tech ceases to function, PwrArm Mov=1, cybernetics inflict 1 fatigue/round, Melee wpn function as Primitive";}
        else if(temp2>=9){temp="<b>Prolonged Dead Zone:</b> Tech ceases to function, PwrArm Mov=1, cybernetics inflict 1 fatigue/round, Melee wpn function as Primitive. Lasts for [[ [NH] 1d5 ]] rounds before lessening to Major Disruption";}

        qualstring = qualstring  + " --Haywire: | [+Haywire] Everything within "+attributeArray['Haywire']+"m of the point(s) hit is affected with the following effect: ^^"+temp+"^^ The field lessens 1 step in severity each round and does not stack (highest effect persists).";
    }
    //Check for Inaccurate quality
    if(attributeArray['Inaccurate'] == true){
        qualstring = qualstring  + " --Inaccurate: | Cannot benefit from the Aim action using this weapon";
    }
    //Check for Indirect quality
    if(attributeArray['Indirect'] != -1 && shotsel!=3 && shotsel!=4 && shotsel!=5){
        qualstring = qualstring  + " --Indirect: | This weapon can be fired as a FuA in Indirect Mode; in this mode, attacks do not require LoS, but the attacker must still be aware of the target. Attacks Scatter on hit and on miss.";
    }
    if(attributeArray['Indirect'] != -1 && (shotsel==3||shotsel==4||shotsel==5) && jam==false ){
        qualstring = qualstring  + " --Indirect: | This weapon is being fired as a FuA in Indirect Mode; attacks do not require LoS, but the attacker must still be aware of the target. Attacks Scatter on hit and on miss.";
    }
    //Check for Lance quality
    if(attributeArray['Lance'] == true && hit==true && jam==false){
        qualstring = qualstring  + " --Lance: | Penetration is increased for every DoS";
    }
    //Check for'Maximal' quality
    if(attributeArray['Maximal']==true && (shotsel==6||shotsel==7||shotsel==8) && jam==false){
        qualstring = qualstring  + " --Maximal: | This weapon is firing on Maximal; it adds +10 Range, +1d10 damage, +2 Pen, Blast(+2), Recharge. Weapon also consumes 3x ammo";
    }
    if(attributeArray['Maximal']==true && shotsel!=6 && shotsel!=7 && shotsel!=8){
        qualstring = qualstring  + " --Maximal: | This weapon can be fired on Maximal; in this mode, it adds +10 Range, +1d10 damage, +2 Pen, Blast(+2), Recharge. Weapon also consumes 3x ammo";
    }
    //Check for 'Melta' quality
    if(attributeArray['Melta'] == true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Melta: | Penetration is doubled at Short Range or closer";
    }
    //Check for 'Overheats' quality
    if( (attributeArray['Overheats'] == true && hit==false && superUnreliable==true)||(attributeArray['Overheats'] == true && roll >= 90 && quality!="best") ){
        dmgstring = dmgstring  + " --Overheats: | This weapon Overheats and you take [[ [$Ovh] "+parseInt(numdice)+"d"+parseInt(dice)+"+"+parseInt(dmg)+"]] Pen 0 Energy damage to the Arm. User can drop the weapon as a FrA to avoid damage. The weapon must spend the next round cooling down.";
    }
    if( (attributeArray['Overheats'] == true && roll <= 90 && quality!="best" && superUnreliable==false)||(attributeArray['Overheats'] == true && hit==true && superUnreliable==true) ){
        qualstring = qualstring  + " --Overheats: | This weapon can overheat on a roll of 91 or higher; it never jams--any effect that would cause it to jam instead causes it to Overheat";
    }
    //Check for 'Primitive' quality
    if(attributeArray['Primitive'] != -1 && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Primitive: | Any die result greater than"+attributeArray['Primitive']+" is counted as "+attributeArray['Primitive']+". Righteous Fury may still trigger as usual.";
    }
    //Check for 'Proven' quality
    if(attributeArray['Proven'] != -1 && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Proven: | Any die result less than"+attributeArray['Proven']+" is counted as "+attributeArray['Proven'];
    }
    //Check for 'RazorSharp' quality
    if(attributeArray['RazorSharp'] == true && hit==true ){
        qualstring = qualstring  + " --Razor Sharp: | Penetration is doubled for 3+ DoS";
    }
    //Check for 'Recharge' quality
    if(attributeArray['Recharge'] == true && jam==false){
        qualstring = qualstring  + " --Recharge: | When used to attack, this weapon cannot fire again until the end of the next round";
    }
    //Check for 'Reliable' quality
    if(attributeArray['Reliable'] == true){
        qualstring = qualstring  + " --Reliable: | This weapon only jams on a 100; spray weapons never jam";
    }
    //Check for 'Sanctified' quality
    if(attributeArray['Sanctified'] == true && jam==false){
        qualstring = qualstring  + " --Sanctified: | Any damage inflicted by this weapon counts as Holy, which can have unique effects against Daemons";
    }
    //Check for 'Scatter' quality
    if(attributeArray['Scatter'] == true && hit==true){
        qualstring = qualstring  + " --Scattering: | Increases dmg and hit at PBR, +hit at SR, -dmg at higher ranges (not to be confused with weapon scattering/drift)";
    }
    //Check for Shocking quality
    if(attributeArray['Shocking']==true && (hit==true||scatter==true) ){
        qualstring = qualstring  + " --Shocking: | A target that takes at least 1 point of damage from this weapon (after A/T) must make a Challenging Toughness Test. If failed, the target gains 1 Fatigue and is Stunned for 1 round per 2 DoF (rounding up)";  
    }
    //Check for Smoke quality
    if(attributeArray['Smoke'] != -1 && jam==false){
        qualstring = qualstring  + " --Smoke: *0| Creates "+parseInt(numhits+scathits)+" Smokescreen(s) at the point(s) of impact with a radius of "+attributeArray['Smoke']+". The screen(s) last for [[ [$Smk] 1d10+10 ]] rounds";  
    }
    //Check for Snare quality
    if(attributeArray['Snare'] != -1 && jam==false){
        qualstring = qualstring  + " --Snare: | [+Helpless] Target(s) hit must make an Agility test at "+parseInt(-10*attributeArray['Snare'])+" or be Immobilized. An Immobilized target can attempt no actions other than escape; as a FuA he can make a Challenging Str test at "+parseInt(-10*attributeArray['Snare'])+". If he succeeds, he bursts free. The target is considered Helpless until he escapes.";  
    }
    //Check for Spray quality
    if(attributeArray['Spray']==true && attributeArray['Twin-Linked']== false){
        qualstring = qualstring  + " --Spray: | Affects targets in a 30 degree cone. Targets must make a Challenging Agility test or suffer one hit from the weapon. If user lacks training, targets gain+20. If user is firing a heavy weapon and isn't braced, targets gain+30. Cover does protect vs Spray unless the target is completely covered. They jam if the firer rolls 9s on any damage dice.";  
    }
    if(attributeArray['Spray']==true && attributeArray['Twin-Linked']== true){
        qualstring = qualstring  + " --TL Spray: | Affects targets in a 30 degree cone. Targets must make a Challenging Agility test or suffer one hit from the weapon, rerolling any successfull saves once. If user lacks training, targets gain+20. If user is firing a heavy weapon and isn't braced, targets gain+30. Cover does protect vs Spray unless the target is completely covered. They jam if the firer rolls 9s on any damage dice. Consumes 2x ammo and doubles Reload time.";  
    }
    //Check for Storm quality
    if(attributeArray['Storm']==true && jam==false){
        qualstring = qualstring  + " --Storm: | Doubles the number of hits this weapon deals (up to the firing rate)";  
    }
    //Check for Tainted quality
    if(attributeArray['Tainted']==true && (hit==true||scatter==true) ){
        qualstring = qualstring  + " --Tainted: | This weapon deals additional damage equal to the bearer's Corruption Bonus [NOT INCLUDED]";
    }
    //Check for Tearing quality
    if(attributeArray['Tearing']==true && jam==false){
        qualstring = qualstring  + " --Tearing: | This weapon rolls one extra die for damage, and the lowest roll is discarded"; 
    }
    //Check for Toxic quality
    if(attributeArray['Toxic'] != -1 && jam==false){
        qualstring = qualstring  + " --Toxic: | Target(s) who take damage (after A/T) must make a Toughness test at "+parseInt(-10*attributeArray['Toxic'])+" or suffer [[ [$Tox] 1d10 ]] additional damage, ignoring A/T. Some Toxins have additional effects.";  
    }
    //Check for Twin-Linked quality
    if(attributeArray['Twin-Linked']== true && attributeArray['Spray']==false && jam==false){
        qualstring = qualstring  + " --TwinLinked: | Weapon adds +20 to hit and uses 2x ammunition; weapon also scores one additional hit if > 2 DoS. Doubles Reload Time.";  
    }
    //Check for 'Unreliable' quality
    if(attributeArray['Unreliable'] == true){
        qualstring = qualstring  + " --Unreliable: | This weapon  jams on a 91+";
    }
    //Check for 'Vengeful' quality
    if(attributeArray['Vengeful'] != 10 && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Vengeful: | Any die result greater than"+attributeArray['Vengeful']+" triggers Righteous Fury";
    }
    
    
    //Add talent descriptions
    talstring = " --Applicable Talents: |";
    //Deathdealer
    if(ttArray['deathdealer']==true && (hit==true||scatter==true) && jam==false){
        talstring = talstring  + "Deathdealer(+PB to crit), ";  
    }
    //Doubletap
    if(ttArray['doubletap']==true && hit==true && jam==false){
        talstring = talstring  + "DoubleTap(+20hit 2nd atk), ";  
    }
    //Eye of Vengeance
    if(ttArray['eyeofvengeance']==true && (shotsel==0||shotsel==3||shotsel==6||shotsel==9) ){
        talstring = talstring  + "EyeofVengeance(spend FP to +dmg/pen), ";  
    }
    //Hip Shooting
    if(ttArray['hipshooting']==true && (shotsel==0||shotsel==3||shotsel==6||shotsel==9) ){
        talstring = talstring  + "HipShooting(FuMv+Std Atk), ";  
    }
    //Hip Shooting
    if(ttArray['independenttargeting']==true){
        talstring = talstring  + "IndepTargeting(>10m targets), ";  
    }
    //Inescapable attack
    if(ttArray['inescapableattack']==true && (shotsel==0||shotsel==3||shotsel==6||shotsel==9) && (hit==true||scatter==true) && jam==false){
        talstring = talstring  + "InescapableAtk("+(-10*parseInt(degOfSuc))+" evasion penalty), ";  
    }
    //Marksman
    if(ttArray['marksman']==true && range>3){
        talstring = talstring  + "Marksman(no penalty lng/ext range), ";  
    }
    //Mighty Shot
    if(ttArray['mightyshot']==true && (hit==true||scatter==true) && jam==false){
        talstring = talstring  + "MightyShot(+BS/2 dmg), ";  
    }
    //Nowhere to Hide
    if(ttArray['nowheretohide']==true && (hit==true||scatter==true) && jam==false){
        talstring = talstring  + "NowhereToHide(damages cover), ";  
    }
    //Precision Killer
    if(ttArray['precisionkiller']==true && shotsel==9){
        talstring = talstring  + "PrecisionKiller(no penalty Called Shot), ";  
    }
    //Target Selection
    if(ttArray['targetselection']==true ){
        talstring = talstring  + "TargetSelection(no penalty fire into melee), ";  
    }
    //Weapon Tech
    if(ttArray['weapontech']==true && (hit==true||scatter==true) && jam==false){
        talstring = talstring  + "WpnTech(enhance certain wpns 1/combat), ";  
    }
    
    //Set the text output sub-headings
    if(shotsel==0){temp="Std";}
    else if(shotsel==1){temp="SA";}
    else if(shotsel==2){temp="FA";}
    else if(shotsel==3){temp="Ind Std";}
    else if(shotsel==4){temp="Ind SA";}
    else if(shotsel==5){temp="Ind FA";}
    else if(shotsel==6){temp="Max Std";}
    else if(shotsel==7){temp="Max SA";}
    else if(shotsel==8){temp="Max FA";}
    else if(shotsel==9){temp="Called";}
    else if(shotsel==10){temp="SA Sup";}
    else if(shotsel==11){temp="FA Sup";}
    
    if(range==0){temp2="Melee Rng";}
    else if(range==1){temp2="PB Rng";}
    else if(range==2){temp2="Short Rng";}
    else if(range==3){temp2="Normal Rng";}
    else if(range==4){temp2="Long Rng";}
    else if(range==5){temp2="Extreme Rng";}
    
    temp = temp + " @ " +temp2;

    if(spray==true){
        sub=''
    } else{
        sub=" --Roll:| [! "+roll+" !] vs [! "+modTarget+" !] --Result:|"+output;
    }

    //Return output
    if(error==true){
      output = errortext; 
    }
    else {
        output ="!power {{--format|ranged --titlefontshadow|none --name|"+token+" --leftsub| "+wpnname+"  --rightsub| "+temp+sub+dmgstring+scatstring+qualstring+talstring+" }}";
        //output="suck it";
        
    }
    return output;
}
