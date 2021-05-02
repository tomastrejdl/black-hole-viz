const CSVReader = require('./csv-reader.js');

const reader = new CSVReader('./data/mag_sample_262144_rows.csv');

reader.read((data) => {
  console.log(data);
  reader.continue();
});
