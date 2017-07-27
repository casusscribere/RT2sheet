/**
 * This script listens for commands in chat and passes arguments to those scripts.
 * 
 * This script current listens for the following commands:
 * !skill40k [tokenName], [attributeValue], [ModifierValue], [AttributeName] 
**/

var listener40kNamespace = listener40kNamespace || {};

on("chat:message", function(msg) {
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
            result=' must specify 13 comma-separated parameters for !melee40k command.';
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
            result = skill40kNamespace.rollResult(curToken, attribute, modifier, attributename, format, mode, msgwho);
        }
    }
    else if (msgTxt.split(" ", 1)[0] === "!ranged40k") {
        cmdName = '!ranged40k ';
        var paramList = msgTxt.slice(cmdName.length);
        if(paramList.indexOf(',') == -1) {
            result=' must specify 13 comma-separated parameters for !melee40k command.';
        }
        else {
            var paramArray = paramList.split(',');
            var curToken, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type;
            special = '';
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
                }
            });
            result = ranged40kNamespace.rollResult(curToken, attribute, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special, quality, talents, wpnname, type );
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
            var curToken, attribute, shotsel, numdice, dice, dmg, pen, str, modifier, special, quality, talents, wpnname, type, psy ;
            special = '';
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
                } else if(i==14){
                    psy = listener40kNamespace.trimString(current);
                }
            });
            result = melee40kNamespace.rollResult(curToken, attribute, shotsel, numdice, dice, dmg, pen, str, modifier, special, quality, talents, wpnname, type, psy);
        }
    }
    sendChat(msg.who, result);
});

/** Trims a string **/
listener40kNamespace.trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}
