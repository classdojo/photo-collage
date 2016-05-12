# photo-mosaic
Combines several images into a photo mosaic.

## Example
Source files:  
![Source file 1](https://github.com/classdojo/photo-mosaic/blob/master/img/src1.jpg?raw=true)
![Source file 2](https://github.com/classdojo/photo-mosaic/blob/master/img/src2.jpg?raw=true)
![Source file 3](https://github.com/classdojo/photo-mosaic/blob/master/img/src3.jpg?raw=true)
![Source file 4](https://github.com/classdojo/photo-mosaic/blob/master/img/src4.jpg?raw=true)
![Source file 5](https://github.com/classdojo/photo-mosaic/blob/master/img/src5.jpg?raw=true)
![Source file 6](https://github.com/classdojo/photo-mosaic/blob/master/img/src6.jpg?raw=true)

Result:
![Result](https://github.com/classdojo/photo-mosaic/blob/master/img/result_no_spacing.png?raw=true)

## Installation
`npm install --save photo-mosaic`  


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
  width: 3, // number of images per row
  height: 2, // number of images per column
  imageWidth: 500, // width of each image
  imageHeight: 500, // height of each image
  backgroundColor: "#cccccc", // optional, defaults to black.
  spacing: 2, // optional: pixels between each image
};

createMosaic(options)
  .then((canvas) => {
    const src = canvas.jpegStream();
    const dest = fs.createWriteStream("myFile");
    src.pipe(dest);
  });
```