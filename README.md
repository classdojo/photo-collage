# photo-mosaic
Combines several images into a photo mosaic.

## Installation
`npm install --save photo-mosaic`.  
This library depends on `node-canvas`, which may require additional setup. See [their installation page](https://github.com/Automattic/node-canvas/wiki/_pages) for details.

## Usage
The following example creates a 2x3 mosaic from a variety of image sources.
```js
const createMosaic = require("photo-mosaic");

const options = {
  sources: [
    imageBufferObject, // source can be a buffer of jpg/png data
    canvasObject, // source can be a canvas object
    "http://myurl.com/image.jpg", // strings that look like urls are downloaded
    "ftp://myftpserver.com/image.png",
    "https://mysecureurl.com/image.jpg"
    "./localfile.png", // other strings are loaded as files
  ],
  width: 3,
  height: 2,
  imageWidth: 500,
  imageHeight: 500,
  backgroundColor: "#cccccc", // optional, defaults to black.
  spacing: 2, // optional: pixels between each image
};

createMosaic(options)
  .then((canvas) => {
    canvas.jpegStream().pipe(fs.createWriteStream("myFile"))
  });
```