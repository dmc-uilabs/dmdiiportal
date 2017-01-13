const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('./stubs/');
const db = {};
files.forEach((file) => {
	const basename = path.basename(file, '.json');
	db[basename] = require(`./stubs/${basename}`);
});

module.exports = db;
