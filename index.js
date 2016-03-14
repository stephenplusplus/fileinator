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

require('yargs')
  .usage('Usage: $0 <size> <path>')
  .example('$0 make 2mb ./bigfile', 'Create a 2MB file named `bigfile` in the current directory.')
  .command('make <size> <path>', 'Make a big file', {}, function (argv) {
    console.log(`you want me to make a file that named ${argv.path} that's ${argv.size}`);
    let size = sizeParser(argv.size);
    console.log(size);
    writeFile(size, argv.path);
  })
  .help('h')
  .alias('h', 'help')
  .argv