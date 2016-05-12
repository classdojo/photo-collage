"use strict";

const Promise  = require("bluebird");
const request  = require("request");
const Canvas   = require("canvas");
const fs       = Promise.promisifyAll(require("fs"));

function downloadPhoto (uri) {
  return new Promise((resolve, reject) => {
    let data;

    const stream = request(uri);
    stream.on("data", (chunk) => data = data ? Buffer.concat([data, chunk]) : chunk);
    stream.on("error", reject);
    stream.on("end", () => resolve(data));
  });
}

function getPhoto (src) {
  if (src instanceof Buffer) {
    return src;
  } else if (typeof src === "string") {
    if (/^http/.test(src) || /^ftp/.test(src)) {
      return downloadPhoto(src)
        .catch(() => {throw new Error(`Could not download url source: ${src}`);});
    } else {
      return fs.readFileAsync(src)
        .catch(() => {throw new Error(`Could not load file source: ${src}`);});
    }
  } else if (src instanceof Canvas) {
    return src.toBuffer();
  } else {
    throw new Error(`Unsupported source type: ${src}`);
  }
}

const PARAMS = [
  {field: "sources", required: true},
  {field: "width", required: true},
  {field: "height", required: true},
  {field: "imageWidth", required: true},
  {field: "imageHeight", required: true},
  {field: "spacing", default: 0},
  {field: "backgroundColor", default: "#000000"},
];

module.exports = function (options) {
  if (Array.isArray(options)) {
    options = {sources: options};
  }

  PARAMS.forEach((param) => {
    if (options[param.field]) {
      return;      
    } else if (param.default != null) {
      options[param.field] = param.default;
    } else if (param.required) {
      throw new Error(`Missing required option: ${param.field}`);
    }
  });

  const canvasWidth = options.width * options.imageWidth + (options.width - 1) * (options.spacing);
  const canvasHeight = options.height * options.imageHeight + (options.height - 1) * (options.spacing);
  const canvas = new Canvas(canvasWidth, canvasHeight);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  return Promise
    .map(options.sources, getPhoto)
    .each((photoBuffer, i) => {
      if (i >= options.width * options.height) return;

      const x = (i % options.width) * (options.imageWidth + options.spacing);
      const y = Math.floor(i / options.width) * (options.imageHeight + options.spacing);

      const img = new Canvas.Image();
      img.src = photoBuffer;

      ctx.drawImage(img, x, y, options.imageWidth, options.imageHeight);
    })
    .return(canvas);
};
