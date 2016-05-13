# photo-collage
Combines several images into a photo collage.

## Example

#### Source files
![Source file 1](https://github.com/classdojo/photo-collage/blob/master/img/src1.jpg?raw=true)
![Source file 2](https://github.com/classdojo/photo-collage/blob/master/img/src2.jpg?raw=true)
![Source file 3](https://github.com/classdojo/photo-collage/blob/master/img/src3.jpg?raw=true)
![Source file 4](https://github.com/classdojo/photo-collage/blob/master/img/src4.jpg?raw=true)
![Source file 5](https://github.com/classdojo/photo-collage/blob/master/img/src5.jpg?raw=true)
![Source file 6](https://github.com/classdojo/photo-collage/blob/master/img/src6.jpg?raw=true)

#### Result
![Result](https://github.com/classdojo/photo-collage/blob/master/img/result_no_spacing.png?raw=true)

## Installation
`npm install --save photo-collage`  


This library depends on `node-canvas`, which may require additional setup. See [their installation page](https://github.com/Automattic/node-canvas/wiki/_pages) for details.

## Usage
The following example creates a 2x3 collage from a variety of image sources.
```js
const createCollage = require("photo-collage");

const options = {
  sources: [
    imageBufferObject, // source can be a buffer of jpg/png data
    canvasObject, // source can be a canvas object
    "http://myurl.com/image.jpg", // source can be a url string
    "https://myurl.com/image.jpg", // https/ftp is ok too.
    "./localfile.png", // source can be a relative file path
    "~/photos/file.png" // source can be an absolute file path
  ],
  width: 3, // number of images per row
  height: 2, // number of images per column
  imageWidth: 350, // width of each image
  imageHeight: 250, // height of each image
  backgroundColor: "#cccccc", // optional, defaults to black.
  spacing: 2, // optional: pixels between each image
};

createCollage(options)
  .then((canvas) => {
    const src = canvas.jpegStream();
    const dest = fs.createWriteStream("myFile");
    src.pipe(dest);
  });
```