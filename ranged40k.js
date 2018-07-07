/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria.
 * 
 * The following commands is used:
 * !ranged40k   
**/

var ranged40kNamespace = ranged40kNamespace || {};

ranged40kNamespace.rollResult = function(token, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type, ammo, mod1, mod2, mod3, effects, wpncat, msg) {
    if (typeof token === 'undefined' || typeof single != 'string' )                         token       = 'generic';
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
    if (typeof type === 'undefined' )                                                       type        = 'unk';
    if (typeof ammo === 'undefined' )                                                       ammo        = null;
    if (typeof mod1 === 'undefined' )                                                       mod1        = null;
    if (typeof mod2 === 'undefined' )                                                       mod2        = null;
    if (typeof mod3 === 'undefined' )                                                       mod3        = null;
    var roll = randomInteger(100);
    var player_obj = getObj("player", msg.playerid);
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
    var format;
    var specialArray = special.split('.');
    var talentArray = talents.split('.');
    var superUnreliable=false;
    var ammomodstring;
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
        "PestilentStench": -1,
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
    var ammoArray = {
        "default": true,
        "abyssal": false,
        "amputator": false,
        "bleeder": false,
        "concussion": false,
        "dumdum": false,
        "expander": false,
        "explosive": false,
        "hotshot": false,
        "incindiary": false,
        "inferno": false,
        "manstopper": false,
        "nitidus": false,
        "purgatus": false,
        "purity": false,
        "psybolts": false,
        "psyflame": false,
        "sanctified": false,
        "scrambler": false,
        "shard": false,
        "shock": false,
        "silver": false,
        "tempest": false,
        "thermal": false,
        "tox": false,
        "inferno": false,           //custom ammo
        "overload": -1,
        "cryo": -1,
        "chemical": -1,
        "shredder": -1,
        "tungsten": false,
        "hammerhead": -1,
        "phasic": false,
        "polonium": -1,
        "flux": false
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
        "vox": false,
        "stabilitydampener": false,         //custom mods
        "extendedbarrel": false,
        "driverscope": false,
        "ultralight": false,
        "extendeddrivermagazine": false,
        "impeller": false,
        "drivergrip": false,
        "bulkbuild": false,
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


    // Flags the ammo used
    if(ammo != null){ammoArray[ammo] = true;}
    
    
    // Flags the mods used
    if(mod1 != null){modArray[mod1] = true;}
    if(mod2 != null){modArray[mod2] = true;}
    if(mod3 != null){modArray[mod3] = true;}


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


    //Add wpn qualities from ammo and mods
    
    //Check impeller mod (affects ammo)
    if(modArray['impeller']==true){
        if(range==1){wpncat=parseInt(wpncat)+2;}
        else if(range==2){wpncat=parseInt(wpncat)+1;}
    }

    
    if(ammoArray['abyssal']==true){attributeArray['Crippling']=2; attributeArray['Tainted']=true; attributeArray['Reliable']=false; attributeArray['Sanctified']=false;}
    else if(ammoArray['amputator']==true){dmg=parseInt(dmg)+2;}
    else if(ammoArray['concussion']==true){
        if(attributeArray['Blast']<5){attributeArray['Blast']=5;}
        if(attributeArray['Concussive']<5){attributeArray['Concussive']=5;}
    } else if(ammoArray['dumdum']==true){dmg=parseInt(dmg)+2;}
    else if(ammoArray['expander']==true){dmg=parseInt(dmg)+1;pen=parseInt(pen)+1;}
    else if(ammoArray['explosive']==true){
        attributeArray['Primitive']=-1;
        boundmod = parseInt(boundmod)-10;
        if(attributeArray['Blast']<1){attributeArray['Blast']=1;}
    } else if(ammoArray['hotshot']==true){dmg=parseInt(dmg)+1; pen=4; attributeArray['Tearing']=true;}
    else if(ammoArray['incindiary']==true){attributeArray['Flame']=true; attributeArray['Unreliable']=true; attributeArray['Reliable']=false; attributeArray['Blast']=-1;}
    else if(ammoArray['inferno']==true){attributeArray['Flame']=true;}
    else if(ammoArray['manstopper']==true){pen=parseInt(pen)+3;}
    else if(ammoArray['psybolts']==true){attributeArray['Daemonbane']=true; attributeArray['Sanctified']=true;}
    else if(ammoArray['psyflame']==true){attributeArray['Sanctified']=true;}
    else if(ammoArray['purgatus']==true){attributeArray['Sanctified']=true;}
    else if(ammoArray['purity']==true){
        if(attributeArray['Haywire']<2){attributeArray['Haywire']=2;}
    } else if(ammoArray['sanctified']==true){attributeArray['Sanctified']=true;}
    else if(ammoArray['scrambler']==true){
        if(attributeArray['Hallucinogenic']<2){attributeArray['Hallucinogenic']=2;}
        attributeArray['Recharge']=true;
    }
    else if(ammoArray['shard']==true){
        if(attributeArray['Crippling']<2){attributeArray['Crippling']=2;}
    }
    else if(ammoArray['shock']==true){attributeArray['Shocking']=true;}
    else if(ammoArray['silver']==true){attributeArray['Sanctified']=true;}
    else if(ammoArray['tempest']==true){attributeArray['Shocking']=true;}
    else if(ammoArray['thermal']==true){attributeArray['Primitive']=-1; attributeArray['Accurate']=false; numdice=parseInt(numdice)+1; pen=6; attributeArray['Melta']=true; attributeArray['Inaccurate']=true;}
    else if(ammoArray['tox']==true){
        if(attributeArray['Toxic']<1){attributeArray['Toxic']=1;}
        dmg=parseInt(dmg)-2;
    } else if(ammoArray['inferno']==true){attributeArray['Flame']=true;}
    else if(ammoArray['overload']==true){
        attributeArray['Shocking']=true;
        if(wpncat>0 && wpncat > attributeArray['Haywire']){attributeArray['Haywire']=wpncat;}
    } else if(ammoArray['cryo']==true && wpncat > attributeArray['Snare']){attributeArray['Snare']=wpncat;}
    else if(ammoArray['chemical']==true && wpncat > attributeArray['Toxic']){attributeArray['Toxic']=wpncat;}
    else if(ammoArray['shredder']==true){
        if(wpncat > attributeArray['Crippling'] && attributeArray['Crippling'] > 0){attributeArray['Crippling']=wpncat;}
        attributeArray['Tearing']=true;
    } else if(ammoArray['tungsten']==true){pen=parseInt(pen)+2;}
   if(ammoArray['hammerhead']==true && attributeArray['Concussive']>wpncat){attributeArray['Concussive']=wpncat;}
   if(ammoArray['polonium']==true && attributeArray['Felling']>wpncat){attributeArray['Felling']=wpncat;}
   if(ammoArray['flux']==true){attributeArray['Graviton']=true;}
   
   
    //Add adjustments for weapon modifications
    if(modArray['auxilliary']==true){/* ADD GRENADE LAUNCHER BUTTON SUPPORT HERE?*/}
    if(modArray['compact']==true){dmg=parseInt(dmg)-1;}
    if(modArray['grip']==true){boundmod = parseInt(boundmod)+5;}
    if(modArray['exterminator']==true){/* ADD EXTERMINATOR OPTION HERE?*/}
    if(modArray['melee']==true){/* ADD SPEAR BUTTON SUPPORT*/}
    if(modArray['motion']==true && (shotsel == 1 || shotsel==4 || shotsel==7 || shotsel==10 || shotsel == 2 || shotsel==5 || shotsel==8 || shotsel==11)){boundmod=parseInt(boundmod)+10;}
    if(modArray['omni']==true && (shotsel == 0 || shotsel==3 || shotsel==6 || shotsel==9)){boundmod=parseInt(boundmod)+10;}
    if(modArray['reddot']==true && (shotsel == 0 || shotsel==3 || shotsel==6 || shotsel==9)){boundmod=parseInt(boundmod)+10;}
    if(modArray['suspensors']==true){ttArray['autostabilized']=true;}
    if(modArray['warpleech']==true && attributeArray['Crippling']<2){attributeArray['Crippling']=2;}
    if(modArray['extendedbarrel']==true && (shotsel == 0 || shotsel==3 || shotsel==6 || shotsel==9)){boundmod=parseInt(boundmod)+10;}
    if(modArray['stabilitydampener']==true && (shotsel == 1 || shotsel==4 || shotsel==7 || shotsel==10)){boundmod=parseInt(boundmod)+10;}
    if(modArray['stabilitydampener']==true && (shotsel == 2 || shotsel==5 || shotsel==8 || shotsel==11)){boundmod=parseInt(boundmod)+20;}
    if(modArray['driverscope']==true){attributeArray['Accurate']=true;}
    
    
    //Account for attributes that add other attributes (typically SoI and Daemon wpn traits)
    
    if(attributeArray['Wounding'] > -1 ){
        if(attributeArray['Crippling'] < attributeArray['Wounding']) {attributeArray['Crippling']=attributeArray['Wounding'];}
    }
    if(attributeArray['Vicious']==true){
        if(attributeArray['Tearing']==true){attributeArray['RazorSharp']=true;}
        else{attributeArray['Tearing']=true;}
    }
    if(attributeArray['Accursed']==true){
        numdice=parseInt(numdice)+1;
        if(attributeArray['Felling']< 4){attributeArray['Felling']=4;}
    }
    if(attributeArray['Fury']==true){boundmod=parseInt(boundmod)+10;}
    if(attributeArray['Skulltaker'] != false && shotsel == 9){
        if(attributeArray['Vengeful']>8){attributeArray['Vengeful']=8;}
    }
    if(attributeArray['WarpFlame']==true){attributeArray['Flame']=true; ttArray['WarpWeapons']=true;}
    if(attributeArray['Envenomed'] > -1){
        if(attributeArray['Toxic']<(parseInt(attributeArray['Envenomed'])/2)){attributeArray['Toxic']=(parseInt(attributeArray['Envenomed'])/2);}
    }
    if(attributeArray['Lashing'] > -1){
        if(attributeArray['Snare']<(parseInt(attributeArray['Lashing'])/2)){attributeArray['Snare']=(parseInt(attributeArray['Lashing'])/2);}
    }
    if(attributeArray['Steady']==true){
        if(attributeArray['Accurate'] != false && attributeArray['Flame'] != false && attributeArray['Scatter'] != false){attributeArray['Reliable']=true; pen=parseInt(pen)+2;}
        else {attributeArray['Accurate']=true;}
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
        dmg=parseInt(dmg)+2;
        //Impact to Explosive
        if(attributeArray['Accurate']==true){attributeArray['Accurate']=false;}
        else{attributeArray['Inaccurate']=true; attributeArray['Unreliable']=true;}
    }
    if(attributeArray['PeerlessElegance']==true){
        dmg=parseInt(dmg)+2;
        //Impact to Rending; clip size x4
        attributeArray['Reliable']=true;
    }
    if(attributeArray['InnovativeDesign']==true){
        dmg=parseInt(dmg)+3;
        pen=parseInt(pen)+3;
        //Dmg type becomes E. Includes Omni-scope
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
    
    
    //Add in targeter mod effects
    if(modArray['targeter']==true && boundmod < 0){boundmod=parseInt(boundmod)+10;}
    
    
    //Sum the Check + bound modifier
    modTarget = parseInt(attribute) + parseInt(boundmod);
    
    
    //Adjust Weapon Jamming based on qualities and talents
    if(attributeArray['Unreliable']==true && attributeArray['Reliable']==true){attributeArray['Unreliable']=false;}
    
    if(quality=='poor' && attributeArray['Unreliable']==true){superUnreliable=true;}
    else if(quality=='poor' && attributeArray['Unreliable']==false && attributeArray['Reliable']==false){attributeArray['Unreliable']=true;}
    else if(quality=='poor' && attributeArray['Unreliable']==false && attributeArray['Reliable']==true){attributeArray['Reliable']=false;}
    else if(quality=='good' && attributeArray['Unreliable']==true){attributeArray['Unreliable']=false;}
    else if(quality=='good' && attributeArray['Unreliable']==false){attributeArray['Reliable']=true;}
    else if(quality=="best"){attributeArray['Reliable']=true;}
    
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
    
    
    //adjust for the "roll 100" edge case
    if(roll==100){
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output = '<span style="color:red">' + token + ' fails automatically by <B>' + degOfSuc + ' degree(s)</B></span>. ';
        hit=false;
    }
    
    //Adding DoS from weapon attributes/qualities/whatever
    if(attributeArray['IncalculablePrecision'] ==true && hit==true){
        degOfSuc=parseInt(degOfSuc)+2;
    }
    if(attributeArray['Patient'] ==true && hit==true){
        degOfSuc=parseInt(degOfSuc)+1;
    }
    if(attributeArray['Unpredictible'] ==true && hit==true){
        degOfSuc=parseInt(degOfSuc)+1;
    } 
    if(attributeArray['Unpredictible'] ==true && hit==false){
        degOfSuc=parseInt(degOfSuc)-2;
    }     
    
    //Adjust Weapon Dmg/Pen/RoF/Qualities based on qualities and talents
    //If Lance, Melta, or RazorSharp (multipliers calculated and summed):
    temp=1;
    if(attributeArray['Lance'] == true)                         {temp=degOfSuc;}
    if(attributeArray['Melta']==true && range<3)                {temp++;}
    if(attributeArray['RazorSharp'] == true && degOfSuc>=3)     {temp++;}
    pen =parseInt(pen)*parseInt(temp);
    
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
    
   
    //Determine # of damage rolls required (check for fluid action mod for semi-auto fire)
    if(modArray['fluid']==true) {semicalc = Math.floor((degOfSuc)/2)+1;}
    else                        {semicalc = Math.floor((degOfSuc-1)/2)+1;}
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
    } else if ( (shotsel == 2 || shotsel==5 || shotsel==8 || shotsel==11) && hit==true && error==false ){
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
    
    //Increase damage by a multiple of the degrees of success
    if(attributeArray['Precision'] > 1){dmg=parseInt(dmg)+parseInt(attributeArray['Precision'])*parseInt(degOfSuc);}
    
    
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
            if(i<=numhits){
                dmgendstring="[[ [NH] 1d10-"+parseInt(sub)+"]] meter(s) "+temp;
            }
            else{
                if(ttArray['grenadier']==true && attributeArray['Blast']>-1){dmgendstring="[[ [NH] "+attributeArray['Indirect']+"d10-"+parseInt(sub)+"]] meter(s) "+temp;} 
                else{dmgendstring="[[ [NH] "+attributeArray['Indirect']+"d10]] meter(s) "+temp;}
            }
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
            if(ttArray['grenadier']==true && attributeArray['Blast']>-1){dmgendstring="[[ [NH] 1d5-"+parseInt(sub)+"]] meter(s) "+temp;} 
            else{dmgendstring="[[ [NH] 1d5]] meter(s) "+temp;}
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
    //Check for 'Voidchill' daemon quality
    if(attributeArray['Voidchill'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Voidchill: | Each time the wpn inflicts a hit, the target suffers [[ [$Voidchill] 1d10 ]] Toughness dmg";
    }
    //Check for 'Howling' daemon quality
    if(attributeArray['Howling'] ==true ){
        qualstring = qualstring  + " --Howling: | When this weapon is drawn bearer gains Fear(1) or increases their Fear rtg by 1";
    }
    //Check for 'Wounding' daemon quality
    if(attributeArray['Wounding'] > -1 && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Wounding: | This weapon gained Crippling equal to daemon's WPB";
    }
    //Check for 'Vicious' daemon quality
    if(attributeArray['Vicious'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Vicious: | This weapon gains the Tearing quality. If it already has tearing it gains RazorSharp";
    }
    //Check for 'Accursed' daemon quality
    if(attributeArray['Accursed'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Accursed: | This weapon gained +1d10 damage and the Felling(4) quality";
    }
    //Check for 'Bloodlust' daemon quality
    if(attributeArray['Bloodlust'] ==true){
        qualstring = qualstring  + " --Bloodlust: | Test WP+0 when drawing or become Frenzied as a FrA";
    }
    //Check for 'Thirsting' daemon quality
    if(attributeArray['Thirsting'] ==true && (hit==true||scatter==true) && jam==false ){
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
    if(attributeArray['Skulltaker'] ==true && shotsel==9){
        qualstring = qualstring  + " --Skulltaker: | Called Shots vs head are done as a HA with a difficulty of +0 (NOT APPLIED). All CS gain Vengeful(8).";
    }
    //Check for 'Illusory' daemon quality
    if(attributeArray['Illusory'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Illusory: | Appears as normal wpn of type unless Awareness-20 passed. Imposes -10 on all Evasion tests vs wpn.";
    }
    //Check for 'Mind Eater' daemon quality
    if(attributeArray['MindEater'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --MindEater: | Instead of dealing damage, target suffers Int and Per dmg equal to half of the given dmg value (rounded up)";
    }
    //Check for 'Spellbound' daemon quality
    if(attributeArray['Spellbound'] ==true){
        qualstring = qualstring  + " --Spellbound: | This weapon gives the wielder 1 specific psychic power chosen at wpn creation. Manifested using Daemon's stats, with a -10 to FP test = to every 100xp power cost after first 100.";
    }
    //Check for 'Warp Flame' daemon quality
    if(attributeArray['Warpflame'] == true){
        qualstring = qualstring  + " --WarpFlame: | Wpn gained Flame and Warp Weapon qualities";
    }
    //Check for 'SorcerousForce' daemon quality
    if(attributeArray['SorcerousForce'] != -1 && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --SorcerousForce: | Gains Force quality activated using Daemon's stats";
    }
    //Check for 'Bile-Quenched' daemon quality
    if(attributeArray['Bile-Quenched'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Bile-Quenched: | Creature wounded by this wpn loses 1 HA next turn. Creatures w/ From Beyond, Daemonic, & Machine are immune.";
    }
    //Check for 'Enfeebling' daemon quality
    if(attributeArray['Enfeebling'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --Enfeebling: | Each time the wpn inflicts a hit that causes dmg, the target suffers [[ [$Enfeebling] 1d10 ]] Strength dmg";
    }
    //Check for 'PlagueCarrier' daemon quality
    if(attributeArray['PlagueCarrier'] ==true && (hit==true||scatter==true) && jam==false ){
        qualstring = qualstring  + " --PlagueCarrier: | Each time this wpn inflicts a hit it infects the target for 7 rounds. Infected targets test T+0 at turn start or take 2d10 Impact dmg ignoring A/T. Any living creature they touch is also infected for 7 rounds. Wpn bearer is immune.";
    }
    //Check for 'StreamofCorruption' daemon quality
    if(attributeArray['StreamofCorruption'] > -1){
        qualstring = qualstring  + " --StreamofCorruption: | Can also be fired as Basic wpn w/ rng: 30m, 2d10+Daemon's WPB Impact dmg w/ Felling(2), Corrosive, Spray, and Toxic(3) qualities";
    }
    //Check for 'Pestilent Stench' daemon quality
    if(attributeArray['PestilentStench'] > -1){
        qualstring = qualstring  + " --PestilentStench: | When drawn all creatures within Daemon's WPB except wielder and Nurgle followers suffer -10 to WS/BS/A/I/P tests";
    }
    //Check for 'Envenomed' daemon quality
    if(attributeArray['Envenomed'] > -1){
        qualstring = qualstring  + " --Envenomed: | Wpn gained Toxic(X) equal to Daemon's WPB";
    }
    //Check for 'Lashing' daemon quality
    if(attributeArray['Lashing'] > -1){
        qualstring = qualstring  + " --Lashing: | Wpn gained Snare(X) equal to Daemon's WPB";
    }
    //Check for 'Swiftness' daemon quality
    if(attributeArray['Swiftness'] > -1 ){
        qualstring = qualstring  + " --Swiftness: | When drawn grants Unnatural Agi(X) equal to Daemon's WPB";
    }
    //Check for 'Sophorific Musk' daemon quality
    if(attributeArray['SophorificMusk'] > -1){
        qualstring = qualstring  + " --SophorificMusk: | When drawn, all creatures except the wielder within Daemon's WPB in meters suffers -20 on Per and Agi tests";
    }
    //Check for 'Entrancing Aura' daemon quality
    if(attributeArray['EntrancingAura'] == true){
        qualstring = qualstring  + " --EntrancingAura: | Imposes -10 penalty to Dodge tests against wpn atks";
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
        qualstring = qualstring  + " --Steady: | Wpn gained Accurate if it doesn't have Accurate/Flame/Scatter, otherwise it gained Reliable and Pen+2";
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
        qualstring = qualstring  + " --Ramshackle: | Wpn gained dmg+2, weight x2, if I becomes X, loses Accurate otherwise gains Inaccurate & Unreliable. Orks ignore Unreliable.";
    }
    //Check for 'PeerlessElegance' SoI quality
    if(attributeArray['PeerlessElegance'] ==true){
        qualstring = qualstring  + " --PeerlessElegance: | I becomes R. Dmg+2 & clip size x4. Gained Reliable.";
    }
    //Check for 'InnovativeDesign' SoI quality
    if(attributeArray['InnovativeDesign'] ==true){
        qualstring = qualstring  + " --InnovativeDesign: | Dmg type becomes E. Dmg and pen +3. Comes with Omni-scope.";
    }
    //Check for 'RemnantoftheEndless' SoI quality
    if(attributeArray['RemnantoftheEndless'] ==true){
        qualstring = qualstring  + " --RemnantoftheEndless: | Dmg type becomes E. Never runs out of ammo nor needs to be reloaded. Attacker ignores Armor on RF.";
    }
    //Check for 'DeathsDreamFragment' SoI quality
    if(attributeArray['DeathsDreamFragment'] ==true){
        qualstring = qualstring  + " --DeathsDreamFragment: | Dmg type becomes E. Reloaded by inflicting dmg: targets hit test WP+0 or suffer 1d10 WP dmg. Wpn refills clip whenever it inflicts WP dmg. If clip hits 0, wielder suffers 1d10 Ins and clip refills. Thrown wpns inflict 1d5 Ins on failed WP+0 test.";
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
    talstring = " --Applicable Talents: |";
    //Deathdealer
    if(ttArray['deathdealer']==true && (hit==true||scatter==true) && jam==false){
        talstring = talstring  + "Deathdealer(+PB to crit), ";  
    }
    //Divine Protection
    if(ttArray['divineprotection']==true && attributeArray['Spray']==true){
        talstring = talstring  + "Allies aren't harmed by Spray atks, ";  
    }
    //Doubletap
    if(ttArray['doubletap']==true && hit==true && jam==false){
        talstring = talstring  + "DoubleTap(+20hit 2nd atk), ";  
    }
    //Eye of Vengeance
    if(ttArray['eyeofvengeance']==true && (shotsel==0||shotsel==3||shotsel==6||shotsel==9) ){
        talstring = talstring  + "EyeofVengeance(spend FP to +dmg/pen), ";  
    }
    //Grenadier
    if(ttArray['grenadier']==true && scatter==true && (attributeArray['Blast']>0||attributeArray['Thrown']==true) ){
        talstring = talstring  + "Grenadier(reduced scatter on blast/thrown), ";  
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
    //Purity of Hatred
    if(ttArray['purityofhatred']==true && ttArray['hatred']==true){
        talstring = talstring  + "Gain Vengeful(9) vs one group you have Hatred for, ";  
    }
    //Target Selection
    if(ttArray['targetselection']==true ){
        talstring = talstring  + "TargetSelection(no penalty fire into melee), ";  
    }
    //Weapon Tech
    if(ttArray['weapontech']==true && (hit==true||scatter==true) && jam==false){
        talstring = talstring  + "WpnTech(enhance certain wpns 1/combat), ";  
    }
    
    
    //Add the ammo and mod descriptions
    ammomodstring = " --Ammo & Mods: |";        
    //Add ammo information
    //Abyssal Bolts
    if(ammoArray['abyssal']==true){
        ammomodstring = ammomodstring  + "AbyssalBolts{Bolt wpns,Crossbows}(gain Crippling(2) and Tainted; loses Reliable and Sanctified), ";  
    }
    //Amputator Shells
    if(ammoArray['amputator']==true){
        ammomodstring = ammomodstring  + "AmputatorShells{stub wpns/shotguns/snipers/handcannon/auto wpns}(dmg+2), ";  
    }
    //Bleeder Rounds
    if(ammoArray['bleeder']==true){
        ammomodstring = ammomodstring  + "BleederRounds{stub wpns/handcannon/auto wpns}(dmg causes Blood Loss for 1d5 rounds; ignores Daemon/Machine), ";  
    }
    //Concussion Bolts
    if(ammoArray['concussion']==true){
        ammomodstring = ammomodstring  + "ConcussionBolts{Crossbows}(gain Blast(5) and Concussive(5); blast radius targets test Str-20 or thrown 1d5m and prone), ";  
    }
    //Dumdum Bullets
    if(ammoArray['dumdum']==true){
        ammomodstring = ammomodstring  + "DumdumBullets{stub wpns/snipers/handcannon}(dmg+2; Armor 2x vs wpn), ";  
    }
    //Expander Rounds
    if(ammoArray['expander']==true){
        ammomodstring = ammomodstring  + "ExpanderRounds{stub wpns/snipers/auto wpns}(dmg+1; Pen+1), ";  
    }
    //Explosive Arrows/Quarrels
    if(ammoArray['explosive']==true){
        ammomodstring = ammomodstring  + "ExplosiveQuarrels{Bows/Crossbows}(BS-10; dmg type X; remove Primitive; gain Blast(1)), ";  
    }
    //Hot-Shot Charge Packs
    if(ammoArray['hotshot']==true){
        ammomodstring = ammomodstring  + "HotShotChargePack{Las}(dmg+1; gain Tearing; Pen=4; Clip=1), ";  
    }
    //Incindiary Rounds
    if(ammoArray['incindiary']==true){
        ammomodstring = ammomodstring  + "IncindiaryRounds{Bows,Crossbows,Shotguns}(gain Flame and Unreliable; lose Blast(X)), ";  
    }
    //Inferno Shells
    if(ammoArray['inferno']==true){
        ammomodstring = ammomodstring  + "InfernoShells{shotguns;any:bolt}(gains Flame), ";  
    }
    //Man-stopper Bullets
    if(ammoArray['manstopper']==true){
        ammomodstring = ammomodstring  + "ManstopperBullets{stub wpns/handcannon/snipers/auto wpns}(Pen+3), ";  
    }
    //Nitidus Rounds
    if(ammoArray['nitidus']==true){
        ammomodstring = ammomodstring  + "NitidusRounds{shotguns}(psykers hit test WP-10 or Stunned 1 round per DoF. Warp Instability targets immediately test WI at -10), ";  
    }
    //Psy Bolts
    if(ammoArray['psybolts']==true){
        ammomodstring = ammomodstring  + "Psybolts{Bolt wpns}(gains Daemonbane and Sanctified; ignores all psychic protection, dmg+1 per PR of target), ";  
    }
    //Psyflame
    if(ammoArray['psyflame']==true){
        ammomodstring = ammomodstring  + "Psyflame{Flame wpns}(gains Sanctified; ignores all psychic protection; Agi-5*PR for targets to evade), ";  
    }
    //Purgatus Stakes
    if(ammoArray['purgatus']==true){
        ammomodstring = ammomodstring  + "PurgatusStakes{Purgatus Xbow}(gain Sanctified; psykers/Daemons test WP+0 or roll psy phenom), ";  
    }
    //Purity Bolts
    if(ammoArray['purity']==true){
        ammomodstring = ammomodstring  + "PurityBolts{Crossbows}(gain Haywire(2)), ";  
    }
    //Sanctified Ammo
    if(ammoArray['sanctified']==true){
        ammomodstring = ammomodstring  + "SanctifiedAmmo{Bows,Crossbows,Flame,SP}(gain Sanctified), ";  
    }
    //Scrambler Rounds
    if(ammoArray['scrambler']==true){
        ammomodstring = ammomodstring  + "ScramblerRounds{any:Bolt/SP}(gain Hallucinogenic(2) and Recharge), ";  
    }
    //Shard Bolts
    if(ammoArray['shard']==true){
        ammomodstring = ammomodstring  + "ShardBolts{Crossbows}(gain Crippling(2)), ";  
    }
    //Shock Bolts
    if(ammoArray['shock']==true){
        ammomodstring = ammomodstring  + "ShockBolts{Crossbows}(gains Shocking; if target fails T by 3+ DoS they are unconscious instead of stunned), ";  
    }
    //Silver Stakes
    if(ammoArray['silver']==true){
        ammomodstring = ammomodstring  + "SilverStakes{Crossbows}(Sanctified; dmg+1d10 vs Psykers/Daemons), ";  
    }
    //Tempest Bolt Shells
    if(ammoArray['tempest']==true){
        ammomodstring = ammomodstring  + "TempestBoltShells{BoltPistol,Boltgun,HvyBolter}(dmg type E; gain Shocking; dmg+3 vs machines), ";  
    }
    //Thermal Bolts
    if(ammoArray['thermal']==true){
        ammomodstring = ammomodstring  + "ThermalBolts{Crossbows}(lose Primitive and Accurate; dmg+1d10 E; Pen=6; gain Melta and Inaccurate; 2x weight), ";  
    }
    //Tox Rounds
    if(ammoArray['tox']==true){
        ammomodstring = ammomodstring  + "ToxRounds{any:Bolt/SP}(gain Toxic(1); dmg-2), ";  
    }
    //Inferno
    if(ammoArray['inferno']==true){
        ammomodstring = ammomodstring  + "Inferno{any:MassDriver}(gain Flame), ";  
    }
    //Overload
    if(ammoArray['overload']==true){
        ammomodstring = ammomodstring  + "Overload{any:MassDriver}(gain Shocking, Haywire(C-1)), ";  
    }
    //Cryo
    if(ammoArray['cryo']==true){
        ammomodstring = ammomodstring  + "Cryo{any:MassDriver}(gain Snare(C)), ";  
    }
    //Chemical Rounds
    if(ammoArray['chemical']==true){
        ammomodstring = ammomodstring  + "Chemical{any:MassDriver}(gain Toxic(C)), ";  
    }
    //Shredder
    if(ammoArray['shredder']==true){
        ammomodstring = ammomodstring  + "Shredder{any:MassDriver}(gain Tearing & Crippling(C-1)), ";  
    }
    //Tungsten
    if(ammoArray['tungsten']==true){
        ammomodstring = ammomodstring  + "Tungsten{any:MassDriver}(pen+2), ";  
    }
    //Hammerhead
    if(ammoArray['hammerhead']==true){
        ammomodstring = ammomodstring  + "Hammerhead{any:MassDriver}(gain Concussive(C)), ";  
    }
    //PHasic
    if(ammoArray['phasic']==true){
        ammomodstring = ammomodstring  + "Phasic{any:MassDriver}(ignore fields), ";  
    }
    //Polonium
    if(ammoArray['polonium']==true){
        ammomodstring = ammomodstring  + "Polonium{any:MassDriver}(gain Felling(C)), ";  
    }
    //Flux
    if(ammoArray['flux']==true){
        ammomodstring = ammomodstring  + "Flux{any:MassDriver}(gain Graviton), ";  
    }
    
    
    //Add modification info
    //Auxilliary Grenade Launcher
    if(modArray['auxilliary']==true){
        ammomodstring = ammomodstring  + "AuxGrenadeLaunch{Las/SP/Bolt:Basic}(can fire launcher w/ range 45 and Indirect or reg wpn; cannot rld in combat), ";  
    }    
    //Backpack Supply
    if(modArray['backpack']==true){
        ammomodstring = ammomodstring  + "BackpackSupply{Bolt/Flame/Las/Melta/Plasma/SP:any}(clipx5; cannot rld in combat; jams lose 1 reg clip of ammo & don't req rld), ";  
    }
    //Compact
    if(modArray['compact']==true){
        ammomodstring = ammomodstring  + "Compact{any:Pistol;Las/SP/Flame/Bolt/Plasma:Basic}(weight/2; clip/2; range/2; dmg-1; searches for wpn take -20), ";  
    }
    //Custom Grip
    if(modArray['grip']==true){
        ammomodstring = ammomodstring  + "CustomGrip{any}(BS+5 or WS+5; other characters -5), ";  
    }
    //Deactivated Safety Features
    if(modArray['deactivated']==true){
        ammomodstring = ammomodstring  + "DeactivatedSafetyFeatures{any}(when rdying this wpn can rdy another as part of same action; wpn activates with 4+ DoF on movement test), ";  
    }
    //Expanded Magazine
    if(modArray['expanded']==true){
        ammomodstring = ammomodstring  + "ExpandedMag{any:ranged}(clip*1.5), ";  
    }
    //Exterminator
    if(modArray['exterminator']==true){
        ammomodstring = ammomodstring  + "Exterminator{anyExcept: pistol/thrown}(1/use HA to do std flamer atk), ";  
    }
    //Fire Selector
    if(modArray['selector']==true){
        ammomodstring = ammomodstring  + "FireSelector{Bolt/Launcher/SP:Pistol/Basic}(can have 3 types of ammo loaded, total # up to clip size, ";  
    }
    //Fluid Action
    if(modArray['fluid']==true){
        ammomodstring = ammomodstring  + "FluidAction{any:ranged}(+1 DoS with Semi-Auto; Rld inc 1 HA), ";  
    }
    //Forearm Wpn Mounting
    if(modArray['forearm']==true){
        ammomodstring = ammomodstring  + "ForearmMount{Las/LT/SP/Bolt/Melta:pistol}(can fire wpn hands-free; range-1/3), ";  
    }
    //Melee Attachment
    if(modArray['melee']==true){
        ammomodstring = ammomodstring  + "MeleeAttachment{any:Basic}(counts as spear in melee), ";  
    }
    //Modified Stock
    if(modArray['stock']==true){
        ammomodstring = ammomodstring  + "ModifiedStock{any}(+2 BS on HA aim; +4 on FuA-NOT INCLUDED), ";  
    }
    //Motion Predictor
    if(modArray['motion']==true){
        ammomodstring = ammomodstring  + "MotionPredictor{any:ranged}(BS+10 on SA or FA fire), ";  
    }
    //Omni-scope
    if(modArray['omni']==true){
        ammomodstring = ammomodstring  + "OmniScope{Las/SP/Bolt/LT/Plasma:Basic}(no darkness penalties; Per+20 vision at dark; BS+10 single shot; ignore range penalties when aiming as FuA-NOT INCLUDED; counts as sight), ";  
    }
    //Photo Sight
    if(modArray['photo']==true){
        ammomodstring = ammomodstring  + "PhotoSight{Las/SP/Bolt/LT/Plasma:Basic}(no darkness penalties; counts as sight), ";  
    }
    //Pistol Grip
    if(modArray['pistol']==true){
        ammomodstring = ammomodstring  + "PistolGrip{any:Basic}(one-hand fire w/o -20-NOT INCLUDED; range/2), ";  
    }
    //Preysense Sight
    if(modArray['preysense']==true){
        ammomodstring = ammomodstring  + "Preysense{Las/SP/Bolt/LT/Plasma:Basic}(no darkness penalties; Per+20 vision at dark; counts as sight), ";  
    }
    //Quick Release
    if(modArray['quick']==true){
        ammomodstring = ammomodstring  + "QuickRelease{any:ranged}(Rld time reduced by HA min HA), ";  
    }
    //Red Dot Laser Sight
    if(modArray['reddot']==true){
        ammomodstring = ammomodstring  + "RedDotSight{Las/SP/Bolt/LT/Plasma:Basic/Pistol}(BS+10 for single shot; counts as sight), ";  
    }
    //Reinforced
    if(modArray['reinforced']==true){
        ammomodstring = ammomodstring  + "Reinforced{any}(weight*1.2; ranged +1 dmg as improvised melee; melee dest on 41+ vs PF), ";  
    }
    //Sacred Inscriptions
    if(modArray['sacred']==true){
        ammomodstring = ammomodstring  + "SacredInscriptions{any}(+10 vs Pinning), ";  
    }
    //Silencer
    if(modArray['silencer']==true){
        ammomodstring = ammomodstring  + "Silencer{SP:Basic/Pistol}(-20 to hear; range/2), ";  
    }
    //Suspensors
    if(modArray['suspensors']==true){
        ammomodstring = ammomodstring  + "Suspensors{any:Heavy}(weight/2; gains Auto-Stabilized), ";  
    }
    //Targeter
    if(modArray['targeter']==true){
        ammomodstring = ammomodstring  + "Targeter{Las/SP/Bolt:Basic/Pistol,any:Heavy}(penalty to shot dec by 10), ";  
    }
    //Telescopic Sight
    if(modArray['telescopic']==true){
        ammomodstring = ammomodstring  + "TelescopicSight{Las/SP/Bolt/LT/Plasma:Basic}(ignores range penalties when aiming as FuA-NOT INCLUDED), ";  
    }
    //Tripod/Bipod
    if(modArray['tripod']==true){
        ammomodstring = ammomodstring  + "Tripod/Bipod{any:Basic/Heavy}(bracable on any flat surface; 90 deg bipod arc, 180 deg tripod), ";  
    }
    //Truesilver Weaving
    if(modArray['weaving']==true){
        ammomodstring = ammomodstring  + "TruesilverWeaving{Launcher/LT/SP:ranged}(upgrades ammo; Daemons dodging suffer -5x atker's WPB), ";  
    }
    //Warpleech Canister
    if(modArray['warpleech']==true){
        ammomodstring = ammomodstring  + "WarpleechCanister{SP w/o silencer}(gains Crippling(2) vs Daemons; Lasts 40 rounds), ";  
    } 
    //Vox Operated
    if(modArray['vox']==true){
        ammomodstring = ammomodstring  + "VoxOperated{notLT:Pistol/Basic/Launch/Heavy}(can be fired with spoken commands), ";  
    }
    //Stability Dampener
    if(modArray['stabilitydampener']==true){
        ammomodstring = ammomodstring  + "StabilityDampener{any:MassDriver}(+10 BS on SA; +20 on FA), ";  
    }
    //Extended Barrel
    if(modArray['extendedbarrel']==true){
        ammomodstring = ammomodstring  + "ExtendedBarrel{any:MassDriver}(Range x1.25; +10 on Si), ";  
    }
    //Driver Scope
    if(modArray['driverscope']==true){
        ammomodstring = ammomodstring  + "DriverScope{any:MassDriver w/o Scatter}(gain Accurate, also functions as preysense and telescoping sights), ";  
    }
    //Ultralight Materials
    if(modArray['ultralightmaterials']==true){
        ammomodstring = ammomodstring  + "UltralightMaterials{any:MassDriver}(Weight/3; wpn can be drawn/holstered as part of any atk action), ";  
    }
    //Extended Driver Magazine
    if(modArray['extendeddrivermagazine']==true){
        ammomodstring = ammomodstring  + "ExtendedDriverMagazine{any:MassDriver}(Clip x3; Rld +1 step), ";  
    }
    //Impeller
    if(modArray['impeller']==true){
        ammomodstring = ammomodstring  + "Impeller{any:MassDriver w/ Scatter}(C+2 when benefitting from Scatter at PB; C+1 at SR), ";  
    }
    //Driver Grip
    if(modArray['drivergrip']==true){
        ammomodstring = ammomodstring  + "DriverGrip{Basic:MassDriver}(can fire one-handed w/o -20 penalty; gains Inaccurate and loses Accurate-NOT CALCULATED; suffers -20 if two wpns with driver grip are fired in one round-NOT CALCULATED), ";  
    }
    //Bulk Build
    if(modArray['bulk build']==true){
        ammomodstring = ammomodstring  + "BulkBuild{Basic:MassDriver}(changes to Heavh; dmg+1d10; pen+1; range x1.5; NONE CALCULATED), ";  
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

    //Set up the roll display
    if(spray==true){
        sub=''
    } else{
        sub=" --Roll:| [! "+roll+" !] vs [! "+modTarget+" !] --Result:|"+output;
    }
    
    
    if(wpnname=="Archangel Mk II"||wpnname=="Idraheith's Bane"||wpnname=="The Culling"){format="legendary";}
    else{format="ranged";}
    
    
    effects=" --Effects:| "+effects;
    
    //Return output
    if(error==true){
      output = errortext; 
    }
    else {
        //output ="!power {{--format|ranged --titlefontshadow|none --name|"+token+" --leftsub| "+attributeArray['Crippling']+"  --rightsub| "+temp+sub+dmgstring+scatstring+qualstring+talstring+ammomodstring+" }}";
        output ="!power {{--format|"+format+" --titlefontshadow|none --name|"+token+" --leftsub| "+wpnname+"  --rightsub| "+temp+sub+dmgstring+scatstring+qualstring+talstring+ammomodstring+effects+" }}";
    }
    msg.content=output;
    msg.who = msg.who.replace(" (GM)", "");
    msg.content = msg.content.replace(/<br\/>\n/g, ' ').replace(/({{(.*?)}})/g, " $2 ");
    PowerCard.Process(msg, player_obj);
    return 0;
}
