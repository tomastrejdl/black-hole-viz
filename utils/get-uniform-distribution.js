
const fs = require('fs'),
    es = require('event-stream'),
    iconv = require('iconv-lite'),
    random = require('random');

let u = random.uniformInt(0, 512*512*512);

let arr = []
for (let i = 0; i < 10000; i++) arr.push(u())
const distribution = arr.sort((a, b) => a - b)

class CSVReader {
  constructor(filename, batchSize, columns) {
    this.reader = fs
      .createReadStream(filename)
      .pipe(iconv.decodeStream('utf8'));
    this.batchSize = batchSize || 1000;
    this.lineNumber = 0;
      
    this.writer = fs.createWriteStream(filename.split('.csv')[0] + '_uniform_random_10_000.csv');
  }

  read(callback) {
    this.reader.pipe(es.split()).pipe(
      es
        .mapSync((line) => {
            
            if (distribution.includes(this.lineNumber)) {
                this.writer.write(line+'\n');
            }
          
            ++this.lineNumber;

          if (this.lineNumber % this.batchSize === 0) {
            callback(this.lineNumber);
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

const reader = new CSVReader('../mag2_512_512_512.csv');

reader.read((data) => {
  console.log(data);
  reader.continue();
});
