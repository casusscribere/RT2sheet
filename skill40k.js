/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria. Outputs are modified using PowerCards.
 * 
 * The following commands is used:
 * !skill40k [tokenName], [attributeValue], [ModifierValue], [AttributeName] 
**/

//Rolls a d100 and calculates the success or fail results to the chat window.
var skill40kNamespace = skill40kNamespace || {};

skill40kNamespace.rollResult = function(token, attribute, modifier, attributename) {
    var roll = randomInteger(100);
    var modTarget = parseInt(attribute) + parseInt(modifier);
    var degOfSuc =0;
    var output2 = 'Error';
    
    //Form output message based on result
    if(roll <= modTarget) {
        degOfSuc = (Math.floor(modTarget/10) - Math.floor(roll/10)) + 1;
        output2 = '<span style="color:green">' + token + ' succeeds by <B>' + degOfSuc + ' degree(s)</B>.</span> ';
    }
    else {
        degOfSuc = (Math.floor(roll/10) - Math.floor(modTarget/10)) + 1;
        output2 = '<span style="color:red">' + token + ' fails by <B>' + degOfSuc + ' degree(s)</B></span>. ';
    }
    
    //Return output
    var output ="!power {{--format|skill --titlefontshadow|none --name|"+token+" --leftsub|"+attributename+" Check "+modTarget+" --rightsub| Roll "+roll+" --Effect|"+output2+"  }}"
    //var output ="!power {{--format|skill --titlefontshadow|none --Attack#?{Number of attacks|1}|[[1d20+4]]--charid|@{character_id} --emote| @{character_id} stabs them all --name|"+token+" --leftsub|"+attributename+" Check "+modTarget+" --rightsub| Roll "+roll+" --Effect|"+output2+"  }}"
    
    return output;
 }
 
/** Trims a string **/
skill40kNamespace.trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}
