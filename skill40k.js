/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria. Outputs are modified using PowerCards.
 * 
 * The following commands is used:
 * !skill40k [tokenName], [attributeValue], [ModifierValue], [skillname], [optional:format] 
**/

//Rolls a d100 and calculates the success or fail results to the chat window.

var skill40kNamespace = skill40kNamespace || {};

skill40kNamespace.rollResult = function(token, attribute, modifier, skillname, talents, mode, msg) {
    if (typeof token            === undefined || typeof token != 'string' )                     token           = 'generic';
    if (typeof attribute        === undefined || Number.isInteger(parseInt(attribute))==false)  attribute       = 0;
    if (typeof modifier         === undefined || Number.isInteger(parseInt(modifier))==false )  modifier        = 0;
    if (typeof skillname        === undefined || typeof skillname != 'string' )                 skillname   = 'generic';
    if (typeof format           === undefined || typeof format != 'string' )                    format          = 'gen';
    if (typeof mode             === undefined || typeof mode != 'string' )                      mode            = 'normal';
    if (typeof msgwho           === undefined || typeof msgwho != 'string' )                    msgwho            = 'GM';

    var roll = randomInteger(100);
    var reroll;
    var modTarget;
    var modTarget2;
    var degOfSuc =0;
    var degOfSuc2=0;
    var qualstring="";
    var output2 = 'Error';
    var output3="N/A";
    var diff='';
    var player_obj = getObj("player", msg.playerid);
    var talentArray = talents.split('.');
    var boundmod=0;
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
    
    
    //Determine difficulty of the check
    if(modifier==0)
    {
        diff="Challenging"
    } else if (modifier == 30){
        diff="Easy"
    } else if (modifier == 20){
        diff="Routine"
    } else if (modifier == 10){
        diff="Ordinary"
    } else if (modifier == -10){
        diff="Difficult"
    } else if (modifier == -20){
        diff="Hard"
    } else if (modifier == -30){
        diff="Very Hard"
    } else if (modifier == -40){
        diff="Arduous"
    } else if (modifier == -50){
        diff="Punishing"
    } else if (modifier == -60){
        diff="Hellish"
    }
    else{
        diff='Other';
    }
    boundmod = parseInt(boundmod)+parseInt(modifier);
    
    
    //Add bonuses for talents
    if(ttArray['CoordinatedInterrogation'] ==true && skillname=="Interrogation"){
        boundmod=parseInt(boundmod)+10;
    }
    if(ttArray['SuperiorChirurgeon'] ==true && skillname=="Medicae"){
        boundmod=parseInt(boundmod)+10;
    }
    
    
    //Bound the modifier to +/-60 and create the target value
    if(boundmod>60){boundmod=60;}
    else if(boundmod<-60){boundmod=-60;}
    modTarget=parseInt(attribute) + parseInt(boundmod);
    
    
    //Form output message based on result
    if(roll <= modTarget) {
        degOfSuc = (Math.floor(modTarget/10) - Math.floor(roll/10)) + 1;
        output2 = '<span style="color:green">' + token + ' succeeds by <B>' + degOfSuc + ' degree(s)</B>.</span> ';
    }
    else {
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output2 = '<span style="color:red">' + token + ' fails by <B>' + degOfSuc + ' degree(s)</B></span>. ';
    }
    
    
    //Check for talents and provide contextual info
    if(ttArray['bulgingbiceps'] ==true && skillname=="Athletics"){
        qualstring = qualstring  + " --BulgingBiceps | Grants +20 to the Heft use of the Athletics skill";  
    }
    if(ttArray['catfall'] ==true && skillname=="Acrobatics"){
        qualstring = qualstring  + " --Catfall | Grants +20 to the Jump use of Acrobatics";  
    } 
    if(ttArray['coordinatedinterrogation'] ==true && skillname=="Interrogation"){
        qualstring = qualstring  + " --CoordinatedInterrogation | Grants +10 to all interrogation tests (inc) and +5 for each additional ally with this talent";  
    }     
    if(ttArray['delicateinterrogation'] ==true && skillname=="Interrogation"){
        qualstring = qualstring  + " --DelicateInterrogation | Subtlety loss from Interrogation reduced by 1d5 (min 1)";  
    }    
    if(ttArray['enemy'] ==true && (skillname=="Charm"||skillname=="Deceive"||skillname=="Command"||skillname=="Inquiry")){
        qualstring = qualstring  + " --Enemy | -10 to interaction tests with the selected group(not included)";  
    }    
    if(ttArray['faceinacrowd'] ==true && skillname=="Stealth"){
        qualstring = qualstring  + " --FaceinaCrowd | Can use Fellowship instead of Agility when using the Shadowing ability of the Stealth skill";  
    }      
    if(ttArray['haloofcommand'] ==true && (skillname=="Charm"||skillname=="Deceive"||skillname=="Command"||skillname=="Inquiry"||skillname=="Intimidate")){
        qualstring = qualstring  + " --HaloofCommand | Can affect targets within 100 x FB meters rather than 10";  
    }      
    if(roll <= modTarget && skillname=="Awareness" && ttArray['keenintuition']==true){
        qualstring = qualstring  + " --KeenIntuition | After failing an awareness check the character can reroll with a -10";  
    } 
    if(roll > modTarget && skillname=="Awareness" && ttArray['keenintuition']==true){
        reroll = randomInteger(100);
        modTarget2=parseInt(modTarget)-10;
        qualstring = qualstring  + " --KeenIntuition | After failing an awareness check the character can reroll with a -10";
        if(reroll <= modTarget2) {
            degOfSuc2 = (Math.floor(modTarget2/10) - Math.floor(reroll/10)) + 1;
            output3 = '<span style="color:green">' + token + ' succeeds by <B>' + degOfSuc2 + ' degree(s)</B>.</span> ';
        }
        else {
            degOfSuc2 = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
            output3 = '<span style="color:red">' + token + ' fails by <B>' + degOfSuc2 + ' degree(s)</B></span>. ';
        }
        qualstring = qualstring  + " --Reroll:|[! "+reroll+" !] vs [! "+modTarget2+" !] --FinalOutput:|"+output3;
    }
    if(ttArray['mastery'] ==true){
        qualstring = qualstring  + " --Mastery | Can spend a FP to auto-pass a test with your chosen skill when final modifier is challenging or easier. Counts as DoS equal to ability modifier.";  
    }
    if(ttArray['peer'] ==true && (skillname=="Charm"||skillname=="Deceive"||skillname=="Command"||skillname=="Inquiry")){
        qualstring = qualstring  + " --Peer | +10 to interaction tests with the selected group (not included)";  
    }     
    if(ttArray['superiorchirurgeon'] ==true && skillname=="Medicae"){
        qualstring = qualstring  + " --SuperiorChir | +20 to Medicae and ignores Heavily Damaged penalty and suffers only a -10 for Critical Damage";  
    }
    //NOT WORKING
    if(ttArray['infusedknowledge'] ==true && (skillname=="Common Lore"||skillname=="Scholastic Lore")){
        qualstring = qualstring  + " --InfusedKnowledge | +1 DoS on successful CL and SL tests";  
    }
    
    //Chose output mode
    if(mode=='normal'){
        mode='';
    } else if(mode=='secret'){
        mode='--whisper|self,gm';
    } else if(mode=='hidden'){
        mode='--whisper|gm';
        if(msg.who!=''){
            sendChat(msg.who, '/w ' + msg.who + ' sent a secret '+skillname+' roll to the GM.');  
        }
    } else{
        mode='';
    }
    
    
    //Return output
    msg.content="!power {{ "+mode+" --format|skill --titlefontshadow|none --name|"+token+" --leftsub|"+skillname+" Check --rightsub| "+diff+" Diff. --Roll:|[! "+roll+" !] vs [! "+modTarget+" !]  --Result:|"+output2+qualstring+" }}";
    //msg.content="!power {{ "+mode+" --format|skill --titlefontshadow|none --name|"+token+" --leftsub|"+ttArray['keenintuition']+" Check --rightsub| "+diff+" Diff. --Roll:|[! "+roll+" !] vs [! "+modTarget+" !]  --Result:|"+output2+qualstring+" }}";
    msg.who = msg.who.replace(" (GM)", "");
    msg.content = msg.content.replace(/<br\/>\n/g, ' ').replace(/({{(.*?)}})/g, " $2 ");
    PowerCard.Process(msg, player_obj);
    return 0;
}
