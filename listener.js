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

    cmdName = '!skill40k ';
    msgTxt = msg.content;
    
    if (msg.type !== "api") return;
    if (msgTxt.split(" ", 1)[0] === "!skill40k") {
        var paramList = msgTxt.slice(cmdName.length);
        if(paramList.indexOf(',') == -1) {
            sendChat(msg.who, '/w ' + msg.who + ' must specify four comma-separated parameters for !skill40k command.');
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
                }  else {}
            });
            var result = skill40kNamespace.rollResult(curToken, attribute, modifier, attributename, format, mode, msgwho);
            sendChat(msg.who, result); 
        }
    }
    if (msgTxt.split(" ", 1)[0] === "!ranged40k") {
        cmdName = '!ranged40k ';
        var paramList = msgTxt.slice(cmdName.length);
        if(paramList.indexOf(',') == -1) {
            sendChat(msg.who, '/w ' + msg.who + ' must specify 13 comma-separated parameters for !ranged40k command.');
        }
        else {
            var paramArray = paramList.split(',');
            var special = '';
            var talents = '';
            var curToken, attribute, wpnname, range, shotsel, single, semi, full, numdice, dice, dmg, type, pen, modifier, quality;
            _.each(paramArray, function(current, i) {
                if(i==0){
                    curToken  = listener40kNamespace.trimString(current);
                } else if(i==1){
                    attribute = listener40kNamespace.trimString(current);
                } else if(i==2){
                    wpnname = listener40kNamespace.trimString(current);
                } else if(i==3){
                    range = listener40kNamespace.trimString(current);
                } else if(i==4){
                    shotsel = listener40kNamespace.trimString(current);
                } else if(i==5){
                    single = listener40kNamespace.trimString(current);
                } else if(i==6){
                    semi = listener40kNamespace.trimString(current);
                } else if(i==7){
                    full = listener40kNamespace.trimString(current);
                } else if(i==8){
                    numdice = listener40kNamespace.trimString(current);
                } else if(i==9){
                    dice = listener40kNamespace.trimString(current);
                } else if(i==10){
                    dmg = listener40kNamespace.trimString(current);
                } else if(i==11){
                    type = listener40kNamespace.trimString(current);
                } else if(i==12){
                    pen = listener40kNamespace.trimString(current);
                } else if(i==13){
                    modifier = listener40kNamespace.trimString(current);
                } else if(i==14){
                    quality = listener40kNamespace.trimString(current);
                } //else if(i==15){
                    //talents = listener40kNamespace.trimString(current);
                /*}*/  else {
                    special += listener40kNamespace.trimString(current)+", ";
                }
            });
            var result = ranged40kNamespace.rollResult(curToken, attribute, wpnname, range, shotsel, single, semi, full, numdice, dice, dmg, type, pen, modifier, quality, special);
            sendChat(msg.who, result);
        }
    }
    if (msgTxt.split(" ", 1)[0] === "!melee40k") {
        cmdName = '!melee40k ';
        var paramList = msgTxt.slice(cmdName.length);
        if(paramList.indexOf(',') == -1) {
            sendChat(msg.who, '/w ' + msg.who + ' must specify 13 comma-separated parameters for !melee40k command.');
        }
        else {
            var paramArray = paramList.split(',');
            var special = '';
            var curToken, attribute, wpnname, shotsel, numdice, dice, dmg, type, pen, psy, str, modifier, quality;
            _.each(paramArray, function(current, i) {
                if(i==0){
                    curToken  = listener40kNamespace.trimString(current);
                } else if(i==1){
                    attribute = listener40kNamespace.trimString(current);
                } else if(i==2){
                    wpnname = listener40kNamespace.trimString(current);
                } else if(i==3){
                    shotsel = listener40kNamespace.trimString(current);
                } else if(i==4){
                    numdice = listener40kNamespace.trimString(current);
                } else if(i==5){
                    dice = listener40kNamespace.trimString(current);
                } else if(i==6){
                    dmg = listener40kNamespace.trimString(current);
                } else if(i==7){
                    type = listener40kNamespace.trimString(current);
                } else if(i==8){
                    pen = listener40kNamespace.trimString(current);
                } else if(i==9){
                    psy = listener40kNamespace.trimString(current);
                }  else if(i==10){
                    str = listener40kNamespace.trimString(current);
                }  else if(i==11){
                    modifier = listener40kNamespace.trimString(current);
                } else if(i==12){
                    quality = listener40kNamespace.trimString(current);
                } else {
                    special += listener40kNamespace.trimString(current)+", ";
                }
            });
            var result = melee40kNamespace.rollResult(curToken, attribute, wpnname, shotsel, numdice, dice, dmg, type, pen, psy, str, modifier, quality, special);
            sendChat(msg.who, result);
        }
    }
});

/** Trims a string **/
listener40kNamespace.trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}
