/**
 * read a file, and save to another file
 */

var fs = require('fs');

var data =fs.readFileSync('testData.txt');


fs.writeFile("newTestData.txt", data, (err) => {
	if (err) {
	throw err;
}
	
console.log ('It\'s saved');
});

fs.readFile ('testData.txt', (err, data) => {
	if (err) {
		throw err;
	}
	fs.writeFile("newTestData1.txt", data, (err) => {
		if (err) {
		throw err;
		}
	});
});

function writeCb(err) {
	if (err) {
		throw err;
	}
	console.log ('it is saved 1.');
}

