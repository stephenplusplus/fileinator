#!/usr/bin/env node
var fileinator = require('../lib/fileinator');
var sizeParser = require('filesize-parser');

require('yargs')
  .usage('Usage: $0 <size> <path>')
  .example('$0 make 2mb ./bigfile', 'Create a 2MB file named `bigfile` in the current directory.')
  .command('make <size> <path>', 'Make a big file', {}, function (argv) {
    console.log(`you want me to make a file that named ${argv.path} that's ${argv.size}`);
    var size = sizeParser(argv.size);
    fileinator.writeFile(size, argv.path);
  })
  .help('h')
  .alias('h', 'help')
  .argv