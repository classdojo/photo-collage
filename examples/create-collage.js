"use strict";

const args = process.argv.slice(2);
if (!args[0]) return console.log("ERR: No unitIdentifier");


const createCollage = require("../index");
const fs            = require("fs");

const identifier = args[0];
let options = fs.readFileSync("/tmp/" + identifier + ".json").toString();
options = JSON.parse(options);

createCollage(options).then((canvas) => {
  const src = canvas.jpegStream();
  const dest = fs.createWriteStream(options.destination);
  src.pipe(dest);
});
