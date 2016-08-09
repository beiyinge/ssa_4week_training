/**
 * http://usejsdoc.org/
 */

var fs = require('fs');
/*
this.setTimeOut (function () {
	var data = fs.readFileSync('example.js');
	console.log (data.toString());
}, 2000);

//synchnise
this.setTimeOut (() => {
	fs.readFile ('example.js', (err, data) => {
		if (err) throw err;
		console.log (data.toString());
	});
}, 2000);
*/


//var data = fs.readFileSync('scratch.js');
//console.log ( );
var data =fs.readFileSync('testData.txt');
//fs.readFile ('testData.txt', (err, data) => {
//	if (err) {
//		throw err;
//	}
//	console.log (data.toString());
//});


fs.writeFile("newTestData.txt", data, (err) => {
	if (err) {
	throw err;
}
console.log ('It\'s saved');
});
