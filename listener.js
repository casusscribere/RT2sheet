/**Author: Argagarg
 * Source: https://github.com/Argagarg/RT2sheet
 * About: This script serves as a wrapper for the 40k scripts: it captures the !skill40k, !ranged40k, !melee40k, and !psy40k commands
 **/

var Wrapper40k = Wrapper40k || (function () {

    handleInput = function (msg_orig) {

        var msg = _.clone(msg_orig),
            args, cmds, ids = [],
            ignoreSelected = false,
            pageRestriction = [],
            modlist = {
                flip: [],
                on: [],
                off: [],
                set: {},
                order: []
            };
        try {
            var cmdName;
            var msgTxt = msg.content;
            var paramList;
            var result = '';
            var player_obj = getObj("player", msg.playerid);
            var mode;
            var outputmode;
            
            if (msg.type !== "api") return;

            args = msg.content;
            cmdName = msg.content.split(" ", 1)[0];
            paramList = msgTxt.slice(cmdName.length);
            var paramArray = paramList.split(',');

            switch (cmdName) {
                case '!skill40k':
                    if (paramArray.length < 4) {
                        result = ' must specify 4 comma-separated parameters for !skill40k command.';
                        sendChat(msg.who, result);
                    } else {
                        //trim strings and set optional mode parameter
                        _.each(paramArray, function (current, i) {
                            if (i == 5) {
                                mode = trimString(current);
                            }
                        });

                        //create skill check instance
                        let Skill = new SkillCheck(paramArray[0],paramArray[1],paramArray[2], paramArray[3], paramArray[4]);
                        Skill.Calc();
                        Skill.buildStr("skill");

                        //Chose output mode
                        if (mode == 'normal') {
                            outputmode = '';
                        } else if (mode == 'secret') {
                            outputmode = '--whisper|self,gm';
                        } else if (mode == 'hidden') {
                            outputmode = '--whisper|gm';
                            if (msg.who != '') {
                                sendChat(msg.who, '/w ' + msg.who + ' sent a secret ' + Skill.skillname + ' roll to the GM.');
                            }
                        } else {
                            outputmode = '';
                        }

                        //build output str and send to PC
                        
                        msg.content = "!power {{ " + mode + " --format|skill --titlefontshadow|none --name|" + outputmode + " --leftsub|" + Skill.skillname + " Check --rightsub| " + Skill.diff + " Diff. --Roll:|[! " + Skill.roll + " !] vs [! " + Skill.checkTarget + " !]  --Result:|" + Skill.hitStr + Skill.talStr + " }}";
                        //msg.content = "!power {{ " + outputmode + " --format|skill --titlefontshadow|none --name|" + Skill.name + " --leftsub|" + Skill.skillname + " Check --rightsub| " + Skill.diff + " Diff. --Roll:|[! " + Skill.roll + " !] vs [! " + Skill.checkTarget + " !]  --Result:|" + Skill.hitStr + Skill.talStr + " }}";
                        msg.who = msg.who.replace(" (GM)", "");
                        msg.content = msg.content.replace(/<br\/>\n/g, ' ').replace(/({{(.*?)}})/g, " $2 ");
                        PowerCard.Process(msg, player_obj);
                    }
                    break;
                case '!ranged40k':
                    if (paramArray.length < 22) {
                        result = ' must specify 22 comma-separated parameters for !ranged40k command.';
                    } else {
                        var curToken, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type, ammo, mod1, mod2, mod3, effects, wpncat;
                        _.each(paramArray, function (current, i) {
                            if (i == 0) {
                                curToken = current;
                            } else if (i == 1) {
                                attribute = current;
                            } else if (i == 2) {
                                range = current;
                            } else if (i == 3) {
                                shotsel = current;
                            } else if (i == 4) {
                                single = current;
                            } else if (i == 5) {
                                semi = current;
                            } else if (i == 6) {
                                full = current;
                            } else if (i == 7) {
                                numdice = current;
                            } else if (i == 8) {
                                dice = current;
                            } else if (i == 9) {
                                dmg = current;
                            } else if (i == 10) {
                                pen = current;
                            } else if (i == 11) {
                                modifier = current;
                            } else if (i == 12) {
                                special = current;
                            } else if (i == 13) {
                                quality = current;
                            } else if (i == 14) {
                                talents = current;
                            } else if (i == 15) {
                                wpnname = current;
                            } else if (i == 16) {
                                type = current;
                            } else if (i == 17) {
                                ammo = current;
                            } else if (i == 18) {
                                mod1 = current;
                            } else if (i == 19) {
                                mod2 = current;
                            } else if (i == 20) {
                                mod3 = current;
                            } else if (i == 21) {
                                effects = current;
                            } else if (i == 22) {
                                wpncat = current;
                            }
                        });
                        result = ranged40kNamespace.rollResult(curToken, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type, ammo, mod1, mod2, mod3, effects, wpncat, msg);

                    }
                    sendChat(msg.who, result);
                    break;
                case '!melee40k':
                    if (paramArray.length < 19) {
                        result = ' must specify 19 comma-separated parameters for !melee40k command.';
                    } else {
                        var curToken, attribute, shotsel, numdice, dice, dmg, pen, str, modifier, special, quality, talents, wpnname, type, psy, mod1, mod2, mod3, effects, wpncat;
                        _.each(paramArray, function (current, i) {
                            if (i == 0) {
                                curToken = current(current);
                            } else if (i == 1) {
                                attribute = current(current);
                            } else if (i == 2) {
                                shotsel = current(current);
                            } else if (i == 3) {
                                numdice = current(current);
                            } else if (i == 4) {
                                dice = current(current);
                            } else if (i == 5) {
                                dmg = current(current);
                            } else if (i == 6) {
                                pen = current(current);
                            } else if (i == 7) {
                                str = current(current);
                            } else if (i == 8) {
                                modifier = current(current);
                            } else if (i == 9) {
                                special = current;
                            } else if (i == 10) {
                                quality = current(current);
                            } else if (i == 11) {
                                talents = current(current);
                            } else if (i == 12) {
                                wpnname = current(current);
                            } else if (i == 13) {
                                type = current(current);
                            } else if (i == 14) {
                                psy = current(current);
                            } else if (i == 15) {
                                mod1 = current(current);
                            } else if (i == 16) {
                                mod2 = current(current);
                            } else if (i == 17) {
                                mod3 = current(current);
                            } else if (i == 18) {
                                effects = current(current);
                            } else if (i == 19) {
                                wpncat = current(current);
                            }
                        });
                        result = melee40kNamespace.rollResult(curToken, attribute, shotsel, numdice, dice, dmg, pen, str, modifier, special, quality, talents, wpnname, type, psy, mod1, mod2, mod3, effects, wpncat, msg);

                    }
                    sendChat(msg.who, result);
                    break;
                case '!psy40k':
                    if (paramArray.length < 16) {
                        result = ' must specify 16 comma-separated parameters for !psy40k command.';
                    } else {
                        var curToken, attribute, psychoice, psymod, psy, psyname, numdice, dmgstat, psydmg, psypen, psypenpr, psydmgtype, atktype, focusmod, atkspecial, effects, talents;
                        _.each(paramArray, function (current, i) {
                            if (i == 0) {
                                curToken = current(current);
                            } else if (i == 1) {
                                attribute = current(current);
                            } else if (i == 2) {
                                psychoice = current(current);
                            } else if (i == 3) {
                                psymod = current(current);
                            } else if (i == 4) {
                                psy = current(current);
                            } else if (i == 5) {
                                psyname = current(current);
                            } else if (i == 6) {
                                numdice = current(current);
                            } else if (i == 7) {
                                dmgstat = current(current);
                            } else if (i == 8) {
                                psydmg = current(current);
                            } else if (i == 9) {
                                psypen = current(current);
                            } else if (i == 10) {
                                psypenpr = current(current);
                            } else if (i == 11) {
                                psydmgtype = current(current);
                            } else if (i == 12) {
                                atktype = current(current);
                            } else if (i == 13) {
                                focusmod = current(current);
                            } else if (i == 14) {
                                atkspecial = current(current);
                            } else if (i == 15) {
                                effects = current(current);
                            } else if (i == 16) {
                                talents = current(current);
                            }
                        });
                        result = psy40kNamespace.rollResult(curToken, attribute, psychoice, psymod, psy, psyname, numdice, dmgstat, psydmg, psypen, psypenpr, psydmgtype, atktype, focusmod, atkspecial, effects, talents, msg);

                    }
                    sendChat(msg.who, result);
                    break;
            }
        } catch (e) {
            let who = (getObj('player', msg_orig.playerid) || {
                get: () => 'API'
            }).get('_displayname');
            sendChat('40kScript', `/w "${who}" ` +
                `<div style="border:1px solid black; background-color: #ffeeee; padding: .2em; border-radius:.4em;" >` +
                `<div>There was an error while trying to run your command:</div>` +
                `<div style="margin: .1em 1em 1em 1em;"><code>${msg_orig.content}</code></div>` +
                `<div>Please <a class="showtip tipsy" title="The Aaron's profile on Roll20." style="color:blue; text-decoration: underline;" href="https://app.roll20.net/users/104025/the-aaron">send me this information</a> so I can make sure this doesn't happen again (triple click for easy select in most browsers.):</div>` +
                `<div style="font-size: .6em; line-height: 1em;margin:.1em .1em .1em 1em; padding: .1em .3em; color: #666666; border: 1px solid #999999; border-radius: .2em; background-color: white;">` +
                JSON.stringify({
                    msg: msg_orig,
                    stack: e.stack
                }) +
                `</div>` +
                `</div>`
            );
        }
    }

    registerEventHandlers = function () {
        on('chat:message', handleInput);
    };

    trimString = function (src) {
        return src.replace(/^\s+|\s+$/g, '');
    };

    class Check {
        constructor(name, attrval, modifier, talentStr) {
            this.name = name;
            this.talentStrToArray=talentStr;
            this.attrval=attrval;
            this.modifier=modifier;
            this.degOfSuc=0;
            this.roll=0;
            this.checkTarget=0;
            this.diff=0;
            this.talStr='';
            this.hitStr='';
        }

        //PUBLIC: Bound the modifier to +/-60 and create the target value
        setCheckThreshold(){
            if (this.modifier > 60) {
                this.modifier = 60;
            } else if (this.modifier < -60) {
                this.modifier = -60;
            }
            this.checkTarget = parseInt(this.attrval) + parseInt(this.modifier);
        }

        //PUBLIC: Calculate DoS and Hit/Miss
        detDoS(){
            if (this.roll <= this.checkTarget) {
                this.degOfSuc = (Math.floor(this.checkTarget / 10) - Math.floor(this.roll / 10)) + 1;
            } else {
                this.degOfSuc = (Math.floor(this.roll / 10) - Math.floor(this.checkTarget / 10)) + 1;
            }
        }

        //PUBLIC: perform the basic calculations required for a check
        Calc(){
            this.roll=randomInteger(100);
            this.setCheckThreshold(); 
            this.detDoS();
        }

        //PUBLIC: Prepare parts of the output message based on the calc results
        buildStr(){
            if (this.roll <= this.checkTarget) {
                this.hitStr = '<span style="color:green">' + this.name + ' succeeds by <B>' + this.degOfSuc + ' degree(s)</B>.</span> ';
            } else {
                this.hitStr = '<span style="color:red">' + this.name + ' fails by <B>' + this.degOfSuc + ' degree(s)</B></span>. ';
            }
        }

        //PRIVATE: use a period-separated string to set a given data array
        setArray(inputString, dataArray){
            var tempvar, current, i, j;
            var tempArray = inputString.split('.');
            for (i = 0, j = tempArray.length; i < j; i++) {
                tempArray[i] = tempArray[i].replace(/^\s+|\s+$/g, ''); //remove whitespace
                tempvar = tempArray[i].match(/\d/); //find any numbers in parentheses
                tempArray[i] = tempArray[i].replace(/\(([^)]+)\)/g, ''); //remove parentheses and anything inside
                current = tempArray[i];
                if (tempvar != null) { //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
                    dataArray[cur] = tempvar;
                } else {
                    dataArray[cur] = true;
                }
            }
            return dataArray;
        }

        get attrval() {
            return this._attrval;
        }
        get modifier() {
            return this._modifier;
        }
        get diff() {
            return this._diff;
        }
        get name() {
            return this._name;
        }
        get talentStrToArray() {
            return this._talents;
        }

        set attrval(value) {
            if(value >= 0 && value <= 100){
                this._attrval=value;
            } else if (value > 100){
                this._attrval=100;
            } else{
                this._attrval=0;
            } 
        }
        set modifier(value) {
            if(value >= -200 && value <= 200){
                this._modifier=value;
            } else if (value > 200){
                this._modifier=200;
            } else if (value < -200){
                this._modifier=-200;
            }
        }
        set diff(value){     
            if (value == 0) {
                this._diff = "Challenging"
            } else if (value == 30) {
                this._diff = "Easy"
            } else if (value == 20) {
                this._diff = "Routine"
            } else if (value == 10) {
                this._diff = "Ordinary"
            } else if (value == -10) {
                this._diff = "Difficult"
            } else if (value == -20) {
                this._diff = "Hard"
            } else if (value == -30) {
                this._diff = "Very Hard"
            } else if (value == -40) {
                this._diff = "Arduous"
            } else if (value == -50) {
                this._diff = "Punishing"
            } else if (value == -60) {
                this._diff = "Hellish"
            } else {
                this._diff = 'Other';
            }
        }
        set name(value) {
            if (typeof value === 'string' || value instanceof String){
                this._name=value;
            } else{
                this._name="Unknown Name";
            }
        }
        set talentStrToArray(value) {
            var talentArray = {
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
            this._talentStrToArray=this.setArray(value,talentArray);
        } 
  

    }

    class SkillCheck extends Check {
        constructor(name, attrval, modifier, skillname, talents) {
            super(name, attrval, modifier, talents);
            this.skillname=skillname;
        }

        Calc(){
            //Add bonuses for specific talents
            
            if (this.talents['CoordinatedInterrogation'] == true && skillname == "Interrogation") {
                checkTarget = parseInt(this.checkTarget) + 10;
            }
            if (this.talents['SuperiorChirurgeon'] == true && this.skillname == "Medicae") {
                this.checkTarget = parseInt(this.checkTarget) + 10;
            }
            //perform the standard check calculations
            super.Calc();
        }

        buildStr(){
            //prepare the basic skill check info
            super.buildStr();
            //prepare the skill-specific addendi
            if (this.talents['bulgingbiceps'] == true && this.skillname == "Athletics") {
                this.talStr = this.talStr + " --BulgingBiceps | Grants +20 to the Heft use of the Athletics skill";
            }
            if (this.talents['catfall'] == true && this.skillname == "Acrobatics") {
                this.talStr = this.talStr + " --Catfall | Grants +20 to the Jump use of Acrobatics";
            }
            if (this.talents['coordinatedinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --CoordinatedInterrogation | Grants +10 to all interrogation tests (inc) and +5 for each additional ally with this talent";
            }
            if (this.talents['delicateinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --DelicateInterrogation | Subtlety loss from Interrogation reduced by 1d5 (min 1)";
            }
            if (this.talents['enemy'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Enemy | -10 to interaction tests with the selected group(not included)";
            }
            if (this.talents['faceinacrowd'] == true && this.skillname == "Stealth") {
                this.talStr = this.talStr + " --FaceinaCrowd | Can use Fellowship instead of Agility when using the Shadowing ability of the Stealth skill";
            }
            if (this.talents['haloofcommand'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry" || this.skillname == "Intimidate")) {
                this.talStr = this.talStr + " --HaloofCommand | Can affect targets within 100 x FB meters rather than 10";
            }
            if (this.roll <= this.modifier && this.skillname == "Awareness" && this.talents['keenintuition'] == true) {
                this.talStr = this.talStr + " --KeenIntuition | After failing an awareness check the this can reroll with a -10";
            }
            if (this.roll > this.modifier && this.skillname == "Awareness" && this.talents['keenintuition'] == true) {
                var reroll = randomInteger(100);
                var checkTarget2 = parseInt(this.checkTarget) - 10;
                var degOfSuc2=0;
                var tempStr='';
                this.talStr = this.talStr + " --KeenIntuition | After failing an awareness check the this can reroll with a -10";
                if (reroll <= checkTarget2) {
                    degOfSuc2 = (Math.floor(checkTarget2 / 10) - Math.floor(reroll / 10)) + 1;
                    tempStr = '<span style="color:green">' + this.name + ' succeeds by <B>' + degOfSuc2 + ' degree(s)</B>.</span> ';
                } else {
                    degOfSuc2 = (Math.floor(reroll / 10) - Math.floor(checkTarget2 / 10)) + 1;
                    tempStr = '<span style="color:red">' + this.name + ' fails by <B>' + degOfSuc2 + ' degree(s)</B></span>. ';
                }
                this.talStr = this.talStr + " --Reroll:|[! " + reroll + " !] vs [! " + checkTarget2 + " !] --FinalOutput:|" + tempStr;
            }
            if (this.talents['mastery'] == true) {
                this.talStr = this.talStr + " --Mastery | Can spend a FP to auto-pass a test with your chosen skill when final modifier is challenging or easier. Counts as DoS equal to ability modifier.";
            }
            if (this.talents['peer'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Peer | +10 to interaction tests with the selected group (not included)";
            }
            if (this.talents['superiorchirurgeon'] == true && this.skillname == "Medicae") {
                this.talStr = this.talStr + " --SuperiorChir | +20 to Medicae and ignores Heavily Damaged penalty and suffers only a -10 for Critical Damage";
            }
            //NOT WORKING
            if (this.talents['infusedknowledge'] == true && (this.skillname == "Common Lore" || this.skillname == "Scholastic Lore")) {
                this.talStr = this.talStr + " --InfusedKnowledge | +1 DoS on successful CL and SL tests";
            }
        }

        get skillname() {
            return this._skillname;
        }
        set skillname(value) {
            if (typeof value === 'string' || value instanceof String){
                this._skillname=value;
            }else{
                this._skillname='Unknown Skill';
            }
        }
    }

    class RangedAtkCheck extends Check {
        constructor(name, attrval, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type, ammo, mod1, mod2, mod3, effects, wpncat) {
            super(name, attrval, modifier, talents);
            this.range=range;
            this.shotsel=shotsel;
            this.single=single;
            this.semi=semi;
            this.full=full;
            this.numdice=numdice;
            this.dice=dice;
            this.dmg=dmg;
            this.pen=pen;
            this.special=special;
            this.quality=quality;
            this.wpnname=wpnname;
            this.type=type;
            this.ammo=ammo;
            this.mod1=mod1;
            this.mod2=mod2;
            this.mod3=mod3;
            this.effects=effects;
            this.wpncat=wpncat;
        }

        Calc(){
            //Add bonuses for specific talents
            
            if (this.talents['CoordinatedInterrogation'] == true && skillname == "Interrogation") {
                checkTarget = parseInt(this.checkTarget) + 10;
            }
            if (this.talents['SuperiorChirurgeon'] == true && this.skillname == "Medicae") {
                this.checkTarget = parseInt(this.checkTarget) + 10;
            }
            //perform the standard check calculations
            super.Calc();
        }

        buildStr(){
            //prepare the basic skill check info
            super.buildStr();
            //prepare the skill-specific addendi
            if (this.talents['bulgingbiceps'] == true && this.skillname == "Athletics") {
                this.talStr = this.talStr + " --BulgingBiceps | Grants +20 to the Heft use of the Athletics skill";
            }
            if (this.talents['catfall'] == true && this.skillname == "Acrobatics") {
                this.talStr = this.talStr + " --Catfall | Grants +20 to the Jump use of Acrobatics";
            }
            if (this.talents['coordinatedinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --CoordinatedInterrogation | Grants +10 to all interrogation tests (inc) and +5 for each additional ally with this talent";
            }
            if (this.talents['delicateinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --DelicateInterrogation | Subtlety loss from Interrogation reduced by 1d5 (min 1)";
            }
            if (this.talents['enemy'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Enemy | -10 to interaction tests with the selected group(not included)";
            }
            if (this.talents['faceinacrowd'] == true && this.skillname == "Stealth") {
                this.talStr = this.talStr + " --FaceinaCrowd | Can use Fellowship instead of Agility when using the Shadowing ability of the Stealth skill";
            }
            if (this.talents['haloofcommand'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry" || this.skillname == "Intimidate")) {
                this.talStr = this.talStr + " --HaloofCommand | Can affect targets within 100 x FB meters rather than 10";
            }
            if (this.roll <= this.modifier && this.skillname == "Awareness" && this.talents['keenintuition'] == true) {
                this.talStr = this.talStr + " --KeenIntuition | After failing an awareness check the this can reroll with a -10";
            }
            if (this.roll > this.modifier && this.skillname == "Awareness" && this.talents['keenintuition'] == true) {
                var reroll = randomInteger(100);
                var checkTarget2 = parseInt(this.checkTarget) - 10;
                var degOfSuc2=0;
                var tempStr='';
                this.talStr = this.talStr + " --KeenIntuition | After failing an awareness check the this can reroll with a -10";
                if (reroll <= checkTarget2) {
                    degOfSuc2 = (Math.floor(checkTarget2 / 10) - Math.floor(reroll / 10)) + 1;
                    tempStr = '<span style="color:green">' + this.name + ' succeeds by <B>' + degOfSuc2 + ' degree(s)</B>.</span> ';
                } else {
                    degOfSuc2 = (Math.floor(reroll / 10) - Math.floor(checkTarget2 / 10)) + 1;
                    tempStr = '<span style="color:red">' + this.name + ' fails by <B>' + degOfSuc2 + ' degree(s)</B></span>. ';
                }
                this.talStr = this.talStr + " --Reroll:|[! " + reroll + " !] vs [! " + checkTarget2 + " !] --FinalOutput:|" + tempStr;
            }
            if (this.talents['mastery'] == true) {
                this.talStr = this.talStr + " --Mastery | Can spend a FP to auto-pass a test with your chosen skill when final modifier is challenging or easier. Counts as DoS equal to ability modifier.";
            }
            if (this.talents['peer'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Peer | +10 to interaction tests with the selected group (not included)";
            }
            if (this.talents['superiorchirurgeon'] == true && this.skillname == "Medicae") {
                this.talStr = this.talStr + " --SuperiorChir | +20 to Medicae and ignores Heavily Damaged penalty and suffers only a -10 for Critical Damage";
            }
            //NOT WORKING
            if (this.talents['infusedknowledge'] == true && (this.skillname == "Common Lore" || this.skillname == "Scholastic Lore")) {
                this.talStr = this.talStr + " --InfusedKnowledge | +1 DoS on successful CL and SL tests";
            }
        }

        get range() {
            return this._range;
        }
        get shotsel(){
            return this._shotsel;
        }
        get single(){
            return this._single;
        }
        get semi(){
            return this._semi;
        }
        get full(){
            return this._full;
        }
        get numdice(){
            return this._numdice;
        }
        get dice(){
            return this._dice;
        }
        get dmg(){
            return this._dmg;
        }
        get pen(){
            return this._pen;
        }
        get special(){
            return this._special;
        }
        get quality(){
            return this._quality;
        }
        get wpnname(){
            return this._wpnname;
        }
        get type(){
            return this._type;
        }
        get ammo(){
            return this._ammo;
        }
        get mod1(){
            return this._mod1;
        }
        get mod2(){
            return this._mod2;
        }
        get mod3(){
            return this._mod3;
        }
        get effects(){
            return this._effects;
        }
        get wpncat(){
            return this._wpncat;
        }


        set range(value) {
            if (value >= 0 && value <= 5){
                this._range=value;
            }else{
                this._range=3;
            }
        }
        set shotsel(value){
           if (value >= 0 && value <= 11){
               this._shotsel=value;
           }else{
               this._shotsel=0;
           }
        }
        set single(value){
            if(value == 'S' || value == 1){
                this._single=1;
            }else{
                this._single=0;
            }
        }
        set semi(value){
            if (typeof value === 'string' || value instanceof String){
                this._semi=0;
            }else if(value<= 10 && value >= 0){
                this._semi=value;
            }else{
                this._semi=0;
            }
        }
        set full(value){
            if (typeof value === 'string' || value instanceof String){
                this._full=0;
            }else if(value<= 10 && value >= 0){
                this._full=value;
            }else{
                this._full=0;
            }
        }
        set numdice(value){
            if(value <= 10 && value >= 0){
                this._numdice=value;
            } else {
                this._numdice=0;
            }
        }
        set dice(value){
            if(value <= 10 && value >= 2){
                this._dice=value;
            } else {
                this._dice=10;
            }
        }
        set dmg(value){
            if(value <= 50 && value >= -10){
                this._dmg=value;
            } else{
                this._dmg=0;
            }
        }
        set pen(value){
            if(value <= 100 && value >= 0){
                this._pen=value;
            } else{
                this._pen=0;
            }
        }
        set special(value){
            var sub, cur, i, j;
            var specialArray = value.split('.');
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

            // Flags values in the special array to values in the tt array
            for (i = 0, j = specialArray.length; i < j; i++) {
                specialArray[i] = specialArray[i].replace(/^\s+|\s+$/g, ''); //remove whitespace
                sub = specialArray[i].match(/\d/); //find any numbers in parentheses
                specialArray[i] = specialArray[i].replace(/\(([^)]+)\)/g, ''); //remove parentheses and anything inside
                cur = specialArray[i];
                if (sub != null) { //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
                    attributeArray[cur] = sub;
                } else {
                    attributeArray[cur] = true;
                }
            }
            this._special=attributeArray;
        }
        set quality(value){
            if (typeof value === 'string' || value instanceof String){
                if(value=='poor' || value=='common'|| value=='good' || value=='best'){
                    this._quality=value;
                }else{
                    this._quality='common';
                }
            }else{
                this._quality='common';
            }
        }
        set wpnname(value){
            if (typeof value === 'string' || value instanceof String){
                this._wpnname=value;
            }else{
                this._wpnname='Unknown Weapon';
            }
        }
        set type(value){
            if (typeof value === 'string' || value instanceof String){
                this._wpnname=value;
            }else{
                this._wpnname='UnkType';
            }
        }
        set ammo(value){
            var sub, cur, i, j;
            var ammoString = value.split('.');
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

            // Flags values in the special array to values in the tt array
            for (i = 0, j = inputArray.length; i < j; i++) {
                inputArray[i] = inputArray[i].replace(/^\s+|\s+$/g, ''); //remove whitespace
                sub = inputArray[i].match(/\d/); //find any numbers in parentheses
                inputArray[i] = inputArray[i].replace(/\(([^)]+)\)/g, ''); //remove parentheses and anything inside
                cur = inputArray[i];
                if (sub != null) { //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
                    outputArray[cur] = sub;
                } else {
                    outputArray[cur] = true;
                }
            }
            this._ammo=outputArray; 
        }





    }










    return {
        RegisterEventHandlers: registerEventHandlers
    };
}());









on("ready", function () {
    'use strict';

    //TokenMod.CheckInstall();
    Wrapper40k.RegisterEventHandlers();
});