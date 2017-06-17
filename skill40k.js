/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria. Outputs are modified using PowerCards.
 * 
 * The following commands is used:
 * !skill40k [tokenName], [attributeValue], [ModifierValue], [AttributeName], [optional:format] 
**/

//Rolls a d100 and calculates the success or fail results to the chat window.
var skill40kNamespace = skill40kNamespace || {};

skill40kNamespace.rollResult = function(token, attribute, modifier, attributename, format) {
    var format = format || "skill";
    var roll = randomInteger(100);
    var modTarget = parseInt(attribute) + parseInt(modifier);
    var degOfSuc =0;
    var output2 = 'Error';
    var diff='';
    
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
        diff='X';
    }
    
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
    //var output ="!power {{--format|skill --titlefontshadow|none --name|"+token+" --leftsub|"+diff+" "+attributename+" Check "+modTarget+" --rightsub| Roll "+roll+" --Effect:|"+output2+"  }}"
    var output ="!power {{--format|"+format+" --titlefontshadow|none --name|"+token+" --leftsub|"+attributename+" Check --rightsub| "+diff+" Diff. --Roll:|[! "+roll+" !] vs [! "+modTarget+" !]  --Result:|"+output2+"  }}"
    
    
    return output;
 }
 
/** Trims a string **/
skill40kNamespace.trimString = function(src) {
    return src.replace(/^\s+|\s+$/g, '');
}
