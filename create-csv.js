'use strict';

const stringify = require('csv-stringify');
const iconv     = require('iconv-lite');
const fs        = require('fs');
const path      = require('path');

const data = [
  ['a', 'b'],
  ['c', 'd'],
];

stringify(data, (error, csvString) => {
  const writableStreem = fs.createWriteStream(path.join(__dirname, 'sample.csv'));

  writableStreem.write(iconv.encode(csvString, 'UTF-8'));
});
