/**
 * This script listens for commands in chat and passes arguments to those scripts.
 * 
 * This script current listens for the following commands:
 * !skill40k [tokenName], [attributeValue], [ModifierValue], [AttributeName] 
**/

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
            var paramArray = paramList.split(',');
            var curToken = skill40kNamespace.trimString(paramArray[0]);
            var attribute = skill40kNamespace.trimString(paramArray[1]);
            var modifier = skill40kNamespace.trimString(paramArray[2]);
            var attributename = skill40kNamespace.trimString(paramArray[3]);
            var format = skill40kNamespace.trimString(paramArray[4]);
            var result = skill40kNamespace.rollResult(curToken, attribute, modifier, attributename, format);
            sendChat(msg.who, result);
        }
    }
    /*if (msgTxt.split(" ", 1)[0] === "!roll40k") {
        cmdName = '!roll40k ';
        var paramList = msgTxt.slice(cmdName.length);
        if(paramList.indexOf(',') == -1) {
            sendChat(msg.who, '/w ' + msg.who + ' must specify three comma-separated parameters for !roll40k command.');
        }
        else {
            var paramArray = paramList.split(',');
            var curToken = roll40kNamespace.trimString(paramArray[0]);
            var attribute = roll40kNamespace.trimString(paramArray[1]);
            var modifier = roll40kNamespace.trimString(paramArray[2]);
            var result = roll40kNamespace.rollResult(curToken, attribute, modifier);
            sendChat(msg.who, result);
            }
    }*/
    if (msgTxt.split(" ", 1)[0] === "!ranged40k") {
        cmdName = '!ranged40k ';
        var paramList = msgTxt.slice(cmdName.length);
        if(paramList.indexOf(',') == -1) {
            sendChat(msg.who, '/w ' + msg.who + ' must specify 13 comma-separated parameters for !ranged40k command.');
        }
        else {
            var paramArray = paramList.split(',');
            var curToken  = ranged40kNamespace.trimString(paramArray[0]);
            var attribute = ranged40kNamespace.trimString(paramArray[1]);
            var wpnname   = ranged40kNamespace.trimString(paramArray[2]);
            var range     = ranged40kNamespace.trimString(paramArray[3]);
            var shotsel   = ranged40kNamespace.trimString(paramArray[4]);
            var single    = ranged40kNamespace.trimString(paramArray[5]);
            var semi      = ranged40kNamespace.trimString(paramArray[6]);
            var full      = ranged40kNamespace.trimString(paramArray[7]);
            var numdice   = ranged40kNamespace.trimString(paramArray[8]);
            var dice      = ranged40kNamespace.trimString(paramArray[9]);
            var dmg       = ranged40kNamespace.trimString(paramArray[10]);
            var pen       = ranged40kNamespace.trimString(paramArray[11]);
            var modifier  = ranged40kNamespace.trimString(paramArray[12]);
            var special   = ranged40kNamespace.trimString(paramArray[13]);
            var result = ranged40kNamespace.rollResult(curToken, attribute, wpnname, range, shotsel, single, semi, full, numdice, dice, dmg, pen, modifier, special);
            sendChat(msg.who, result);
            }
    }
});
