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
            this.attrval=attrval;
            this.modifier=modifier;
            this.degOfSuc=0;
            this.roll=0;
            this.checkTarget=0;
            this.diff=0;
            this.talStr='';
            this.hitStr='';
            this.talentArray = {
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
            this.configArray(talentStr,this.talentArray);
            this.hit=false;
            this.err=false;
            this.errStr='';
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
                this.hit=true;
                this.degOfSuc = (Math.floor(this.checkTarget / 10) - Math.floor(this.roll / 10)) + 1;
            } else {
                this.hit=false;
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
            if (this.hit=true) {
                this.hitStr = '<span style="color:green">' + this.name + ' succeeds by <B>' + this.degOfSuc + ' degree(s)</B>.</span> ';
            } else {
                this.hitStr = '<span style="color:red">' + this.name + ' fails by <B>' + this.degOfSuc + ' degree(s)</B></span>. ';
            }
        }

        //PRIVATE: use a period-separated string to set a given data array
        configArray(inputString, dataArray){
            var tempvar, current, i, j;
            var tempArray = inputString.split('.');
            for (i = 0, j = tempArray.length; i < j; i++) {
                tempArray[i] = tempArray[i].replace(/^\s+|\s+$/g, ''); //remove whitespace
                tempvar = tempArray[i].match(/\d/); //find any numbers in parentheses
                tempArray[i] = tempArray[i].replace(/\(([^)]+)\)/g, ''); //remove parentheses and anything inside
                current = tempArray[i];
                if (tempvar != null) { //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
                    dataArray[current] = tempvar;
                } else {
                    dataArray[current] = true;
                }
            }
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
        get talentArray() {
            return this._talentArray;
        }
        get err(){
            return this._err;
        }
        get errStr(){
            return this._errStr;
        }

        set attrval(value) {
            if(value >= 0 && value <= 100){
                this._attrval=value;
            } else if (value > 100){
                this._attrval=100;
                this.err=true;
                this.errStr += "Attr out of range |";
            } else{
                this._attrval=0;
                this.err=true;
                this.errStr += "Attr out of range |";
            } 
        }
        set modifier(value) {
            if(value >= -200 && value <= 200){
                this._modifier=value;
            } else if (value > 200){
                this._modifier=200;
                this.err=true;
                this.errStr += "Modifier out of range |";
            } else if (value < -200){
                this._modifier=-200;
                this.err=true;
                this.errStr += "Modifier out of range |";
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
                this.err=true;
                this.errStr += "Invalid Name |"
            }
        }
        set talentArray(value) {
            this._talentArray=value;
        }
        set err(value){
            this._err=value;
        }
        set errStr(value){
            this._errStr=value;
        }
  

    }

    class SkillCheck extends Check {
        constructor(name, attrval, modifier, skillname, talentStr) {
            super(name, attrval, modifier, talentStr);
            this.skillname=skillname;
        }

        Calc(){
            //Add bonuses for specific talents
            
            if (this.talentArray['coordinatedinterrogation'] == true && this.skillname == "Interrogation") {
                this.modifier = parseInt(this.modifier) + 10;
            }
            if (this.talentArray['superiorchirurgeon'] == true && this.skillname == "Medicae") {
                this.modifier = parseInt(this.modifier) + 20;
            }
            //perform the standard check calculations
            super.Calc();
        }

        buildStr(){
            //prepare the basic check info
            super.buildStr();
            //prepare the skill-specific addendi
            if (this.talentArray['bulgingbiceps'] == true && this.skillname == "Athletics") {
                this.talStr = this.talStr + " --BulgingBiceps | Grants +20 to the Heft use of the Athletics skill";
            }
            if (this.talentArray['catfall'] == true && this.skillname == "Acrobatics") {
                this.talStr = this.talStr + " --Catfall | Grants +20 to the Jump use of Acrobatics";
            }
            if (this.talentArray['coordinatedinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --CoordinatedInterrogation | Grants +10 to all interrogation tests (inc) and +5 for each additional ally with this talent";
            }
            if (this.talentArray['delicateinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --DelicateInterrogation | Subtlety loss from Interrogation reduced by 1d5 (min 1)";
            }
            if (this.talentArray['enemy'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Enemy | -10 to interaction tests with the selected group(not included)";
            }
            if (this.talentArray['faceinacrowd'] == true && this.skillname == "Stealth") {
                this.talStr = this.talStr + " --FaceinaCrowd | Can use Fellowship instead of Agility when using the Shadowing ability of the Stealth skill";
            }
            if (this.talentArray['haloofcommand'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry" || this.skillname == "Intimidate")) {
                this.talStr = this.talStr + " --HaloofCommand | Can affect targets within 100 x FB meters rather than 10";
            }
            if (this.roll <= this.modifier && this.skillname == "Awareness" && this.talentArray['keenintuition'] == true) {
                this.talStr = this.talStr + " --KeenIntuition | After failing an awareness check the this can reroll with a -10";
            }
            if (this.roll > this.modifier && this.skillname == "Awareness" && this.talentArray['keenintuition'] == true) {
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
            if (this.talentArray['mastery'] == true) {
                this.talStr = this.talStr + " --Mastery | Can spend a FP to auto-pass a test with your chosen skill when final modifier is challenging or easier. Counts as DoS equal to ability modifier.";
            }
            if (this.talentArray['peer'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Peer | +10 to interaction tests with the selected group (not included)";
            }
            if (this.talentArray['superiorchirurgeon'] == true && this.skillname == "Medicae") {
                this.talStr = this.talStr + " --SuperiorChir | +20 to Medicae and ignores Heavily Damaged penalty and suffers only a -10 for Critical Damage";
            }
            //NOT WORKING
            if (this.talentArray['infusedknowledge'] == true && (this.skillname == "Common Lore" || this.skillname == "Scholastic Lore")) {
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
                this.err=true;
                this.errStr +="Invalid Skillname |";
            }
        }
    }

    class RangedAtkCheck extends Check {
        constructor(name, attrval, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, attributeStr, quality, talentStr, wpnname, type, ammo, mod1, mod2, mod3, effects, wpncat) {
            super(name, attrval, modifier, talentStr);
            this.range=range;
            this.shotsel=shotsel;
            this.single=single;
            this.semi=semi;
            this.full=full;
            this.numdice=numdice;
            this.dice=dice;
            this.dmg=dmg;
            this.pen=pen;
            this.attributeArray = {
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
            this.configArray(attributeStr,this.attributeArray);
            this.quality=quality;
            this.wpnname=wpnname;
            this.type=type;
            this.ammo=ammo;
            this.modStr=mod1 + "."+ mod2 + "." + mod3; //TODO: build this into a single string in the character sheet
            this.modArray = {
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
            this.configArray(modStr,this.modArray);
            this.effects=effects;
            this.wpncat=wpncat;
            this.jamThreshold=100;
            this.jam=false;
            this.scatter=false;
            this.spray=false;
        }

        //PUBLIC: Prepares the attributes and calculates the check
        Calc(){
            //Add bonuses for specific talents

            applyModifiers();
            calcAtkHit();
            calcDmgRolls();




        }

        //PUBLIC: Build the powerCards string
        buildStr(){
            //prepare the basic attack info
            if(this.hit==true && this.jam==false) {
                this.hitStr = '<span style="color:green">' + this.name + ' hits with <B>' + this.degOfSuc + ' degree(s)</B>.</span> ';
            } else if(this.hit==false && this.jam==false){
                this.hitStr = '<span style="color:red">' + this.name + ' misses by <B>' + this.degOfSuc + ' degree(s)</B></span>. ';
            }else if (this.jam==true){
                this.hitStr = '<span style="color:red">' + this.name + ' gets <B>' + this.degOfSuc + ' Degree(s) of Failure </B> and jams his weapon! </span>. ';
            }
            //prepare the skill-specific addendi
        }

        configJamThresh(){
            //adjust for shot selection
            if(this.shotsel==0||this.shotsel==3||this.shotsel==6||this.shotsel==9){
                this.jamThreshold=96;
            }else if (this.shotsel==1 || this.shotsel==2||this.shotsel==4||this.shotsel==5||this.shotsel==7||this.shotsel==8||this.shotsel==10||this.shotsel==11){
                this.jamThreshold=94;
            }

            //Adjust Weapon Jamming based on qualities and talents
            if(this.attributeArray['Unreliable']==true && this.attributeArray['Reliable']==true){this.attributeArray['Unreliable']=false;}
            
            if(this.quality=='poor' && this.attributeArray['Unreliable']==true){this.superUnreliable=true;}
            else if(this.quality=='poor' && this.attributeArray['Unreliable']==false && this.attributeArray['Reliable']==false){this.attributeArray['Unreliable']=true;}
            else if(this.quality=='poor' && this.attributeArray['Unreliable']==false && this.attributeArray['Reliable']==true){this.attributeArray['Reliable']=false;}
            else if(this.quality=='good' && this.attributeArray['Unreliable']==true){this.attributeArray['Unreliable']=false;}
            else if(this.quality=='good' && this.attributeArray['Unreliable']==false){this.attributeArray['Reliable']=true;}
            else if(this.quality=="best"){this.attributeArray['Reliable']=true;}
            
            if(this.superUnreliable==true && this.attributeArray['Overheats']==false){this.jamThreshold=this.modifier;} //BE CAREFUL: this value setting depends on the modifier not changing after the jam threshold is set
            else if(this.attributeArray['Overheats']==true||quality=="best"){this.jamThreshold=999;}
            else if(this.attributeArray['Reliable']==true){this.jamThreshold=100;}
            else if(this.attributeArray['Unreliable']==true && this.quality!='poor'){this.jamThreshold=91;}
        }

        configModifiers(){
            //adjust for shot selection
            if(this.shotsel==0||this.shotsel==6){
                this.modifier=parseInt(this.modifier)+10;
            }else if(this.shotsel==2||this.shotsel==4||this.shotsel==8){
                this.modifier=parseInt(this.modifier)-10;
            }else if((this.shotsel==5)||(this.shotsel==9 && this.talentArray['precisionkiller']==false)||(this.shotsel==10||this.shotsel==11)){
                this.modifier=parseInt(this.modifier)-20;
            }

            //adjust for range calculation
            if(this.range==0){this.modifier = parseInt(this.modifier)+0;}
            else if (this.range==1){this.modifier = parseInt(this.modifier)+parseInt(30);}
            else if (this.range==2){this.modifier = parseInt(this.modifier)+parseInt(10);}
            else if (this.range==3){this.modifier = parseInt(this.modifier)+parseInt(0);}
            else if (this.range==4 && this.talentArray['marksman']==false){this.modifier = parseInt(this.modifier)+parseInt(-10);}
            else if (this.range==4 && this.talentArray['marksman']==true){this.modifier = parseInt(this.modifier)+0;} 
            else if (this.range==5 && this.talentArray['marksman']==false){this.modifier = parseInt(this.modifier)+parseInt(-30);}
            else if (this.range==5 && this.talentArray['marksman']==true){this.modifier = parseInt(this.modifier)+0;}

            //Adjust +hit if using a 'Scatter' weapon at Short or PB Range (not to be confused with the drift/scatter of area weapons)
            if(this.attributeArray['Scatter']==true && (this.range==1||this.range==2) ){this.modifier = parseInt(this.modifier)+parseInt(10);}
            //Adjust +hit if using a 'Twin-Linked' weapon
            if(this.attributeArray['Twin-Linked']==true){this.modifier = parseInt(this.modifier)+parseInt(20);}
        }

        configMods(){
            //increment the weapon category counter (adjusts mass driver mod values)
            if(this.modArray['impeller']==true && this.range==1){
                this.wpncat=parseInt(this.wpncat)+2;
            } else if(this.modArray['impeller']==true && this.range==2){
                this.wpncat=parseInt(this.wpncat)+1;
            }

            //Add adjustments for weapon modifications
            if(this.modArray['auxilliary']==true){/* ADD GRENADE LAUNCHER BUTTON SUPPORT HERE?*/}
            if(this.modArray['compact']==true){this.dmg=parseInt(this.dmg)-1;}
            if(this.modArray['grip']==true){this.modifier = parseInt(this.modifier)+5;}
            if(this.modArray['exterminator']==true){/* ADD EXTERMINATOR OPTION HERE?*/}
            if(this.modArray['melee']==true){/* ADD SPEAR BUTTON SUPPORT*/}
            if(this.modArray['motion']==true && (this.shotsel == 1 || this.shotsel==4 || this.shotsel==7 || this.shotsel==10 || this.shotsel == 2 || this.shotsel==5 || this.shotsel==8 || this.shotsel==11)){this.modifier=parseInt(this.modifier)+10;}
            if(this.modArray['omni']==true && (this.shotsel == 0 || this.shotsel==3 || this.shotsel==6 || this.shotsel==9)){this.modifier=parseInt(this.modifier)+10;}
            if(this.modArray['reddot']==true && (this.shotsel == 0 || this.shotsel==3 || this.shotsel==6 || this.shotsel==9)){this.modifier=parseInt(this.modifier)+10;}
            if(this.modArray['suspensors']==true){this.talentArray['autostabilized']=true;}
            if(this.modArray['warpleech']==true && this.attributeArray['Crippling']<2){this.attributeArray['Crippling']=2;}
            if(this.modArray['extendedbarrel']==true && (this.shotsel == 0 || this.shotsel==3 || this.shotsel==6 || this.shotsel==9)){this.modifier=parseInt(this.modifier)+10;}
            if(this.modArray['stabilitydampener']==true && (this.shotsel == 1 || this.shotsel==4 || this.shotsel==7 || this.shotsel==10)){this.modifier=parseInt(this.modifier)+10;}
            if(this.modArray['stabilitydampener']==true && (this.shotsel == 2 || this.shotsel==5 || this.shotsel==8 || this.shotsel==11)){this.modifier=parseInt(this.modifier)+20;}
            if(this.modArray['driverscope']==true){this.attributeArray['Accurate']=true;}
            if(this.modArray['targeter']==true && this.modifier < 0){this.modifier=parseInt(this.modifier)+10;}
        }

        configAmmo(){
            if(this.ammo=='abyssal'){
                this.attributeArray['Crippling']=2; 
                this.attributeArray['Tainted']=true; 
                this.attributeArray['Reliable']=false; 
                this.attributeArray['Sanctified']=false;
            }
            else if(this.ammo=='amputator'){this.dmg=parseInt(this.dmg)+2;}
            else if(this.ammo=='concussion'){
                if(this.attributeArray['Blast']<5){this.attributeArray['Blast']=5;}
                if(this.attributeArray['Concussive']<5){this.attributeArray['Concussive']=5;}
            } else if(this.ammo=='dumdum'){this.dmg=parseInt(this.dmg)+2;}
            else if(this.ammo=='expander'){
                this.dmg=parseInt(this.dmg)+1;
                this.pen=parseInt(this.pen)+1;
            }
            else if(this.ammo=='explosive'){
                this.attributeArray['Primitive']=-1;
                this.modifier = parseInt(this.modifier)-10;
                if(this.attributeArray['Blast']<1){this.attributeArray['Blast']=1;}
            } else if(this.ammo=='hotshot'){
                this.dmg=parseInt(this.dmg)+1; 
                this.pen=4; 
                this.attributeArray['Tearing']=true;
            }
            else if(this.ammo=='incindiary'){
                this.attributeArray['Flame']=true; 
                this.attributeArray['Unreliable']=true; 
                this.attributeArray['Reliable']=false; 
                this.attributeArray['Blast']=-1;
            }
            else if(this.ammo=='inferno'){this.attributeArray['Flame']=true;}
            else if(this.ammo=='manstopper'){this.pen=parseInt(this.pen)+3;}
            else if(ammo=='psybolts'){
                this.attributeArray['Daemonbane']=true; 
                this.attributeArray['Sanctified']=true;
            }
            else if(this.ammo=='psyflame'){this.attributeArray['Sanctified']=true;}
            else if(this.ammo=='purgatus'){this.attributeArray['Sanctified']=true;}
            else if(this.ammo=='purity'){
                if(this.attributeArray['Haywire']<2){this.attributeArray['Haywire']=2;}
            } else if(this.ammo=='sanctified'){this.attributeArray['Sanctified']=true;}
            else if(this.ammo=='scrambler'){
                if(this.attributeArray['Hallucinogenic']<2){this.attributeArray['Hallucinogenic']=2;}
                this.attributeArray['Recharge']=true;
            }
            else if(this.ammo=='shard'){
                if(this.attributeArray['Crippling']<2){this.attributeArray['Crippling']=2;}
            }
            else if(this.ammo=='shock'){this.attributeArray['Shocking']=true;}
            else if(this.ammo=='silver'){this.attributeArray['Sanctified']=true;}
            else if(this.ammo=='tempest'){this.attributeArray['Shocking']=true;}
            else if(this.ammo=='thermal'){
                this.attributeArray['Primitive']=-1; 
                this.attributeArray['Accurate']=false; 
                this.numdice=parseInt(this.numdice)+1; 
                this.pen=6; 
                this.attributeArray['Melta']=true; 
                this.attributeArray['Inaccurate']=true;
            }
            else if(this.ammo=='tox'){
                if(this.attributeArray['Toxic']<1){this.attributeArray['Toxic']=1;}
                this.dmg=parseInt(this.dmg)-2;
            } else if(this.ammo=='inferno'){this.attributeArray['Flame']=true;}
            else if(this.ammo=='overload'){
                this.attributeArray['Shocking']=true;
                if(this.wpncat>0 && this.wpncat > this.attributeArray['Haywire']){this.attributeArray['Haywire']=this.wpncat;}
            } else if(this.ammo=='cryo' && this.wpncat > this.attributeArray['Snare']){this.attributeArray['Snare']=this.wpncat;}
            else if(this.ammo=='chemical' && this.wpncat > this.attributeArray['Toxic']){this.attributeArray['Toxic']=this.wpncat;}
            else if(this.ammo=='shredder'){
                if(this.wpncat > this.attributeArray['Crippling'] && this.attributeArray['Crippling'] > 0){this.attributeArray['Crippling']=this.wpncat;}
                this.attributeArray['Tearing']=true;
            } else if(this.ammo=='tungsten'){this.pen=parseInt(this.pen)+2;}
            else if(this.ammo=='hammerhead' && this.attributeArray['Concussive']>this.wpncat){this.attributeArray['Concussive']=this.wpncat;}
            else if(this.ammo=='polonium' && this.attributeArray['Felling']>this.wpncat){this.attributeArray['Felling']=this.wpncat;}
            else if(this.ammo=='flux'){this.attributeArray['Graviton']=true;}
        }

        configGenAttr(){
            //Account for attributes that add other attributes (typically SoI and Daemon wpn traits)
            if(this.attributeArray['Wounding'] > -1 ){
                if(this.attributeArray['Crippling'] < this.attributeArray['Wounding']) {this.attributeArray['Crippling']=this.attributeArray['Wounding'];}
            }
            if(this.attributeArray['Vicious']==true){
                if(this.attributeArray['Tearing']==true){this.attributeArray['RazorSharp']=true;}
                else{this.attributeArray['Tearing']=true;}
            }
            if(this.attributeArray['Accursed']==true){
                this.numdice=parseInt(this.numdice)+1;
                if(this.attributeArray['Felling']< 4){this.attributeArray['Felling']=4;}
            }
            if(this.attributeArray['Fury']==true){this.modifier=parseInt(this.modifier)+10;}
            if(this.attributeArray['Skulltaker'] != false && this.shotsel == 9){
                if(this.attributeArray['Vengeful']>8){this.attributeArray['Vengeful']=8;}
            }
            if(this.attributeArray['WarpFlame']==true){this.attributeArray['Flame']=true; this.talentArray['WarpWeapons']=true;}
            if(this.attributeArray['Envenomed'] > -1){
                if(this.attributeArray['Toxic']<(parseInt(this.attributeArray['Envenomed'])/2)){this.attributeArray['Toxic']=(parseInt(this.attributeArray['Envenomed'])/2);}
            }
            if(this.attributeArray['Lashing'] > -1){
                if(this.attributeArray['Snare']<(parseInt(this.attributeArray['Lashing'])/2)){this.attributeArray['Snare']=(parseInt(this.attributeArray['Lashing'])/2);}
            }
            if(this.attributeArray['Steady']==true){
                if(this.attributeArray['Accurate'] != false && this.attributeArray['Flame'] != false && this.attributeArray['Scatter'] != false){this.attributeArray['Reliable']=true; this.pen=parseInt(this.pen)+2;}
                else {this.attributeArray['Accurate']=true;}
            }
            if(this.attributeArray['Potent']==true){
                this.dmg=parseInt(this.dmg)+4;
                if(this.attributeArray['Vengeful']>9){this.attributeArray['Vengeful']=9;}
            }
            if(this.attributeArray['SwirlingEnergy']==true){
                this.dmg=parseInt(this.dmg)+2;
                this.pen=parseInt(this.pen)+2;
                this.attributeArray['Shocking']=true;
                //dmg type becomes energy
            }
            if(this.attributeArray['Indestructible']==true){
                this.dmg=parseInt(this.dmg)+2;
                this.pen=parseInt(this.pen)+2;
            }    
            if(attributeArray['Ramshackle']==true){
                this.dmg=parseInt(this.dmg)+2;
                //Impact to Explosive
                if(this.attributeArray['Accurate']==true){this.attributeArray['Accurate']=false;}
                else{
                    this.attributeArray['Inaccurate']=true; 
                    this.attributeArray['Unreliable']=true;
                }
            }
            if(this.attributeArray['PeerlessElegance']==true){
                this.dmg=parseInt(this.dmg)+2;
                //Impact to Rending; clip size x4
                this.attributeArray['Reliable']=true;
            }
            if(this.attributeArray['InnovativeDesign']==true){
                this.dmg=parseInt(this.dmg)+3;
                this.pen=parseInt(this.pen)+3;
                //Dmg type becomes E. Includes Omni-scope
            }
        }

        applyModifiers(){
            configModifiers();
            configMods();
            configAmmo();
            configGenAttr();
            configJamThresh();
        }

        calcAtkHit(){
            super.Calc();
            //adjust check calculations to match jam thresholds and such
            if(this.attributeArray['Spray']==true){
                this.hit=true;
                this.jam=false;
            }
            else if(this.roll <= this.checkTarget && this.roll <= this.jamthreshold) {
                this.hit=true;
                this.jam=false;
            } else if(this.roll > this.checkTarget && this.roll <= this.jamThreshold ){
                this.hit=false;
                this.jam=false;
            }else if (this.roll >= this.jamThreshold){
                this.hit=false;
                this.jam=true;
            }
            //account for the roll 100 corner case on non auto-hitting weapons
            if(this.roll==100 && this.attributeArray['Spray']==false){
                this.hit=false;
            }

            //Adding DoS from weapon attributes/qualities/whatever
            if(this.attributeArray['IncalculablePrecision'] ==true && this.hit==true){
                this.degOfSuc=parseInt(this.degOfSuc)+2;
            }
            if(this.attributeArray['Patient'] ==true && this.hit==true){
                this.degOfSuc=parseInt(this.degOfSuc)+1;
            }
            if(this.attributeArray['Unpredictible'] ==true && this.hit==true){
                this.degOfSuc=parseInt(this.degOfSuc)+1;
            } 
            if(this.attributeArray['Unpredictible'] ==true && this.hit==false){
                this.degOfSuc=parseInt(this.degOfSuc)-2;
            }     
            
            //Adjust Weapon Dmg/Pen/RoF/Qualities based on qualities and talents
            //If Lance, Melta, or RazorSharp (multipliers calculated and summed):
            var temp=1;
            if(this.attributeArray['Lance'] == true)                         {temp=this.degOfSuc;}
            if(this.attributeArray['Melta']==true && this.range<3)                {temp++;}
            if(this.attributeArray['RazorSharp'] == true && this.degOfSuc>=3)     {temp++;}
            this.pen =parseInt(this.pen)*parseInt(temp);
            
            //If firing on Maximal:
            if(this.shotsel==6||this.shotsel==7||this.shotsel==8){
                this.attributeArray['Recharge']=true;
                this.pen=parseInt(this.pen)+2;
                this.numdice=parseInt(this.numdice)+1;
                if(this.attributeArray['Blast']>-1)  {this.attributeArray['Blast']=parseInt(this.attributeArray['Blast'])+2;}
            }
            //If 'Scatter':
            if(this.attributeArray['Scatter']==true && this.range==1 )    {this.dmg=parseInt(this.dmg)+3;}
            else if(this.attributeArray['Scatter']==true && this.range>=3 )    {this.dmg=parseInt(this.dmg)-3;}
            //If 'Tearing':
            if(this.attributeArray['Tearing']==true){this.numdice=parseInt(this.numdice)+1;}
            //If 'Mighty Shot'
            if(this.talentArray['mightyshot']==true){
                var sub=Math.floor(this.attrval/10);
                sub=Math.ceil(sub/2);
                this.dmg=parseInt(this.dmg)+parseInt(sub);
            }

            //Determine if weapon scatters/drifts (Indirect Fire, Blast, and Smoke)
            if(this.shotsel == 3||this.shotsel == 4||this.shotsel == 5||this.attributeArray['Blast'] > -1||this.attributeArray['Smoke'] > -1 ){this.scatter=true;}
            else{this.scatter=false;}
        }

        calcDmgRolls(){
            var semicalc=0;
            var fullcalc=0;

            //Determine # of damage rolls required (check for fluid action mod for semi-auto fire)
            if(this.modArray['fluid']==true) {semicalc = Math.floor((this.degOfSuc)/2)+1;}
            else                        {semicalc = Math.floor((this.degOfSuc-1)/2)+1;}
            fullcalc= this.degOfSuc;
            if(this.attributeArray['Storm']==true){
                this.semicalc=semicalc*2;
                this.fullcalc=fullcalc*2;
            }
            
            if(this.attributeArray['Spray']==true){
                this.spray=true;
                if(this.shotsel==0){
                    this.numhits=parseInt(this.single);            
                } else if (this.shotsel==1){
                    this.numhits=this.semi;
                } else if (this.shotsel==2){
                    this.numhits=this.full;
                } else{
                    this.err=true;
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
        get effects(){
            return this._effects;
        }
        get wpncat(){
            return this._wpncat;
        }
        get attributeArray(){
            return this._attributeArray;
        }

        set range(value) {
            if (value >= 0 && value <= 5){
                this._range=value;
            }else{
                this._range=3;
                this._err=true;
                this._errStr+="Invalid Weapon Range Bracket |";
            }
        }
        set shotsel(value){
           if ((value >= 0 && value <= 2)||(value >=3 && value <=5 && this.attributeArray['Indirect']==true)||(value >= 6 && value <=8 && this.attributeArray['Maximal']==true)||(value>=9 && value <=11)){
                this._shotsel=value;
           }else if (value >=3 && value <=5 && this.attributeArray['Indirect']==false){
                this._shotsel=value-3;
                this._err=true;
                this._errStr+="Incorrect Wpn Attr for Shot Selection(Id)|";
           }else if (value >=6 && value <=8 && this.attributeArray['Maximal']==false){
                this._shotsel=value-6;
                this._err=true;
                this._errStr+="Incorrect Wpn Attr for Shot Selection(Mx)|";
            }else{
                this._shotsel=0;
                this._err=true;
                this._errStr+="Shot Selection Out of Range|";
           }
        }
        set single(value){
            if(value == 'S' || value == 1){
                this._single=1;
            }else{
                this._single=0;
                this._err=true;
                this._errStr+="Invalid Single Shot Val|";
                }
            }
        }
        set semi(value){
            if (typeof value === 'string' || value instanceof String){
                this._semi=0;
            }else if(value<= 10 && value >= 0){
                this._semi=value;
            }else{
                this._semi=0;
                this._err=true;
                this._errStr+="Semi Shot Val Out of Range|";
            }
        }
        set full(value){
            if (typeof value === 'string' || value instanceof String){
                this._full=0;
            }else if(value<= 10 && value >= 0){
                this._full=value;
            }else{
                this._full=0;
                this._err=true;
                this._errStr+="Auto Shot Val Out of Range|";
            }
        }
        set numdice(value){
            if(value <= 10 && value >= 0){
                this._numdice=value;
            } else {
                this._numdice=0;
                this._err=true;
                this._errStr+="Num Dice Out of Range|";
            }
        }
        set dice(value){
            if(value <= 10 && value >= 2){
                this._dice=value;
            } else {
                this._dice=10;
                this._err=true;
                this._errStr+="Dice Out of Range|";
            }
        }
        set dmg(value){
            if(value <= 50 && value >= -10){
                this._dmg=value;
            } else{
                this._dmg=0;
                this._err=true;
                this._errStr+="Dmg Out of Range|";
            }
        }
        set pen(value){
            if(value <= 100 && value >= 0){
                this._pen=value;
            } else{
                this._pen=0;
                this._err=true;
                this._errStr+="Pen Out of Range|";
            }
        }
        set quality(value){
            if (typeof value === 'string' || value instanceof String){
                if(value=='poor' || value=='common'|| value=='good' || value=='best'){
                    this._quality=value;
                }else{
                    this._quality='common';
                    this._err=true;
                    this._errStr+="Invalid Quality Val|";
                }
            }else{
                this._quality='common';
                this._err=true;
                this._errStr+="Invalid Quality|";
            }
        }
        set wpnname(value){
            if (typeof value === 'string' || value instanceof String){
                this._wpnname=value;
            }else{
                this._wpnname='Unknown Weapon';
                this._err=true;
                this._errStr+="Invalid Wpn Name|";
            }
        }
        set type(value){
            if (typeof value === 'string' || value instanceof String){
                this._wpnname=value;
            }else{
                this._wpnname='UnkType';
                this._err=true;
                this._errStr+="Invalid Type|";
            }
        }
        set ammo(value){
            this._ammo=value;
        }
        set effects(value){
            this._effects=value;
        }
        set wpncat(value){
            this._wpncat=value;
        }
        set attributeArray(value){
            this._attributeArray=value;
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