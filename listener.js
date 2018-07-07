/**
 * This script serves as a wrapper for the 40k scripts
 * 
 * 
 * 
**/

var Wrapper40k = Wrapper40k || (function() {

    handleInput = function(msg_orig) {
        try {
            var cmdName;
            var msgTxt;
            var paramList;
            var result='';
            msgTxt = msg.content;
            if (msg.type !== "api") return;
            if (msgTxt.split(" ", 1)[0] === "!skill40k") {
                cmdName = '!skill40k ';
                paramList = msgTxt.slice(cmdName.length);
                if(paramList.indexOf(',') == -1) {
                    result=' must specify 13 comma-separated parameters for !skill40k command.';
                }
                else {
                    var paramArray    = paramList.split(',');
                    var curToken, attribute, modifier, attributename, format, mode, msgwho;
                    msgwho=msg.who;
                    _.each(paramArray, function(current, i) {
                        if(i==0){
                            curToken  = listener40kNamespace.trimString(current);
                        } else if(i==1){
                            attribute = listener40kNamespace.trimString(current);
                        } else if(i==2){
                            modifier = listener40kNamespace.trimString(current);
                        } else if(i==3){
                            attributename = listener40kNamespace.trimString(current);
                        } else if(i==4){
                            format = listener40kNamespace.trimString(current);
                        } else if(i==5){
                            mode = listener40kNamespace.trimString(current);
                        }
                    });
                    result = skill40kNamespace.rollResult(curToken, attribute, modifier, attributename, format, mode, msg);
                }
            }
            else if (msgTxt.split(" ", 1)[0] === "!ranged40k") {
                cmdName = '!ranged40k ';
                var paramList = msgTxt.slice(cmdName.length);
                if(paramList.indexOf(',') == -1) {
                    result=' must specify 13 comma-separated parameters for !ranged40k command.';
                }
                else {
                    var paramArray = paramList.split(',');
                    var curToken, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type, ammo, mod1, mod2, mod3, effects, wpncat;
                    _.each(paramArray, function(current, i) {
                        if(i==0){
                            curToken  = listener40kNamespace.trimString(current);
                        } else if(i==1){
                            attribute = listener40kNamespace.trimString(current);
                        } else if(i==2){
                            range = listener40kNamespace.trimString(current);
                        } else if(i==3){
                            shotsel = listener40kNamespace.trimString(current);
                        } else if(i==4){
                            single = listener40kNamespace.trimString(current);
                        } else if(i==5){
                            semi = listener40kNamespace.trimString(current);
                        } else if(i==6){
                            full = listener40kNamespace.trimString(current);
                        } else if(i==7){
                            numdice = listener40kNamespace.trimString(current);
                        } else if(i==8){
                            dice = listener40kNamespace.trimString(current);
                        } else if(i==9){
                            dmg = listener40kNamespace.trimString(current);
                        } else if(i==10){
                            pen = listener40kNamespace.trimString(current);
                        } else if(i==11){
                            modifier = listener40kNamespace.trimString(current);
                        } else if(i==12){
                            special = current;
                        } else if(i==13){
                            quality = listener40kNamespace.trimString(current);
                        } else if(i==14){
                            talents = listener40kNamespace.trimString(current);
                        } else if(i==15){
                            wpnname = listener40kNamespace.trimString(current);
                        } else if(i==16){
                            type = listener40kNamespace.trimString(current);
                        } else if(i==17){
                            ammo = listener40kNamespace.trimString(current);
                        } else if(i==18){
                            mod1 = listener40kNamespace.trimString(current);
                        } else if(i==19){
                            mod2 = listener40kNamespace.trimString(current);
                        } else if(i==20){
                            mod3 = listener40kNamespace.trimString(current);
                        } else if(i==21){
                            effects = listener40kNamespace.trimString(current);
                        } else if(i==22){
                            wpncat = listener40kNamespace.trimString(current);
                        }
                    });
                    result = ranged40kNamespace.rollResult(curToken, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type, ammo, mod1, mod2, mod3, effects, wpncat, msg );
                }
            }
            else if (msgTxt.split(" ", 1)[0] === "!melee40k") {
                cmdName = '!melee40k ';
                var paramList = msgTxt.slice(cmdName.length);
                if(paramList.indexOf(',') == -1) {
                    result=' must specify 13 comma-separated parameters for !melee40k command.';
                }
                else {
                    var paramArray = paramList.split(',');
                    var curToken, attribute, shotsel, numdice, dice, dmg, pen, str, modifier, special, quality, talents, wpnname, type, psy, mod1, mod2, mod3, effects, wpncat;
                    _.each(paramArray, function(current, i) {
                        if(i==0){
                            curToken  = listener40kNamespace.trimString(current);
                        } else if(i==1){
                            attribute = listener40kNamespace.trimString(current);
                        } else if(i==2){
                            shotsel = listener40kNamespace.trimString(current);
                        } else if(i==3){
                            numdice = listener40kNamespace.trimString(current);
                        } else if(i==4){
                            dice = listener40kNamespace.trimString(current);
                        } else if(i==5){
                            dmg = listener40kNamespace.trimString(current);
                        } else if(i==6){
                            pen = listener40kNamespace.trimString(current);
                        } else if(i==7){
                            str = listener40kNamespace.trimString(current);
                        } else if(i==8){
                            modifier = listener40kNamespace.trimString(current);
                        } else if(i==9){
                            special = current;
                        }  else if(i==10){
                            quality = listener40kNamespace.trimString(current);
                        }  else if(i==11){
                            talents = listener40kNamespace.trimString(current);
                        }  else if(i==12){
                            wpnname = listener40kNamespace.trimString(current);
                        }  else if(i==13){
                            type = listener40kNamespace.trimString(current);
                        }  else if(i==14){
                            psy = listener40kNamespace.trimString(current);
                        }  else if(i==15){
                            mod1 = listener40kNamespace.trimString(current);
                        }  else if(i==16){
                            mod2 = listener40kNamespace.trimString(current);
                        }  else if(i==17){
                            mod3 = listener40kNamespace.trimString(current);
                        } else if(i==18){
                            effects = listener40kNamespace.trimString(current);
                        } else if(i==19){
                            wpncat = listener40kNamespace.trimString(current);
                        }
                    });
                    result = melee40kNamespace.rollResult(curToken, attribute, shotsel, numdice, dice, dmg, pen, str, modifier, special, quality, talents, wpnname, type, psy, mod1, mod2, mod3, effects, wpncat, msg);
                }
            }
            else if (msgTxt.split(" ", 1)[0] === "!psy40k") {
                cmdName = '!psy40k ';
                var paramList = msgTxt.slice(cmdName.length);
                if(paramList.indexOf(',') == -1) {
                    result=' must specify 13 comma-separated parameters for !psy40k command.';
                }
                else {
                    var paramArray = paramList.split(',');
                    var curToken, attribute, psychoice, psymod, psy, psyname, numdice, dmgstat, psydmg, psypen, psypenpr, psydmgtype, atktype, focusmod, atkspecial, effects, talents ;
                    _.each(paramArray, function(current, i) {
                        if(i==0){
                            curToken  = listener40kNamespace.trimString(current);
                        } else if(i==1){
                            attribute = listener40kNamespace.trimString(current);
                        } else if(i==2){
                            psychoice = listener40kNamespace.trimString(current);
                        } else if(i==3){
                            psymod = listener40kNamespace.trimString(current);
                        } else if(i==4){
                            psy = listener40kNamespace.trimString(current);
                        } else if(i==5){
                            psyname = listener40kNamespace.trimString(current);
                        } else if(i==6){
                            numdice = listener40kNamespace.trimString(current);
                        } else if(i==7){
                            dmgstat = listener40kNamespace.trimString(current);
                        } else if(i==8){
                            psydmg = listener40kNamespace.trimString(current);
                        } else if(i==9){
                            psypen = listener40kNamespace.trimString(current);
                        }  else if(i==10){
                            psypenpr = listener40kNamespace.trimString(current);
                        }  else if(i==11){
                            psydmgtype = listener40kNamespace.trimString(current);
                        }  else if(i==12){
                            atktype = listener40kNamespace.trimString(current);
                        }  else if(i==13){
                            focusmod = listener40kNamespace.trimString(current);
                        }  else if(i==14){
                            atkspecial = listener40kNamespace.trimString(current);
                        }  else if(i==15){
                            effects = listener40kNamespace.trimString(current);
                        }  else if(i==16){
                            talents = listener40kNamespace.trimString(current);
                        }
                    });
                    result = psy40kNamespace.rollResult(curToken, attribute, psychoice, psymod, psy, psyname, numdice, dmgstat, psydmg, psypen, psypenpr, psydmgtype, atktype, focusmod, atkspecial, effects, talents, msg);
                }
            }
            sendChat(msg.who, result);

        } catch (e) {
            let who=(getObj('player',msg_orig.playerid)||{get:()=>'API'}).get('_displayname');
            sendChat('40kScript',`/w "${who}" `+
                `<div style="border:1px solid black; background-color: #ffeeee; padding: .2em; border-radius:.4em;" >`+
                    `<div>There was an error while trying to run your command:</div>`+
                    `<div style="margin: .1em 1em 1em 1em;"><code>${msg_orig.content}</code></div>`+
                    `<div>Please <a class="showtip tipsy" title="The Aaron's profile on Roll20." style="color:blue; text-decoration: underline;" href="https://app.roll20.net/users/104025/the-aaron">send me this information</a> so I can make sure this doesn't happen again (triple click for easy select in most browsers.):</div>`+
                    `<div style="font-size: .6em; line-height: 1em;margin:.1em .1em .1em 1em; padding: .1em .3em; color: #666666; border: 1px solid #999999; border-radius: .2em; background-color: white;">`+
                        JSON.stringify({msg: msg_orig, stack: e.stack})+
                    `</div>`+
                `</div>`
            );
        }
    }

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };

    return {
        RegisterEventHandlers: registerEventHandlers
    };



}());







/** Trims a string **/
Wrapper40k.trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}




on("ready",function(){
    'use strict';

    //TokenMod.CheckInstall();
    Wrapper40k.RegisterEventHandlers();
});