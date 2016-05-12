"use strict";

const fs             = require("fs");
const bufferEqual    = require("buffer-equal");
const createMosaic   = require("./index");

require("chai")
  .use(require("chai-as-promised"))
  .should();

it("generated 2x3 mosaic with no spacing matches reference", () => {
  const options = {
    sources: [1, 2, 3, 4, 5, 6].map((n) => `./img/src${n}.jpg`),
    width: 3,
    height: 2,
    imageWidth: 350,
    imageHeight: 250,
  };

  return createMosaic(options)
    .then((canvas) => canvas.toBuffer())
    .then((buffer) => bufferEqual(buffer, fs.readFileSync("./img/result_no_spacing.png")))
    .should.eventually.equal(true);
});

it("generated 2x3 mosaic with spacing matches reference", () => {
  const options = {
    sources: [1, 2, 3, 4, 5, 6].map((n) => `./img/src${n}.jpg`),
    width: 3,
    height: 2,
    imageWidth: 350,
    imageHeight: 250,
    backgroundColor: "#f00",
    spacing: 2,
  };

  return createMosaic(options)
    .then((canvas) => canvas.toBuffer())
    .then((buffer) => bufferEqual(buffer, fs.readFileSync("./img/result_with_spacing.png")))
    .should.eventually.equal(true);
});