
function gameComputer() {
  var optionList = ["rock","paper","scissors"];
  
  do {
	var optionPrompt=prompt ("Enter rock, paper or scissors");
	//alert (optionPrompt);
	} while ( !contains (optionList, optionPrompt) )
	
	//console.log (optionPrompt);
	
	//alert ("*"+optionPrompt+"*");
	
	var selection=0;
	var computer=Math.floor (Math.random()* 3);
	
	if (optionPrompt==="rock")  
	{
	//alert ("in if rock");
	  selection=0;
	}
	else if (optionPrompt==="paper")  
	{
	  selection=1;
	}
	else if (optionPrompt==="scissors")  
	{
	  selection=2;
	}
	else
	{
	  alert ("Please re-enter.");
	}
	
	
	
	//rock, 0
	//paper, 1
	//scissors 2
	if (( selection ===0 && computer ===2) 
		|| (selection===1 && computer===0) 
		|| (selection===2 && computer===1) )
	{
	 alert ("You win. You have " + optionList[selection] + ", computer has "+ optionList[computer]);
	}
	else if (selection===computer)  
	{
	  alert ("Tie, try again. Both have " + optionList[computer]);
	  
	  }
	else {
	  alert ("You lose. You have " + optionList[selection] + ", computer has "+ optionList[computer]);
	}
}

function contains(arrayObj, oneObj) {
    var i = arrayObj.length;
    while (i--) {
       if (arrayObj[i] === oneObj) {
           return true;
       }
    }
    return false;
}
