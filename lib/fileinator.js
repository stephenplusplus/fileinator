'use strict';

const fs = require('fs');
const crypto = require('crypto');
const sizeParser = require('filesize-parser');
const chunkSize = 104857600;
const ProgressBar = require('progress');

function writeFile(size, path) {
  let stream = fs.createWriteStream(path);  
  let bar = new ProgressBar('creating [:bar] :percent :etas', { 
    complete: '=',
    incomplete: ' ',
    total: size
  });
  writeChunk(stream, size, bar, writeChunk);
}

function writeChunk(stream, bytesRemaining, bar, callback) {
  let currentChunkSize = (bytesRemaining >= chunkSize) ? chunkSize : bytesRemaining;
  crypto.randomBytes(currentChunkSize, (err, buffer) => {
    if (err) throw err;
    stream.write(buffer, function(err) {
      let br = bytesRemaining - buffer.length;
      bar.tick(buffer.length);
      if (br > 0) {
        callback(stream, br, bar, writeChunk);
      } else {
        console.log('done!');
      }
    });
  });
}

module.exports = {
  writeFile: writeFile
}