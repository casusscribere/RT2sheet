/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria. Outputs are modified using PowerCards.
 * 
 * The following commands is used:
 * !skill40k [tokenName], [attributeValue], [ModifierValue], [AttributeName], [optional:format] 
**/

//Rolls a d100 and calculates the success or fail results to the chat window.

var skill40kNamespace = skill40kNamespace || {};

skill40kNamespace.rollResult = function(token, attribute, modifier, attributename, format, mode, msgwho) {
    if (typeof token            === undefined || typeof token != 'string' )                     token           = 'generic';
    if (typeof attribute        === undefined || Number.isInteger(parseInt(attribute))==false)  attribute       = 0;
    if (typeof modifier         === undefined || Number.isInteger(parseInt(modifier))==false )  modifier        = 0;
    if (typeof attributename    === undefined || typeof attributename != 'string' )             attributename   = 'generic';
    if (typeof format           === undefined || typeof format != 'string' )                    format          = 'gen';
    if (typeof mode             === undefined || typeof mode != 'string' )                      mode            = 'normal';
    if (typeof msgwho           === undefined || typeof msgwho != 'string' )                    msgwho            = 'GM';

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
        diff='Other';
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
    
    
    if(mode=='normal'){
        mode='';
    } else if(mode=='secret'){
        mode='--whisper|self,gm';
    } else if(mode=='hidden'){
        mode='--whisper|gm';
        if(msgwho!=''){
            sendChat(msgwho, '/w ' + msgwho + ' sent a secret '+attributename+' roll to the GM.');  
        }
    } else{
        mode='';
    }
    
    //Return output
    var output ="!power {{ "+mode+" --format|"+format+" --titlefontshadow|none --name|"+token+" --leftsub|"+attributename+" Check --rightsub| "+diff+" Diff. --Roll:|[! "+roll+" !] vs [! "+modTarget+" !]  --Result:|"+output2+"  }}"
    return output;
}
