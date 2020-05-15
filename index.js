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

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';
  let initialY = y;

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  return y - initialY + lineHeight; // height used
}

const PARAMS = [
  {field: "sources", required: true},
  {field: "width", required: true},
  {field: "height", required: true},
  {field: "imageWidth", required: true},
  {field: "imageHeight", required: true},
  {field: "spacing", default: 0},
  {field: "backgroundColor", default: "#eeeeee"},
  {field: "lines", default: []},
  {field: "textStyle", default: {}},
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

  const headerHeight = (options.header || {}).height || 0;
  const canvasWidth = options.width * options.imageWidth + (options.width - 1) * (options.spacing);
  const canvasHeight = headerHeight  + options.height * options.imageHeight + (options.height - 1) * (options.spacing) + (options.textStyle.height || 200);
  const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const sources = options.sources;
  let maxImages = options.width * options.height;
  if ((options.header || {}).image) {
    maxImages += 1;
    sources.unshift(options.header.image);
  }
 
  return Promise
    .map(sources, getPhoto)
    .each((photoBuffer, i) => {
      if (i >= maxImages) return;

      const img = new Canvas.Image();
      img.src = photoBuffer;

      if ((options.header || {}).image) { // only for header
        if (!i) { // first time
          ctx.drawImage(img, 0, 0, canvasWidth, options.header.height);
          return;
        }
        i -= 1;
      }

      const x = (i % options.width) * (options.imageWidth + options.spacing);
      const y = Math.floor(i / options.width) * (options.imageHeight + options.spacing);
      ctx.drawImage(img, x, y + headerHeight, options.imageWidth, options.imageHeight);
    })
    .then(() => {
      if (options.text) {
        ctx.font = (options.textStyle.fontSize || "20") + "px " + (options.textStyle.font || "Helvetica");
        wrapText(ctx, options.text, 10, canvasHeight - (options.textStyle.height || 200) + 50, canvasWidth - 10, (options.textStyle.fontSize || 20) * 1.2);
      }
      else {
        let curHeight = 150;
        options.lines.map((line) => {
          ctx.font = line.font || "20px Helvetica";
          ctx.fillStyle = line.color || "#333333";
          const heightUsed = wrapText(ctx, line.text, 10, canvasHeight - curHeight, canvasWidth - 10, (parseInt(line.font) || 20) * 1.2);
          curHeight -= heightUsed;
        });
      }
    })
    .return(canvas);
};
