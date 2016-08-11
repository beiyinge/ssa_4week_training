/**
 * 
 */
//reduce
var reduceVarB =  [10, 11, 12, 13, 14];
console.log ('reduce, before, ' +reduceVarB);

var reduceVar =reduceVarB.reduce( 
		
		function (pr, cu, ind, orgArray) { 
	//count +=1;
console.log ('orgArray='+ orgArray+', prev='+pr +' curr=' +cu +' index='+ind);
return pr + cu});
console.log ('reduce, after, ' +reduceVar);

//reverse
var myArray = ['one', 'two', 'three'];
console.log ('before, ', myArray);
myArray.reverse(); 

console.log('after, '+ myArray); // ['three', 'two', 'one']


//********shift
var myFish = ['angel', 'clown', 'mandarin', 'surgeon'];

console.log('myFish before: ' + myFish);
// "myFish before: angel,clown,mandarin,surgeon"

var shifted = myFish.shift(); 

console.log('myFish after: ' + myFish); 
// "myFish after: clown,mandarin,surgeon" 

console.log('Removed this element: ' + shifted); 
// "Removed this element: angel"


//***slice
var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
console.log('fruits before: ' + fruits); 
var citrus = fruits.slice(1, 4);
console.log('After, citrus: ' + citrus); 