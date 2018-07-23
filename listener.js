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
            var msSgTxt;
            var paramList;
            var result = '';
            msgTxt = msg.content;
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
                        var mode;
                        _.each(paramArray, function (current, i) {
                            if (i == 5) {
                                mode = current;
                            } else{
                                //current=Wrapper40k.trimString(current);
                            }
                        });

                        //create skill check instance
                        let Skill = new SkillCheck(paramArray[0],paramArray[1],paramArray[2], paramArray[3], paramArray[4]);
                        Skill.Calc();
                        Skill.buildStr("skill");

                        //Chose output mode
                        if (mode == 'normal') {
                            mode = '';
                        } else if (mode == 'secret') {
                            mode = '--whisper|self,gm';
                        } else if (mode == 'hidden') {
                            mode = '--whisper|gm';
                            if (msg.who != '') {
                                sendChat(msg.who, '/w ' + msg.who + ' sent a secret ' + skillname + ' roll to the GM.');
                            }
                        } else {
                            mode = '';
                        }

                        //build output str and send to PC
                        msg.content = "!power {{ " + mode + " --format|skill --titlefontshadow|none --name|" + Skill.token.name + " --leftsub|" + Skill.skillname + " Check --rightsub| " + Skill.diff + " Diff. --Roll:|[! " + Skill.roll + " !] vs [! " + Skill.checkTarget + " !]  --Result:|" + Skill.hitStr + Skill.talStr + " }}";
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
                                curToken = Wrapper40k.trimString(current);
                            } else if (i == 1) {
                                attribute = Wrapper40k.trimString(current);
                            } else if (i == 2) {
                                range = Wrapper40k.trimString(current);
                            } else if (i == 3) {
                                shotsel = Wrapper40k.trimString(current);
                            } else if (i == 4) {
                                single = Wrapper40k.trimString(current);
                            } else if (i == 5) {
                                semi = Wrapper40k.trimString(current);
                            } else if (i == 6) {
                                full = Wrapper40k.trimString(current);
                            } else if (i == 7) {
                                numdice = Wrapper40k.trimString(current);
                            } else if (i == 8) {
                                dice = Wrapper40k.trimString(current);
                            } else if (i == 9) {
                                dmg = Wrapper40k.trimString(current);
                            } else if (i == 10) {
                                pen = Wrapper40k.trimString(current);
                            } else if (i == 11) {
                                modifier = Wrapper40k.trimString(current);
                            } else if (i == 12) {
                                special = current;
                            } else if (i == 13) {
                                quality = Wrapper40k.trimString(current);
                            } else if (i == 14) {
                                talents = Wrapper40k.trimString(current);
                            } else if (i == 15) {
                                wpnname = Wrapper40k.trimString(current);
                            } else if (i == 16) {
                                type = Wrapper40k.trimString(current);
                            } else if (i == 17) {
                                ammo = Wrapper40k.trimString(current);
                            } else if (i == 18) {
                                mod1 = Wrapper40k.trimString(current);
                            } else if (i == 19) {
                                mod2 = Wrapper40k.trimString(current);
                            } else if (i == 20) {
                                mod3 = Wrapper40k.trimString(current);
                            } else if (i == 21) {
                                effects = Wrapper40k.trimString(current);
                            } else if (i == 22) {
                                wpncat = Wrapper40k.trimString(current);
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
                                curToken = Wrapper40k.trimString(current);
                            } else if (i == 1) {
                                attribute = Wrapper40k.trimString(current);
                            } else if (i == 2) {
                                shotsel = Wrapper40k.trimString(current);
                            } else if (i == 3) {
                                numdice = Wrapper40k.trimString(current);
                            } else if (i == 4) {
                                dice = Wrapper40k.trimString(current);
                            } else if (i == 5) {
                                dmg = Wrapper40k.trimString(current);
                            } else if (i == 6) {
                                pen = Wrapper40k.trimString(current);
                            } else if (i == 7) {
                                str = Wrapper40k.trimString(current);
                            } else if (i == 8) {
                                modifier = Wrapper40k.trimString(current);
                            } else if (i == 9) {
                                special = current;
                            } else if (i == 10) {
                                quality = Wrapper40k.trimString(current);
                            } else if (i == 11) {
                                talents = Wrapper40k.trimString(current);
                            } else if (i == 12) {
                                wpnname = Wrapper40k.trimString(current);
                            } else if (i == 13) {
                                type = Wrapper40k.trimString(current);
                            } else if (i == 14) {
                                psy = Wrapper40k.trimString(current);
                            } else if (i == 15) {
                                mod1 = Wrapper40k.trimString(current);
                            } else if (i == 16) {
                                mod2 = Wrapper40k.trimString(current);
                            } else if (i == 17) {
                                mod3 = Wrapper40k.trimString(current);
                            } else if (i == 18) {
                                effects = Wrapper40k.trimString(current);
                            } else if (i == 19) {
                                wpncat = Wrapper40k.trimString(current);
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
                                curToken = Wrapper40k.trimString(current);
                            } else if (i == 1) {
                                attribute = Wrapper40k.trimString(current);
                            } else if (i == 2) {
                                psychoice = Wrapper40k.trimString(current);
                            } else if (i == 3) {
                                psymod = Wrapper40k.trimString(current);
                            } else if (i == 4) {
                                psy = Wrapper40k.trimString(current);
                            } else if (i == 5) {
                                psyname = Wrapper40k.trimString(current);
                            } else if (i == 6) {
                                numdice = Wrapper40k.trimString(current);
                            } else if (i == 7) {
                                dmgstat = Wrapper40k.trimString(current);
                            } else if (i == 8) {
                                psydmg = Wrapper40k.trimString(current);
                            } else if (i == 9) {
                                psypen = Wrapper40k.trimString(current);
                            } else if (i == 10) {
                                psypenpr = Wrapper40k.trimString(current);
                            } else if (i == 11) {
                                psydmgtype = Wrapper40k.trimString(current);
                            } else if (i == 12) {
                                atktype = Wrapper40k.trimString(current);
                            } else if (i == 13) {
                                focusmod = Wrapper40k.trimString(current);
                            } else if (i == 14) {
                                atkspecial = Wrapper40k.trimString(current);
                            } else if (i == 15) {
                                effects = Wrapper40k.trimString(current);
                            } else if (i == 16) {
                                talents = Wrapper40k.trimString(current);
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
/*
    class Character {

        constructor(name, talents) {
          this.name = name;
          this.talents=talents;
        }

        get name() {
            return this._name;
        }
        get talents() {
            return this._talents;
        }
        set name(value) {
            if (typeof value === 'string' || value instanceof String){
                this._name=value;
            }
        }
        set talents(value) {
            var sub, cur, i, j;
            var talentArray = value.split('.');
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
                "amorphous": false, //traits
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
                "abyssalterror": false, //Elite Advances
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
                "coldsoul": false, //traits from EAs
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
                talentArray[i] = talentArray[i].replace(/^\s+|\s+$/g, ''); //remove whitespace
                sub = talentArray[i].match(/\d/); //find any numbers in parentheses
                talentArray[i] = talentArray[i].replace(/\(([^)]+)\)/g, ''); //remove parentheses and anything inside
                cur = talentArray[i];
                if (sub != null) { //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
                    ttArray[cur] = sub;
                } else {
                    ttArray[cur] = true;
                }
            }
            this._talents=ttArray;
        }     


    }
*/
    class Check {
        constructor(name, attrval, modifier, talents) {
            //let token = new Character(name,talents);
            this.attrval=attrval;
            this.modifier=modifier;
            this.degOfSuc=0;
            this.roll=0;
            this.checkTarget=0;
            this.diff=0;
            this.talStr='';
            this.hitStr='';
            this.token= class {
                constructor() {
                    this.name = name;
                    this.talents=talents;
                }
                get name() {
                      return this._name;
                  }
                get talents() {
                      return this._talents;
                  }
                set name(value) {
                      if (typeof value === 'string' || value instanceof String){
                          this._name=value;
                      }
                  }
                set talents(value) {
                      var sub, cur, i, j;
                      var talentArray = value.split('.');
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
                          "amorphous": false, //traits
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
                          "abyssalterror": false, //Elite Advances
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
                          "coldsoul": false, //traits from EAs
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
                          talentArray[i] = talentArray[i].replace(/^\s+|\s+$/g, ''); //remove whitespace
                          sub = talentArray[i].match(/\d/); //find any numbers in parentheses
                          talentArray[i] = talentArray[i].replace(/\(([^)]+)\)/g, ''); //remove parentheses and anything inside
                          cur = talentArray[i];
                          if (sub != null) { //if there was a number in parentheses, set the array location equal to that number, otherwise set it as true
                              ttArray[cur] = sub;
                          } else {
                              ttArray[cur] = true;
                          }
                      }
                      this._talents=ttArray;
                  } 
            }
        }


        //Bound the modifier to +/-60 and create the target value
        setCheckThreshold(){
            if (this.modifier > 60) {
                this.modifier = 60;
            } else if (this.modifier < -60) {
                this.modifier = -60;
            }
            this.checkTarget = parseInt(this.attrval) + parseInt(this.modifier);
        }

        //Calculate DoS and Hit/Miss
        detDoS(){
            if (this.roll <= this.boundmod) {
                this.degOfSuc = (Math.floor(this.boundmod / 10) - Math.floor(this.roll / 10)) + 1;
            } else {
                this.degOfSuc = (Math.floor(this.roll / 10) - Math.floor(this.modTarget / 10)) + 1;
            }
        }

        //perform the basic calculations required for a check
        Calc(){
            this.token= new this.token;
            this.roll=randomInteger(100);
            this.setCheckThreshold(); 
            this.detDoS();
        }

        //Prepare parts of the output message based on the calc results
        buildStr(checktype){
            if (this.roll <= this.checkTarget) {
                this.hitStr = '<span style="color:green">' + this.token.name + ' succeeds by <B>' + this.degOfSuc + ' degree(s)</B>.</span> ';
            } else {
                this.hitStr = '<span style="color:red">' + this.token.name + ' fails by <B>' + this.degOfSuc + ' degree(s)</B></span>. ';
            }
        };

        get attrval() {
            return this._attrval;
        }
        get modifier() {
            return this._modifier;
        }
        get diff() {
            return this._diff;
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
                this._modifierl=value;
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

    }

    class SkillCheck extends Check {
        constructor(name, attrval, modifier, talents, skillname) {
            super(name, attrval, modifier, talents);
            this.skillname=skillname;
        }

        Calc(){
            //Add bonuses for specific talents
            /*
            if (token.talents['CoordinatedInterrogation'] == true && skillname == "Interrogation") {
                checkTarget = parseInt(this.checkTarget) + 10;
            }
            if (this.token.talents['SuperiorChirurgeon'] == true && this.skillname == "Medicae") {
                this.checkTarget = parseInt(this.checkTarget) + 10;
            }*/
            //perform the standard check calculations
            super.Calc();
        }

        buildStr(checktype){
            //prepare the basic skill check info
            super.buildStr();
            //prepare the skill-specific addendi
            if (token.talents['bulgingbiceps'] == true && this.skillname == "Athletics") {
                this.talStr = this.talStr + " --BulgingBiceps | Grants +20 to the Heft use of the Athletics skill";
            }
            if (this.token.talents['catfall'] == true && this.skillname == "Acrobatics") {
                this.talStr = this.talStr + " --Catfall | Grants +20 to the Jump use of Acrobatics";
            }
            if (this.token.talents['coordinatedinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --CoordinatedInterrogation | Grants +10 to all interrogation tests (inc) and +5 for each additional ally with this talent";
            }
            if (this.token.talents['delicateinterrogation'] == true && this.skillname == "Interrogation") {
                this.talStr = this.talStr + " --DelicateInterrogation | Subtlety loss from Interrogation reduced by 1d5 (min 1)";
            }
            if (this.token.talents['enemy'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Enemy | -10 to interaction tests with the selected group(not included)";
            }
            if (this.token.talents['faceinacrowd'] == true && this.skillname == "Stealth") {
                this.talStr = this.talStr + " --FaceinaCrowd | Can use Fellowship instead of Agility when using the Shadowing ability of the Stealth skill";
            }
            if (this.token.talents['haloofcommand'] == true && (this.skillname == "Charm" || this.token.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry" || this.skillname == "Intimidate")) {
                this.talStr = this.talStr + " --HaloofCommand | Can affect targets within 100 x FB meters rather than 10";
            }
            if (roll <= boundmod && this.skillname == "Awareness" && this.token.talents['keenintuition'] == true) {
                this.talStr = this.talStr + " --KeenIntuition | After failing an awareness check the this.token can reroll with a -10";
            }
            if (roll > boundmod && this.skillname == "Awareness" && this.token.talents['keenintuition'] == true) {
                var reroll = randomInteger(100);
                var checkTarget2 = parseInt(this.checkTarget) - 10;
                var degOfSuc2=0;
                var tempStr='';
                this.talStr = this.talStr + " --KeenIntuition | After failing an awareness check the this.token can reroll with a -10";
                if (this.reroll <= this.checkTarget2) {
                    degOfSuc2 = (Math.floor(checkTarget2 / 10) - Math.floor(reroll / 10)) + 1;
                    tempStr = '<span style="color:green">' + this.token.name + ' succeeds by <B>' + degOfSuc2 + ' degree(s)</B>.</span> ';
                } else {
                    degOfSuc2 = (Math.floor(reroll / 10) - Math.floor(checkTarget2 / 10)) + 1;
                    tempStr = '<span style="color:red">' + this.token.name + ' fails by <B>' + degOfSuc2 + ' degree(s)</B></span>. ';
                }
                this.talStr = this.talStr + " --Reroll:|[! " + reroll + " !] vs [! " + checkTarget2 + " !] --FinalOutput:|" + tempStr;
            }
            if (this.token.talents['mastery'] == true) {
                this.talStr = this.talStr + " --Mastery | Can spend a FP to auto-pass a test with your chosen skill when final modifier is challenging or easier. Counts as DoS equal to ability modifier.";
            }
            if (this.token.talents['peer'] == true && (this.skillname == "Charm" || this.skillname == "Deceive" || this.skillname == "Command" || this.skillname == "Inquiry")) {
                this.talStr = this.talStr + " --Peer | +10 to interaction tests with the selected group (not included)";
            }
            if (this.token.talents['superiorchirurgeon'] == true && this.skillname == "Medicae") {
                this.talStr = this.talStr + " --SuperiorChir | +20 to Medicae and ignores Heavily Damaged penalty and suffers only a -10 for Critical Damage";
            }
            //NOT WORKING
            if (this.token.talents['infusedknowledge'] == true && (this.skillname == "Common Lore" || this.skillname == "Scholastic Lore")) {
                this.talStr = this.talStr + " --InfusedKnowledge | +1 DoS on successful CL and SL tests";
            }
        }

        get skillname() {
            return this._skillname;
        }
        set skillname(value) {
            if (typeof value === 'string' || value instanceof String){
                this._skillname=value;
            }
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