export function readDataFromFile(fileName) {
  // return fetch('http://127.0.0.1:5500/data/mag_sample_1_048_576_rows.csv');
  //   return fetch('http://127.0.0.1:5500/data/mag_sample_262144_rows.csv');
  return fetch('http://127.0.0.1:5500/data/' + fileName);
}
