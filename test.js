"use strict";

const fs            = require("fs");
const path          = require("path");
const bufferEqual   = require("buffer-equal");
const createCollage = require("./index");

require("chai")
  .use(require("chai-as-promised"))
  .should();

// Test a variety of source types - file name, buffer, uri.
const sources = [
  "./img/src1.jpg",
  "img/src2.jpg",
  path.join(__dirname, "img/src3.jpg"),
  fs.readFileSync("img/src4.jpg"),  
  "http://github.com/classdojo/photo-collage/blob/master/img/src5.jpg?raw=true",
  "https://github.com/classdojo/photo-collage/blob/master/img/src6.jpg?raw=true",
];

it("2x3 collage with no spacing matches reference", () => {
  const options = {
    sources: sources,
    width: 3,
    height: 2,
    imageWidth: 350,
    imageHeight: 250,
  };

  return createCollage(options)
    .then((canvas) => canvas.toBuffer())
    .then((buffer) => bufferEqual(buffer, fs.readFileSync("./img/result_no_spacing.png")))
    .should.eventually.equal(true);
});

it("2x3 collage with spacing matches reference", () => {
  const options = {
    sources: sources,
    width: 3,
    height: 2,
    imageWidth: 350,
    imageHeight: 250,
    backgroundColor: "#f00",
    spacing: 2,
  };

  return createCollage(options)
    .then((canvas) => canvas.toBuffer())
    .then((buffer) => bufferEqual(buffer, fs.readFileSync("./img/result_with_spacing.png")))
    .should.eventually.equal(true);
});