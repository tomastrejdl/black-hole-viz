const fs = require('fs'),
  es = require('event-stream'),
  iconv = require('iconv-lite'),
  CSVToArray = require('./csv-to-array');

class CSVReader {
  constructor(filename, batchSize, columns) {
    this.reader = fs
      .createReadStream(filename)
      .pipe(iconv.decodeStream('utf8'));
    this.batchSize = batchSize || 1000;
    this.lineNumber = 0;
    this.data = [];
    this.parseOptions = {
      delimiter: ',',
      columns: true,
      escape: '/',
      relax: true,
    };
  }

  read(callback) {
    this.reader.pipe(es.split()).pipe(
      es
        .mapSync((line) => {
          ++this.lineNumber;

          //   parse(line, this.parseOptions, (err, d) => {
          //     this.data.push(d[0]);
          //   });

          const parsedLine = CSVToArray(line);
          const x = parsedLine[0];
          const y = parsedLine[1];
          const z = parsedLine[2];
          const u = parsedLine[3];
          const v = parsedLine[4];
          const w = parsedLine[5];
          this.data.push([x, y, z, u, v, w]);

          if (this.lineNumber % this.batchSize === 0) {
            callback(this.data);
          }
        })
        .on('error', function(e) {
          console.log('Error while reading file.', e);
        })
        .on('end', function() {
          console.log('Read entirefile.');
        }),
    );
  }

  continue() {
    this.data = [];
    this.reader.resume();
  }
}

module.exports = CSVReader;
