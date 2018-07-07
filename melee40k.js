/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria.
 * 
 * The following commands is used:
 * !ranged40k   
**/

//Rolls a d100 and calculates the success or fail results to the chat window.
var melee40kNamespace = melee40kNamespace || {};

melee40kNamespace.rollResult = function(token, attribute, shotsel, numdice, dice, dmg, pen, str, modifier, special, quality, talents, wpnname, type, psy, mod1, mod2, mod3, effects, wpncat, msg) {
    if (typeof token === 'undefined' || typeof token != 'string' )                          token       = 'generic';
    if (typeof attribute === 'undefined' || Number.isInteger(parseInt(attribute))==false)   attribute   = 0;
    if (typeof wpnname === 'undefined' || typeof wpnname != 'string' )                      wpnname     = 'generic';
    if (typeof shotsel === 'undefined' || Number.isInteger(parseInt(shotsel))==false)       shotsel     = 0;
    if (typeof numdice === 'undefined' || Number.isInteger(parseInt(numdice))==false)       numdice     = 1;
    if (typeof dice === 'undefined' || Number.isInteger(parseInt(dice))==false)             dice        = 10;
    if (typeof dmg === 'undefined' || Number.isInteger(parseInt(dmg))==false)               dmg         = 0;
    if (typeof type === 'undefined' || typeof type != 'string' )                            type        = '';
    if (typeof pen === 'undefined' || Number.isInteger(parseInt(pen))==false)               pen         = 0;
    if (typeof modifier === 'undefined' || Number.isInteger(parseInt(modifier))==false)     modifier    = 0;
    if (typeof quality === 'undefined' || typeof quality != 'string' )                      quality     = '';
    if (typeof special === 'undefined' || typeof special != 'string' )                      special     = '';
    
    //var special2 = "Flame, Indirect(4), Sanctified, Twin-Linked";  //test string
    var player_obj = getObj("player", msg.playerid);
    var roll = randomInteger(100);
    var i, j, k, cur, temp, temp2; //loop control and temporary variables
    var error=false;
    var errortext="ERROR: GENERIC";
    var hit=false;
    var damage=false;
    var parry=false;
    var boundmod=0;
    var modTarget = 0;
    var degOfSuc =0;
    var numhits = 0;
    var swiftcalc=0;
    var dmgroll=null;
    var prvdmg=0;
    var lowest=0;
    var prvrf=false;
    var output='';
    var dmgstring='';
    var dmgsubstring='';
    var dmgendstring='';
    var qualstring='';
    var rfstring='';
    var talstring='';
    var ammomodstring='';
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
        "Vengeful": 10,         //Daemon wpn attributes
        "Voidchill": false,
        "Howling": false,
        "Wounding": -1,
        "Vicious": false,
        "Accursed": false,
        "Bloodlust": false,
        "Thirsting": false,
        "Null": false,
        "Fury": false,
        "Skulltaker": false,
        "Illusory": false,
        "MindEater": false,
        "Spellbound": false,
        "WarpFlame": false,
        "SorcerousForce": -1,
        "Bile-Quenched": false,
        "Enfeebling": false,
        "PlagueCarrier": false,
        "StreamofCorruption": -1,
        "PestilentStench": false,
        "Envenomed": -1,
        "Lashing": -1,
        "Swiftness": -1,
        "Sophorific Musk": false,
        "Enticing": false,
        "Vulgar": false,
        "Jealous": false,
        "Prideful": false,
        "Vindictive": false,
        "Overbearing": false,
        "Thrown": false,        //Wpn can be thrown as ranged atk
        "Multiplier": -1,    //Multiplier to attribute damage
        "Precision": -1,        //+X damage per DoS
        "Weighty": -1,          //requires SB(X) to fire
        "Intangible": false,    //doesn't add attribute to melee damage
        "Imposing": false,
        "Compact": false,
        "Steady": false,
        "Potent": false,
        "SwirlingEnergy": false,
        "IncalculablePrecision": false,
        "Indestructible": false,
        "Ramshackle": false,
        "PeerlessElegance": false,
        "InnovativeDesign": false,
        "RemnantoftheEndless": false,
        "DeathsDreamFragment": false,
        "Surly": false,
        "Cruel": false,
        "Patient": false,
        "Unpredictable": false,
        "Respendent": false,
        "Vanishing": false,
        "Trusty": false,
        "Zealous": false,
        "Dogged": false,
        "Lucky": false
    };
    var ttArray = {
        "adamantiumfaith": false,
        "aegisofcontempt": false,
        "ambassadorimp": false,
        "ambidexterous": false,
        "archivator": false,
        "armormonger": false,
        "assassinstrike": false,
        "bastionironwill": false,
        "battlerage": false,
        "blademaster": false,
        "blindfighting": false,
        "bodyguard": false,
        "bulgingbiceps": false,
        "bulwarkoffaith": false,
        "catfall": false,
        "cluesfromcrowds": false,
        "combatmaster": false,
        "constantvigilance": false,
        "contact network": false,
        "coordinatedinterrogation": false,
        "counterattack": false,
        "coverup": false,
        "crushingblow": false,
        "daemonhunter": false,
        "daemonicdisrupt": false,
        "daemonologist": false,
        "darksoul": false,
        "deathdealer": false,
        "delicateinterrogation": false,
        "denythewitch": false,
        "devastatingassault": false,
        "diehard": false,
        "disarm": false,
        "divineprotection": false,
        "doubletap": false,
        "doudbleteam": false,
        "enemy": false,
        "eyeofvengeance": false,
        "faceinacrowd": false,
        "favoredbywarp": false,
        "ferricsummons": false,
        "fieldvivi": false,
        "flagellant": false,
        "flashofinsight": false,
        "frenzy": false,
        "grenadier": false,
        "haloofcommand": false,
        "hammerblow": false,
        "hardenedsoul": false,
        "hardtarget": false,
        "hardy": false,
        "hatred": false,
        "hipshooting": false,
        "hotshotpilot": false,
        "hulldown": false,
        "independenttargeting": false,
        "indomitableconv": false,
        "inescapableattack": false,
        "infusedknowledge": false,
        "inspiringaura": false,
        "instrumentofhiswill": false,
        "intothejaws": false,
        "ironfaith": false,
        "ironjaw": false,
        "ironresolve": false,
        "jaded": false,
        "keenintuition": false,
        "killingstrike": false,
        "leapingdodge": false,
        "leapup": false,
        "lightningattack": false,
        "luminenblast": false,
        "luminenshock": false,
        "maglevtrans": false,
        "marksman": false,
        "mastery": false,
        "mechadendrite": false,
        "mightyshot": false,
        "mountedwarrior": false,
        "neverdie": false,
        "nowheretohide": false,
        "oneonone": false,
        "peer": false,
        "penitentpsy": false,
        "precisionkiller": false,
        "preturnaturalspeed": false,
        "prosanguine": false,
        "purityofhatred": false,
        "pushthelimit": false,
        "quickdraw": false,
        "rapidreload": false,
        "resistance": false,
        "riteofbanish": false,
        "sancticpurity": false,
        "shieldwall": false,
        "skilledrider": false,
        "soundcon": false,
        "sprint": false,
        "stepaside": false,
        "strongminded": false,
        "superiorchi": false,
        "swiftattack": false,
        "taintedpsy": false,
        "takedown": false,
        "targetselection": false,
        "technicalknock": false,
        "thundercharge": false,
        "truegrit": false,
        "twowpnmstr": false,
        "twowpnwld": false,
        "unarmedspec": false,
        "warpconduit": false,
        "warplock": false,
        "warpsense": false,
        "weaponintuition": false,
        "weapontech": false,
        "whirlwindofdeath": false,
        "witchfinder": false,
        "xenosavant": false,
        "amorphous": false,                 //traits
        "amphibious": false,
        "autostabilized": false,
        "banefulpres": -1,
        "bestial": false,
        "blind": false,
        "brutalcharge": -1,
        "burrower": -1,
        "cranialcircuitry": false,
        "crawler": false,
        "cybermantle": false,
        "daemonic": -1,
        "darksight": false,
        "deadlynatural": false,
        "electrograft": false,
        "electooinductors": false,
        "fear": -1,
        "flyer": -1,
        "frombeyond": false,
        "hoverer": -1,
        "incorporeal": false,
        "machine": -1,
        "mindlock": false,
        "multiplearms": -1,
        "naturalarmor": -1,
        "naturalweapons": false,
        "potentiacoil": false,
        "phase": false,
        "psyker": false,
        "quadruped": false,
        "regeneration": -1,
        "sanctioned": false,
        "size": -1,
        "sonarsense": false,
        "soulbound": false,
        "stampede": false,
        "stuffofnightmares": false,
        "sturdy": false,
        "touchedbythefates": -1,
        "toxic": -1,
        "undying": false,
        "unnaturalsenses": false,
        "warpinstability": false,
        "warpweapons": false,
        "abyssalterror": false,                 //Elite Advances
		"adrenalrecovery": false,
		"advancedbattlesuittraining": false,
		"allyofthexenos": false,
		"apotheosisdelayed": false,
		"attackmytarget": false,
		"baneofthedaemon": false,
		"battlefieldtechnician": false,
		"bestofthebest": false,
		"blessedmartyrdom": false,
		"blessingoftheethereals": false,
		"bondingritual": false,
		"boundtothehighest": false,
		"braceforimpact": false,
		"burytheknife": false,
		"ceaselesscrusader": false,
		"cleanseandpurify": false,
		"cleansewithfire": false,
		"cogswithincogs": false,
		"coldreading": false,
		"coldtrader": false,
		"combatflair": false,
		"completecontrol": false,
		"corruptedcharge": false,
		"coverandadvance": false,
		"daemonicaffinity": false,
		"daemonicanathema": false,
		"daemonicdomination": false,
		"daemonicemergence": false,
		"damagecontrol": false,
		"despoiler": false,
		"discipleofkauyon": false,
		"discipleofmontka": false,
		"dispassionatedispatch": false,
		"divineministration": false,
		"divinesymbol": false,
		"divinevengeance": false,
		"emperorsguidance": false,
		"envoyofthegreatergood": false,
		"exemplaroftheselflesscause": false,
		"fated": false,
		"favoreditem": false,
		"feelnopain": false,
		"firebrandscall": false,
		"firesupport": false,
		"flamesoffaith": false,
		"fleshwarp": false,
		"furiousfusillade": false,
		"furiouszeal": false,
		"greaterthanthesun": false,
		"holdfast": false,
		"honorguard": false,
		"hunkerdown": false,
		"inspiredintuition": false,
		"jackofalltrades": false,
		"killerseye": false,
		"legendary": false,
		"legendaryarmament": false,
		"lostokenhancement": false,
		"luminenbarrier": false,
		"luminendesecration": false,
		"luminenflare": false,
		"luminenshield": false,
		"luminensurge": false,
		"marauder": false,
		"martyrsgift": false,
		"masterofalltrades": false,
		"masteroftechnology": false,
		"metalfatigue": false,
		"mightoftheemperor": false,
		"mindsight": false,
		"mindtrap": false,
		"mortalglamour": false,
		"newallies": false,
		"nullfield": false,
		"operativeconditioning": false,
		"panxenoist": false,
		"personalequipment": false,
		"priorityfire": false,
		"psychicnull": false,
		"purgetheunclean": false,
		"renownedwarrant": false,
		"resurrection": false,
		"riteofawe": false,
		"riteoffear": false,
		"riteofpurethought": false,
		"secondsight": false,
		"sharedestiny": false,
		"shieldingfaith": false,
		"shieldofcontempt": false,
		"shipmaster": false,
		"snapshot": false,
		"soullessaura": false,
		"soulstorm": false,
		"soulward": false,
		"spiritofthemartyr": false,
		"squadmode": false,
		"strengththroughconviction": false,
		"strengththroughunity": false,
		"subversiveprogramming": false,
		"suffertheflesh": false,
		"superiorsupplychain": false,
		"supportingfire": false,
		"supremetelepath": false,
		"swarmprotocols": false,
		"tacticalflexibility": false,
		"tacticalwithdrawal": false,
		"takethemalive": false,
		"technologicalinsight": false,
		"technologytriumphant": false,
		"tempestofmonkua": false,
		"theemperorprotects": false,
		"thepowerbeyond": false,
		"thepowerwithin": false,
		"throughunitydevastation": false,
		"undyingwarrior": false,
		"unfalteringredemption": false,
		"unhalloweddiscovery": false,
		"unholyinsight": false,
		"unorthodoxrites": false,
		"veteran's reflexes": false,
		"voidsavant": false,
		"warpanathema": false,
		"warpawareness": false,
		"warpbane": false,
		"warpdisruption": false,
		"warpforge": false,
		"watchfulforbetrayal": false,
		"whispersfrombeyond": false,
		"whispersofsamadhi": false,
		"willoftheinquisitor": false,
		"wrathoftherighteous": false,
		"xenoarcheologist": false,
		"xenosaugmentation": false,
		"xenosfamiliarity": false,
		"xenoshybridization": false,
		"zealotspassion": false,
		"coldsoul": false,              //traits from EAs
		"lostokaugmentation": false,
		"masteryofaugurs": false,
		"masteryofgunnery": false,
		"masteryofsmallcraft": false,
		"masteryofspace": false,
		"possessed": false,
		"purefaith": false,
		"rigormentis": false,
		"temperament": false,
		"untouchable": false,
		"xenophilia": false
    };     
    var modArray = {
        "na": false,
        "auxilliary": false,
        "backpack": false,
        "compact": false,
        "grip": false,
        "deactivated": false,
        "expanded": false,
        "exterminator": false,
        "selector": false,
        "fluid": false,
        "melee": false,
        "stock": false,
        "mono": false,
        "motion": false,
        "omni": false,
        "photo": false,
        "pistol": false,
        "preysense": false,
        "quick": false,
        "reddot": false,
        "reinforced": false,
        "sacred": false,
        "silencer": false,
        "suspensors": false,
        "targeter": false,
        "telescopic": false,
        "tox": false,
        "tripod": false,
        "truesilver": false,
        "weaving": false,
        "warpleech": false,
        "vox": false
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
    
    
    // Flags the mods used
    if(mod1 != null){modArray[mod1] = true;}
    if(mod2 != null){modArray[mod2] = true;}
    if(mod3 != null){modArray[mod3] = true;}
    
    
    //Add adjustments for weapon mods
    if(modArray['mono']==true && attributeArray['PowerField']==false){pen=parseInt(pen)+2; attributeArray['Primitive']=-1;}
    if(modArray['tox']==true && attributeArray['Toxic']<2){attributeArray['Toxic']=2;}
    
    
    //Account for attributes that add other attributes (typically SoI and Daemon wpn traits)
    if(attributeArray['Wounding'] > -1 ){
        if(attributeArray['Crippling'] < attributeArray['Wounding']) {attributeArray['Crippling']=attributeArray['Wounding'];}
    }
    if(attributeArray['Vicious'] ==true){
        if(attributeArray['Tearing']==true){attributeArray['RazorSharp']=true;}
        else{attributeArray['Tearing']=true;}
    }
    if(attributeArray['Accursed']==true){
        numdice=parseInt(numdice)+1;
        if(attributeArray['Felling']< 4){attributeArray['Felling']=4;}
    }
    if(attributeArray['Fury']==true){boundmod=parseInt(boundmod)+10;}
    if(attributeArray['Skulltaker']==true && shotsel == 4){
        if(attributeArray['Vengeful']>8){attributeArray['Vengeful']=8;}
    }
    if(attributeArray['Warpflame']==true){attributeArray['Flame']=true; ttArray['WarpWeapons']=true;}
    if(attributeArray['Envenomed'] > -1){
        if(attributeArray['Toxic']<(parseInt(attributeArray['Envenomed'])/2)){attributeArray['Toxic']=(parseInt(attributeArray['Envenomed'])/2);}
    }
    if(attributeArray['Lashing'] > -1){
        attributeArray['Flexible']=true;
        //range = Daemon's WPB meters
    }
    if(attributeArray['Steady']==true){
        if(attributeArray['Unwieldy'] == false && attributeArray['Unbalanced'] == false){attributeArray['Balanced']=true;}
        else {pen=parseInt(pen)+3;}
    }
    if(attributeArray['Potent']==true){
        dmg=parseInt(dmg)+4;
        if(attributeArray['Vengeful']>9){attributeArray['Vengeful']=9;}
    }
    if(attributeArray['SwirlingEnergy']==true){
        dmg=parseInt(dmg)+2;
        pen=parseInt(pen)+2;
        attributeArray['Shocking']=true;
        //dmg type becomes energy
    }
    if(attributeArray['Indestructible']==true){
        dmg=parseInt(dmg)+2;
        pen=parseInt(pen)+2;
    }    
    if(attributeArray['Ramshackle']==true){
        dmg=parseInt(dmg)+4;
        //Double weight
        if(attributeArray['PowerField']==true){attributeArray['PowerField']=false; attributeArray['Shocking']=true}
    }
    if(attributeArray['PeerlessElegance']==true){
        dmg=parseInt(dmg)+2;
        pen=parseInt(pen)+2;
        //Weight/2
        if(attributeArray['Unwieldy'] != false){attributeArray['Unwieldy']=false; attributeArray['Unbalanced']=true;}
        else if(attributeArray['Unbalanced'] != false){attributeArray['Unbalanced']=false;}
        else if(shotsel==8){boundmod=parseInt(boundmod)+5;}
    }
    if(attributeArray['InnovativeDesign']==true){
        dmg=parseInt(dmg)-1;
        //Weight/2
    }
    if(attributeArray['RemnantoftheEndless']==true){
        attributeArray['PowerField']=true;
        pen=parseInt(pen)+2;
        type='E';
    }
    if(attributeArray['DeathsDreamFragment']==true){
        dmg=parseInt(dmg)+2;
    }
    if(attributeArray['Multiplier'] > -1){str=parseInt(str)*attributeArray['Multiplier'];}      
    if(attributeArray['Intangible']==true){str=0;}  
    
    
    //Shot selection modifier adjustment
    if(shotsel==0){
        //If the user selected Standard Attack
        boundmod += 10;
    } else if (shotsel == 1 && ttArray['swiftattack']==true){
        //If the user selected Swift Attack
        boundmod += 0;
    } else if (shotsel == 2 && ttArray['lightningattack']==true && attributeArray['Unwieldy'] == false && attributeArray['Unbalanced'] == false){
        //If the user selected Lightning Attack
        boundmod += -10;
    } else if (shotsel == 3){
        //If the user selected All-Out Attack
        boundmod += 30;
    } else if (shotsel == 4){
        //If the user selected Called Strike
        if(ttArray['precisionkiller']==true){boundmod +=0;}
        if(ttArray['precisionkiller']==false){boundmod +=-20;}
    } else if (shotsel == 5){
        //If the user selected Charge
        boundmod += 20;
    } else if (shotsel == 6){
        //If the user selected Feint
        boundmod += 0;
    } else if (shotsel == 7){
        //If the user selected Stun
        if(ttArray['takedown']==true){boundmod +=0;}
        if(ttArray['takedown']==false){boundmod +=-20;}
    } else if (shotsel == 8 && attributeArray['Unwieldy'] == false){
        //If the user selected Parry
        boundmod += 0;
    } else if (shotsel == 9 && ttArray['disarm']==true){
        //If the user selected Disarm
        boundmod += 0;
    }    else{
        error=true;
        errortext="ERROR: Invalid Combat Action Selection"
    }
   
    
    if(attributeArray['Balanced']==true &&shotsel==8){boundmod = boundmod+10;}
    if(attributeArray['Defensive']==true&&shotsel==8){boundmod = boundmod+15;}
    if(attributeArray['Defensive']==true&&shotsel!=8){boundmod = boundmod-10;}
    if(attributeArray['Unbalanced']==true&&shotsel==8){boundmod = boundmod-10;}
    
    
    //Add the modifier to the fire selection and range bonuses
    boundmod = parseInt(boundmod) + parseInt(modifier);
    
    //Increase for wpn grip
    if(modArray['grip']==true){boundmod = parseInt(boundmod)+5;}
    
    //Adjust +hit based on quality
    if(quality=='poor'){boundmod=parseInt(boundmod)-10;}
    if(quality=='good' ){boundmod=parseInt(boundmod)+5;}
    if(quality=="best"){boundmod=parseInt(boundmod)+10;}
    
    //insert upper and lower bounds for modifiers
    if(boundmod>=60){boundmod=60;}
    else if (boundmod <=-60){boundmod=-60;}
    
    //Sum the Check + bound modifier
    modTarget = parseInt(attribute) + parseInt(boundmod);



    //Calculate Hit/Miss & DoS/DoF
    if(roll <= modTarget) {
        degOfSuc = (Math.floor(modTarget/10) - Math.floor(roll/10)) + 1;
        if(shotsel==8){
            parry=true;
            output = '<span style="color:green">' + token + ' successfully Parries with <B>' + degOfSuc + ' degree(s)</B>.</span> ';
        }
        else if(shotsel==6){output = '<span style="color:green">' + token + ' feints with <B>' + degOfSuc + ' degree(s)</B>.</span> ';} 
        else if(shotsel==7){
            hit=true;
            damage=false;
            output = '<span style="color:green">' + token + ' hits with <B>' + degOfSuc + ' degree(s)</B>.</span> ';
        }
        else{
            hit=true;
            damage=true;
            output = '<span style="color:green">' + token + ' hits with <B>' + degOfSuc + ' degree(s)</B>.</span> ';
        }
    } else if(roll > modTarget){
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output = '<span style="color:red">' + token + ' fails by <B>' + degOfSuc + ' degree(s)</B></span>. ';
        hit=false;
    }else{
        error=true;
        errortext="ERROR: Failed DoS Calculation"
    }

    //adjust for the "roll 100" edge case
    if(roll==100){
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output = '<span style="color:red">' + token + ' fails automatically by <B>' + degOfSuc + ' degree(s)</B></span>. ';
        hit=false;
    }


    //Adding DoS from weapon attributes/qualities/whatever
    if(attributeArray['IncalculablePrecision']==true && hit==true){
        degOfSuc=parseInt(degOfSuc)+2;
    }
    if(attributeArray['Patient']==true && hit==true){
        degOfSuc=parseInt(degOfSuc)+1;
    }
    if(attributeArray['Unpredictible']==true && hit==true){
        degOfSuc=parseInt(degOfSuc)+1;
    } 
    if(attributeArray['Unpredictible']==true && hit==false){
        degOfSuc=parseInt(degOfSuc)-2;
    }  


    //Determine # of damage rolls required
    swiftcalc = Math.floor((degOfSuc -1)/2)+1;
    if( (shotsel == 0 || shotsel==3 || shotsel==4 || shotsel==5)&& hit==true && error==false) {
        //If the user selected Standard Attack (or others) and hits
        numhits = 1;     
    } else if ( shotsel==1  && hit==true && error==false){
        //If the user selected Swift Attack and hit
        numhits = swiftcalc;     
    } else if ( shotsel==2 && hit==true && error==false){
        //If the user selected Lightning Attack and hit
        numhits=degOfSuc;     
    } else if ( (shotsel==6||shotsel==7||shotsel==8) && error==false){
        //If the user selected Stun, Parry, of Feint
        numhits=0;     
    } else if (error==false){
        //If the user missed
        numhits=0;     
    }else{
            error=true;
            errortext="ERROR: INVALID COMBAT MODE (Numhits)";
            numhits=0;
    }


    //Determine Initial Hit Location
    temp = Math.floor(roll/10); //Store 10s place
    temp2 = roll - temp*10;     //Store 1s place
    temp = temp2*10+temp;       //swap 10s and 1s place
    if(shotsel==4)                   {var hitloc = ["chosen location", "chosen location", "chosen location"];}
    else if(temp <= 10)              {var hitloc = ["Head","Head","Left Arm","Body","Right Arm","Body","Body","Body","Body","Body"];} 
    else if(10 < temp && temp <= 20) {var hitloc = ["Right Arm","Right Arm","Body","Head","Body","Left Arm","Left Arm","Left Arm","Left Arm","Left Arm"];} 
    else if(20 < temp && temp <= 30) {var hitloc = ["Left Arm","Left Arm","Body","Head","Body","Right Arm","Right Arm","Right Arm","Right Arm","Right Arm"];} 
    else if(30 < temp && temp <= 70) {var hitloc = ["Body","Body","Right Arm","Head","Left Arm","Body","Body","Body","Body","Body"];} 
    else if(70 < temp && temp <= 85) {var hitloc = ["Right Leg","Right Leg","Body","Right Arm","Head","Body","Body","Body","Body","Body"];} 
    else if(85 < temp && temp <= 100){var hitloc = ["Left Leg","Left Leg","Body","Left Arm","Head","Body","Body","Body","Body","Body"];} 
    else{
        error=true;
        errortext="ERROR: BAD HIT LOCATION";
    }


    //If Lance or RazorSharp:
    if(attributeArray['Lance'] == true) { pen=parseInt(pen)*degOfSuc;}
    if(attributeArray['RazorSharp'] == true && degOfSuc>=3)    {pen =parseInt(pen)*2;}
    //Increase damage for weapons with the Force quality and a Psy rating
    if(attributeArray['Force']==true&&psy>0){
        dmg=parseInt(dmg)+parseInt(psy);
        pen=parseInt(pen)+parseInt(psy);
    }
    //If 'Tearing':
    if(attributeArray['Tearing']==true){numdice=parseInt(numdice)+1;}
    //Increase dmg for best-quality weapons
    if(quality=="best"){dmg=parseInt(dmg)+1;}
    //Add strength to melee damage
    dmg=parseInt(dmg)+parseInt(str);
    //Add damage for Crushing Blow talent
    if(ttArray['crushingblow']==true){
        temp=Math.floor(attribute/10);
        temp=Math.ceil(temp/2);
        dmg=parseInt(dmg)+parseInt(temp);
    }
    //Hammer Blow talent
    if(ttArray['hammerblow']==true && shotsel==3){
        temp=Math.ceil(str/2);
        dmg=parseInt(dmg)+parseInt(temp);
        if(attributeArray['Concussive']<2){attributeArray['Concussive']=2;}
    }
    
    //Increase damage by a multiple of the degrees of success
    if(attributeArray['Precision'] > 1){dmg=parseInt(dmg)+parseInt(attributeArray['Precision'])*parseInt(degOfSuc);}
    
    
    if(attributeArray['Tearing']==true){dmgsubstring=parseInt(numdice)+"d"+parseInt(dice)+"d1cs>"+(parseInt(attributeArray['Vengeful']))+"cf0+"+parseInt(dmg)+" ]] <B> Pen "+parseInt(pen)+" </B>";}
    else {dmgsubstring=parseInt(numdice)+"d"+parseInt(dice)+"cs>"+(parseInt(attributeArray['Vengeful']))+"cf0+"+parseInt(dmg)+" ]] <B> Pen "+parseInt(pen)+" </B>";}
    
    
    
    
    //dmgsubstring=parseInt(numdice)+"d"+parseInt(dice)+"cs>"+(parseInt(attributeArray['Vengeful']))+"cf0+"+parseInt(dmg)+" ]] <B> Pen "+parseInt(pen)+" </B>";
 
    for(i=1; i <=numhits; i++){
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
        
        //add hitloc string
        dmgendstring="to the "+hitloc[i];
        
        dmgstring = dmgstring+ " --Damage: *"+i+"|[[ [$Dmg"+i+"] "+dmgsubstring+dmgendstring;
        
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

        //check for 'Corrosive' Quality
        if(attributeArray['Corrosive']==true){
                dmgstring = dmgstring  + " --!^1Corrosive: *"+i+"| [[ [$Cor"+i+"] [NH] 1d10 ]] dmg to "+hitloc[i]+" Armor ";
        }
    }
    
    //Apply descriptions for the special combat modes
    if(shotsel==3){
        qualstring = qualstring  + " --AllOutAtk: | This is a standard attack at +20, after which the user cannot use Evasion reactions until the start of his next turn";
    } else if(shotsel==4){
        qualstring = qualstring  + " --CalledStrike: | Hard (-20) WS test that allows the attacker to select a hit location";
    } else if(shotsel==5){
        qualstring = qualstring  + " --Charge: | The target must be at least four metres away, but still within the attacker’s Charge Move. The last four metres of the Charge must be in a straight line. Grants +20WS. If the Charging character has no weapons or other items currently readied, he can attemptto Grapple his opponent (or knock him down) instead of inflicting damage.";
    } else if(shotsel==6){
        qualstring = qualstring  + " --Feint: | The character and his target make an Opposed Weapon Skill test. If the character wins, his next melee Standard Attack action against that same target during this turncannot be Evaded. If the character’s next action is any other action, the advantage of Feinting is lost.";
    } else if(shotsel==7){
        qualstring = qualstring  + " --Stun: | Hard (–20) Weapon Skill test. If successful, [[ [$Stn] 1d10+"+str+"]] is compared to the target’s total of his Toughness bonus +1 per Armour point protecting his head. If the attacker’s roll is equal to or higher than this value, the target is Stunned for a number of rounds equal to the difference between the two values and gains one level of Fatigue.";
    } else if(shotsel==9){
        qualstring = qualstring  + " --Disarm: | Opposed Weapon Skill test. If successful, the enemy drops his weapon to the ground. If >2 DoS, the character can take the enemy's weapon.";
    }
 
    //Check for Balanced quality
    if(attributeArray['Balanced'] ==true && shotsel!=8){
        qualstring = qualstring  + " --Balanced: | This weapon grants an additional +10 to WS when Parrying";
    }
    if(attributeArray['Balanced'] ==true && shotsel==8){
        qualstring = qualstring  + " --Balanced: | This weapon is granting an additional +10 to WS while Parrying";
    }
    //Check for Concussive quality
    if(attributeArray['Concussive'] != -1 && hit==true){
        qualstring = qualstring  + " --Concussive: | Target(s) must make "+parseInt(numhits)+" Toughness test(s) at  -"+(10*attributeArray['Concussive'])+". If failed, the target is Stunned for 1 round per DoF";  
    }
    //Check for 'Corrosive' quality
    if(attributeArray['Corrosive']== true && hit==true){
        qualstring = qualstring  + " --Corrosive: *0| Armor damage is cumulative and permanent. Any damage done to Armor that reduces it below 0 AP (or if the target has no armor at that location) is dealt to the target directly, bypassing Toughness";  
    }
    //Check for Crippling quality
    if(attributeArray['Crippling'] != -1 && damage==true){
        qualstring = qualstring  + " --Crippled: |[+Crippled] If Target takes at least 1 wound from this wpn he is considered Crippled until end of the encounter or healed fully. If a Crippled character takes more than a half action on his turn, he suffers "+attributeArray['Crippling']+" Rending damage, not reduced by A or T.";  
    } 
    //Check for Defensive quality
    if(attributeArray['Defensive'] ==true && hit==true && shotsel!=8){
        qualstring = qualstring  + " --Defensive: | This weapon grants an additional +15 to WS when Parrying, but is reducing WS by 10 while attacking";
    }
    if(attributeArray['Defensive'] ==true && hit==true && shotsel==8){
        qualstring = qualstring  + " --Balanced: | This weapon is granting an additional +15 to WS while Parrying, but reduces WS by 10 when attacking";
    }
    //Check for Felling quality
    if(attributeArray['Felling'] != -1 && damage==true ){
        qualstring = qualstring  + " --Felling: | Target reduces their Unnatural Toughness by "+attributeArray['Felling']+" ";
    }
    //Check for Flame quality
    if(attributeArray['Flame'] == true && hit==true){
        qualstring = qualstring  + " --Flame: | [+Fire] Target(s) hit must make an Agility test or be set on Fire ";
    }
    //Check for Flexible quality
    if(attributeArray['Flexible']==true){
        qualstring = qualstring  + " --Flexible: | This weapon cannot be Parried; it can be used to Parry, however";
    } 
    //Check for Force quality
    if(attributeArray['Force']==true && psy>0 && damage==true){
        qualstring = qualstring  + " --Force: | In the hands of a psyker, this weapon deals additional damage based on Psy Rating and the damage type changes to E. In addition, whenever a psyker damages an opponent, he may take a Focus Power action (Opposed with Willpower) as a HA. Winning deals 1d10 E dmg per DoS, ignoring A/T. Force weapons cannot be destroyed with the Power Field quality.";
    }
    //Check for Graviton quality
    if(attributeArray['Graviton'] == true && damage==true){
        qualstring = qualstring  + " --Graviton: | Target takes additional damage on every hit equal to his Armor Bonus ";
    }
    //check for 'Hallucinogenic' Quality
    if(attributeArray['Hallucinogenic'] !=-1 && hit==true){
        qualstring = qualstring  + " --Hallucinogenic: | [+Hallucinating] Target(s) hit must make Toughness tests at "+parseInt(-10*attributeArray['Hallucinogenic'])+" or else suffer this temporary delusion: ^^[[ [TXT] [$Tbl] 1t[hallucinogenic] ]] The effects last for 1 round, +1 per DoF.";
    }
    //check for 'Haywire' Quality
    if(attributeArray['Haywire']!=-1 && hit==true){
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
    //Check for Lance quality
    if(attributeArray['Lance'] == true && damage==true){
        qualstring = qualstring  + " --Lance: | Penetration is increased for every DoS";
    }
    //Check for Power Field quality
    if(attributeArray['PowerField'] == true && shotsel==8 && parry==true){
        dmgstring = dmgstring  + " --PowerField: | When successfully parrying, you have a chance of breaking the opponent's weapon (as long as it lacks the Power Field, Natural Weapon, or Warp Weapon qualities): [[ [$pwf] 1d100cs>26 ]]";
        dmgstring = dmgstring  + " --??  $pwf > 25 ??  !^pfs: | You Parry the opponent's weapon and shatter it!";
        dmgstring = dmgstring  + " --??  $pwf < 26 ?? !^pfm: | You Parry the opponent's weapon but fail to shatter it!";
    }
    if(attributeArray['PowerField'] == true && shotsel==8 && parry==false){
        dmgstring = dmgstring  + " --PowerField: | If you successfully Parry, you have a chance of breaking the opponent's weapon (as long as it lacks the Power Field, Natural Weapon, or Warp Weapon qualities)";
    }
    //Check for 'Primitive' quality
    if(attributeArray['Primitive'] != -1 && damage==true){
        qualstring = qualstring  + " --Primitive: | Any die result greater than"+attributeArray['Primitive']+" is counted as "+attributeArray['Primitive']+". Righteous Fury may still trigger as usual.";
    }
    //Check for 'Proven' quality
    if(attributeArray['Proven'] != -1 && damage==true){
        qualstring = qualstring  + " --Proven: | Any die result less than"+attributeArray['Proven']+" is counted as "+attributeArray['Proven'];
    }
    //Check for 'RazorSharp' quality
    if(attributeArray['RazorSharp'] == true && damage==true ){
        qualstring = qualstring  + " --Razor Sharp: | Penetration is doubled for 3+ DoS";
    }
    //Check for 'Recharge' quality
    if(attributeArray['Recharge'] == true){
        qualstring = qualstring  + " --Recharge: | When used to attack, this weapon cannot attack again until the end of the next round";
    }
    //Check for 'Sanctified' quality
    if(attributeArray['Sanctified'] == true){
        qualstring = qualstring  + " --Sanctified: | Any damage inflicted by this weapon counts as Holy, which can have unique effects against Daemons";
    }
    //Check for Shocking quality
    if(attributeArray['Shocking']==true && damage==true ){
        qualstring = qualstring  + " --Shocking: | A target that takes at least 1 point of damage from this weapon (after A/T) must make a Challenging Toughness Test. If failed, the target gains 1 Fatigue and is Stunned for 1 round per 2 DoF (rounding up)";  
    }
    //Check for Snare quality
    if(attributeArray['Snare'] != -1 && hit==true){
        qualstring = qualstring  + " --Snare: | [+Helpless] Target(s) hit must make an Agility test at "+parseInt(-10*attributeArray['Snare'])+" or be Immobilized. An Immobilized target can attempt no actions other than escape; as a FuA he can make a Challenging Str test at "+parseInt(-10*attributeArray['Snare'])+". If he succeeds, he bursts free. The target is considered Helpless until he escapes.";  
    }
    //Check for Tearing quality
    if(attributeArray['Tearing']==true && hit==true){
        qualstring = qualstring  + " --Tearing: | This weapon rolls one extra die for damage, and the lowest roll is discarded"; 
    }
    //Check for Toxic quality
    if(attributeArray['Toxic'] != -1 && damage==true){
        qualstring = qualstring  + " --Toxic: | Target(s) who take damage (after A/T) must make a Toughness test at "+parseInt(-10*attributeArray['Toxic'])+" or suffer [[ [$Tox] 1d10 ]] additional damage, ignoring A/T. Some Toxins have additional effects.";  
    }
    //Check for 'Unbalanced' quality
    if(attributeArray['Unbalanced'] == true){
        qualstring = qualstring  + " --Unbalanced: | This weapon cannot be used to Lightning Attack and suffers a -10 to Parry";
    }
    //Check for 'Unwieldy' quality
    if(attributeArray['Unwieldy'] == true){
        qualstring = qualstring  + " --Unwieldy: | This weapon cannot be used to Lightning Attack or Parry";
    }
    //Check for 'Vengeful' quality
    if(attributeArray['Vengeful'] != 10 && damage==true){
        qualstring = qualstring  + " --Vengeful: | Any die result greater than"+attributeArray['Vengeful']+" triggers Righteous Fury";
    }
    //Check for 'Voidchill' daemon quality
    if(attributeArray['Voidchill'] ==true && hit==true){
        qualstring = qualstring  + " --Voidchill: | Each time the wpn inflicts a hit, the target suffers [[ [$Voidchill] 1d10 ]] Toughness dmg";
    }
    //Check for 'Howling' daemon quality
    if(attributeArray['Howling'] ==true ){
        qualstring = qualstring  + " --Howling: | When this weapon is drawn bearer gains Fear(1) or increases their Fear rtg by 1";
    }
    //Check for 'Wounding' daemon quality
    if(attributeArray['Wounding'] > -1 && damage==true){
        qualstring = qualstring  + " --Wounding: | This weapon gained Crippling equal to daemon's WPB";
    }
    //Check for 'Vicious' daemon quality
    if(attributeArray['Vicious'] ==true && damage==true){
        qualstring = qualstring  + " --Vicious: | This weapon gains the Tearing quality. If it already has tearing it gains RazorSharp";
    }
    //Check for 'Accursed' daemon quality
    if(attributeArray['Accursed'] ==true && damage==true){
        qualstring = qualstring  + " --Accursed: | This weapon gained +1d10 damage and the Felling(4) quality";
    }
    //Check for 'Bloodlust' daemon quality
    if(attributeArray['Bloodlust'] ==true){
        qualstring = qualstring  + " --Bloodlust: | Test WP+0 when drawing or become Frenzied as a FrA";
    }
    //Check for 'Thirsting' daemon quality
    if(attributeArray['Thirsting'] ==true && hit==true){
        qualstring = qualstring  + " --Thirsting: | Each time the wpn inflicts a hit the target suffers 1 Fatigue";
    }
    //Check for 'Null' daemon quality
    if(attributeArray['Null'] ==true ){
        qualstring = qualstring  + " --Null: | Psychic powers targeting the wielder suffer -20 to the FP test";
    }
    //Check for 'Fury' daemon quality
    if(attributeArray['Fury'] ==true ){
        qualstring = qualstring  + " --Fury: | Grants +10 to hit";
    }
    //Check for 'Skulltaker' daemon quality
    if(attributeArray['Skulltaker'] ==true && shotsel==4){
        qualstring = qualstring  + " --Skulltaker: | Called Shots vs head are done as a HA with a difficulty of +0 (NOT APPLIED). All CS gain Vengeful(8).";
    }
    //Check for 'Illusory' daemon quality
    if(attributeArray['Illusory'] ==true && hit==true){
        qualstring = qualstring  + " --Illusory: | Appears as normal wpn of type unless Awareness-20 passed. Imposes -10 on all Evasion tests vs wpn.";
    }
    //Check for 'Mind Eater' daemon quality
    if(attributeArray['MindEater'] ==true && damage==true){
        qualstring = qualstring  + " --MindEater: | Instead of dealing damage, target suffers Int and Per dmg equal to half of the given dmg value (rounded up)";
    }
    //Check for 'Spellbound' daemon quality
    if(attributeArray['Spellbound'] ==true){
        qualstring = qualstring  + " --Spellbound: | This weapon gives the wielder 1 specific psychic power chosen at wpn creation. Manifested using Daemon's stats, with a -10 to FP test = to every 100xp power cost after first 100.";
    }
    //Check for 'Warp Flame' daemon quality
    if(attributeArray['Warpflame'] ==true){
        qualstring = qualstring  + " --WarpFlame: | Wpn gained Flame and Warp Weapon qualities";
    }
    //Check for 'SorcerousForce' daemon quality
    if(attributeArray['SorcerousForce'] > -1 && damage==true){
        qualstring = qualstring  + " --SorcerousForce: | Gains Force quality activated using Daemon's stats";
    }
    //Check for 'Bile-Quenched' daemon quality
    if(attributeArray['Bile-Quenched'] ==true && damage==true){
        qualstring = qualstring  + " --Bile-Quenched: | Creature wounded by this wpn loses 1 HA next turn. Creatures w/ From Beyond, Daemonic, & Machine are immune.";
    }
    //Check for 'Enfeebling' daemon quality
    if(attributeArray['Enfeebling'] ==true && damage==true){
        qualstring = qualstring  + " --Enfeebling: | Each time the wpn inflicts a hit that causes dmg, the target suffers [[ [$Enfeebling] 1d10 ]] Strength dmg";
    }
    //Check for 'PlagueCarrier' daemon quality
    if(attributeArray['PlagueCarrier'] ==true && hit==true){
        qualstring = qualstring  + " --PlagueCarrier: | Each time this wpn inflicts a hit it infects the target for 7 rounds. Infected targets test T+0 at turn start or take 2d10 Impact dmg ignoring A/T. Any living creature they touch is also infected for 7 rounds. Wpn bearer is immune.";
    }
    //Check for 'StreamofCorruption' daemon quality
    if(attributeArray['StreamofCorruption'] > -1){
        qualstring = qualstring  + " --StreamofCorruption: | Can also be fired as Basic wpn w/ rng: 30m, 2d10+Daemon's WPB Impact dmg w/ Felling(2), Corrosive, Spray, and Toxic(3) qualities";
    }
    //Check for 'Pestilent Stench' daemon quality
    if(attributeArray['PestilentStench'] ==true){
        qualstring = qualstring  + " --PestilentStench: | When drawn all creatures within Daemon's WPB except wielder and Nurgle followers suffer -10 to WS/BS/A/I/P tests";
    }
    //Check for 'Envenomed' daemon quality
    if(attributeArray['Envenomed'] > -1){
        qualstring = qualstring  + " --Envenomed: | Wpn gained Toxic(X) equal to half Daemon's WPB";
    }
    //Check for 'Lashing' daemon quality
    if(attributeArray['Lashing'] > -1){
        qualstring = qualstring  + " --Lashing: | Wpn gained Flexible and a range equal to half the Daemon's WPB";
    }
    //Check for 'Swiftness' daemon quality
    if(attributeArray['Swiftness'] > -1 ){
        qualstring = qualstring  + " --Swiftness: | When drawn grants Unnatural Agi(X) equal to half Daemon's WPB";
    }
    //Check for 'Sophorific Musk' daemon quality
    if(attributeArray['SophorificMusk'] > -1){
        qualstring = qualstring  + " --SophorificMusk: | When drawn, all creatures except the wielder within Daemon's WPB in meters suffers -20 on Per and Agi tests";
    }
    //Check for 'Entrancing Aura' daemon quality
    if(attributeArray['EntrancingAura'] ==true){
        qualstring = qualstring  + " --EntrancingAura: | Bearer can make the Feint action as a Free Action";
    }
    //Check for 'Vulgar' daemon quality
    if(attributeArray['Vulgar'] ==true){
        qualstring = qualstring  + " --Vulgar: | Whenever party loses subtlety it loses 1d5 more";
    }
    //Check for 'Jealous' daemon quality
    if(attributeArray['Jealous'] ==true){
        qualstring = qualstring  + " --Jealous: | Using another weapon removes all daemon attributes from this one until end of encounter";
    }
    //Check for 'Prideful' daemon quality
    if(attributeArray['Prideful'] ==true){
        qualstring = qualstring  + " --Prideful: | Cannot be used to Parry";
    }    
    //Check for 'Vindictive' daemon quality
    if(attributeArray['Vindictive'] ==true){
        qualstring = qualstring  + " --Vindictive: | Whenever the user fails an atk with this wpn he suffers 1 Rending dmg ignoring A/T";
    }
    //Check for 'Overbearing' daemon quality
    if(attributeArray['Overbearing'] ==true){
        qualstring = qualstring  + " --Overbearing: | Whenever user would gain insanity they gain +1 Insanity";
    }
    //Check for 'Imposing' SoI quality
    if(attributeArray['Imposing'] ==true){
        qualstring = qualstring  + " --Imposing: | Grants +10 to Intimidate and gives Fear(1) or increases Fear rtg by 1";
    }
    //Check for 'Compact' SoI quality
    if(attributeArray['Compact'] ==true){
        qualstring = qualstring  + " --Compact: | Reduce weight by half. Searches for wpn suffer -20.";
    }
    //Check for 'Steady' SoI quality
    if(attributeArray['Steady'] ==true){
        qualstring = qualstring  + " --Steady: | Wpn gained Balanced if not Unwieldy/Unbalanced, otherwise Pen+3";
    }
    //Check for 'Potent' SoI quality
    if(attributeArray['Potent'] ==true){
        qualstring = qualstring  + " --Potent: | Gained dmg+4 and Vengeful(9)";
    }
    //Check for 'SwirlingEnergy' SoI quality
    if(attributeArray['SwirlingEnergy'] ==true){
        qualstring = qualstring  + " --SwirlingEnergy: | Wpn gained dmg+2 and pen+2. Dmg type is E and gained Shocking.";
    }
    //Check for 'IncalculablePrecision' SoI quality
    if(attributeArray['IncalculablePrecision'] ==true){
        qualstring = qualstring  + " --IncalculablePrecision: | Gained range x2 and two bonus DoS on hit";
    }
    //Check for 'Indestructible' SoI quality
    if(attributeArray['Indestructible'] ==true){
        qualstring = qualstring  + " --Indestructible: | Gained dmg+2 and pen+2. Never jams. Resists all attempts to destroy or dmg by natural means.";
    }
    //Check for 'Ramshackle' SoI quality
    if(attributeArray['Ramshackle'] ==true){
        qualstring = qualstring  + " --Ramshackle: | Wpn gained dmg+4, loses Balanced, PowerField degrades to Shocking";
    }
    //Check for 'PeerlessElegance' SoI quality
    if(attributeArray['PeerlessElegance'] ==true){
        qualstring = qualstring  + " --PeerlessElegance: | Improves Unwieldy to Unbalanced, Unbalanced to neutral, and a reg wpn to +5 Parry";
    }
    //Check for 'InnovativeDesign' SoI quality
    if(attributeArray['InnovativeDesign'] ==true){
        qualstring = qualstring  + " --InnovativeDesign: | Weight/2, Damage-1";
    }
    //Check for 'RemnantoftheEndless' SoI quality
    if(attributeArray['RemnantoftheEndless'] ==true){
        qualstring = qualstring  + " --RemnantoftheEndless: | Dmg type becomes E. Gains PowerField, Pen+2, and ignores Fields/psychic protection on 3+ DoS";
    }
    //Check for 'DeathsDreamFragment' SoI quality
    if(attributeArray['DeathsDreamFragment'] ==true){
        qualstring = qualstring  + " --DeathsDreamFragment: |  Damage & Pen +2. Psykers increase PR+2 when Pushing (max 10).";
    }
    //Check for 'Surly' SoI quality
    if(attributeArray['Surly'] ==true){
        qualstring = qualstring  + " --Surly: | Wpn stops working when 96+ is rolled when using wpn for several moments. Owner gains Init+2.";
    }
    //Check for 'Cruel' SoI quality
    if(attributeArray['Cruel'] ==true){
        qualstring = qualstring  + " --Cruel: | Once per game session wpn bearer can reroll 1 dmg roll.";
    }
    //Check for 'Patient' SoI quality
    if(attributeArray['Patient'] ==true){
        qualstring = qualstring  + " --Patient: | Imposes -3 on Initiative. Adds +1 DoS on successful atks.";
    }
    //Check for 'Unpredictible' SoI quality
    if(attributeArray['Unpredictible'] ==true){
        qualstring = qualstring  + " --Unpredictible: | Gain +1 DoS on successful atk, but -2 DoS on failed atk";
    }
    //Check for 'Resplendent' SoI quality
    if(attributeArray['Resplendent'] ==true){
        qualstring = qualstring  + " --Resplendent: | Owner gains +5 Charm/Intimidate. Searches for this wpn gain +30.";
    }
    //Check for 'Vanishing' SoI quality
    if(attributeArray['Vanishing'] ==true){
        qualstring = qualstring  + " --Vanishing: | Searches for this wpn suffer -10.";
    }
    //Check for 'TRusty' SoI quality
    if(attributeArray['Trusty'] ==true){
        qualstring = qualstring  + " --Trusty: | Once per Game Session bearer can add +10 to a test with this wpn before rolling";
    }
    //Check for 'Zealous' SoI quality
    if(attributeArray['Zealous'] ==true){
        qualstring = qualstring  + " --Zealous: | Atks can never suffer circumstantial penalties more than -30 or circumstantial buffs more than +30.";
    }
    //Check for 'Dogged' SoI quality
    if(attributeArray['Dogged'] ==true){
        qualstring = qualstring  + " --Dogged: | This weapon always finds its way back to its owner";
    }
    //Check for 'Lucky' SoI quality
    if(attributeArray['Lucky'] ==true){
        qualstring = qualstring  + " --Lucky: | While the owner is in contact with this wpn he has one extra FP he can spend but not burn.";
    }
    //Check for 'Thrown' custom quality
    if(attributeArray['Thrown'] ==true){
        qualstring = qualstring  + " --Thrown: | This weapon is being thrown or something";
    }
    //Check for 'Multipler' custom quality
    if(attributeArray['Multiplier'] > -1){
        qualstring = qualstring  + " --Multiplier: | This weapon multiplies the bearer's attribute bonus by "+attributeArray['Multiplier'];
    }    
    //Check for 'Weighty' custom quality
    if(attributeArray['Weighty'] > -1){
        qualstring = qualstring  + " --Weighty: | This weapon requires a Strength Bonus of "+attributeArray['Multiplier']+" to use";
    }  
    //Check for 'Precision' custom quality
    if(attributeArray['Precision'] > -1){
        qualstring = qualstring  + " --Precision: | This weapon deals additional damage equal to "+attributeArray['Precision']+" times the bearer's DoS";
    }      
    //Check for 'Intangible' custom quality
    if(attributeArray['Intangible'] ==true){
        qualstring = qualstring  + " --Intangible: | This weapon does not add attribute bonuses to its damage";
    }
    
    
    //Check for 'Warp Weapons' trait
    if(ttArray['WarpWeapons'] ==true){
        qualstring = qualstring  + " --WarpWeapons: | Attacks from this weapon ignore non-warded armor. Fields function normally.";
    }

    //Add talent descriptions
    talstring = " --Applicable Talents: | ";
    //Assassin Strike
    if(ttArray['assassinstrike']==true && hit==true){
        talstring = talstring  + "AssassinStrike(Acrobatics to move after Atk), ";  
    }
    //Battlerage
    if(ttArray['battlerage']==true && shotsel==8){
        talstring = talstring  + "BattleRage(parry while frenzied), ";  
    }
    //Blademaster
    if(ttArray['blademaster']==true && hit==false){
        talstring = talstring  + "Blademaster(reroll miss w/ blades), ";  
    }
    //BlindFighting
    if(ttArray['blindfighting']==true){
        talstring = talstring  + "BlindFighting(no penalty obscured vision in melee), ";  
    }
    //Brutal Charge
    if(ttArray['brutalcharge']==true && shotsel==5 && hit==true){
        talstring = talstring  + "BrutalCharge(+dmg charge NOT IMPLEMENTED), ";  
    }
    //CounterAttack
    if(ttArray['counterattack']==true && shotsel==8 && parry==true){
        talstring = talstring  + "CounterAttack(Std Atk -20 WS after parry), ";  
    }
    //Crushing Blow
    if(ttArray['crushingblow']==true && hit==true){
        talstring = talstring  + "CrushingBlow(+dmg WS/2), ";  
    }
    //Deathdealer
    if(ttArray['deathdealer']==true && hit==true){
        talstring = talstring  + "Deathdealer(+PB crit dmg), ";  
    }
    //Devastating Assault
    if(ttArray['devastatingassault']==true && hit==true && shotsel==3){
        talstring = talstring  + "DevastatingAtk(free second AOA), ";  
    }
    //Double Team
    if(ttArray['doubleteam']==true){
        talstring = talstring  + "DoubleTeam(+hit for Ganging Up), ";  
    }
    //Eye of Vengeance
    if(ttArray['eyeofvengeance']==true){
        talstring = talstring  + "EyeofVengeance(FP adds "+degOfSuc+" +dmg/pen), ";  
    }
    //Frenzy
    if(ttArray['frenzy']==true){
        talstring = talstring  + "Frenzy(can enter frenzy as FuA), ";  
    }
    //Hammer Blow   
    if(ttArray['hammerblow']==true && shotsel==3){
        talstring = talstring  + "Hammerblow(+SB/2 & Conc(2) on AOA), ";  
    }
    //Hatred
    if(ttArray['hatred']==true){
        talstring = talstring  + "Hatred(+10WS vs foe), ";  
    }
    //Inescapable attack
    if(ttArray['inescapableattack']==true && (shotsel==0||shotsel==3||shotsel==4||shotsel==5||shotsel==7) && hit==true){
        talstring = talstring  + "InescapableAtk("+(-10*parseInt(degOfSuc))+" penalty on evasion), ";  
    }
    //Killing Strike
    if(ttArray['killingstrike']==true){
        talstring = talstring  + "KillingStrike(spend FP before atk to prevent evasion), ";  
    }
    //Lightning Attack
    if(ttArray['lightningattack']==true && attributeArray['Unwieldy']!=true && attributeArray['Unbalanced']!=true){
        talstring = talstring  + "LightningAtk(Atk option), ";  
    }
    //Nowhere to Hide
    if(ttArray['nowheretohide']==true && hit==true){
        talstring = talstring  + "NowhereToHide(cover armor reduction), ";  
    }
    //Precision Killer
    if(ttArray['precisionkiller']==true && shotsel==4){
        talstring = talstring  + "Precision(no penalty Called Shot), ";  
    }
    //Preternatural Speed
    if(ttArray['preternaturalspeed']==true && shotsel==5){
        talstring = talstring  + "PreternaturalSpeed(2x move on Charge), ";  
    }
    //Swift Attack
    if(ttArray['swiftattack']==true){
        talstring = talstring  + "SwiftAtk(Atk option), ";  
    }
    //Takedown
    if(ttArray['takedown']==true && (shotsel==0||shotsel==5) ){
        talstring = talstring  + "Takedown(Std/Chrg Atk variant), ";  
    }
    //Thunder Charge
    if(ttArray['thundercharge']==true && shotsel==5 ){
        talstring = talstring  + "Thundercharge(push enemies aside on Charge), ";  
    }
    //Whirlwind of Death
    if(ttArray['whirlwindofdeath']==true){
        talstring = talstring  + "WhirlwindofDeath(Std Atk against all enemies in reach), ";  
    }

    //Add the ammo and mod descriptions
    ammomodstring = " --Ammo & Mods: |"; 
    //Add modification info
    //Custom Grip
    if(modArray['grip']==true){
        ammomodstring = ammomodstring  + "CustomGrip{any}(BS+5 or WS+5; other characters -5), ";  
    }
    //Deactivated Safety Features
    if(modArray['deactivated']==true){
        ammomodstring = ammomodstring  + "DeactivatedSafetyFeatures{any}(when rdying this wpn can rdy another as part of same action; wpn activates with 4+ DoF on movement test), ";  
    }
    //Exterminator
    if(modArray['exterminator']==true){
        ammomodstring = ammomodstring  + "Exterminator{anyExcept: pistol/thrown}(1/use HA to do std flamer atk), ";  
    }
    //Mono
    if(modArray['mono']==true){
        ammomodstring = ammomodstring  + "Mono{LT/Pwr:melee}(loses Primitive; Pen+2 when PF off), ";  
    }
    //Reinforced
    if(modArray['reinforced']==true){
        ammomodstring = ammomodstring  + "Reinforced{any}(weight*1.2; ranged +1 dmg as improvised melee--NOT INCLUDED; melee dest on 41+ vs PF), ";  
    }
    //Sacred Inscriptions
    if(modArray['sacred']==true){
        ammomodstring = ammomodstring  + "SacredInscriptions{any}(+10 vs Pinning), ";  
    }
    //Tox Dispenser
    if(modArray['tox']==true){
        ammomodstring = ammomodstring  + "ToxDispenser{LT/Chain:melee}(FrA to gain Toxic(2) for 1 round; 10 charges), ";  
    }
    //Truesilver Gilding
    if(modArray['truesilver']==true){
        ammomodstring = ammomodstring  + "TruesilverGilding{LT melee}(gains +WS to Parry vs Daemons = to 5x owners WPB), ";  
    } 


    //Set the text output sub-headings
    if(shotsel==0){temp="Standard Attack";}
    else if(shotsel==1){temp="Swift Attack";}
    else if(shotsel==2){temp="Lightning Attack";}
    else if(shotsel==3){temp="All-Out Attack";}
    else if(shotsel==4){temp="Called Strike";}
    else if(shotsel==5){temp="Charge";}
    else if(shotsel==6){temp="Feint";}
    else if(shotsel==7){temp="Stun";}
    else if(shotsel==8){temp="Parry";}
    else if(shotsel==9){temp="Counterattack";}
    temp2=wpnname;
    cur=" --Roll:| [! "+roll+" !] vs [! "+modTarget+" !] --Result:|"+output;
    
    
    effects=" --Effects:| "+effects;
    
    
    //Return output
    if(error==true){
      output = errortext; 
    }
    else {
        output ="!power {{--format|melee --titlefontshadow|none --name|"+token+" --leftsub| "+wpnname+"  --rightsub| "+temp+cur+dmgstring+qualstring+talstring+ammomodstring+effects+" }}";
        //output ="!power {{--format|melee --titlefontshadow|none --name|"+attributeArray['Crippling']+" --leftsub| "+mod2+"  --rightsub| "+mod3+cur+dmgstring+qualstring+talstring+ammomodstring+" }}";
    }
    msg.content=output;
    msg.who = msg.who.replace(" (GM)", "");
    msg.content = msg.content.replace(/<br\/>\n/g, ' ').replace(/({{(.*?)}})/g, " $2 ");
    PowerCard.Process(msg, player_obj);
    return 0;
}
