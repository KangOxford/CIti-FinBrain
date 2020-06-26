const pathObj = require("path");
const rootDir = pathObj.join(__dirname, "/../dist");
const port = 3000;
const express = require("express");

const app = express();

app.use(express.static(rootDir));

app.listen(port);

console.log('Serving production files from: '+rootDir);
console.log(`Listening at http://localhost:${port}`);
console.log('Press Ctrl + C to stop.');
